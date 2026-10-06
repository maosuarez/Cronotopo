/**
 * Shared art direction: "museum diorama". Warm earthy base, matte low-poly materials, one era accent per scene.
 * Scenes take colours from here instead of inventing their own so the six episodes read as one series.
 */
export const PALETTE = {
  // ground & stone
  sand: "#d8b98a",
  sandDark: "#b8925f",
  clay: "#b9764f",
  mudbrick: "#c49a6c",
  mudbrickDark: "#9c7550",
  limestone: "#e9dfc9",
  limestoneShade: "#cbbd9f",
  marble: "#f1ece2",
  basalt: "#4a4540",
  soil: "#7a5a3c",
  grass: "#7f8f4e",
  grassDry: "#a59a5a",
  leaf: "#5f7a3d",
  palmLeaf: "#6d8a3f",
  trunk: "#6b4a2f",
  water: "#3f7f8c",
  waterDeep: "#2a5866",
  // materials
  wood: "#8a5e3b",
  woodDark: "#5c3d26",
  iron: "#3d3f44",
  brass: "#b8913f",
  lead: "#7c8189",
  paper: "#efe6cf",
  ink: "#1d1a17",
  brick: "#8e4a35",
  soot: "#2e2b2a",
  smoke: "#8b8580",
  // people
  skinTones: ["#8d5a3b", "#a8714b", "#c08a62", "#7a4b30", "#d0a07a"],
  linen: "#e6dcc3",
  wool: "#9c8a6a",
  dyeRed: "#9b3d2e",
  dyeBlue: "#3e5a7a",
  dyeOchre: "#c08a3e",
  dyeGreen: "#5d6b3a",
} as const;

/** Era accents (match `accentColor` in src/data/eras). */
export const ACCENT = {
  mesopotamia: "#6fa8dc",
  egypt: "#e8c547",
  greece: "#8fb8e8",
  rome: "#e2726e",
  renaissance: "#f2c57c",
  industrial: "#c9a77c",
} as const;
