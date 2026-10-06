/**
 * World layout of the Uruk diorama (1 unit = 1 m). Every set piece reads its placement from here so the
 * camera path (shots.ts) and the props agree on where things are.
 *
 *   -z (north) ── Euphrates ── palms
 *        Kullaba terrace + White Temple (west)      Eanna precinct (east) with the storeroom
 *   +z (south) ── fields and irrigation canals ── camera side
 */
import type { Vec3 } from "../kit";

/** Euphrates: runs west–east north of the city. */
export const RIVER = { z: -95, halfWidth: 17 };

/** Irrigation canals: two running south from the river and one crossing the fields. */
export const CANALS = {
  west: { x: -80, z0: RIVER.z, z1: 260 },
  east: { x: 92, z0: RIVER.z, z1: 260 },
  cross: { z: 64, x0: -320, x1: 320 },
  halfWidth: 2.4,
};

/** Built-up area of the city (half extents around the origin). */
export const CITY = { halfX: 72, halfZ: 52 };

/** Eanna precinct: walled enclosure with the main temple and courtyard; gate in the south wall. */
export const EANNA = {
  center: [20, 0, 4] as Vec3,
  halfX: 22,
  halfZ: 16,
  wallHeight: 3.6,
  wallThickness: 1.2,
  gateWidth: 5,
};
export const EANNA_GATE: Vec3 = [EANNA.center[0], 0, EANNA.center[2] + EANNA.halfZ];

/** Kullaba district: high terrace (the "Anu ziggurat") crowned by the White Temple. */
export const KULLABA = {
  center: [-36, 0, -10] as Vec3,
  terraceWidth: 26,
  terraceDepth: 22,
  terraceHeight: 12,
};

/** Storeroom inside the Eanna courtyard (interior bounds). Its south (front) wall is the cutaway. */
export const STOREROOM = {
  x0: 29,
  x1: 37,
  z0: 4.5,
  z1: 10.5,
  wall: 0.5,
  height: 3.2,
  door: { z0: 6.6, z1: 8.2, height: 2.2 },
};

/** Scribe's low table inside the storeroom, and the reed mat where the close-ups happen. */
export const TABLE = { center: [33, 0, 8.3] as Vec3, size: [4, 0.75, 0.9] as Vec3 };
export const MAT = { center: [32.5, 0, 8.3] as Vec3, width: 1.3, depth: 0.55, thickness: 0.004 };
/** Height of the working surface (top of the mat). */
export const TOP = TABLE.size[1] + MAT.thickness;

/** Close-up props on the mat (x along the table, all at the same depth). */
export const WORK_Z = 8.3;
export const BULLA_POS: Vec3 = [32.1, TOP, WORK_Z];
export const TABLET_A_POS: Vec3 = [32.4, TOP, WORK_Z];
export const TABLET_B_POS: Vec3 = [32.64, TOP, WORK_Z];
export const TABLET_C_POS: Vec3 = [32.9, TOP, WORK_Z];
export const SCRIBE_POS: Vec3 = [32.5, 0, 7.35];

/** Archive shelves along the storeroom's back wall. */
export const SHELVES = { x0: 32.2, x1: 36.7, z: STOREROOM.z0, depth: 0.45, levels: [0.5, 1.1, 1.7, 2.3] };
