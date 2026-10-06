/**
 * Signs as data: every mark on a tablet is a tapered stroke (a → b with end radii), which the clay shader turns
 * into a groove. One representation covers round numeral impressions (a = b), incised pictograph lines (equal
 * radii) and cuneiform wedges (fat head, thin tail), so the evolution of the barley sign is a plain interpolation
 * of stroke parameters. Units: metres in tablet-local coordinates (x right, z towards the viewer).
 */
import { lerp } from "../kit";

export type Stroke = {
  a: [number, number];
  b: [number, number];
  /** Radius at a / at b. */
  ra: number;
  rb: number;
  /** Groove depth at its deepest point (0 = not impressed). */
  depth: number;
  /** Depth falloff along the stroke: > 0 deepest at a, < 0 deepest at b. */
  taper: number;
};

export const MAX_STROKES = 16;

/** Screen-like sign space (u right, v up) → tablet plane (x right, z towards the viewer). */
const toTablet = (u: number, v: number): [number, number] => [u, -v];

/**
 * Proto-cuneiform numeral impressions made with the round end of a stylus: the D-shaped mark comes from an
 * oblique press, the circle from a vertical one. The values they stood for are not represented here.
 */
export function numeralStrokes(originX: number): Stroke[] {
  const cup = (u: number, v: number): Stroke => ({ a: toTablet(u, v + 0.0022), b: toTablet(u, v - 0.0022), ra: 0.0034, rb: 0.0019, depth: 0.0017, taper: 0.5 });
  const circle = (u: number, v: number): Stroke => ({ a: toTablet(u, v), b: toTablet(u, v), ra: 0.0043, rb: 0.0043, depth: 0.0019, taper: 0 });
  return [cup(originX, 0.013), cup(originX, 0.002), cup(originX, -0.009), circle(originX + 0.012, 0.01), circle(originX + 0.012, -0.004)];
}

/** Shape parameters of the barley sign; stages of its history are presets, in-betweens are interpolations. */
export type BarleyParams = {
  /** Rotation of the whole sign, radians counter-clockwise (later signs are turned 90°). */
  rotation: number;
  /** Angle of the ears from the stem, radians. */
  earAngle: number;
  earLength: number;
  /** Length factor of the top pair of ears (0 = dropped when the sign is simplified). */
  topPair: number;
  /** Incised line radius. */
  lineRadius: number;
  /** 0 = incised line, 1 = wedge impression (fat head, thin tail). */
  wedge: number;
  /** Groove depth multiplier (0..1, used to press the sign in). */
  press: number;
};

export const BARLEY_STAGES = {
  /** Pictograph: an upright ear of grain, drawn with the stylus tip. */
  pictograph: { rotation: 0, earAngle: 0.68, earLength: 0.0105, topPair: 0.75, lineRadius: 0.0011, wedge: 0, press: 1 },
  /** Turned on its side and simplified: straighter, fewer strokes. */
  rotated: { rotation: Math.PI / 2, earAngle: 0.85, earLength: 0.0095, topPair: 0, lineRadius: 0.00125, wedge: 0, press: 1 },
  /** Every stroke becomes a wedge pressed with the edge of the stylus. */
  wedges: { rotation: Math.PI / 2, earAngle: 0.95, earLength: 0.009, topPair: 0, lineRadius: 0.00125, wedge: 1, press: 1 },
} satisfies Record<string, BarleyParams>;

export function mixBarley(a: BarleyParams, b: BarleyParams, t: number): BarleyParams {
  return {
    rotation: lerp(a.rotation, b.rotation, t),
    earAngle: lerp(a.earAngle, b.earAngle, t),
    earLength: lerp(a.earLength, b.earLength, t),
    topPair: lerp(a.topPair, b.topPair, t),
    lineRadius: lerp(a.lineRadius, b.lineRadius, t),
    wedge: lerp(a.wedge, b.wedge, t),
    press: lerp(a.press, b.press, t),
  };
}

const EAR_LEVELS = [-0.0105, -0.0025, 0.0055, 0.0125];
const STEM_HALF = 0.02;

/**
 * The barley sign (an ear of grain) as 9 strokes: stem first, then ear pairs from the bottom up — the order in
 * which the stylus draws them. Wedge heads sit at the start of the stem and at the outer end of each ear.
 */
export function barleyStrokes(p: BarleyParams, center: [number, number], scale = 1): Stroke[] {
  const cos = Math.cos(p.rotation);
  const sin = Math.sin(p.rotation);
  const place = (u: number, v: number): [number, number] => toTablet(center[0] + (u * cos - v * sin) * scale, center[1] + (u * sin + v * cos) * scale);
  const headR = lerp(p.lineRadius, 0.0033, p.wedge) * scale;
  const tailR = lerp(p.lineRadius, 0.0005, p.wedge) * scale;
  const lineR = p.lineRadius * scale;
  const depth = 0.0014 * p.press;
  const taper = 0.65 * p.wedge;

  const strokes: Stroke[] = [
    { a: place(0, STEM_HALF), b: place(0, -STEM_HALF), ra: p.wedge > 0 ? headR : lineR, rb: p.wedge > 0 ? tailR : lineR, depth, taper },
  ];
  EAR_LEVELS.forEach((v, i) => {
    const len = p.earLength * (i === EAR_LEVELS.length - 1 ? p.topPair : 1);
    const du = Math.sin(p.earAngle) * len;
    const dv = Math.cos(p.earAngle) * len;
    for (const side of [-1, 1]) {
      strokes.push({
        a: place(0, v),
        b: place(side * du, v + dv),
        ra: p.wedge > 0 ? tailR : lineR,
        rb: p.wedge > 0 ? headR : lineR,
        depth: len > 1e-4 ? depth : 0,
        taper: -taper,
      });
    }
  });
  return strokes;
}

/** Packs strokes into the two vec4 uniform arrays read by the tablet shader (unused slots get depth 0). */
export function packStrokes(strokes: readonly Stroke[], ab: Float32Array, radii: Float32Array) {
  for (let i = 0; i < MAX_STROKES; i++) {
    const s = strokes[i];
    if (!s) {
      radii[i * 4 + 2] = 0;
      continue;
    }
    ab.set([s.a[0], s.a[1], s.b[0], s.b[1]], i * 4);
    radii.set([s.ra, s.rb, s.depth, s.taper], i * 4);
  }
}
