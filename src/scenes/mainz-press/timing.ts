/**
 * Pure choreography of the workshop: every function maps scene time (s) to a state.
 * Times follow the storyboard in ./beats (scribe 0–10, mould 10–21, compose 21–32, ink 32–40,
 * press 40–51, sheet 51–61, multiply 61–69, europe 69–80).
 */
import { clamp, ease, lerp, progress, smoothstep, type Vec3 } from "../kit";

// ---------------------------------------------------------------- layout (world space)
export const SCRIBE = { desk: [-5.4, 0, -2.65] as Vec3, seat: [-5.4, 0, -1.95] as Vec3, window: [-5.4, 2.05, -3.38] as Vec3 };
export const CAST = { bench: [-2.35, 0, -2.85] as Vec3, furnace: [-3.55, 0, -2.8] as Vec3, mould: [-2.5, 0.9, -2.72] as Vec3 };
export const COMPOSE = { case: [0.25, 0, -3.0] as Vec3, stone: [0.95, 0, -2.05] as Vec3, forme: [0.66, 0.905, -2.1] as Vec3, stick: [1.2, 0.9, -1.92] as Vec3 };
export const PRESS = [4.4, 0, -2.2] as Vec3;
export const WINE_PRESS = [6.7, 0, -2.45] as Vec3;
export const STACK = [6.75, 0, -0.85] as Vec3;
export const MAP_TABLE = [5.6, 0, 1.7] as Vec3;
export const MAP_TOP = 0.8;

/** Printed page size (m). */
export const SHEET_W = 0.32;

// ---------------------------------------------------------------- cuts
/** Hard cuts (dip to black) between non-adjacent stations. */
export const CUTS = [21, 32];
export function dipOpacity(t: number) {
  let o = 0;
  for (const c of CUTS) o = Math.max(o, 1 - smoothstep(0, 0.32, Math.abs(t - c)));
  return o;
}

// ---------------------------------------------------------------- scribe (beat 1)
/** Lines written on the right page (0..84 = two columns of 42). */
export const scribeLines = (t: number) => 84 * progress(t, 0.6, 9.6);
/** Day/night time-lapse through the window: 0 = night, 1 = day. */
export function daylight(t: number) {
  if (t < 1.8 || t > 9.8) return 0;
  const k = (t - 1.8) / 2.2; // one day every 2.2 s
  const fade = smoothstep(1.8, 2.6, t) * (1 - smoothstep(9.0, 9.8, t));
  return fade * Math.max(0, Math.sin(k * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5) ** 1.5;
}
export function timeLapseWord(t: number): string {
  return t < 4.6 ? "días" : t < 7.2 ? "semanas" : "meses";
}

// ---------------------------------------------------------------- casting (beat 2)
export type CastState = { ladle: Vec3; tilt: number; full: boolean; stream: number; open: number; eject: number };
/** One casting cycle, u in 0..1: dip, carry, pour, open, eject. Ladle positions are relative to the mould. */
function castCycle(u: number): CastState {
  const pot: Vec3 = [-1.05, 0.0, -0.08];
  const above: Vec3 = [-0.1, 0.22, 0];
  const dip = progress(u, 0, 0.18);
  const carry = ease.inOut(progress(u, 0.2, 0.42));
  const back = ease.inOut(progress(u, 0.75, 1));
  let ladle: Vec3 = [lerp(pot[0], above[0], carry), lerp(pot[1] - 0.11 * Math.sin(dip * Math.PI), above[1], carry), lerp(pot[2], above[2], carry)];
  if (back > 0) ladle = [lerp(above[0], pot[0], back), lerp(above[1], pot[1], back), lerp(above[2], pot[2], back)];
  const pour = smoothstep(0.42, 0.5, u) * (1 - smoothstep(0.62, 0.7, u));
  return {
    ladle,
    tilt: pour * 1.05,
    full: u > 0.12 && u < 0.62,
    stream: smoothstep(0.46, 0.5, u) * (1 - smoothstep(0.6, 0.64, u)),
    open: smoothstep(0.66, 0.74, u) * (1 - smoothstep(0.92, 1, u)),
    eject: progress(u, 0.72, 0.9),
  };
}
const FAST_START = 17.0;
const FAST_PERIOD = 0.72;
const FAST_CYCLES = 5;
export const SORTS_PER_FAST_CYCLE = 8;
export function castState(t: number): CastState & { sorts: number } {
  if (t < FAST_START) {
    const u = progress(t, 12.0, FAST_START);
    return { ...castCycle(u), sorts: u >= 0.9 ? 1 : 0 };
  }
  const k = (t - FAST_START) / FAST_PERIOD;
  const done = Math.min(FAST_CYCLES, Math.floor(k));
  const u = k >= FAST_CYCLES ? 0 : k - Math.floor(k);
  const st = castCycle(k >= FAST_CYCLES ? 0 : u);
  return { ...st, sorts: 1 + done * SORTS_PER_FAST_CYCLE + (u >= 0.9 ? SORTS_PER_FAST_CYCLE : 0) };
}

// ---------------------------------------------------------------- composing (beat 3)
export const LINE_TEXT = "IN PRINCIPIO";
const SORT_START = 21.9;
const SORT_STEP = 0.36;
/** 0..1 drop-in progress of sort k into the stick. */
export const sortDrop = (t: number, k: number) => progress(t, SORT_START + k * SORT_STEP, SORT_START + k * SORT_STEP + 0.28);
/** The finished line slides from the stick into the forme. */
export const lineSlide = (t: number) => ease.inOut(progress(t, 26.6, 27.7));
/** Lines composed in the forme (0..42). */
export const formeLines = (t: number) => (t < 27.6 ? 0 : 1 + 41 * progress(t, 27.9, 31.4));

// ---------------------------------------------------------------- inking (beat 4)
/** 0..1 sweep of the ink balls over the forme (top of page → bottom). */
export const inkSweep = (t: number) => progress(t, 33.0, 38.6);
export const inkBallsOn = (t: number) => t > 31.9 && t < 40.4;

// ---------------------------------------------------------------- press (beats 5–7)
export const BAR_REST = -0.35;
export const BAR_PULL = -1.55;
export const CARRIAGE_OUT = 0.62;
export const TYMPAN_OPEN = -0.3;
export const PRINTED_AT = 46.2;

export type PressState = { carriage: number; tympan: number; bar: number; platen: number };
/** Pressing pulse 0..1 (0 = bar at rest, 1 = platen down). */
function pull(t: number, start: number, down: number, hold: number, up: number) {
  return ease.inOut(progress(t, start, start + down)) * (1 - ease.inOut(progress(t, start + down + hold, start + down + hold + up)));
}
export function pressState(t: number): PressState {
  // tympan: open → closed (41.5–43) → open (51–52.4) → closed (61.1–61.7)
  const close1 = ease.inOut(progress(t, 41.5, 43.0));
  const open1 = ease.inOut(progress(t, 51.0, 52.4));
  const close2 = ease.inOut(progress(t, 61.4, 62.0));
  const closed = clamp(close1 - open1 + close2);
  // carriage: out → in (43–44.6) → out (48.6–50.2) → in (62–62.5)
  const inward = clamp(ease.inOut(progress(t, 43.0, 44.6)) - ease.inOut(progress(t, 48.6, 50.2)) + ease.inOut(progress(t, 62.0, 62.5)));
  let p = pull(t, 44.6, 1.6, 1.0, 1.2);
  if (t > 62.5 && t < 68.8) {
    const u = ((t - 62.5) / 1.05) % 1;
    p = Math.sin(Math.PI * clamp(u / 0.8)) ** 2;
  }
  return {
    carriage: lerp(CARRIAGE_OUT, 0, inward),
    tympan: lerp(TYMPAN_OPEN, -Math.PI, closed),
    bar: lerp(BAR_REST, BAR_PULL, p),
    platen: p,
  };
}
export const winePressRise = (t: number) => smoothstep(40.0, 41.6, t) * (1 - smoothstep(49.6, 50.9, t));

/** Sheet flight: 0 = on the tympan, 1 = presented in front of the camera. */
export const sheetLift = (t: number) => ease.inOut(progress(t, 52.6, 55.2));
/** After the close-up the sheet flies to the drying line (0..1). */
export const sheetToLine = (t: number) => ease.inOut(progress(t, 61.0, 62.1));
export const SHEET_PRESENT: Vec3 = [4.4, 1.42, -0.55];

// ---------------------------------------------------------------- print run (beat 7)
/** Sheets hung on the drying lines at time t (fractional → the last one is dropping in). */
export const hungSheets = (t: number, capacity: number) => (t < 62.1 ? 0 : 1 + (capacity - 1) * progress(t, 62.6, 68.6));
export const stackSheets = (t: number, capacity: number) => capacity * progress(t, 62.8, 68.8);

// ---------------------------------------------------------------- map (beat 8)
export const mapInk = (t: number) => smoothstep(69.4, 71.2, t);
export const mainzOn = (t: number) => smoothstep(71.0, 71.6, t);
export const SPREAD = { start: 72.0, end: 77.4 };
