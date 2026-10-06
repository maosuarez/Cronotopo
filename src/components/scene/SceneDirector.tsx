"use client";

import { useEffect, useRef } from "react";
import type gsap from "gsap";
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
import { cameraDriverRef, useSceneState } from "./sceneState";

const eraPoseOf = (eraId: string) => {
  const era = getEra(eraId)!;
  return eraFramingPose(era.locations.map((l) => l.coordinates));
};

/**
 * Renders nothing. Translates store changes into choreography timelines.
 * Deep link (selection present at mount): intro runs to the era framing, then the select
 * timeline flies in, so the globe always "arrives" before focusing.
 */
export function SceneDirector() {
  const reduced = useReducedMotion();
  const reducedRef = useRef(reduced);
  const ready = useSceneState((s) => s.ready);

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
        locationFocusPose(found.location.coordinates, { distance: CAMERA.focusDistance }),
        index,
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

    const start = (run: (gen: number) => void) => {
      timeline?.kill();
      generation += 1;
      run(generation);
    };

    const { activeEraId, selectedLocationId } = atlas.getState();
    useSceneState.getState().setDisplayedEraId(activeEraId);
    start((gen) =>
      chain(
        gen,
        (ctx) => createIntroTimeline(ctx, eraPoseOf(activeEraId), getEra(activeEraId)!.accentColor),
        selectedLocationId ? () => (timeline = select(gen, selectedLocationId)) : undefined,
      ),
    );

    const unsubscribe = atlas.subscribe((state, prev) => {
      const eraChanged = state.activeEraId !== prev.activeEraId;
      const selection = state.selectedLocationId;
      if (!eraChanged && selection === prev.selectedLocationId) return;

      if (eraChanged) {
        const era = getEra(state.activeEraId);
        if (!era) return;
        start((gen) =>
          chain(
            gen,
            (ctx) =>
              createEraChangeTimeline(
                { ...ctx, swapEra: () => useSceneState.getState().setDisplayedEraId(era.id) },
                eraPoseOf(era.id),
                era.accentColor,
              ),
            selection ? () => (timeline = select(gen, selection)) : undefined,
          ),
        );
      } else if (selection) {
        start((gen) => {
          timeline = select(gen, selection);
        });
      } else {
        start((gen) => {
          timeline = createCloseTimeline(makeCtx(gen), eraPoseOf(state.activeEraId));
        });
      }
    });

    return () => {
      unsubscribe();
      generation += 1;
      timeline?.kill();
      atlas.getState().setTransitioning(false);
    };
  }, [ready]);

  return null;
}
