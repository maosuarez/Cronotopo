/**
 * Geography and city layout of the Pompeii diorama (1 unit = 1 m, stylised and compressed).
 * Pure data + pure functions (no React): the same height functions feed the meshes and the shaders.
 *
 * Axes: +x east, −z north. The city sits at the origin; Vesuvius rises to the NNW; the bay opens to the SW
 * with the Misenum headland across it.
 */
import { fbm2 } from "../kit/noise";
import { smoothstep } from "../kit/math";
import { createRng } from "../kit/prng";

export type Rect = { x0: number; x1: number; z0: number; z1: number };

/** Vesuvius: base centre, base radius and height (vertically exaggerated for the diorama). */
export const VOLCANO = { x: -50, z: -430, r: 270, h: 135 };
/** Crater/vent position (top of the pre-79 cone). */
export const VENT: [number, number, number] = [VOLCANO.x, VOLCANO.h - 4, VOLCANO.z];
/** Misenum headland across the bay (where Pliny the Younger watched from). */
export const MISENUM = { x: -470, z: 120 };
/** Prevailing wind (unit vector on XZ) carrying the umbrella cloud south-east, over Pompeii. */
export const WIND: [number, number] = (() => {
  const l = Math.hypot(0.32, 1);
  return [0.32 / l, 1 / l];
})();

/** South face of the cutaway section (z of the cut plane). */
export const ZC = 34;

/** Deposit levels (m above the 79 street level): pumice fall, surge deposits on top, later soil. */
export const LEVEL = { pumice: 2.6, flow: 6.4, soil: 7.2 };

/** Pre-79 cone: a single green peak with a slightly rounded summit and radial gullies. */
export function volcanoPre(x: number, z: number): number {
  const dx = x - VOLCANO.x;
  const dz = z - VOLCANO.z;
  const r = Math.hypot(dx, dz);
  const k = 1 - r / VOLCANO.r;
  if (k <= 0) return 0;
  const theta = Math.atan2(dz, dx);
  const gullies = 2.4 * Math.sin(theta * 15 + r * 0.04) * Math.sin(Math.PI * Math.min(1, k * 1.4));
  const rough = (fbm2(x * 0.02 + 40, z * 0.02 - 13, 9) - 0.5) * 9 * k;
  // broad rounded shoulders (flat-ish summit), concave lower slopes
  const q = r / VOLCANO.r;
  const s = q * q * (3 - 2 * q);
  return VOLCANO.h * (1 - s) ** 1.5 + gullies + rough - 2.5 * Math.exp(-((r / 18) ** 2));
}

/** After 79: truncated summit with a wide crater (the modern Somma–Vesuvius silhouette, simplified). */
export function volcanoPost(x: number, z: number): number {
  const pre = volcanoPre(x, z);
  const r = Math.hypot(x - VOLCANO.x, z - VOLCANO.z);
  const cap = VOLCANO.h * 0.84;
  const truncated = pre > cap ? cap + (pre - cap) * 0.15 : pre;
  return truncated - 14 * Math.exp(-((r / 34) ** 2));
}

/** Plain around the city: flat inside the walls, a shallow bowl outside, the bay to the south-west. */
export function plain(x: number, z: number): number {
  const rc = Math.hypot(x, z * 1.15);
  const bowl = 0.035 * Math.max(0, rc - 170);
  const noise = (fbm2(x * 0.012 + 7, z * 0.012 + 3, 21) - 0.5) * 2 * 3 * smoothstep(110, 170, rc);
  let h = bowl + noise;
  const coast = x + 0.55 * z + 260;
  h = h + (-9 - h) * smoothstep(0, -55, coast);
  const dm = Math.hypot(x - MISENUM.x, z - MISENUM.z);
  const headland = 16 * Math.exp(-((dm / 48) ** 2)) - 9 * (1 - Math.exp(-((dm / 48) ** 2)));
  return Math.max(h, headland);
}

/** Ground height under the terrain mesh (volcano capped: the volcano mesh covers its upper part). */
export const ground = (x: number, z: number) => plain(x, z) + Math.max(0, Math.min(volcanoPre(x, z), VOLCANO.h * 0.7) - 4);

// ---------------------------------------------------------------- city layout

export const CITY: Rect = { x0: -75, x1: 75, z0: -55, z1: 50 };
/** Street centre lines. Main N–S street at x = 6 (from the north gate), main E–W street at z = 20. */
export const STREET_X = [-50, -22, 6, 34, 60];
export const STREET_Z = [-36, -8, 20];
export const STREET_W = 7;
export const SIDEWALK = 1.3;
export const CURB = 0.35;
export const FORUM: Rect = { x0: -46.5, x1: -25.5, z0: -32.5, z1: 16.5 };
export const BAKERY: Rect = { x0: 9.5, x1: 18, z0: -4.5, z1: 4.5 };

export type House = Rect & { h: number; roofH: number; ridgeX: boolean; wall: string; roof: string; tc: number; seed: number };
export type Wall = { x: number; z: number; sx: number; sz: number; h: number; color: string; ruin: number };

const WALL_T = 0.45;
const PLASTER = ["#eadfc8", "#dcc39a", "#cf9f72", "#b8654b", "#efe6d2", "#d7b48c"];
const TILES = ["#a8553a", "#9a4a33", "#b6643f", "#8f4630"];

function blockRects(): Rect[] {
  const xs = [CITY.x0, ...STREET_X, CITY.x1];
  const zs = [CITY.z0, ...STREET_Z, CITY.z1];
  const out: Rect[] = [];
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < zs.length - 1; j++) {
      const inset = (edge: boolean) => (edge ? 3.5 : STREET_W / 2);
      out.push({
        x0: xs[i] + inset(i === 0),
        x1: xs[i + 1] - inset(i === xs.length - 2),
        z0: zs[j] + inset(j === 0),
        z1: zs[j + 1] - inset(j === zs.length - 2),
      });
    }
  }
  return out;
}

const overlaps = (a: Rect, b: Rect) => a.x0 < b.x1 && a.x1 > b.x0 && a.z0 < b.z1 && a.z1 > b.z0;

/** City blocks (insulae) except the forum. */
export const BLOCKS: Rect[] = blockRects().filter((b) => !overlaps(b, FORUM));

function splitLot(r: Rect, rng: ReturnType<typeof createRng>, out: Rect[]) {
  const w = r.x1 - r.x0;
  const d = r.z1 - r.z0;
  if (w <= 13 && d <= 13) {
    out.push(r);
    return;
  }
  const k = rng.range(0.38, 0.62);
  if (w >= d) {
    const m = r.x0 + w * k;
    splitLot({ ...r, x1: m }, rng, out);
    splitLot({ ...r, x0: m }, rng, out);
  } else {
    const m = r.z0 + d * k;
    splitLot({ ...r, z1: m }, rng, out);
    splitLot({ ...r, z0: m }, rng, out);
  }
}

/** Collapse time of a roof: a wave sweeping west along the featured row during the close tracking shot. */
function collapseTime(cx: number, cz: number, jitter: number): number {
  const featured = cz > -6 && cz < 18 && cx > 8 && cx < 58;
  if (featured) return 38.2 + ((56 - cx) / 48) * 5.2 + jitter * 0.5;
  return 36.5 + jitter * 7.2;
}

export const HOUSES: House[] = (() => {
  const rng = createRng(79);
  const lots: Rect[] = [];
  for (const b of BLOCKS) {
    if (overlaps(b, BAKERY)) {
      // The bakery courtyard is carved out of its block; the rest of the block is split normally.
      splitLot({ x0: BAKERY.x1, x1: b.x1, z0: b.z0, z1: BAKERY.z1 }, rng, lots);
      splitLot({ x0: b.x0, x1: b.x1, z0: BAKERY.z1, z1: b.z1 }, rng, lots);
    } else splitLot(b, rng, lots);
  }
  return lots.map((r, i) => {
    const w = r.x1 - r.x0;
    const d = r.z1 - r.z0;
    return {
      ...r,
      h: rng.range(3.3, 4.6),
      roofH: rng.range(1.0, 1.5),
      ridgeX: w >= d,
      wall: rng.pick(PLASTER),
      roof: rng.pick(TILES),
      tc: collapseTime((r.x0 + r.x1) / 2, (r.z0 + r.z1) / 2, rng.next()),
      seed: i,
    };
  });
})();

/** Axis-aligned wall segment(s) from (x0,z0) to (x1,z1); optional door gap; split at the section plane. */
function pushWall(out: Wall[], x0: number, z0: number, x1: number, z1: number, h: number, color: string, rng: ReturnType<typeof createRng>, door: boolean) {
  const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
  const a = alongX ? Math.min(x0, x1) : Math.min(z0, z1);
  const b = alongX ? Math.max(x0, x1) : Math.max(z0, z1);
  const fixed = alongX ? z0 : x0;
  const spans: [number, number][] = [];
  if (door && b - a > 4) {
    const c = a + (b - a) * rng.range(0.3, 0.7);
    spans.push([a, c - 0.8], [c + 0.8, b]);
  } else spans.push([a, b]);
  // Walls running N–S are split at the cut so the section shows clean wall ends.
  const cut: [number, number][] = [];
  for (const [s, e] of spans) {
    if (!alongX && s < ZC && e > ZC) cut.push([s, ZC], [ZC, e]);
    else cut.push([s, e]);
  }
  for (const [s, e] of cut) {
    if (e - s < 0.2) continue;
    const ruin = rng.range(0.45, 0.95);
    if (alongX) out.push({ x: (s + e) / 2, z: fixed, sx: e - s, sz: WALL_T, h, color, ruin });
    else out.push({ x: fixed, z: (s + e) / 2, sx: WALL_T, sz: e - s, h, color, ruin });
  }
}

const onStreet = (v: number, edges: number[]) => edges.some((e) => Math.abs(v - e) < 0.01);

export const WALLS: Wall[] = (() => {
  const rng = createRng(1748);
  const out: Wall[] = [];
  const blockEdgesX = BLOCKS.flatMap((b) => [b.x0, b.x1]);
  const blockEdgesZ = BLOCKS.flatMap((b) => [b.z0, b.z1]);
  for (const h of HOUSES) {
    const t = WALL_T / 2;
    pushWall(out, h.x0, h.z0 + t, h.x1, h.z0 + t, h.h, h.wall, rng, onStreet(h.z0, blockEdgesZ));
    pushWall(out, h.x0, h.z1 - t, h.x1, h.z1 - t, h.h, h.wall, rng, onStreet(h.z1, blockEdgesZ));
    pushWall(out, h.x0 + t, h.z0, h.x0 + t, h.z1, h.h, h.wall, rng, onStreet(h.x0, blockEdgesX));
    pushWall(out, h.x1 - t, h.z0, h.x1 - t, h.z1, h.h, h.wall, rng, onStreet(h.x1, blockEdgesX));
    // one interior partition across the long side, with a doorway
    if (h.ridgeX && h.x1 - h.x0 > 7) {
      const m = (h.x0 + h.x1) / 2;
      pushWall(out, m, h.z0, m, h.z1, h.h * 0.92, h.wall, rng, true);
    } else if (!h.ridgeX && h.z1 - h.z0 > 7) {
      const m = (h.z0 + h.z1) / 2;
      pushWall(out, h.x0, m, h.x1, m, h.h * 0.92, h.wall, rng, true);
    }
  }
  // bakery courtyard: low walls, wide opening onto the main street (west side)
  const B = BAKERY;
  pushWall(out, B.x0, B.z0 + 0.2, B.x1, B.z0 + 0.2, 2.4, "#dcc39a", rng, false);
  pushWall(out, B.x0, B.z1 - 0.2, B.x1, B.z1 - 0.2, 2.4, "#dcc39a", rng, false);
  pushWall(out, B.x1 - 0.2, B.z0, B.x1 - 0.2, B.z1, 2.4, "#dcc39a", rng, false);
  pushWall(out, B.x0 + 0.2, B.z0, B.x0 + 0.2, B.z0 + 1.6, 2.4, "#dcc39a", rng, false);
  pushWall(out, B.x0 + 0.2, B.z1 - 1.6, B.x0 + 0.2, B.z1, 2.4, "#dcc39a", rng, false);
  return out;
})();

/** Stepping stones: three raised stones across the roadway near every crossing. */
export const STEPPING_STONES: [number, number, boolean][] = (() => {
  const out: [number, number, boolean][] = [];
  const offs = [-1.25, 0, 1.25];
  for (const x of STREET_X) {
    for (const z of [...STREET_Z, CITY.z0 + 8, CITY.z1 - 8]) {
      if (x > FORUM.x0 - 4 && x < FORUM.x1 + 4 && z > FORUM.z0 && z < FORUM.z1) continue;
      for (const o of offs) out.push([x + o, z + 5.2, true]);
    }
  }
  for (const z of STREET_Z) {
    for (const x of [-64, -36, -8, 20, 47, 68]) {
      if (x > FORUM.x0 && x < FORUM.x1 && z > FORUM.z0 && z < FORUM.z1) continue;
      for (const o of offs) out.push([x + 5.6, z + o, false]);
    }
  }
  return out;
})();

/** Colonnade around three sides of the forum. */
export const FORUM_COLUMNS: [number, number][] = (() => {
  const out: [number, number][] = [];
  const f = FORUM;
  for (let z = f.z0 + 13; z <= f.z1 - 1.2; z += 2.6) {
    out.push([f.x0 + 1.4, z], [f.x1 - 1.4, z]);
  }
  for (let x = f.x0 + 1.4 + 2.6; x <= f.x1 - 1.4 - 2.6 + 0.01; x += 2.6) out.push([x, f.z1 - 1.4]);
  return out;
})();

/** Temple of Jupiter at the north end of the forum, facing south with Vesuvius behind it. */
export const TEMPLE = { x: -36, z0: -32, z1: -20, w: 9, podium: 1.4, colH: 3.3 };
