import { firstEra, getEra, getLocation } from "@/data/index";

export type AtlasQuery = { eraId: string; locationId: string | null };

/** Validates against the data. A valid `loc` wins over a mismatched `era`; anything invalid falls back to the first era. */
export function parseAtlasQuery(search: string): AtlasQuery {
  const params = new URLSearchParams(search);
  const found = getLocation(params.get("loc"));
  if (found) return { eraId: found.era.id, locationId: found.location.id };
  const era = getEra(params.get("era"));
  return { eraId: era ? era.id : firstEra.id, locationId: null };
}

export function buildAtlasQuery({ eraId, locationId }: AtlasQuery): string {
  const params = new URLSearchParams({ era: eraId });
  if (locationId) params.set("loc", locationId);
  return `?${params.toString()}`;
}
