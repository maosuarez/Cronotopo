import type { HistoricalScene } from "../types";
import { URUK_BEATS } from "./beats";

export const scene: HistoricalScene = {
  id: "uruk-writing",
  elementId: "mesopotamia--uruk--technology",
  title: "Nace la escritura",
  yearLabel: "c. 3400 – 3000 a.C.",
  duration: URUK_BEATS[URUK_BEATS.length - 1].end,
  beats: URUK_BEATS,
  load: () => import("./index"),
};
