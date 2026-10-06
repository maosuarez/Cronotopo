"use client";

import { useEffect } from "react";
import { buildAtlasQuery, parseAtlasQuery, type AtlasQuery } from "@/lib/url";
import { useAtlasStore } from "@/store/useAtlasStore";

/** `debug=1` (test hooks) survives URL normalisation for the whole session. */
let debugSuffix = "";

const toQuery = (): AtlasQuery => {
  const { activeEraId, selectedLocationId, sceneElementId } = useAtlasStore.getState();
  return { eraId: activeEraId, locationId: selectedLocationId, sceneId: sceneElementId };
};

/**
 * Keeps `?era=&loc=&scene=` and the atlas store in sync (pushState / popstate, no router).
 * Runs on mount before the scene is ready (texture load is async), so the intro frames the URL's era.
 * A deep-linked `scene` opens once the globe is ready: the player pauses the globe canvas, which
 * would otherwise never render its first frame and the loader would never leave.
 */
export function useUrlSync() {
  useEffect(() => {
    debugSuffix = new URLSearchParams(window.location.search).get("debug") === "1" ? "&debug=1" : "";
    /** True while the store is being driven by the URL (popstate): nothing to push. */
    let applyingUrl = false;
    let cancelPendingScene: (() => void) | null = null;

    const openSceneWhenReady = (sceneId: string) => {
      cancelPendingScene?.();
      cancelPendingScene = null;
      if (useAtlasStore.getState().sceneReady) {
        useAtlasStore.getState().openScene(sceneId);
        return;
      }
      const unsubscribe = useAtlasStore.subscribe((state) => {
        if (!state.sceneReady) return;
        unsubscribe();
        cancelPendingScene = null;
        state.openScene(sceneId);
      });
      cancelPendingScene = unsubscribe;
    };

    const initial = parseAtlasQuery(window.location.search);
    const store = useAtlasStore.getState();
    if (initial.locationId) store.selectLocation(initial.locationId);
    else store.setEra(initial.eraId);
    // Content on screen starts as the deep-linked era (the director would also do this at intro).
    store.setDisplayedEra(useAtlasStore.getState().activeEraId);
    // Canonical URL keeps the pending scene so it is not dropped before the globe is ready.
    const canonical = buildAtlasQuery({ ...toQuery(), sceneId: initial.sceneId }) + debugSuffix;
    if (window.location.search !== canonical) {
      window.history.replaceState(null, "", `${window.location.pathname}${canonical}`);
    }
    if (initial.sceneId) openSceneWhenReady(initial.sceneId);

    const unsubscribe = useAtlasStore.subscribe((state, prev) => {
      if (
        state.activeEraId === prev.activeEraId &&
        state.selectedLocationId === prev.selectedLocationId &&
        state.sceneElementId === prev.sceneElementId
      ) {
        return;
      }
      if (state.selectedLocationId !== prev.selectedLocationId) {
        cancelPendingScene?.();
        cancelPendingScene = null;
      }
      if (applyingUrl) return;
      const query = buildAtlasQuery(toQuery()) + debugSuffix;
      if (window.location.search !== query) {
        window.history.pushState(null, "", `${window.location.pathname}${query}`);
      }
    });

    const onPopState = () => {
      const target = parseAtlasQuery(window.location.search);
      const store = useAtlasStore.getState();
      applyingUrl = true;
      try {
        if (target.sceneId) {
          if (store.selectedLocationId !== target.locationId && !store.sceneReady) store.selectLocation(target.locationId!);
          openSceneWhenReady(target.sceneId);
        } else if (target.locationId) {
          cancelPendingScene?.();
          cancelPendingScene = null;
          store.selectLocation(target.locationId);
          store.closeScene();
        } else if (target.eraId !== store.activeEraId) store.setEra(target.eraId);
        else store.clearSelection();
      } finally {
        applyingUrl = false;
      }
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      cancelPendingScene?.();
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
