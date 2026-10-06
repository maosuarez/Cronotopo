"use client";

import { useEffect } from "react";
import { buildAtlasQuery, parseAtlasQuery, type AtlasQuery } from "@/lib/url";
import { useAtlasStore } from "@/store/useAtlasStore";

/** `debug=1` (test hooks) survives URL normalisation for the whole session. */
let debugSuffix = "";

const toQuery = (): AtlasQuery => {
  const { activeEraId, selectedLocationId } = useAtlasStore.getState();
  return { eraId: activeEraId, locationId: selectedLocationId };
};

function applyToStore({ eraId, locationId }: AtlasQuery) {
  const store = useAtlasStore.getState();
  if (locationId) store.selectLocation(locationId);
  else store.setEra(eraId);
}

/**
 * Keeps `?era=&loc=` and the atlas store in sync (pushState / popstate, no router).
 * Runs on mount before the scene is ready (texture load is async), so the intro frames the URL's era.
 */
export function useUrlSync() {
  useEffect(() => {
    debugSuffix = new URLSearchParams(window.location.search).get("debug") === "1" ? "&debug=1" : "";
    const initial = parseAtlasQuery(window.location.search);
    applyToStore(initial);
    // Content on screen starts as the deep-linked era (the director would also do this at intro).
    useAtlasStore.getState().setDisplayedEra(useAtlasStore.getState().activeEraId);
    const canonical = buildAtlasQuery(toQuery()) + debugSuffix;
    if (window.location.search !== canonical) {
      window.history.replaceState(null, "", `${window.location.pathname}${canonical}`);
    }

    const unsubscribe = useAtlasStore.subscribe((state, prev) => {
      if (state.activeEraId === prev.activeEraId && state.selectedLocationId === prev.selectedLocationId) return;
      const query = buildAtlasQuery(toQuery()) + debugSuffix;
      if (window.location.search !== query) {
        window.history.pushState(null, "", `${window.location.pathname}${query}`);
      }
    });

    const onPopState = () => {
      const target = parseAtlasQuery(window.location.search);
      const store = useAtlasStore.getState();
      if (target.locationId) store.selectLocation(target.locationId);
      else if (target.eraId !== store.activeEraId) store.setEra(target.eraId);
      else store.clearSelection();
    };
    window.addEventListener("popstate", onPopState);

    return () => {
      unsubscribe();
      window.removeEventListener("popstate", onPopState);
    };
  }, []);
}
