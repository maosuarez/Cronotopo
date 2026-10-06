"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { getEra, getLocation } from "@/data/index";
import {
  CAMERA,
  createCloseTimeline,
  createEraChangeTimeline,
  createIntroTimeline,
  createSelectTimeline,
  sceneMotion,
  type DirectorContext,
} from "@/lib/choreography";
import { eraFramingPose, locationFocusPose } from "@/lib/camera";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useAtlasStore } from "@/store/useAtlasStore";
import { cameraDriverRef } from "./sceneState";

/** Never zoom out when focusing: tight eras (e.g. Greece) are framed closer than the default focus. */
const focusDistanceFor = (eraId: string) =>
  Math.min(CAMERA.focusDistance, Math.max(CAMERA.minDistance + 0.05, eraPoseOf(eraId).distance - 0.3));

const requireEra = (eraId: string) => {
  const era = getEra(eraId);
  if (!era) throw new Error(`SceneDirector: unknown era "${eraId}"`);
  return era;
};

const eraPoseOf = (eraId: string) => eraFramingPose(requireEra(eraId).locations.map((l) => l.coordinates));

/**
 * Renders nothing. Translates store changes into choreography timelines.
 * Deep link (selection present at mount): intro runs to the era framing, then the select
 * timeline flies in, so the globe always "arrives" before focusing.
 */
export function SceneDirector() {
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const ready = useAtlasStore((s) => s.sceneReady);

  // `?debug=1`: lets motion tests slow the 3D timelines down to capture denser frame sequences.
  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("debug") !== "1") return;
    const w = window as typeof window & { __atlasDebug?: { timeScale: (s: number) => void } };
    w.__atlasDebug = { timeScale: (s) => void gsap.globalTimeline.timeScale(s) };
    return () => {
      delete w.__atlasDebug;
    };
  }, []);

  useEffect(() => {
    reducedRef.current = reduced;
    sceneMotion.ambient = !reduced;
  }, [reduced]);

  useEffect(() => {
    const camera = cameraDriverRef.current;
    if (!ready || !camera) return;

    const atlas = useAtlasStore;
    let timeline: gsap.core.Timeline | null = null;
    let generation = 0;

    // `generation` guards callbacks of killed timelines (GSAP fires onInterrupt on kill).
    const makeCtx = (gen: number, extra: Partial<DirectorContext> = {}): DirectorContext => ({
      motion: sceneMotion,
      camera,
      reduced: reducedRef.current,
      onStart: () => gen === generation && atlas.getState().setTransitioning(true),
      onComplete: () => gen === generation && atlas.getState().setTransitioning(false),
      ...extra,
    });

    const select = (gen: number, locationId: string, extra?: Partial<DirectorContext>) => {
      const found = getLocation(locationId);
      if (!found) return null;
      const index = found.era.locations.findIndex((l) => l.id === locationId);
      return createSelectTimeline(
        makeCtx(gen, extra),
        locationFocusPose(found.location.coordinates, { distance: focusDistanceFor(found.era.id) }),
        index,
        found.era.accentColor,
      );
    };

    // Runs `first`, then (if given) `then` instead of finishing the transition.
    const chain = (gen: number, first: (ctx: DirectorContext) => gsap.core.Timeline, then?: () => void) => {
      const ctx = makeCtx(gen, {
        onComplete: () => {
          if (gen !== generation) return;
          if (then) then();
          else atlas.getState().setTransitioning(false);
        },
      });
      timeline = first(ctx);
    };

    const selectThen = (gen: number, locationId: string) => () => {
      timeline = select(gen, locationId);
      if (!timeline) atlas.getState().setTransitioning(false);
    };

    // Era-change timeline to `eraId`, optionally followed by a selection in it.
    const changeEra = (gen: number, eraId: string, selection: string | null) =>
      chain(
        gen,
        (ctx) =>
          createEraChangeTimeline(
            { ...ctx, swapEra: () => atlas.getState().setDisplayedEra(eraId) },
            eraPoseOf(eraId),
            requireEra(eraId).accentColor,
          ),
        selection ? selectThen(gen, selection) : undefined,
      );

    const start = (run: (gen: number) => void) => {
      // Bump first: kill() fires onInterrupt synchronously and the stale guard must already reject it.
      generation += 1;
      timeline?.kill();
      timeline = null;
      run(generation);
    };

    const { activeEraId, selectedLocationId } = atlas.getState();
    atlas.getState().setDisplayedEra(activeEraId);
    start((gen) =>
      chain(
        gen,
        (ctx) => createIntroTimeline(ctx, eraPoseOf(activeEraId), requireEra(activeEraId).accentColor),
        selectedLocationId ? selectThen(gen, selectedLocationId) : undefined,
      ),
    );

    const unsubscribe = atlas.subscribe((state, prev) => {
      const eraChanged = state.activeEraId !== prev.activeEraId;
      const selection = state.selectedLocationId;
      if (!eraChanged && selection === prev.selectedLocationId) return;
      if (!getEra(state.activeEraId)) return;

      // An interrupted era change leaves the previous era's markers on screen:
      // finish the era change first so marker indices match the active era.
      const staleDisplay = state.displayedEraId !== state.activeEraId;

      if (eraChanged || staleDisplay) {
        start((gen) => changeEra(gen, state.activeEraId, selection));
      } else if (selection) {
        start((gen) => {
          timeline = select(gen, selection);
        });
      } else {
        start((gen) => {
          timeline = createCloseTimeline(makeCtx(gen), eraPoseOf(state.activeEraId), requireEra(state.activeEraId).accentColor);
        });
      }
    });

    return () => {
      unsubscribe();
      generation += 1;
      timeline?.kill();
      timeline = null;
      atlas.getState().setTransitioning(false);
    };
  }, [ready]);

  return null;
}
