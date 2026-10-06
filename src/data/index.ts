/**
 * Single entry point for atlas content. Components read eras from here (or the store), never from `eras/*`.
 * Validation runs at build time (`pnpm build` → scripts/validate-data.ts) so zod stays out of the client bundle.
 * To add an era: create `eras/NN-<id>.ts` and register it in `rawEras`.
 */
import type { HistoricalEra, HistoricalLocation } from "@/domain/types";
import era01 from "./eras/01-primeros-humanos";

export const rawEras: readonly HistoricalEra[] = [era01];

export const eras: readonly HistoricalEra[] = [...rawEras].sort((a, b) => a.order - b.order);

const eraById = new Map(eras.map((e) => [e.id, e]));
const locationById = new Map<string, { era: HistoricalEra; location: HistoricalLocation }>(
  eras.flatMap((era) => era.locations.map((location) => [location.id, { era, location }] as const)),
);

export const firstEra: HistoricalEra = eras[0];

export function getEra(id: string | null | undefined): HistoricalEra | undefined {
  return id ? eraById.get(id) : undefined;
}

export function getLocation(id: string | null | undefined): { era: HistoricalEra; location: HistoricalLocation } | undefined {
  return id ? locationById.get(id) : undefined;
}
