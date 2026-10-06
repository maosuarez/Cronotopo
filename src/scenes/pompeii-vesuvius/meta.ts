import type { HistoricalScene } from "../types";

/**
 * Registry entry for this scene. STUB: replace beats with the real storyboard (from ./beats) and point
 * `load` to "./index" once the scene component exists.
 */
const beats: HistoricalScene["beats"] = [
  { id: "wip", start: 0, end: 10, caption: "Escena en preparación.", visual: "Placeholder while the scene is being built." },
];

export const scene: HistoricalScene = {
  id: "pompeii-vesuvius",
  elementId: "roma--pompeya--event",
  title: "El día que desapareció Pompeya",
  yearLabel: "79 d.C.",
  duration: beats[beats.length - 1].end,
  beats,
  load: () => import("../placeholder"),
};
