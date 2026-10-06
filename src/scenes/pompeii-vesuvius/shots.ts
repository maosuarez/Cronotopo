/**
 * Camera language: one keyframe track (cuts = two keys 0.001 s apart) plus a deterministic shake for the tremors,
 * the blast and the roar of the surge.
 */
import { sampleCamera, type CameraKey, type CameraPose } from "../kit/camera";
import { ease, window01 } from "../kit/math";
import { B, T } from "./story";

const cut = (t: number) => t + 0.001;
const s = ease.sine;
const lin = ease.linear;

export const SHOTS: CameraKey[] = [
  // 1 · aerial: forum and Temple of Jupiter, green Vesuvius behind
  { t: 0, pos: [70, 52, 128], look: [-30, 8, -150], fov: 42 },
  { t: 5, pos: [50, 40, 100], look: [-34, 12, -170], fov: 40, ease: s },
  // 1 · bakery courtyard from the street
  { t: cut(5), pos: [4.0, 1.75, 4.6], look: [13.5, 0.9, -0.2], fov: 46 },
  { t: 8.3, pos: [4.5, 1.7, 1.0], look: [13.5, 1.0, -1.4], fov: 46, ease: lin },
  // 1–2 · street level: stepping stones, the street runs to the north gate and Vesuvius
  { t: cut(8.3), pos: [7.6, 0.85, 30.2], look: [3, -9, -250], fov: 50 },
  { t: 12.3, pos: [7.4, 0.85, 28.9], look: [2.5, -8, -250], fov: 50, ease: lin },
  { t: 13.9, pos: [7.4, 0.85, 28.8], look: [2.5, -4, -250], fov: 50, ease: s },
  { t: 18, pos: [7.5, 1.2, 31.5], look: [-22, 250, -430], fov: 62, ease: ease.inOut },
  // 2 · high wide: tiny city, the volcano, the column opening
  { t: cut(18), pos: [470, 150, 420], look: [-60, 250, -380], fov: 60 },
  { t: B.pine.start, pos: [445, 142, 395], look: [-60, 262, -380], fov: 60, ease: lin },
  // 3 · from Misenum across the bay: stone pine and the "pine" cloud
  { t: cut(B.pine.start), pos: [-503, 15, 158], look: [-170, 240, -330], fov: 56 },
  { t: B.pumice.start, pos: [-518, 13, 178], look: [-130, 268, -330], fov: 58, ease: s },
  // 4 · pumice fall over the blocks
  { t: cut(B.pumice.start), pos: [36, 23, 52], look: [6, 0, 4], fov: 44 },
  { t: 37.5, pos: [28, 18, 43], look: [8, 0, 2], fov: 44, ease: lin },
  // 4 · tracking along the roofs as they give way
  { t: cut(37.5), pos: [54, 8.5, 28], look: [47, 3, 8], fov: 42 },
  { t: B.surge.start, pos: [18, 8, 28], look: [11, 3, 8], fov: 42, ease: lin },
  // 5 · wide side view: the surge runs down the slope
  { t: cut(B.surge.start), pos: [470, 120, -60], look: [-50, 120, -250], fov: 48 },
  { t: 51.5, pos: [450, 110, -48], look: [-40, 110, -230], fov: 48, ease: lin },
  // 5 · the street, standing on the pumice: the front pours over the north wall
  { t: cut(51.5), pos: [6.9, 3.9, 44], look: [5, 20, -80], fov: 56 },
  { t: B.buried.start, pos: [6.6, 3.7, 40.5], look: [5, 32, -80], fov: 58, ease: lin },
  // 6 · silence: the grey plain
  { t: cut(B.buried.start), pos: [95, 72, 175], look: [-20, 8, -60], fov: 44 },
  { t: T.cut, pos: [82, 62, 152], look: [-20, 10, -70], fov: 44, ease: lin },
  // 6 · cutaway section
  { t: cut(T.cut), pos: [-18, 4.6, 74], look: [-10, 2.4, 34], fov: 40 },
  { t: B.centuries.start, pos: [-13, 4.2, 67], look: [-10, 2.6, 34], fov: 40, ease: lin },
  // 7 · time-lapse on the section
  { t: B.excavation.start, pos: [-17, 11, 96], look: [-10, 4.5, 30], fov: 42, ease: s },
  // 8 · aerial (matches the opening): excavations reveal the ruins, Vesuvius behind
  { t: cut(B.excavation.start), pos: [70, 50, 140], look: [-20, 2, -30], fov: 42 },
  { t: 84, pos: [80, 58, 160], look: [-24, 10, -90], fov: 42, ease: s },
  { t: B.excavation.end, pos: [92, 62, 185], look: [-30, 16, -180], fov: 42, ease: s },
];

const n3 = (t: number, a: number, b: number, c: number) => Math.sin(t * a) * 0.5 + Math.sin(t * b + 1.3) * 0.3 + Math.sin(t * c + 2.1) * 0.2;

/** Shake amplitude (m) at `t`. */
function shake(t: number): number {
  const tremor = 0.09 * window01(t, T.tremor, T.tremor + 0.2, 13.2, 13.6);
  const blast = 0.16 * window01(t, T.blast, T.blast + 0.1, T.blast + 0.4, 16.5);
  const collapse = 0.025 * window01(t, 37.6, 38, 43.5, 44);
  const roar = 0.1 * window01(t, 53, 56.5, 57, 57.01);
  return tremor + blast + collapse + roar;
}

export function shotAt(t: number): CameraPose {
  const pose = sampleCamera(SHOTS, t, 40);
  const a = shake(t);
  if (a <= 0) return pose;
  const k = Math.max(1, Math.hypot(pose.look[0] - pose.pos[0], pose.look[1] - pose.pos[1], pose.look[2] - pose.pos[2])) / 60;
  return {
    ...pose,
    pos: [pose.pos[0] + a * n3(t, 37, 53, 71), pose.pos[1] + a * n3(t, 43, 61, 29), pose.pos[2] + a * 0.5 * n3(t, 31, 47, 67)],
    look: [pose.look[0] + a * k * 6 * n3(t, 41, 59, 23), pose.look[1] + a * k * 6 * n3(t, 33, 49, 77), pose.look[2]],
  };
}
