/** Timing and curve constants for the whole choreography. No three/gsap imports: safe for the initial UI bundle. */

/* ------------------------------------------------------------------ curves */

export const EASE = {
  /** Documentary camera: calm acceleration, weighted braking. */
  travel: "power2.inOut",
  /** Long settle for arrivals (camera dolly-in, panel). */
  settle: "expo.out",
  /** Elements leaving: accelerate away, never linger. */
  exit: "power2.in",
  /** Marker pop: slight overshoot gives physical weight. */
  pop: "back.out(2.2)",
  /** Arc tracing: fast start, gentle finish, like a pen stroke. */
  trace: "power2.out",
  /** Colour/atmosphere: symmetric and slow. */
  tint: "sine.inOut",
} as const;

/** CSS / Framer equivalents of the curves above. */
export const CSS_EASE = {
  settle: [0.16, 1, 0.3, 1] as [number, number, number, number],
  exit: [0.55, 0, 1, 0.45] as [number, number, number, number],
  travel: [0.45, 0, 0.55, 1] as [number, number, number, number],
};

/* --------------------------------------------------------------- durations */

export const CAMERA = {
  /** Era framing / location flights scale with angular distance between these bounds (s). */
  flight: { min: 1.6, max: 2.2 },
  /** Returning to the era framing after closing is a shorter hop. */
  ret: { min: 1.2, max: 1.6 },
  /** Extra pull-back (world units) at mid-flight on a half-globe trip. */
  arcLift: 0.9,
  arcLiftReturn: 0.25,
  /** Distances. */
  introStart: 7.5,
  focusDistance: 1.75,
  minDistance: 1.35,
  maxDistance: 6,
  /** Idle orbit (OrbitControls.autoRotateSpeed) and resume delay after interaction (ms). */
  idleSpeed: 0.35,
  idleResumeMs: 4000,
} as const;

export const INTRO = {
  loaderFadeOut: 0.6,
  dolly: 2.6,
  atmosphereIn: 1.4,
  atmosphereAt: 0.2,
  starsIn: 1.8,
  markersAt: 1.5,
  arcsAt: 1.9,
} as const;

export const ERA_CHANGE = {
  markersOut: 0.35,
  markersOutStagger: 0.05,
  arcsOut: 0.3,
  /** Swap of displayed era data happens when the outgoing elements are gone. */
  swapAt: 0.4,
  tintAt: 0.1,
  tint: 1.1,
  sweepAt: 0.1,
  sweep: 1.3,
  cameraAt: 0.15,
  /** New markers enter once the camera has covered this fraction of its flight. */
  markersInAtFlight: 0.62,
  markerIn: 0.7,
  markerStagger: 0.12,
  arcsAfterMarkers: 0.25,
  arcIn: 0.9,
  arcStagger: 0.15,
} as const;

export const SELECT = {
  dimOthers: 0.45,
  dimOpacity: 0.3,
  /** Selected marker highlight starts at this fraction of the flight. */
  highlightAtFlight: 0.55,
  highlight: 0.6,
} as const;

export const CLOSE = {
  cameraAt: 0.12,
  undim: 0.5,
  undimAt: 0.35,
  unhighlight: 0.35,
} as const;

/** Framing offset so the focused location clears the UI panel (432px right panel / 54dvh bottom sheet). */
export const FRAMING = {
  panelWidthDesktop: 432,
  sheetHeightMobile: 0.54,
  desktopBreakpoint: 1024,
  /** Mobile: focus point sits at this fraction of the free (top) area height. */
  mobileFocusY: 0.45,
} as const;

export const REDUCED = {
  fadeOut: 0.18,
  fadeIn: 0.28,
  tint: 0.3,
  elementFade: 0.25,
} as const;

/** Timing consumed by the 2D UI (Framer Motion). Seconds. */
export const UI_MOTION = {
  chromeInDelay: 1.7,
  chromeIn: 0.8,
  chromeStagger: 0.12,
  headerOut: 0.25,
  headerIn: 0.55,
  headerInDelay: 0.35,
  /** Panel enters while the camera is still braking (≈55% of a typical flight). */
  panelInDelay: 0.95,
  panelIn: 0.65,
  panelOut: 0.3,
  cardsDelay: 0.25,
  cardStagger: 0.07,
  cardIn: 0.5,
  reducedFade: 0.2,
  /** Panel content leaving when the selected location changes while the panel stays open. */
  contentOut: 0.2,
  /** Timeline caption swap. */
  captionFade: 0.15,
  /** Location rows enter after the header text. */
  rowsDelay: 0.1,
  /** Loader graticule rotation period. */
  loaderSpin: 60,
} as const;

/** Scene player (2D overlay, Framer Motion). Seconds. */
export const PLAYER_MOTION = {
  /** Overlay expands from the card's rect to fullscreen (clip-path). */
  open: 0.6,
  openEase: CSS_EASE.settle,
  /** Collapses back into the card: shorter, accelerating away. */
  close: 0.42,
  closeEase: CSS_EASE.travel,
  /** Title/controls fade in once the overlay is mostly open. */
  chromeDelay: 0.3,
  chromeIn: 0.35,
  captionOut: 0.18,
  captionIn: 0.32,
  /** Reduced motion: overlay fade and slideshow fade between key frames. */
  reducedFade: 0.2,
  slideFade: 0.3,
  /** Corner radius of the card the overlay grows from (px). */
  originRadius: 6,
} as const;
