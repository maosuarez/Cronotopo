import { firstEra, getEra, getLocation } from "@/data/index";
import { getSceneLocation } from "@/scenes/registry";

export type AtlasQuery = { eraId: string; locationId: string | null; sceneId: string | null };

/**
 * Validates against the data. A valid `loc` wins over a mismatched `era`; anything invalid falls back to the first era.
 * `scene` is kept only when `loc` is valid, that location owns the element and the element has a scene.
 */
export function parseAtlasQuery(search: string): AtlasQuery {
  const params = new URLSearchParams(search);
  const found = getLocation(params.get("loc"));
  if (found) {
    const scene = params.get("scene");
    const sceneId = getSceneLocation(scene)?.location.id === found.location.id ? scene : null;
    return { eraId: found.era.id, locationId: found.location.id, sceneId };
  }
  const era = getEra(params.get("era"));
  return { eraId: era ? era.id : firstEra.id, locationId: null, sceneId: null };
}

/** Canonical order: `?era=x&loc=y&scene=z`. `scene` is only written together with `loc`. */
export function buildAtlasQuery({ eraId, locationId, sceneId }: AtlasQuery): string {
  const params = new URLSearchParams({ era: eraId });
  if (locationId) {
    params.set("loc", locationId);
    if (sceneId) params.set("scene", sceneId);
  }
  return `?${params.toString()}`;
}
