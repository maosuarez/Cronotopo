"use client";

import { useEffect } from "react";
import { getEra } from "@/data/index";
import { useAtlasStore } from "@/store/useAtlasStore";

/** Single writer of --accent on <html>. Transitions via @property; no transition for the first paint. */
export function AccentSync() {
  useEffect(() => {
    const root = document.documentElement;
    const apply = (eraId: string) => {
      const era = getEra(eraId);
      if (era) root.style.setProperty("--accent", era.accentColor);
    };
    root.dataset.boot = "true";
    apply(useAtlasStore.getState().activeEraId);
    // Two frames: let the first colour commit with transitions off.
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => delete root.dataset.boot);
    });
    const unsubscribe = useAtlasStore.subscribe((state, prev) => {
      if (state.activeEraId !== prev.activeEraId) apply(state.activeEraId);
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      unsubscribe();
    };
  }, []);
  return null;
}
