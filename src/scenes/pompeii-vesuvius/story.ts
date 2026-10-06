/**
 * Everything that changes over time, as pure functions of `t` (seconds): beat windows, deposit levels, eruption
 * column and surge parameters, lightning schedule and the light of every moment.
 */
import { LIGHT, mixLight, type LightPreset } from "../kit/lighting";
import { clamp, lerp, progress, smoothstep, type Vec3 } from "../kit/math";
import { createRng } from "../kit/prng";
import { POMPEII_BEATS } from "./beats";
import { LEVEL, VENT, VOLCANO, WIND } from "./world";

const beat = (id: string) => {
  const b = POMPEII_BEATS.find((x) => x.id === id);
  if (!b) throw new Error(`pompeii: unknown beat ${id}`);
  return b;
};
export const B = {
  city: beat("city"),
  eruption: beat("eruption"),
  pine: beat("pine"),
  pumice: beat("pumice"),
  surge: beat("surge"),
  buried: beat("buried"),
  centuries: beat("centuries"),
  excavation: beat("excavation"),
};

/** Key moments. */
export const T = {
  tremor: 12.3,
  /** Eruption column starts at the vent. */
  blast: 13.6,
  /** People are on screen only before this (leaving early, never harmed). */
  peopleEnd: B.pine.start,
  pumiceStart: 33,
  surgeLaunch: 44.6,
  /** Surge reaches the north wall / the camera in the street shot. */
  surgeWall: 53.6,
  cut: 61,
  cutEnd: B.excavation.start,
  ruins: B.excavation.start,
};

/** Is the cutaway section active (south part of the diorama removed)? */
export const isCut = (t: number) => t >= T.cut && t < T.cutEnd;

/** Top of the volcanic deposit over the city (−1 = none yet). */
export function depositLevel(t: number): number {
  if (t < T.pumiceStart) return -1;
  const pumice = LEVEL.pumice * progress(t, T.pumiceStart, B.pumice.end) ** 1.1;
  const flow = (LEVEL.flow - LEVEL.pumice) * smoothstep(54.2, 56.8, t);
  const soil = (LEVEL.soil - LEVEL.flow) * smoothstep(B.centuries.start + 0.5, B.centuries.end - 2, t);
  return pumice + flow + soil;
}

/** Pumice level at the instant a roof gave way (where its debris comes to rest). */
export const pumiceAt = (t: number) => LEVEL.pumice * progress(t, T.pumiceStart, B.pumice.end) ** 1.1;

/** Colour of the deposit surface: pumice → grey ash → soil → grass. */
export function depositTop(t: number): { color: string; mix: number; to: string } {
  if (t < 54.4) return { color: "#e3ddcf", to: "#8a837a", mix: 0 };
  if (t < B.centuries.start) return { color: "#e3ddcf", to: "#8a837a", mix: smoothstep(54.4, 56.6, t) };
  if (t < B.centuries.start + 3.5) return { color: "#8a837a", to: "#5d4a35", mix: smoothstep(B.centuries.start, B.centuries.start + 3.5, t) };
  return { color: "#5d4a35", to: "#6f8a45", mix: smoothstep(B.centuries.start + 3.5, B.centuries.start + 7, t) };
}

/** Volcanic ash cover of the countryside (0 = green, 1 = grey) and later regrowth. */
export function ashCover(t: number): number {
  const fall = smoothstep(33, 44, t) * 0.55 + smoothstep(53, 57, t) * 0.45;
  const regrow = smoothstep(B.centuries.start + 2, B.centuries.end - 1, t);
  return fall * (1 - regrow);
}

/** Summit morph (0 = pre-79 cone, 1 = truncated) — happens unseen inside the cloud during the surge. */
export const summitMorph = (t: number) => smoothstep(47, 56, t);

// ---------------------------------------------------------------- eruption column

export type ColumnState = { t0: number; t1: number; life: number; hc: number; rc0: number; spread: number; drift: number; scale: number; heat: number };

export function columnAt(t: number): ColumnState {
  const collapse = smoothstep(45, 51, t);
  const wane = smoothstep(B.buried.start, B.buried.start + 4, t);
  return {
    t0: T.blast,
    t1: B.buried.start + 6,
    life: 16,
    hc: lerp(lerp(470, 330, collapse), 160, wane),
    rc0: 16,
    spread: lerp(270, 210, collapse),
    drift: lerp(lerp(240, 320, smoothstep(30, 45, t)), 120, wane),
    scale: lerp(1, 0.35, wane) * (1 - smoothstep(B.buried.start + 4, B.buried.end - 2, t)),
    heat: 0.55 + 0.45 * smoothstep(44, 48, t),
  };
}

/** Distance (m) travelled by the surge front from the volcano axis along the slope towards the city. */
export function surgeFront(t: number): number {
  if (t < T.surgeLaunch) return 0;
  // accelerates down the cone and keeps its pace across the plain: over the north wall at ≈ 55 s,
  // reaching the street camera (≈ 475 m from the axis) as the beat ends
  const k = progress(t, T.surgeLaunch, B.buried.start);
  return 478 * (0.55 * k + 0.45 * k * k);
}

export const SURGE_DIR: [number, number] = (() => {
  const dx = 6 - VOLCANO.x;
  const dz = 30 - VOLCANO.z;
  const l = Math.hypot(dx, dz);
  return [dx / l, dz / l];
})();

// ---------------------------------------------------------------- lightning (atmosphere only)

export type Bolt = { t: number; dur: number; origin: Vec3; path: Vec3[]; branches: Vec3[][] };

function boltPath(rng: ReturnType<typeof createRng>, from: Vec3, len: number, segs: number, dir: Vec3): Vec3[] {
  const pts: Vec3[] = [from];
  let p = from;
  const step = len / segs;
  for (let i = 0; i < segs; i++) {
    p = [p[0] + dir[0] * step + rng.range(-0.6, 0.6) * step, p[1] + dir[1] * step + rng.range(-0.25, 0.25) * step, p[2] + dir[2] * step + rng.range(-0.6, 0.6) * step];
    pts.push(p);
  }
  return pts;
}

export const BOLTS: Bolt[] = (() => {
  const rng = createRng(4242);
  const times = [34.6, 36.9, 39.4, 41.1, 42.8, 45.6, 47.1, 48.4, 49.6, 50.7, 52.2, 54.9];
  return times.map((t, i) => {
    const inColumn = i % 3 === 1;
    const origin: Vec3 = inColumn
      ? [VENT[0] + rng.range(-25, 25), VENT[1] + rng.range(60, 200), VENT[2] + rng.range(-25, 25)]
      : [VENT[0] + WIND[0] * rng.range(120, 300) + rng.range(-120, 120), VENT[1] + rng.range(200, 300), VENT[2] + WIND[1] * rng.range(120, 300)];
    const path = boltPath(rng, origin, rng.range(90, 170), 11, [rng.range(-0.4, 0.4), -1, rng.range(-0.4, 0.4)]);
    const branches = [3, 6].map((k) => boltPath(rng, path[k], rng.range(30, 60), 5, [rng.range(-1, 1), -0.6, rng.range(-1, 1)]));
    return { t, dur: 0.5, origin, path, branches };
  });
})();

/** Lightning flash intensity (0..1) and the active bolt, if any. Flickers three times. */
export function flashAt(t: number): { k: number; bolt: Bolt | null } {
  for (const b of BOLTS) {
    const a = t - b.t;
    if (a >= 0 && a < b.dur) {
      const env = 1 - a / b.dur;
      const flicker = a < 0.08 ? 1 : a < 0.14 ? 0.25 : a < 0.24 ? 0.85 : a < 0.3 ? 0.2 : 0.55;
      return { k: env * flicker, bolt: b };
    }
  }
  return { k: 0, bolt: null };
}

// ---------------------------------------------------------------- light

const CAMPANIA: LightPreset = {
  skyTop: "#3f78bd", skyHorizon: "#efd9b3", skyGround: "#a88b66",
  sunDir: [0.55, 0.62, 0.62], sunColor: "#ffe3b8", sunIntensity: 3.1,
  hemiSky: "#d8e2ee", hemiGround: "#a0845f", hemiIntensity: 0.95,
  fogColor: "#e8d6b6", fogNear: 140, fogFar: 1150, sunGlow: 0.7,
};
const PLUME_DAY: LightPreset = {
  ...CAMPANIA,
  skyTop: "#5a6f8c", skyHorizon: "#e3c69a", sunColor: "#ffd6a0", sunIntensity: 2.6, hemiIntensity: 0.85, fogColor: "#d9c3a0",
};
const MISENUM: LightPreset = {
  skyTop: "#47729f", skyHorizon: "#f0c890", skyGround: "#8a7258",
  sunDir: [-0.55, 0.42, 0.72], sunColor: "#ffd39a", sunIntensity: 2.9,
  hemiSky: "#d6dce6", hemiGround: "#7d6650", hemiIntensity: 0.8,
  fogColor: "#e9cfa6", fogNear: 200, fogFar: 1400, sunGlow: 0.9,
};
const ASHFALL: LightPreset = {
  ...LIGHT.ash,
  skyTop: "#3d3530", skyHorizon: "#857262", fogColor: "#6e6157", fogNear: 30, fogFar: 260, sunColor: "#d9a27a", sunIntensity: 1.0, hemiSky: "#a3968a", hemiIntensity: 1.0,
};
const ASH_DARK: LightPreset = {
  ...LIGHT.ash,
  skyTop: "#221d1a", skyHorizon: "#5a493e", fogColor: "#4a3f37", fogNear: 25, fogFar: 220, sunColor: "#c98a62", sunIntensity: 0.7, hemiSky: "#8f8276", hemiIntensity: 0.9,
};
const SURGE_WIDE: LightPreset = {
  ...LIGHT.ash,
  skyTop: "#17130f", skyHorizon: "#4d3527", skyGround: "#1d1713", sunDir: [0.6, 0.35, 0.3], sunColor: "#d0835a", sunIntensity: 0.7,
  hemiSky: "#806a5c", hemiGround: "#241c17", hemiIntensity: 0.7, fogColor: "#33281f", fogNear: 150, fogFar: 1300, sunGlow: 0.1,
};
const SURGE_STREET: LightPreset = {
  ...SURGE_WIDE,
  skyHorizon: "#6a4532", fogColor: "#3e3027", fogNear: 40, fogFar: 520, hemiIntensity: 0.8,
};
const SILENCE: LightPreset = {
  skyTop: "#8a857f", skyHorizon: "#c3bbaf", skyGround: "#7d766d",
  sunDir: [0.4, 0.75, 0.5], sunColor: "#efe6d8", sunIntensity: 1.1,
  hemiSky: "#d4cec5", hemiGround: "#7c746a", hemiIntensity: 1.05,
  fogColor: "#b5ada2", fogNear: 60, fogFar: 600, sunGlow: 0.08,
};
const SECTION: LightPreset = {
  ...SILENCE, skyTop: "#7c8290", skyHorizon: "#d2c9ba", sunDir: [0.35, 0.7, 0.75], sunIntensity: 1.8, hemiIntensity: 1.0, fogNear: 120, fogFar: 900,
};
const CLEAR: LightPreset = { ...LIGHT.noon, sunDir: [0.4, 0.8, 0.6], fogNear: 140, fogFar: 1100 };
const MODERN: LightPreset = { ...CAMPANIA, skyTop: "#4677b4", sunDir: [0.75, 0.42, 0.45], sunColor: "#ffd59c", sunIntensity: 3.0 };
const SUNSET: LightPreset = { ...LIGHT.golden, sunDir: [0.85, 0.22, 0.4], fogNear: 140, fogFar: 1150, sunGlow: 1.0 };

/** Light of the moment (cuts may switch presets abruptly; inside a shot they blend). */
export function lightAt(t: number, flash: number): LightPreset {
  let l: LightPreset;
  if (t < T.tremor) l = CAMPANIA;
  else if (t < B.pine.start) l = mixLight(CAMPANIA, PLUME_DAY, progress(t, 16, 23));
  else if (t < B.pumice.start) l = MISENUM;
  else if (t < B.surge.start) l = mixLight(ASHFALL, ASH_DARK, progress(t, 35, 42));
  else if (t < 51.5) l = SURGE_WIDE;
  else if (t < B.buried.start) l = SURGE_STREET;
  else if (t < T.cut) l = SILENCE;
  else if (t < B.centuries.start) l = SECTION;
  else if (t < B.excavation.start) {
    const k = progress(t, B.centuries.start, B.centuries.start + 4);
    const base = mixLight(SECTION, { ...CLEAR, fogNear: 120, fogFar: 900 }, k);
    // the sun sweeps across the sky: days and seasons passing
    const a = (t - B.centuries.start) * 1.9;
    l = { ...base, sunDir: [Math.cos(a) * 0.8, 0.55 + 0.25 * Math.sin(a * 0.5), 0.5 + 0.4 * Math.sin(a)] };
  } else l = mixLight(MODERN, SUNSET, progress(t, 81, 88));
  if (flash > 0) {
    l = { ...l, hemiIntensity: l.hemiIntensity + flash * 1.6, hemiSky: "#c8d4ff", skyTop: mixLight(l, { ...l, skyTop: "#9aa6c8" }, clamp(flash)).skyTop };
  }
  return l;
}
