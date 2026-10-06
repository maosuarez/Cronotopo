"use client";

import { useUrlSync } from "@/hooks/useUrlSync";
import { useAtlasStore } from "@/store/useAtlasStore";

/** Mounts URL sync and exposes the store as read-only data attributes (e2e hook). Renders nothing visible. */
export function AtlasUrlSync() {
  useUrlSync();
  const era = useAtlasStore((s) => s.activeEraId);
  const loc = useAtlasStore((s) => s.selectedLocationId);
  const transitioning = useAtlasStore((s) => s.isTransitioning);
  return (
    <div
      hidden
      data-testid="atlas-state"
      data-era={era}
      data-loc={loc ?? ""}
      data-transitioning={String(transitioning)}
    />
  );
}
