"use client";

import type { SceneProps } from "../types";
import { Diorama, Environment, LIGHT, mixLight, progress, smoothstep, useCameraPath, type CameraKey, type LightPreset } from "../kit";
import { City } from "./City";
import { Cottage } from "./Cottage";
import { Engine } from "./Engine";
import { MillFloor } from "./MillFloor";
import { Grade } from "./parts";

/**
 * "La ciudad de las chimeneas" — Manchester, c. 1780–1830.
 * Four sets share the origin and are mounted one at a time: cottage → engine house → mill floor → city.
 * Cuts: spinning wheel ↔ flywheel match cut (10 s); dips to black at 32, 44, 65 and 76 s.
 */

const COTTAGE = mixLight(LIGHT.soot, LIGHT.candle, 0.45);
const ENGINE_HOUSE = mixLight(LIGHT.soot, LIGHT.candle, 0.22);
const MILL_FLOOR: LightPreset = { ...LIGHT.soot, fogNear: 22, fogFar: 85 };
const CITY_DUSK: LightPreset = {
  skyTop: "#45464b", skyHorizon: "#a08d74", skyGround: "#4a4440",
  sunDir: [-0.7, 0.28, 0.45], sunColor: "#d9b48a", sunIntensity: 1.1,
  hemiSky: "#a29c93", hemiGround: "#47413b", hemiIntensity: 0.85,
  fogColor: "#7a7168", fogNear: 110, fogFar: 620, sunGlow: 0.25,
};
const PALL: LightPreset = {
  skyTop: "#2c2c30", skyHorizon: "#665c53", skyGround: "#3b3632",
  sunDir: [-0.7, 0.2, 0.45], sunColor: "#b8916a", sunIntensity: 0.7,
  hemiSky: "#857f78", hemiGround: "#3a3530", hemiIntensity: 0.7,
  fogColor: "#57504a", fogNear: 110, fogFar: 560, sunGlow: 0.12,
};
const RAIL_DAY: LightPreset = { ...LIGHT.soot, fogNear: 60, fogFar: 330, sunIntensity: 1.6, sunDir: [0.4, 0.55, 0.6] };
const SOOT_NIGHT: LightPreset = {
  skyTop: "#232226", skyHorizon: "#544c45", skyGround: "#2d2926",
  sunDir: [0.3, 0.5, 0.6], sunColor: "#c9a988", sunIntensity: 0.55,
  hemiSky: "#6d6862", hemiGround: "#2c2825", hemiIntensity: 0.6,
  fogColor: "#3f3a36", fogNear: 18, fogFar: 150, sunGlow: 0,
};

function lightAt(t: number): LightPreset {
  if (t < 10) return COTTAGE;
  if (t < 32) return ENGINE_HOUSE;
  if (t < 44) return MILL_FLOOR;
  if (t < 54) return CITY_DUSK;
  if (t < 65) return mixLight(CITY_DUSK, PALL, progress(t, 54, 64));
  if (t < 76) return RAIL_DAY;
  return SOOT_NIGHT;
}

const CAMERA: CameraKey[] = [
  // A · cottage: establishing → loom → close on the wheel (match cut)
  { t: 0, pos: [0.6, 2.7, 7.6], look: [0, 1.1, -0.6], fov: 38 },
  { t: 4.6, pos: [3.9, 2.0, 4.0], look: [1.2, 1.05, -0.8], fov: 36 },
  { t: 7.4, pos: [-0.3, 1.2, 3.6], look: [-1.2, 0.8, 0.6], fov: 32 },
  { t: 9.999, pos: [-1.2, 0.8, 2.85], look: [-1.2, 0.78, 0.6], fov: 30 },
  // B · engine: flywheel framed like the wheel → full engine → boiler → cylinder & condenser
  { t: 10, pos: [4.5, 3.6, 15.8], look: [4.5, 3.6, -0.7], fov: 30 },
  { t: 12.8, pos: [-1, 7, 27], look: [-2, 6, 0], fov: 38 },
  { t: 15.4, pos: [-6.6, 5.2, 17.5], look: [-6.4, 4.4, 0], fov: 38 },
  { t: 18.6, pos: [-3.8, 4.4, 11.5], look: [-3.5, 3.7, 0], fov: 36 },
  { t: 21, pos: [-3.4, 5.4, 11.2], look: [-3.1, 4.6, 0], fov: 36 },
  // B · motion: up to the beam, down the rod to the gears and flywheel, governor, push into the shaft
  { t: 23.6, pos: [-0.5, 10.6, 13.5], look: [0, 10, 0], fov: 36 },
  { t: 26.4, pos: [5.6, 5.2, 11.5], look: [4.6, 4.2, 0], fov: 34 },
  { t: 29.2, pos: [11.4, 5.8, 6.8], look: [8.4, 4.9, 0], fov: 32 },
  { t: 31.4, pos: [7.2, 4.3, 4.4], look: [4.5, 3.6, -0.5], fov: 30 },
  { t: 31.999, pos: [6.2, 3.9, 3.0], look: [4.5, 3.6, -0.5], fov: 30 },
  // C · mill floor: from the drive along the line shaft to the mules
  { t: 32, pos: [-18.2, 2.4, 1.2], look: [-14, 3.2, 0], fov: 40 },
  { t: 35.6, pos: [-12, 2.8, 1.6], look: [-4, 2.6, -1], fov: 42 },
  { t: 39.6, pos: [-1, 2.0, 1.8], look: [4, 1.9, -3], fov: 42 },
  { t: 43.999, pos: [3, 2.2, 2.0], look: [8, 1.7, -3], fov: 42 },
  // D · city: mill across the canal → crane up over the growing city
  { t: 44, pos: [-62, 11, 86], look: [-2, 20, 0], fov: 44 },
  { t: 49, pos: [-48, 12, 82], look: [4, 21, 0], fov: 44 },
  { t: 53.6, pos: [-26, 24, 98], look: [4, 16, 0], fov: 44 },
  { t: 59, pos: [20, 150, 200], look: [0, 0, -30], fov: 42 },
  { t: 64.999, pos: [-60, 200, 170], look: [-10, 0, -40], fov: 42 },
  // D · railway: station → the train passes heading for Liverpool
  { t: 65, pos: [-48, 3.6, 27], look: [-16, 3, 44], fov: 38 },
  { t: 69.5, pos: [-52, 3.4, 27], look: [-30, 2.6, 43], fov: 38 },
  { t: 75.999, pos: [-62, 4.2, 28], look: [-92, 2.4, 43], fov: 38 },
  // D · street: the shift going in, then tilt up to the soot sky
  { t: 76, pos: [-34, 2.6, 24], look: [-14, 2.2, 13], fov: 38 },
  { t: 81, pos: [-30, 3.2, 25], look: [-10, 3.6, 11], fov: 38 },
  { t: 86, pos: [-27, 5.5, 27], look: [-2, 30, -6], fov: 42 },
];

const DIPS: [number, number][] = [
  [32, 0.35],
  [44, 0.45],
  [65, 0.45],
  [76, 0.5],
];

function fadeAt(t: number): number {
  let f = 0;
  for (const [c, w] of DIPS) f = Math.max(f, 1 - smoothstep(0, w, Math.abs(t - c)));
  return Math.max(f, 0.7 * smoothstep(85, 86, t));
}

export default function ManchesterSteam({ time, quality }: SceneProps) {
  const t = time;
  const high = quality === "high";
  useCameraPath(CAMERA, t);
  return (
    <Diorama quality={quality} bloom={0.5}>
      <Environment light={lightAt(t)} shadows={high} shadowSize={t >= 44 ? 70 : 20} sunDistance={t >= 44 ? 140 : 40} />
      {t < 10 && <Cottage t={t} high={high} />}
      {t >= 10 && t < 32 && <Engine t={t} high={high} />}
      {t >= 32 && t < 44 && <MillFloor t={t} high={high} />}
      {t >= 44 && <City t={t} high={high} />}
      <Grade fade={fadeAt(t)} time={t} grain={high ? 0.05 : 0} tint={1} />
    </Diorama>
  );
}
