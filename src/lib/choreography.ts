/**
 * Motion direction for the atlas. Every duration, curve and overlap lives here.
 *
 * Four named moments, each a GSAP timeline:
 *   intro       – LoadingScreen → globe at rest
 *   eraChange   – old era out → atmosphere shift → new era in → camera framing
 *   select      – camera flight → marker highlight → (UI panel + cards, timed by UI_MOTION)
 *   close       – (UI panel out) → camera back to the era framing
 *
 * The scene reads the mutable `sceneMotion` object every frame; timelines only write to it.
 * 2D UI (Framer Motion) consumes UI_MOTION so its timing is defined in this same file.
 */
import gsap from "gsap";
import { Color } from "three";
import { flightDuration, interpolatePose, type CameraPose } from "./camera";

export * from "./motionTokens";
import { CAMERA, CLOSE, ERA_CHANGE, EASE, REDUCED, SELECT, INTRO } from "./motionTokens";

/* ------------------------------------------------------------ scene state */

export type MarkerMotion = {
  /** 0 = hidden, 1 = rest scale. */
  scale: number;
  opacity: number;
  /** 0..1 selection highlight. */
  highlight: number;
};

export type ArcMotion = { progress: number; opacity: number };

/** Mutable animation state read by scene components in useFrame. Written only by timelines. */
export const sceneMotion = {
  accent: new Color("#e0a458"),
  /** Atmosphere glow multiplier. */
  atmosphere: 0,
  stars: 0,
  /** Time-jump sweep: position 0..1 from one pole to the other, strength 0..1. */
  sweep: 0,
  sweepStrength: 0,
  /** Whole-canvas fade (reduced-motion cuts). 1 = visible. */
  canvasOpacity: 1,
  /** 0..1 amount of panel framing offset applied to the projection. */
  frameShift: 0,
  /** Pulse & idle allowed (false under reduced motion). */
  ambient: true,
  markers: [0, 1, 2].map<MarkerMotion>(() => ({ scale: 0, opacity: 0, highlight: 0 })),
  arcs: [0, 1, 2].map<ArcMotion>(() => ({ progress: 0, opacity: 0 })),
};

export type SceneMotion = typeof sceneMotion;

/* ----------------------------------------------------------- director api */

export type CameraDriver = {
  getPose(): CameraPose;
  applyPose(pose: CameraPose): void;
};

export type DirectorContext = {
  motion: SceneMotion;
  camera: CameraDriver;
  reduced: boolean;
  /** Called when the outgoing era has left and the new era's data should be displayed. */
  swapEra?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
};

const allMarkers = (m: SceneMotion) => m.markers;
const allArcs = (m: SceneMotion) => m.arcs;

/**
 * Adds a camera flight to `tl` at `position`. The start pose is captured when the flight
 * actually begins, so an interrupted move continues from wherever the camera is.
 */
function addFlight(
  tl: gsap.core.Timeline,
  ctx: DirectorContext,
  to: CameraPose,
  duration: number,
  arcLift: number,
  position: gsap.Position,
) {
  const proxy = { t: 0 };
  let from: CameraPose | null = null;
  tl.to(
    proxy,
    {
      t: 1,
      duration,
      ease: EASE.travel,
      onStart: () => {
        from = ctx.camera.getPose();
      },
      onUpdate: () => {
        if (from) ctx.camera.applyPose(interpolatePose(from, to, proxy.t, { arcLift }));
      },
    },
    position,
  );
}

/** Reduced motion: fade the canvas out, cut the camera, fade back in. */
function addCut(
  tl: gsap.core.Timeline,
  ctx: DirectorContext,
  to: CameraPose,
  position: gsap.Position,
  frameShift: number,
) {
  tl.to(ctx.motion, { canvasOpacity: 0, duration: REDUCED.fadeOut, ease: "none" }, position)
    .call(() => {
      ctx.camera.applyPose(to);
      ctx.motion.frameShift = frameShift;
    })
    .to(ctx.motion, { canvasOpacity: 1, duration: REDUCED.fadeIn, ease: "none" });
}

function base(ctx: DirectorContext, name: string) {
  return gsap.timeline({
    id: name,
    onStart: ctx.onStart,
    onComplete: ctx.onComplete,
    onInterrupt: ctx.onComplete,
  });
}

function marksIn(tl: gsap.core.Timeline, ctx: DirectorContext, position: gsap.Position) {
  const { motion, reduced } = ctx;
  if (reduced) {
    tl.set(allMarkers(motion), { scale: 1 }, position).to(
      allMarkers(motion),
      { opacity: 1, duration: REDUCED.elementFade, ease: "none" },
      position,
    );
    tl.set(allArcs(motion), { progress: 1 }, position).to(
      allArcs(motion),
      { opacity: 1, duration: REDUCED.elementFade, ease: "none" },
      position,
    );
    return;
  }
  tl.fromTo(
    allMarkers(motion),
    { scale: 0, opacity: 0 },
    {
      scale: 1,
      opacity: 1,
      duration: ERA_CHANGE.markerIn,
      ease: EASE.pop,
      stagger: ERA_CHANGE.markerStagger,
      immediateRender: false,
    },
    position,
  );
  const arcsAt = `<+=${ERA_CHANGE.arcsAfterMarkers}`;
  tl.set(allArcs(motion), { opacity: 1, progress: 0 }, arcsAt).to(
    allArcs(motion),
    { progress: 1, duration: ERA_CHANGE.arcIn, ease: EASE.trace, stagger: ERA_CHANGE.arcStagger },
    arcsAt,
  );
}

/**
 * Brings temporary values (sweep, accent mid-tint, arcs/markers mid-intro, stars/atmosphere) to rest.
 * An interrupted timeline can leave them anywhere; run at position 0 of timelines that don't own them.
 */
function addSettle(tl: gsap.core.Timeline, ctx: DirectorContext, accent: string) {
  const { motion, reduced } = ctx;
  const color = new Color(accent);
  const duration = reduced ? 0 : 0.3;
  const vars = { duration, ease: EASE.tint };
  tl.to(motion, { sweepStrength: 0, stars: 1, atmosphere: 1, ...vars }, 0);
  tl.to(motion.accent, { r: color.r, g: color.g, b: color.b, ...vars }, 0);
  tl.to(allArcs(motion), { progress: 1, opacity: 1, ...vars }, 0);
  tl.to(allMarkers(motion), { scale: 1, ...vars }, 0);
}

/* --------------------------------------------------------------- moments */

/** 1 · Initial load: the globe emerges from deep space and settles on the first era. */
export function createIntroTimeline(ctx: DirectorContext, eraPose: CameraPose, accent: string): gsap.core.Timeline {
  const { motion, camera, reduced } = ctx;
  const tl = base(ctx, "intro");
  motion.accent.set(accent);
  motion.frameShift = 0;
  motion.markers.forEach((m) => Object.assign(m, { scale: 0, opacity: 0, highlight: 0 }));
  motion.arcs.forEach((a) => Object.assign(a, { progress: 0, opacity: 0 }));

  if (reduced) {
    camera.applyPose(eraPose);
    tl.set(motion, { atmosphere: 1, stars: 1, canvasOpacity: 0 })
      .to(motion, { canvasOpacity: 1, duration: REDUCED.fadeIn, ease: "none" });
    marksIn(tl, ctx, 0);
    return tl;
  }

  camera.applyPose({ direction: eraPose.direction.clone(), distance: CAMERA.introStart });
  motion.atmosphere = 0;
  motion.stars = 0;
  tl.to(motion, { stars: 1, duration: INTRO.starsIn, ease: EASE.tint }, 0);
  tl.to(motion, { atmosphere: 1, duration: INTRO.atmosphereIn, ease: EASE.tint }, INTRO.atmosphereAt);
  const proxy = { d: CAMERA.introStart };
  tl.to(
    proxy,
    {
      d: eraPose.distance,
      duration: INTRO.dolly,
      ease: EASE.settle,
      onUpdate: () => camera.applyPose({ direction: camera.getPose().direction, distance: proxy.d }),
    },
    0,
  );
  marksIn(tl, ctx, INTRO.markersAt);
  return tl;
}

/** 2 · Era change: feels like travelling in time, not filtering a list. */
export function createEraChangeTimeline(
  ctx: DirectorContext,
  eraPose: CameraPose,
  accent: string,
): gsap.core.Timeline {
  const { motion, camera, reduced } = ctx;
  const tl = base(ctx, "eraChange");
  const target = new Color(accent);

  if (reduced) {
    tl.to(allMarkers(motion), { opacity: 0, duration: REDUCED.elementFade, ease: "none" }, 0)
      .to(allArcs(motion), { opacity: 0, duration: REDUCED.elementFade, ease: "none" }, 0)
      .call(() => ctx.swapEra?.(), [], REDUCED.elementFade)
      .to(motion.accent, { r: target.r, g: target.g, b: target.b, duration: REDUCED.tint, ease: "none" }, 0);
    tl.set(allMarkers(motion), { highlight: 0 }, REDUCED.elementFade);
    addCut(tl, ctx, eraPose, REDUCED.elementFade, 0);
    marksIn(tl, ctx, ">");
    return tl;
  }

  // Outgoing: markers shrink first (most important), arcs retract alongside.
  tl.to(
    allMarkers(motion),
    {
      scale: 0,
      opacity: 0,
      highlight: 0,
      duration: ERA_CHANGE.markersOut,
      ease: EASE.exit,
      stagger: ERA_CHANGE.markersOutStagger,
    },
    0,
  );
  tl.to(allArcs(motion), { opacity: 0, duration: ERA_CHANGE.arcsOut, ease: EASE.exit }, 0);
  tl.call(() => ctx.swapEra?.(), [], ERA_CHANGE.swapAt);

  // Atmosphere shift + time sweep across the globe.
  tl.to(
    motion.accent,
    { r: target.r, g: target.g, b: target.b, duration: ERA_CHANGE.tint, ease: EASE.tint },
    ERA_CHANGE.tintAt,
  );
  tl.fromTo(motion, { sweep: 0 }, { sweep: 1, duration: ERA_CHANGE.sweep, ease: "power1.inOut", immediateRender: false }, ERA_CHANGE.sweepAt);
  tl.to(motion, { sweepStrength: 1, duration: ERA_CHANGE.sweep * 0.3, ease: "sine.out" }, ERA_CHANGE.sweepAt);
  tl.to(
    motion,
    { sweepStrength: 0, duration: ERA_CHANGE.sweep * 0.45, ease: "sine.in" },
    ERA_CHANGE.sweepAt + ERA_CHANGE.sweep * 0.55,
  );

  // Camera travels to the new framing; new era arrives as it brakes.
  const duration = flightDuration(camera.getPose(), eraPose, CAMERA.flight);
  addFlight(tl, ctx, eraPose, duration, CAMERA.arcLift, ERA_CHANGE.cameraAt);
  tl.to(motion, { frameShift: 0, duration, ease: EASE.travel }, ERA_CHANGE.cameraAt);
  const markersAt = Math.max(ERA_CHANGE.swapAt + 0.05, ERA_CHANGE.cameraAt + duration * ERA_CHANGE.markersInAtFlight);
  marksIn(tl, ctx, markersAt);
  return tl;
}

/** 3 · Location selected: fly in, dim the others, highlight the chosen one. */
export function createSelectTimeline(
  ctx: DirectorContext,
  focusPose: CameraPose,
  index: number,
  accent: string,
): gsap.core.Timeline {
  const { motion, camera, reduced } = ctx;
  const tl = base(ctx, "select");
  addSettle(tl, ctx, accent);
  const others = motion.markers.filter((_, i) => i !== index);
  const chosen = motion.markers[index];

  if (reduced) {
    tl.to(others, { opacity: SELECT.dimOpacity, highlight: 0, duration: REDUCED.elementFade, ease: "none" }, 0);
    tl.to(chosen, { opacity: 1, scale: 1, highlight: 1, duration: REDUCED.elementFade, ease: "none" }, 0);
    addCut(tl, ctx, focusPose, 0, 1);
    return tl;
  }

  const duration = flightDuration(camera.getPose(), focusPose, CAMERA.flight);
  addFlight(tl, ctx, focusPose, duration, CAMERA.arcLift, 0);
  tl.to(motion, { frameShift: 1, duration, ease: EASE.travel }, 0);
  tl.to(others, { opacity: SELECT.dimOpacity, highlight: 0, duration: SELECT.dimOthers, ease: EASE.tint }, 0);
  tl.to(chosen, { opacity: 1, scale: 1, duration: SELECT.dimOthers, ease: EASE.tint }, 0);
  tl.to(chosen, { highlight: 1, duration: SELECT.highlight, ease: EASE.pop }, duration * SELECT.highlightAtFlight);
  return tl;
}

/** 4 · Close: the panel leaves (UI), the camera steps back to the era framing. */
export function createCloseTimeline(
  ctx: DirectorContext,
  eraPose: CameraPose,
  accent: string,
): gsap.core.Timeline {
  const { motion, camera, reduced } = ctx;
  const tl = base(ctx, "close");
  addSettle(tl, ctx, accent);

  if (reduced) {
    tl.to(allMarkers(motion), { opacity: 1, highlight: 0, duration: REDUCED.elementFade, ease: "none" }, 0);
    addCut(tl, ctx, eraPose, 0, 0);
    return tl;
  }

  tl.to(allMarkers(motion), { highlight: 0, duration: CLOSE.unhighlight, ease: EASE.exit }, 0);
  const duration = flightDuration(camera.getPose(), eraPose, CAMERA.ret);
  addFlight(tl, ctx, eraPose, duration, CAMERA.arcLiftReturn, CLOSE.cameraAt);
  tl.to(motion, { frameShift: 0, duration, ease: EASE.travel }, CLOSE.cameraAt);
  tl.to(allMarkers(motion), { opacity: 1, scale: 1, duration: CLOSE.undim, ease: EASE.tint }, CLOSE.undimAt);
  return tl;
}
