/**
 * Direction of the scene: one continuous camera move, the light of the day and where the sun's shadow map
 * should concentrate. Everything is keyframed against the beats in beats.ts (times in seconds).
 */
import { ease, LIGHT, mixLight, sample, smoothstep, type CameraKey, type Keyframe, type LightPreset, type Vec3 } from "../kit";

/**
 * Camera: wide plain → down to the Eanna gate → over the wall into the storeroom → macro on the mat
 * (bulla, then tablet, then the row of tablets) → back out of the room and up over the city.
 * Close-ups use a long lens (low fov) like a macro shot: objects are centimetres wide.
 */
export const CAMERA: CameraKey[] = [
  // 1 · plain: slow aerial drift
  { t: 0, pos: [-38, 80, 168], look: [6, 0, -24], fov: 40 },
  { t: 10, pos: [-12, 60, 132], look: [12, 0, -12], ease: ease.sine },
  // 2 · temple economy: descend to the gate, drift with the workers
  { t: 14, pos: [13, 22, 42], look: [21, 0, 10], ease: ease.inOut },
  { t: 21.5, pos: [21, 19, 38], look: [25, 0, 8], ease: ease.sine },
  // 3 · tokens: over the enclosure wall, through the opened front of the storeroom, onto the mat
  { t: 23.6, pos: [32.8, 4.8, 19.5], look: [32.5, 1.0, 8.6], fov: 34 },
  { t: 25.6, pos: [32.3, 1.3, 9.6], look: [32.12, 0.79, 8.3], fov: 20 },
  { t: 27.2, pos: [32.17, 0.95, 8.78], look: [32.1, 0.78, 8.29], fov: 15, ease: ease.out },
  { t: 35, pos: [32.2, 0.93, 8.74], look: [32.11, 0.778, 8.3], fov: 14, ease: ease.sine },
  // 4 · first tablet: pan right to the tablet, slow push-in while the scribe writes
  { t: 37.6, pos: [32.43, 0.95, 8.7], look: [32.4, 0.774, 8.31], fov: 13 },
  { t: 47.2, pos: [32.42, 0.93, 8.64], look: [32.402, 0.774, 8.31], fov: 11.5, ease: ease.sine },
  // 5 · evolution: track along the row of tablets
  { t: 50, pos: [32.62, 1.3, 9.02], look: [32.62, 0.76, 8.31], fov: 22 },
  { t: 58.5, pos: [32.67, 1.26, 8.98], look: [32.66, 0.76, 8.31], fov: 21, ease: ease.sine },
  // 6 · archive: pull back to see the shelves, then out and up over the city
  { t: 62, pos: [33.9, 1.95, 11.4], look: [34.2, 1.15, 4.8], fov: 36 },
  { t: 66.5, pos: [33.9, 2.1, 12.6], look: [34.0, 1.2, 4.8], ease: ease.sine },
  { t: 72, pos: [70, 42, 96], look: [14, 0, -4], fov: 40, ease: ease.inOut },
];

/** Morning haze from the south-east (rakes the tablets through the storeroom's open front) → golden evening. */
const MORNING: LightPreset = { ...LIGHT.haze, sunDir: [0.6, 0.5, 0.6], fogNear: 120, fogFar: 560 };
const EVENING: LightPreset = { ...LIGHT.golden, sunDir: [-0.7, 0.38, 0.45], fogNear: 110, fogFar: 520 };

export function lightAt(t: number): LightPreset {
  return mixLight(MORNING, EVENING, smoothstep(62, 71, t));
}

/**
 * Shadow focus: the sun's shadow camera follows the action so a single 2k map stays sharp from the
 * city-wide shot (±110 m) down to the tablets (±0.6 m). Size is interpolated in log space.
 */
const SHADOW_FOCUS: Keyframe<Vec3>[] = [
  { t: 0, v: [0, 0, 0] },
  { t: 11, v: [0, 0, 0] },
  { t: 14, v: [24, 0, 12] },
  { t: 23, v: [27, 0, 10] },
  { t: 25.5, v: [32.5, 0.8, 8.3] },
  { t: 61, v: [32.5, 0.8, 8.3] },
  { t: 63, v: [33, 1, 7] },
  { t: 67, v: [33, 1, 7] },
  { t: 72, v: [0, 0, 0] },
];
const SHADOW_LOG_SIZE: Keyframe<number>[] = [
  { t: 0, v: Math.log(110) },
  { t: 11, v: Math.log(110) },
  { t: 14, v: Math.log(26) },
  { t: 23, v: Math.log(26) },
  { t: 26, v: Math.log(0.6) },
  { t: 61, v: Math.log(0.6) },
  { t: 63, v: Math.log(7) },
  { t: 67, v: Math.log(7) },
  { t: 72, v: Math.log(110) },
];

export function shadowFocusAt(t: number): { focus: Vec3; size: number } {
  return { focus: sample(SHADOW_FOCUS, t), size: Math.exp(sample(SHADOW_LOG_SIZE, t)) };
}

/** Section device: the storeroom's front wall sinks before the camera enters and rises after it leaves (0..1). */
export function frontWallAt(t: number): number {
  return 1 - smoothstep(22.4, 24.4, t) + smoothstep(67.2, 69.2, t);
}
