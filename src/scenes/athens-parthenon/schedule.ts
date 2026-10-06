import { ease, progress, smoothstep } from "../kit";
import { BEND_DEMO, BEND_REAL, COLUMNS, ENTASIS_DEMO, ENTASIS_REAL, HERO } from "./layout";

/** Pure time → state functions shared by the scene's components. */

/** Build order: columns ranked by distance from the hero (south-east corner) column. */
const RANK: number[] = (() => {
  const order = COLUMNS.map((c, i) => ({ i, d: Math.hypot(c.x - HERO.x, c.z - HERO.z) })).sort((a, b) => a.d - b.d);
  const rank = new Array<number>(COLUMNS.length);
  order.forEach((o, r) => (rank[o.i] = r));
  return rank;
})();

/** Drums already standing when the construction beat opens (work in progress around the hero column). */
const INITIAL = [6, 4, 3, 3, 2, 2, 1, 1, 1, 1];

/** Moment the hanging drum seats on the hero column. */
export const HERO_SEAT = 24;
export const HERO_DRUM_INDEX = 6;

/**
 * Pieces placed on column `i` at time `t`: 0..11 (10 drums then the capital). Fractional part = piece dropping in.
 * Columns only exist from the construction beat on.
 */
export function piecesBuilt(i: number, t: number): number {
  if (t < 20) return 0;
  const r = RANK[i];
  if (r === 0) {
    if (t < HERO_SEAT) return HERO_DRUM_INDEX;
    return Math.min(11, HERO_DRUM_INDEX + 1 + Math.max(0, (t - HERO_SEAT - 0.3) / 0.3));
  }
  const initial = INITIAL[r] ?? 0;
  const start = 24.4 + ((r - 1) / (COLUMNS.length - 2)) * 2.6;
  return Math.min(11, Math.max(initial, (t - start) / 0.21));
}

export const wallsRise = (t: number) => ease.inOut(progress(t, 25.2, 29.4));
export const archDrop = (t: number) => progress(t, 29.0, 30.0);
export const friezeDrop = (t: number) => progress(t, 29.6, 30.6);
export const topDrop = (t: number) => progress(t, 30.2, 31.4);

/** Entasis demo (exaggerate, hold, relax to real) during the entasis beat. */
export function entasisAt(t: number): number {
  const up = ease.inOut(progress(t, 34, 36.8));
  const down = ease.inOut(progress(t, 39, 41.3));
  const k = up * (1 - down);
  return ENTASIS_REAL + (ENTASIS_DEMO - ENTASIS_REAL) * k;
}

/** Curvature of the stylobate: real everywhere, exaggerated ×25 during the stylobate beat. */
export function bendAt(t: number): [number, number] {
  const up = ease.inOut(progress(t, 43.6, 46.4));
  const down = ease.inOut(progress(t, 48.4, 50.4));
  const f = 1 + (BEND_DEMO - 1) * up * (1 - down);
  return [BEND_REAL[0] * f, BEND_REAL[1] * f];
}

/** Paint progress for an element at distance `d` (m) from the south-east corner: a wave sweeping the temple. */
export function paintAt(t: number, d: number): number {
  return smoothstep(52 + d * 0.075, 53.1 + d * 0.075, t);
}

/** Global paint state (pediments, mouldings). */
export const pedimentPaint = (t: number) => smoothstep(53.6, 55.8, t);
export const stripPaint = (t: number) => smoothstep(52.4, 56.5, t);
