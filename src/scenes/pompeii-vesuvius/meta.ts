import type { HistoricalScene } from "../types";
import { POMPEII_BEATS } from "./beats";

export const scene: HistoricalScene = {
  id: "pompeii-vesuvius",
  elementId: "roma--pompeya--event",
  title: "El día que desapareció Pompeya",
  yearLabel: "79 d.C.",
  duration: POMPEII_BEATS[POMPEII_BEATS.length - 1].end,
  beats: POMPEII_BEATS,
  load: () => import("./index"),
};
