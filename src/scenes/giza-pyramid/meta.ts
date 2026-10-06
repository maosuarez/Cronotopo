import type { HistoricalScene } from "../types";
import { GIZA_BEATS } from "./beats";

export const scene: HistoricalScene = {
  id: "giza-pyramid",
  elementId: "egipto-antiguo--giza--landmark",
  title: "Construir una montaña de piedra",
  yearLabel: "c. 2560 a.C.",
  duration: GIZA_BEATS[GIZA_BEATS.length - 1].end,
  beats: GIZA_BEATS,
  load: () => import("./index"),
};
