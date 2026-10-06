/**
 * Layout of the Giza diorama (1 unit = 1 m). +x = east (towards the Nile), +z = south.
 */
import { makeHeightFn, smoothstep, type HeightFn, type Vec3 } from "../kit";

export const PYR = {
  x: -100,
  z: -80,
  /** Half of the ~230 m base side. */
  half: 115,
  /** Original height (~146 m). */
  height: 146,
  /** Stylised courses of the stepped core (the real pyramid has ~200). */
  courses: 48,
} as const;

export const COURSE_H = PYR.height / PYR.courses;

/** Half-width of the pyramid at height y. */
export const halfAt = (y: number) => PYR.half * (1 - y / PYR.height);
/** z of the south face at height y. */
export const southFaceZ = (y: number) => PYR.z + halfAt(y);

/** Quarry pit on the plateau, south-east of the pyramid. */
export const QUARRY = { x: 60, z: 90, w: 35, d: 25, depth: 7, wall: 12 } as const;

/** Flood water level and the canal leading to the quay at the foot of the plateau. */
export const WATER_Y = -15.5;
export const CANAL = { z: 0, halfWidth: 14, quayX: 192, endX: 470 } as const;

/** Workers' town on the low desert, south-east. */
export const VILLAGE = { x: 195, z: 215, w: 32, d: 26 } as const;

/** Edge of the flood plain: the low desert band widens towards the south (village). */
const floodEdge = (z: number) => 172 + 75 * smoothstep(80, 190, z);

const shape: HeightFn = (x, z) => {
  let h = -8 * smoothstep(105, 140, x) - 9.5 * smoothstep(floodEdge(z) - 14, floodEdge(z) + 14, x);
  // Quarry pit: flat floor, falloff hidden under the stepped rock walls.
  const qx = Math.abs(x - QUARRY.x) - (QUARRY.w - QUARRY.wall * 0.5);
  const qz = Math.abs(z - QUARRY.z) - (QUARRY.d - QUARRY.wall * 0.5);
  const inside = 1 - smoothstep(-2, 4, Math.max(qx, qz));
  h -= QUARRY.depth * inside;
  return h;
};

/** No noise on the worksite (pyramid, quarry, haul road), dunes elsewhere. */
const mask: HeightFn = (x, z) => {
  const dp = Math.max(Math.abs(x - PYR.x), Math.abs(z - PYR.z)) - PYR.half - 10;
  const dRoad = Math.hypot(x + 20, z - 160) - 90;
  const dq = Math.hypot(x - QUARRY.x, z - QUARRY.z) - 50;
  const dv = Math.hypot(x - VILLAGE.x, z - VILLAGE.z) - 45;
  const d = Math.min(dp, dRoad, dq, dv);
  return smoothstep(0, 60, d) * (1 - smoothstep(100, 150, x));
};

export const TERRAIN_OPTS = { amplitude: 3, frequency: 0.012, seed: 11, shape, mask } as const;
export const groundY: HeightFn = makeHeightFn(TERRAIN_OPTS);

export const onGround = (x: number, z: number, lift = 0): Vec3 => [x, groundY(x, z) + lift, z];
