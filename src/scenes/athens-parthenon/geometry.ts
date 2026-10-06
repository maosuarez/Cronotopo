import { BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, ExtrudeGeometry, Shape, SphereGeometry } from "three";
import { cached, merge } from "../kit";
import {
  ARCH_TOP,
  AX,
  AZ,
  CEILING_Y,
  CELLA,
  COL_TOP,
  CORNICE_TOP,
  FRIEZE_TOP,
  IONIC_BOTTOM,
  IONIC_TOP,
  PORCH_X,
  ROOF_H,
  S,
  STEP_H,
  STYLO,
} from "./layout";

/** Box of size (sx, sy, sz) whose base sits at y0, centred on (cx, cz). */
export function boxAt(cx: number, y0: number, cz: number, sx: number, sy: number, sz: number): BufferGeometry {
  return new BoxGeometry(sx, sy, sz).translate(cx, y0 + sy / 2, cz);
}

/** Rectangular ring of boxes (outer half-extents hx, hz; band thickness t). */
function ring(hx: number, hz: number, t: number, y0: number, h: number): BufferGeometry[] {
  return [
    boxAt(0, y0, -hz + t / 2, hx * 2, h, t),
    boxAt(0, y0, hz - t / 2, hx * 2, h, t),
    boxAt(-hx + t / 2, y0, 0, t, h, hz * 2 - 2 * t),
    boxAt(hx - t / 2, y0, 0, t, h, hz * 2 - 2 * t),
  ];
}

/** Triangular prism (gable) along X: base width w on y = 0, apex at height h, length l. */
function gable(w: number, h: number, l: number): BufferGeometry {
  const shape = new Shape();
  shape.moveTo(-w / 2, 0);
  shape.lineTo(w / 2, 0);
  shape.lineTo(0, h);
  shape.closePath();
  return new ExtrudeGeometry(shape, { depth: l, bevelEnabled: false }).rotateY(Math.PI / 2).translate(-l / 2, 0, 0);
}

export const TG = {
  crepidoma: () =>
    cached("ath-crepidoma", () =>
      merge([0, 1, 2].map((i) => boxAt(0, i * STEP_H, 0, (STYLO.halfX + (2 - i) * 0.7) * 2, STEP_H, (STYLO.halfZ + (2 - i) * 0.7) * 2))),
    ),
  /** Column drum: unit radius, unit height, base at 0 (taper/entasis are applied in the shader). 20 facets read as flutes. */
  drum: () => cached("ath-drum", () => new CylinderGeometry(1, 1, 1, 20, 2).translate(0, 0.5, 0)),
  /** Doric capital (echinus + abacus) for a column of radius 0.95, base at 0, height 0.83. */
  capital: () =>
    cached("ath-capital", () =>
      merge([new CylinderGeometry(1.08, 0.76, 0.45, 20).translate(0, 0.225, 0), boxAt(0, 0.45, 0, 2.2, 0.38, 2.2)]),
    ),
  architrave: () => cached("ath-architrave", () => merge(ring(AX + 1.05, AZ + 1.05, 2.1, COL_TOP, ARCH_TOP - COL_TOP))),
  /** Doric frieze band (behind triglyphs/metopes), porch beams and the Ionic frieze band around the cella. */
  frieze: () =>
    cached("ath-frieze", () =>
      merge([
        ...ring(AX + 0.92, AZ + 0.92, 1.9, ARCH_TOP, FRIEZE_TOP - ARCH_TOP),
        ...[-1, 1].map((sx) => boxAt(sx * PORCH_X, COL_TOP, 0, 1.8, CEILING_Y - 0.35 - COL_TOP, CELLA.halfZ * 2)),
        ...ring(PORCH_X + 1.02, CELLA.halfZ + 0.12, 0.5, IONIC_BOTTOM, IONIC_TOP - IONIC_BOTTOM),
      ]),
    ),
  /** Cornice, ceiling slab, raking cornices. */
  cornice: () =>
    cached("ath-cornice", () => {
      const half = AZ + 1.7;
      const len = Math.hypot(half, ROOF_H);
      const a = Math.atan2(ROOF_H, half);
      const raking: BufferGeometry[] = [];
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          raking.push(
            new BoxGeometry(1.25, 0.55, len)
              .rotateX(sz * a)
              .translate(sx * (AX + 1.5 - 0.62), CORNICE_TOP + ROOF_H / 2 + 0.22, (sz * half) / 2),
          );
        }
      }
      return merge([
        ...ring(AX + 1.5, AZ + 1.5, 2.6, FRIEZE_TOP, CORNICE_TOP - FRIEZE_TOP),
        boxAt(0, CEILING_Y - 0.35, 0, (AX - 1) * 2, 0.4, (AZ - 1) * 2),
        ...raking,
      ]);
    }),
  roof: () => cached("ath-roof", () => gable((AZ + 1.7) * 2, ROOF_H, (AX + 0.5) * 2).translate(0, CORNICE_TOP, 0)),
  /** Thin plates in front of both pediment faces (painted blue in the polychromy beat). */
  tympanum: () =>
    cached("ath-tympanum", () =>
      merge([-1, 1].map((sx) => gable((AZ + 1.2) * 2, ROOF_H - 0.25, 0.08).translate(sx * (AX + 0.55), CORNICE_TOP + 0.02, 0))),
    ),
  /** Painted moulding under the cornice, all around. */
  strip: () => cached("ath-strip", () => merge(ring(AX + 1.53, AZ + 1.53, 0.08, FRIEZE_TOP + 0.04, 0.2))),
  /** Cella walls with east/west doors and the cross wall; base at 0 (placed at y = S, scaled in y while rising). */
  walls: () =>
    cached("ath-walls", () => {
      const h = CEILING_Y - 0.35 - S;
      const { halfX, halfZ, wall, cross, doorHalf, doorH } = CELLA;
      const inner = halfZ - wall;
      const parts: BufferGeometry[] = [boxAt(0, 0, -halfZ + wall / 2, halfX * 2, h, wall), boxAt(0, 0, halfZ - wall / 2, halfX * 2, h, wall)];
      for (const sx of [-1, 1]) {
        const x = sx * (halfX - wall / 2);
        const side = inner - doorHalf;
        parts.push(boxAt(x, 0, doorHalf + side / 2, wall, h, side), boxAt(x, 0, -doorHalf - side / 2, wall, h, side));
        parts.push(boxAt(x, doorH, 0, wall, h - doorH, doorHalf * 2));
      }
      parts.push(boxAt(cross, 0, 0, wall, h, inner * 2));
      return merge(parts);
    }),
  /** Two-storey Doric colonnade inside the naos, U-shaped around the statue; base at 0. */
  innerColonnade: () =>
    cached("ath-inner", () => {
      const spots: [number, number][] = [];
      for (let i = 0; i < 10; i++) spots.push([-1.6 + i * 2.47, -6.3], [-1.6 + i * 2.47, 6.3]);
      for (const z of [-3.78, -1.26, 1.26, 3.78]) spots.push([-1.6, z]);
      const parts: BufferGeometry[] = [];
      const lowH = 6.0;
      const upH = 5.6;
      for (const [x, z] of spots) {
        parts.push(new CylinderGeometry(0.42, 0.5, lowH, 16).translate(x, lowH / 2, z));
        parts.push(boxAt(x, lowH, z, 1.15, 0.25, 1.15));
        parts.push(new CylinderGeometry(0.32, 0.38, upH, 16).translate(x, lowH + 0.55 + upH / 2, z));
        parts.push(boxAt(x, lowH + 0.55 + upH, z, 0.9, 0.2, 0.9));
      }
      // architraves of both storeys along the U
      for (const y of [lowH + 0.25, lowH + 0.75 + upH]) {
        for (const sz of [-1, 1]) parts.push(boxAt(9.5, y, sz * 6.3, 22.9, 0.35, 0.8));
        parts.push(boxAt(-1.6, y, 0, 0.8, 0.35, 12.6));
      }
      return merge(parts);
    }),
  /** Skin over the Ionic frieze band (its painted blue ground). */
  ionicSkin: () => cached("ath-ionic-skin", () => merge(ring(PORCH_X + 1.04, CELLA.halfZ + 0.14, 0.06, IONIC_BOTTOM + 0.03, IONIC_TOP - IONIC_BOTTOM - 0.06))),
  triglyph: () => cached("ath-triglyph", () => boxAt(0, 0, 0, 0.84, FRIEZE_TOP - ARCH_TOP, 0.22)),
  metope: () => cached("ath-metope", () => boxAt(0, 0, 0, 1.3, FRIEZE_TOP - ARCH_TOP - 0.12, 0.1)),
  /** Relief of a struggle (two leaning figures), flattened, facing +Z, ~1 m tall. */
  metopeRelief: () =>
    cached("ath-relief", () =>
      merge(
        [-1, 1].flatMap((s) => [
          new CylinderGeometry(0.08, 0.15, 0.68, 6).translate(0, 0.34, 0).rotateZ(s * 0.3).translate(s * 0.27, 0.05, 0),
          new SphereGeometry(0.1, 7, 5).translate(s * 0.09, 0.76, 0),
        ]),
      ).scale(1, 1, 0.45),
    ),
  /** Ionic frieze relief figures (walker and horse), flattened, facing +Z. */
  ionicWalker: () =>
    cached("ath-ionic-walker", () =>
      merge([new CylinderGeometry(0.07, 0.13, 0.62, 6).translate(0, 0.31, 0), new SphereGeometry(0.075, 7, 5).translate(0, 0.72, 0)]).scale(1, 1, 0.45),
    ),
  ionicHorse: () =>
    cached("ath-ionic-horse", () =>
      merge([
        boxAt(0, 0.34, 0, 0.62, 0.24, 0.16),
        new BoxGeometry(0.1, 0.32, 0.12).rotateZ(-0.6).translate(0.36, 0.62, 0),
        ...[-0.24, 0.24].map((x) => boxAt(x, 0, 0, 0.07, 0.36, 0.08)),
        // rider
        new CylinderGeometry(0.06, 0.1, 0.36, 6).translate(-0.02, 0.76, 0),
        new SphereGeometry(0.065, 7, 5).translate(-0.02, 1.0, 0),
      ]).scale(1, 1, 0.45),
    ),
  statueBody: () => cached("ath-statue-body", () => new CylinderGeometry(0.15, 0.27, 1.45, 8).translate(0, 0.72, 0)),
  statueHead: () => cached("ath-statue-head", () => new SphereGeometry(0.12, 8, 6)),
  acroterion: () => cached("ath-acroterion", () => merge([new ConeGeometry(0.45, 1.3, 6).translate(0, 0.65, 0), new SphereGeometry(0.3, 6, 4).translate(0, 1.35, 0)])),
};
