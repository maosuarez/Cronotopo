import type { HistoricalScene } from "../types";

/**
 * Registry entry for this scene. STUB: replace beats with the real storyboard (from ./beats) and point
 * `load` to "./index" once the scene component exists.
 */
const beats: HistoricalScene["beats"] = [
  { id: "wip", start: 0, end: 10, caption: "Escena en preparación.", visual: "Placeholder while the scene is being built." },
];

export const scene: HistoricalScene = {
  id: "giza-pyramid",
  elementId: "egipto-antiguo--giza--landmark",
  title: "Construir una montaña de piedra",
  yearLabel: "c. 2560 a.C.",
  duration: beats[beats.length - 1].end,
  beats,
  load: () => import("../placeholder"),
};
