import type { HistoricalScene } from "../types";
import { beats } from "./beats";

export const scene: HistoricalScene = {
  id: "mainz-press",
  elementId: "renacimiento--maguncia--technology",
  title: "La máquina que multiplicó los libros",
  yearLabel: "c. 1450 – 1455",
  duration: beats[beats.length - 1].end,
  beats,
  load: () => import("./index"),
};
