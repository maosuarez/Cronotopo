import { CanvasTexture, RepeatWrapping, SRGBColorSpace, type Texture } from "three";
import { createRng, type Rng } from "../kit";
import { LAND, MAP_ASPECT, project } from "./europe";

/**
 * Runtime canvas textures (no files). Text is never a facsimile: the "gothic" page is made of
 * procedural minim strokes that read as textura blocks from a distance, 42 lines per column.
 */
export const PAGE = { w: 1024, h: 1448, lines: 42, top: 128, bottom: 196, inner: 104, outer: 150, gap: 54 };
export const PAGE_ASPECT = PAGE.w / PAGE.h;
/** Page band [v0, v1] (0 = top) holding the 42 lines; used to clip the line-by-line reveals. */
export const TEXT_V0 = PAGE.top / PAGE.h;
export const TEXT_V1 = (PAGE.h - PAGE.bottom) / PAGE.h;

function canvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2D canvas unavailable");
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, srgb = true): CanvasTexture {
  const t = new CanvasTexture(c);
  if (srgb) t.colorSpace = SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

type Glyph = { minims: number; asc: boolean; desc: boolean };

/** One line of textura-like strokes from x0 to x0 + width; justified unless `ragged`. */
function strokeLine(ctx: CanvasRenderingContext2D, rng: Rng, x0: number, base: number, width: number, xh: number, ragged: boolean) {
  const mw = xh * 0.34;
  const minimGap = mw * 0.5;
  const letterGap = mw * 0.75;
  const wordGap = xh * 0.85;
  const words: Glyph[][] = [];
  let natural = 0;
  for (;;) {
    const letters = rng.int(2, 8);
    const word: Glyph[] = [];
    let w = 0;
    for (let i = 0; i < letters; i++) {
      const g = { minims: rng.int(1, 3), asc: rng.next() < 0.14, desc: rng.next() < 0.05 };
      word.push(g);
      w += g.minims * mw + (g.minims - 1) * minimGap + (i ? letterGap : 0);
    }
    const next = natural + (words.length ? wordGap : 0) + w;
    if (next > width) break;
    words.push(word);
    natural = next;
  }
  if (ragged) words.splice(Math.max(1, Math.floor(words.length * rng.range(0.35, 0.8))));
  const gaps = Math.max(1, words.length - 1);
  const extra = ragged ? 0 : (width - natural) / gaps;
  let x = x0;
  for (const word of words) {
    word.forEach((g, i) => {
      if (i) x += letterGap;
      for (let m = 0; m < g.minims; m++) {
        const top = base - xh - (g.asc && m === 0 ? xh * 0.62 : 0);
        const bottom = base + (g.desc && m === g.minims - 1 ? xh * 0.55 : 0);
        ctx.fillRect(x, top, mw, bottom - top);
        // lozenge feet/heads, the hallmark of textura
        ctx.beginPath();
        ctx.moveTo(x - mw * 0.25, top + mw * 0.35);
        ctx.lineTo(x + mw * 0.5, top - mw * 0.35);
        ctx.lineTo(x + mw * 1.25, top + mw * 0.35);
        ctx.lineTo(x + mw * 0.5, top + mw * 0.9);
        ctx.fill();
        if (!g.desc) {
          ctx.beginPath();
          ctx.moveTo(x - mw * 0.2, base - mw * 0.3);
          ctx.lineTo(x + mw * 0.5, base - mw * 0.9);
          ctx.lineTo(x + mw * 1.25, base - mw * 0.3);
          ctx.lineTo(x + mw * 0.5, base + mw * 0.35);
          ctx.fill();
        }
        x += mw + (m < g.minims - 1 ? minimGap : 0);
      }
    });
    x += wordGap + extra;
  }
}

/** Two justified columns of 42 lines; space left blank for a hand-painted initial. */
function drawColumns(ctx: CanvasRenderingContext2D, seed: number, ink: string, handwritten = false) {
  const rng = createRng(seed);
  const colW = (PAGE.w - PAGE.inner - PAGE.outer - PAGE.gap) / 2;
  const lineH = (PAGE.h - PAGE.top - PAGE.bottom) / PAGE.lines;
  const xh = lineH * 0.36;
  ctx.fillStyle = ink;
  for (let col = 0; col < 2; col++) {
    const x0 = PAGE.inner + col * (colW + PAGE.gap);
    const breaks = new Set([rng.int(9, 20), rng.int(24, 38)]);
    for (let l = 0; l < PAGE.lines; l++) {
      const base = PAGE.top + (l + 0.78) * lineH + (handwritten ? rng.range(-1.2, 1.2) : 0);
      // initial space: 4 lines indented at the head of the first column
      const indent = col === 0 && l < 4 ? lineH * 3.6 : 0;
      ctx.globalAlpha = handwritten ? rng.range(0.75, 1) : rng.range(0.82, 1);
      strokeLine(ctx, rng, x0 + indent, base, colW - indent, xh, breaks.has(l));
    }
  }
  ctx.globalAlpha = 1;
}

function paperGrain(ctx: CanvasRenderingContext2D, w: number, h: number, seed: number, base: string, speck: string, edge: string) {
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  const g = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.3, w / 2, h / 2, Math.max(w, h) * 0.75);
  g.addColorStop(0, "rgba(0,0,0,0)");
  g.addColorStop(1, edge);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);
  const rng = createRng(seed);
  ctx.fillStyle = speck;
  for (let i = 0; i < (w * h) / 900; i++) {
    ctx.globalAlpha = rng.range(0.04, 0.16);
    ctx.fillRect(rng.range(0, w), rng.range(0, h), rng.range(1, 3), rng.range(1, 3));
  }
  ctx.globalAlpha = 1;
}

/** The printed page (black ink on paper). */
export function makePageTexture(): CanvasTexture {
  const { c, ctx } = canvas(PAGE.w, PAGE.h);
  paperGrain(ctx, PAGE.w, PAGE.h, 7, "#efe4c8", "#8a7550", "rgba(150,115,60,0.28)");
  drawColumns(ctx, 42, "#191512");
  return toTexture(c);
}

/** The scribe's manuscript page (brown ink, slightly irregular). */
export function makeManuscriptTexture(): CanvasTexture {
  const { c, ctx } = canvas(PAGE.w, PAGE.h);
  paperGrain(ctx, PAGE.w, PAGE.h, 11, "#eadcb9", "#7a6440", "rgba(140,100,50,0.32)");
  drawColumns(ctx, 1450, "#3b2414", true);
  // a painted initial: the scribe's book is already rubricated
  ctx.fillStyle = "#9b3d2e";
  const lineH = (PAGE.h - PAGE.top - PAGE.bottom) / PAGE.lines;
  ctx.fillRect(PAGE.inner + 4, PAGE.top + 6, lineH * 3.2, lineH * 3.6);
  return toTexture(c);
}

/**
 * The forme seen from above: the same page mirrored left–right, light metal letters on a dark ground.
 * Also used as alpha map for the ink layer (letters = where ink sticks).
 */
export function makeFormeTexture(): CanvasTexture {
  const { c, ctx } = canvas(PAGE.w, PAGE.h);
  ctx.fillStyle = "#262422";
  ctx.fillRect(0, 0, PAGE.w, PAGE.h);
  ctx.translate(PAGE.w, 0);
  ctx.scale(-1, 1);
  drawColumns(ctx, 42, "#e6e8ea");
  return toTexture(c);
}

/** Letters for the type sorts, each drawn mirrored on a dark shoulder (4×4 atlas). */
export const SORT_LETTERS = "INPRCOEAVTDUS";
export function makeLetterAtlas(): { atlas: CanvasTexture; letters: Record<string, Texture> } {
  const cell = 128;
  const { c, ctx } = canvas(cell * 4, cell * 4);
  ctx.fillStyle = "#3a3836";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `bold ${cell * 0.78}px Georgia, "Times New Roman", serif`;
  [...SORT_LETTERS].forEach((ch, i) => {
    const cx = (i % 4) * cell + cell / 2;
    const cy = Math.floor(i / 4) * cell + cell / 2;
    ctx.fillStyle = "#2e2c2a";
    ctx.fillRect(cx - cell * 0.44, cy - cell * 0.47, cell * 0.88, cell * 0.94);
    ctx.save();
    ctx.translate(cx, cy + cell * 0.04);
    ctx.scale(-1, 1);
    ctx.fillStyle = "#d9dcdf";
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  const atlas = toTexture(c);
  const letters: Record<string, Texture> = {};
  [...SORT_LETTERS].forEach((ch, i) => {
    const t = atlas.clone();
    t.repeat.set(0.25, 0.25);
    t.offset.set((i % 4) * 0.25, 1 - (Math.floor(i / 4) + 1) * 0.25);
    letters[ch] = t;
  });
  return { atlas, letters };
}

/** Plank floor. */
export function makePlankTexture(): CanvasTexture {
  const { c, ctx } = canvas(512, 512);
  const rng = createRng(3);
  const tones = ["#4a3220", "#53392a", "#432c1c", "#5a3e27"];
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = rng.pick(tones);
    ctx.fillRect(0, i * 64, 512, 64);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, i * 64, 512, 3);
    const seam = rng.range(40, 470);
    ctx.fillRect(seam, i * 64, 3, 64);
    ctx.fillStyle = "rgba(255,220,170,0.05)";
    for (let k = 0; k < 6; k++) ctx.fillRect(0, i * 64 + rng.range(8, 60), 512, 1.5);
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(8, 4);
  return t;
}

/** Blank parchment for the map sheet. */
export const MAP_PX = { w: 2048, h: Math.round(2048 / MAP_ASPECT) };
export function makeParchmentTexture(): CanvasTexture {
  const { c, ctx } = canvas(MAP_PX.w, MAP_PX.h);
  paperGrain(ctx, MAP_PX.w, MAP_PX.h, 21, "#e9d9b3", "#7c6440", "rgba(120,85,40,0.45)");
  return toTexture(c);
}

/** Transparent ink layer with the stylised map (faded in over the parchment). */
export function makeMapInkTexture(): CanvasTexture {
  const { w, h } = MAP_PX;
  const { c, ctx } = canvas(w, h);
  const pts = (poly: [number, number][]) => poly.map((p) => project(p)).map(([u, v]) => [u * w, v * h] as const);
  const trace = (poly: [number, number][]) => {
    const p = pts(poly);
    ctx.beginPath();
    p.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.closePath();
  };
  // sea hatching near the coast (old-map style): wide soft strokes of the outline
  ctx.lineJoin = "round";
  for (const [width, alpha] of [[46, 0.06], [26, 0.08], [10, 0.1]] as const) {
    ctx.strokeStyle = `rgba(70,95,105,${alpha})`;
    ctx.lineWidth = width;
    LAND.forEach((poly) => {
      trace(poly);
      ctx.stroke();
    });
  }
  // land
  ctx.fillStyle = "rgba(196,160,104,0.55)";
  LAND.forEach((poly) => {
    trace(poly);
    ctx.fill();
  });
  // graticule
  ctx.strokeStyle = "rgba(90,65,40,0.18)";
  ctx.lineWidth = 2;
  for (let lon = -10; lon <= 30; lon += 10) {
    const [u] = project([lon, 0]);
    ctx.beginPath();
    ctx.moveTo(u * w, 0);
    ctx.lineTo(u * w, h);
    ctx.stroke();
  }
  for (let lat = 40; lat <= 55; lat += 5) {
    const [, v] = project([0, lat]);
    ctx.beginPath();
    ctx.moveTo(0, v * h);
    ctx.lineTo(w, v * h);
    ctx.stroke();
  }
  // coastline
  ctx.strokeStyle = "rgba(60,40,24,0.9)";
  ctx.lineWidth = 4;
  LAND.forEach((poly) => {
    trace(poly);
    ctx.stroke();
  });
  // compass rose in the Atlantic
  const [cu, cv] = project([-8.5, 46.5]);
  const cx = cu * w;
  const cy = cv * h;
  ctx.fillStyle = "rgba(60,40,24,0.75)";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4;
    const r = i % 2 ? 60 : 120;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.lineTo(cx + Math.cos(a + 0.35) * 22, cy + Math.sin(a + 0.35) * 22);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + Math.cos(a - 0.35) * 22, cy + Math.sin(a - 0.35) * 22);
    ctx.closePath();
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(60,40,24,0.6)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, 80, 0, Math.PI * 2);
  ctx.stroke();
  ctx.font = `600 64px Georgia, "Times New Roman", serif`;
  ctx.textAlign = "center";
  ctx.fillStyle = "rgba(60,40,24,0.8)";
  ctx.fillText("N", cx, cy - 140);
  // border
  ctx.strokeStyle = "rgba(60,40,24,0.7)";
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, w - 72, h - 72);
  ctx.lineWidth = 2;
  ctx.strokeRect(54, 54, w - 108, h - 108);
  return toTexture(c);
}

/** Soft radial glow sprite. */
export function makeGlowTexture(): CanvasTexture {
  const { c, ctx } = canvas(128, 128);
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return toTexture(c);
}

export type SceneTextures = {
  page: CanvasTexture;
  manuscript: CanvasTexture;
  forme: CanvasTexture;
  atlas: CanvasTexture;
  letters: Record<string, Texture>;
  planks: CanvasTexture;
  parchment: CanvasTexture;
  mapInk: CanvasTexture;
  glow: CanvasTexture;
};

export function createTextures(): SceneTextures {
  const { atlas, letters } = makeLetterAtlas();
  return {
    page: makePageTexture(),
    manuscript: makeManuscriptTexture(),
    forme: makeFormeTexture(),
    atlas,
    letters,
    planks: makePlankTexture(),
    parchment: makeParchmentTexture(),
    mapInk: makeMapInkTexture(),
    glow: makeGlowTexture(),
  };
}

export function disposeTextures(t: SceneTextures) {
  Object.values(t.letters).forEach((x) => x.dispose());
  [t.page, t.manuscript, t.forme, t.atlas, t.planks, t.parchment, t.mapInk, t.glow].forEach((x) => x.dispose());
}
