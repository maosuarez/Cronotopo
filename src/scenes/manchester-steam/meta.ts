import type { HistoricalScene } from "../types";
import { BEATS } from "./beats";

export const scene: HistoricalScene = {
  id: "manchester-steam",
  elementId: "revolucion-industrial--manchester--technology",
  title: "La ciudad de las chimeneas",
  yearLabel: "c. 1780 – 1830",
  duration: BEATS[BEATS.length - 1].end,
  beats: BEATS,
  load: () => import("./index"),
};
