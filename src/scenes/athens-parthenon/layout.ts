/**
 * Dimensions (1 unit = 1 m) and the master timeline of the Parthenon scene. The temple is centred on the world origin,
 * long axis along X (east = +X, north = −Z), rock plateau top at y = 0.
 */

/** Crepidoma: three steps; top of the stylobate. */
export const STEP_H = 0.55;
export const S = STEP_H * 3;
export const STYLO = { halfX: 34.75, halfZ: 15.44 };

/** Peristyle column axes (8 × 17 columns). */
export const AX = 33.75;
export const AZ = 14.44;
export const COL = { h: 10.43, r: 0.95, shaft: 9.6, drums: 10, taper: 0.21 };
export const DRUM_H = COL.shaft / COL.drums;
export const COL_TOP = S + COL.h;

/** Entablature levels. */
export const ARCH_TOP = COL_TOP + 1.35;
export const FRIEZE_TOP = ARCH_TOP + 1.35;
export const CORNICE_TOP = FRIEZE_TOP + 0.62;
export const ROOF_H = 3.45;

/** Cella (inner building) and its porches. */
export const CELLA = { halfX: 24.5, halfZ: 10.6, wall: 1.1, cross: -5, doorHalf: 2.5, doorH: 10 };
export const PORCH_X = 28.2;
export const IONIC_BOTTOM = COL_TOP + 0.82;
export const IONIC_TOP = IONIC_BOTTOM + 1.0;
export const CEILING_Y = FRIEZE_TOP;

/** Athena Parthenos stands in the west part of the naos, facing the east door. */
export const STATUE = { x: 4, z: 0 };

/** Real curvature of the stylobate (rise at mid long side / mid short side) and exaggeration of the demo. */
export const BEND_REAL: [number, number] = [0.11, 0.06];
export const BEND_DEMO = 40;
export const ENTASIS_REAL = 0.012;
export const ENTASIS_DEMO = 0.2;

export type ColumnSpot = { x: number; z: number; r: number; porch: boolean };

/** 46 peristyle columns + 2 × 6 porch columns. */
export const COLUMNS: ColumnSpot[] = (() => {
  const out: ColumnSpot[] = [];
  for (let k = 0; k < 17; k++) {
    const x = -AX + (k * 2 * AX) / 16;
    out.push({ x, z: -AZ, r: COL.r, porch: false }, { x, z: AZ, r: COL.r, porch: false });
  }
  for (let k = 1; k < 7; k++) {
    const z = -AZ + (k * 2 * AZ) / 7;
    out.push({ x: -AX, z, r: COL.r, porch: false }, { x: AX, z, r: COL.r, porch: false });
  }
  for (let k = 0; k < 6; k++) {
    const z = -10 + k * 4;
    out.push({ x: -PORCH_X, z, r: 0.86, porch: true }, { x: PORCH_X, z, r: 0.86, porch: true });
  }
  return out;
})();

/** Hero column of the construction and entasis shots: south-east corner. */
export const HERO = { x: AX, z: AZ };

/** Beat boundaries (keep in sync with beats.ts). */
export const T = {
  ruins: 0,
  pericles: 10,
  drums: 20,
  entasis: 32,
  stylobate: 42,
  color: 51,
  athena: 61,
  procession: 72,
  end: 84,
} as const;
