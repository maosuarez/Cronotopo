/**
 * Future: maps a locationId to a lazily-loaded detail scene (region/city/site/object zoom levels).
 * Kept framework-agnostic: the loader returns whatever the rendering layer understands.
 * Empty in the MVP — only the `world` zoom level is implemented.
 */
import type { ZoomLevel } from "./types";

export type SceneLoader = () => Promise<{ default: unknown }>;

export type SceneEntry = {
  zoomLevel: Exclude<ZoomLevel, "world">;
  load: SceneLoader;
};

export const sceneRegistry: Readonly<Record<string, SceneEntry>> = {};

export function getScene(locationId: string): SceneEntry | undefined {
  return sceneRegistry[locationId];
}
