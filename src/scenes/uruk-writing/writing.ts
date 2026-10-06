/**
 * Choreography of the first tablet (beat "first-tablet"): which strokes exist at time t and where the stylus
 * tip is. Pure functions of time — the schedule is data, the state is derived, nothing accumulates.
 */
import { clamp, ease, lerp, progress } from "../kit";
import { BARLEY_STAGES, barleyStrokes, numeralStrokes, type Stroke } from "./signs";

/** Tablet A carries the account: numerals on the left, the barley sign on the right. */
const NUMERALS = numeralStrokes(-0.031);
const BARLEY = barleyStrokes(BARLEY_STAGES.pictograph, [0.017, 0]);
export const TABLET_A_STROKES: readonly Stroke[] = [...NUMERALS, ...BARLEY];

type Mark = { stroke: number; kind: "press" | "draw"; start: number; end: number };

/** Numerals are pressed (0.65 s each) from 38.2 s; the barley sign is drawn from 41.8 s. */
const SCHEDULE: Mark[] = (() => {
  const marks: Mark[] = [];
  let t = 38.2;
  NUMERALS.forEach((_, i) => {
    marks.push({ stroke: i, kind: "press", start: t, end: t + 0.42 });
    t += 0.65;
  });
  t = 41.8;
  BARLEY.forEach((_, i) => {
    const dur = i === 0 ? 0.9 : 0.42;
    marks.push({ stroke: NUMERALS.length + i, kind: "draw", start: t, end: t + dur });
    t += dur + 0.14;
  });
  return marks;
})();

export const WRITING_END = SCHEDULE[SCHEDULE.length - 1].end;
export const NUMERALS_END = SCHEDULE[NUMERALS.length - 1].end;

/** Strokes of tablet A as they look at time t (drawn lines grow from a to b, presses deepen). */
export function tabletAStrokes(t: number): Stroke[] {
  return SCHEDULE.map((m) => {
    const s = TABLET_A_STROKES[m.stroke];
    const k = progress(t, m.start, m.end);
    if (k <= 0) return { ...s, depth: 0 };
    if (m.kind === "press") return { ...s, depth: s.depth * ease.out(clamp(k * 1.6)) };
    const g = ease.sine(k);
    return { ...s, b: [lerp(s.a[0], s.b[0], g), lerp(s.a[1], s.b[1], g)] };
  });
}

/**
 * Stylus tip in tablet-local coordinates [x, lift, z] (lift = height above the surface, metres).
 * Between marks it travels in a low arc; on presses it dips in; on lines it rides the groove.
 */
export function stylusTip(t: number): [number, number, number] {
  const rest: [number, number, number] = [0.06, 0.05, 0.02];
  if (t < SCHEDULE[0].start - 0.6) return rest;
  for (let i = 0; i < SCHEDULE.length; i++) {
    const m = SCHEDULE[i];
    const s = TABLET_A_STROKES[m.stroke];
    const prevEnd = i === 0 ? SCHEDULE[0].start - 0.6 : SCHEDULE[i - 1].end;
    const from: [number, number] = i === 0 ? [rest[0], rest[2]] : endPoint(SCHEDULE[i - 1]);
    if (t < m.start) {
      // travel arc from the previous mark to this one
      const k = ease.inOut(progress(t, prevEnd, m.start));
      const lift = i === 0 ? lerp(rest[1], 0.004, k) : Math.sin(Math.PI * k) * 0.009 + 0.0005;
      return [lerp(from[0], s.a[0], k), lift, lerp(from[1], s.a[1], k)];
    }
    if (t <= m.end) {
      const k = progress(t, m.start, m.end);
      if (m.kind === "press") return [s.a[0], 0.004 * Math.cos(Math.PI * k) ** 2 - 0.0012 * Math.sin(Math.PI * k), s.a[1]];
      const g = ease.sine(k);
      return [lerp(s.a[0], s.b[0], g), -0.0006, lerp(s.a[1], s.b[1], g)];
    }
  }
  // after the last stroke the scribe lifts the stylus away
  const last = endPoint(SCHEDULE[SCHEDULE.length - 1]);
  const k = ease.inOut(progress(t, WRITING_END, WRITING_END + 1.2));
  return [lerp(last[0], rest[0], k), lerp(0.001, rest[1], k), lerp(last[1], rest[2], k)];
}

function endPoint(m: Mark): [number, number] {
  const s = TABLET_A_STROKES[m.stroke];
  return m.kind === "press" ? s.a : s.b;
}
