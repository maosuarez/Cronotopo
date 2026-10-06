/** Pure animation math shared by scenes. All functions are deterministic. */
export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** Progress 0..1 of `t` inside the window [start, end]. */
export const progress = (t: number, start: number, end: number) => clamp((t - start) / Math.max(1e-6, end - start));
export const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
/** Rises 0→1 during [inStart, inEnd] and falls 1→0 during [outStart, outEnd]. */
export const window01 = (t: number, inStart: number, inEnd: number, outStart: number, outEnd: number) =>
  smoothstep(inStart, inEnd, t) * (1 - smoothstep(outStart, outEnd, t));

export type EaseFn = (t: number) => number;
export const ease = {
  linear: (t: number) => t,
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2),
  out: (t: number) => 1 - (1 - t) ** 3,
  in: (t: number) => t * t * t,
  sine: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  expoOut: (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t)),
  backOut: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
  },
} satisfies Record<string, EaseFn>;

export type Vec3 = [number, number, number];
export const lerp3 = (a: Vec3, b: Vec3, t: number): Vec3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];

export type Keyframe<T> = { t: number; v: T; ease?: EaseFn };

/**
 * Samples a keyframe track at time `t` (keys sorted by t). Holds the first/last value outside the range.
 * The ease of a key shapes the segment that ENDS at that key.
 */
export function sample<T extends number | Vec3>(keys: readonly Keyframe<T>[], t: number): T {
  if (t <= keys[0].t) return keys[0].v;
  const last = keys[keys.length - 1];
  if (t >= last.t) return last.v;
  let i = 1;
  while (keys[i].t < t) i++;
  const a = keys[i - 1];
  const b = keys[i];
  const k = (b.ease ?? ease.inOut)((t - a.t) / (b.t - a.t));
  if (typeof a.v === "number") return lerp(a.v, b.v as number, k) as T;
  return lerp3(a.v as Vec3, b.v as Vec3, k) as T;
}

/** Deterministic oscillation helper (period in seconds). */
export const wave = (t: number, period: number, phase = 0) => Math.sin(((t / period) + phase) * Math.PI * 2);
