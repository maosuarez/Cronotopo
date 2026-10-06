/**
 * Single entry point for atlas content. Components read eras from here (or the store), never from `eras/*`.
 * Validation runs at build time (`pnpm build` → scripts/validate-data.ts) so zod stays out of the client bundle.
 * To add an era: create `eras/NN-<id>.ts` and register it in `rawEras`.
 */
import type { HistoricalEra, HistoricalLocation } from "@/domain/types";
import era01 from "./eras/01-primeros-humanos";
import era02 from "./eras/02-revolucion-neolitica";
import era03 from "./eras/03-mesopotamia";
import era04 from "./eras/04-egipto-antiguo";
import era05 from "./eras/05-civilizacion-del-indo";
import era06 from "./eras/06-china-antigua";
import era07 from "./eras/07-grecia-clasica";
import era08 from "./eras/08-imperios-persas";
import era09 from "./eras/09-helenismo";
import era10 from "./eras/10-roma";
import era11 from "./eras/11-india-clasica";
import era12 from "./eras/12-mundo-islamico-medieval";
import era13 from "./eras/13-europa-medieval";
import era14 from "./eras/14-china-medieval";
import era15 from "./eras/15-imperio-mongol";
import era16 from "./eras/16-renacimiento";
import era17 from "./eras/17-exploracion-global";
import era18 from "./eras/18-revolucion-cientifica";
import era19 from "./eras/19-revolucion-industrial";
import era20 from "./eras/20-mundo-contemporaneo";

export const rawEras: readonly HistoricalEra[] = [
  era01, era02, era03, era04, era05, era06, era07, era08, era09, era10, era11, era12, era13, era14, era15, era16, era17, era18, era19, era20,
];

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
