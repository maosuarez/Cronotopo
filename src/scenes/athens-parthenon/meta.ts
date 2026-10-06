import type { HistoricalScene } from "../types";
import { beats } from "./beats";

export const scene: HistoricalScene = {
  id: "athens-parthenon",
  elementId: "grecia-clasica--atenas--landmark",
  title: "El templo de Atenea",
  yearLabel: "447 – 432 a.C.",
  duration: beats[beats.length - 1].end,
  beats,
  load: () => import("./index"),
};
