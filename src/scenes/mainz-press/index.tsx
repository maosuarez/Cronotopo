"use client";

import { useEffect, useMemo } from "react";
import { MeshStandardMaterial } from "three";
import {
  Diorama,
  Environment,
  GEO,
  LIGHT,
  matte,
  Particles,
  PARTICLES,
  useCameraPath,
  type CameraKey,
  type LightPreset,
} from "../kit";
import type { SceneProps } from "../types";
import { LightRig } from "./Lights";
import { MAP_CANDLE, MapTable } from "./MapTable";
import { disposeMainzMaterials } from "./materials";
import { Dip } from "./parts";
import { Press } from "./Press";
import { createTextures, disposeTextures } from "./textures";
import { daylight, dipOpacity, PRESS } from "./timing";
import { Casting, Compose, Room, Scribe } from "./Workshop";

/**
 * Mainz, c. 1450–1455: one candle-lit workshop visited station by station
 * (scribe → type casting → composing → inking → press → printed page → print run → map of Europe).
 * Every value is a pure function of `time`.
 */
const CAMERA: CameraKey[] = [
  // 1 scribe: over the shoulder, then pull back to reveal desk and window
  { t: 0, pos: [-4.98, 1.42, -2.02], look: [-5.36, 1.0, -2.6], fov: 32 },
  { t: 3.6, pos: [-4.72, 1.62, -1.6], look: [-5.36, 1.1, -2.62], fov: 38 },
  { t: 9.4, pos: [-3.75, 1.75, 0.25], look: [-5.3, 1.32, -2.7], fov: 38 },
  // 2 casting: dolly to the bench, push in to the mould, pan to the finished sorts
  { t: 11.0, pos: [-2.5, 1.68, -1.3], look: [-3.0, 0.88, -2.75], fov: 40 },
  { t: 16.2, pos: [-2.72, 1.62, -1.55], look: [-2.9, 0.9, -2.75], fov: 38 },
  { t: 20.99, pos: [-2.0, 1.5, -1.72], look: [-2.2, 0.92, -2.72], fov: 36 },
  // 3 composing (cut): close on the stick, then the forme filling
  { t: 21.0, pos: [1.32, 1.38, -1.3], look: [1.08, 0.92, -1.96], fov: 34 },
  { t: 26.0, pos: [1.26, 1.3, -1.43], look: [1.09, 0.92, -1.95], fov: 32 },
  { t: 27.6, pos: [0.98, 1.45, -1.38], look: [0.88, 0.9, -2.05], fov: 34 },
  { t: 31.99, pos: [0.82, 1.52, -1.45], look: [0.74, 0.9, -2.1], fov: 32 },
  // 4 inking (cut): three-quarter view of the forme run out on the carriage
  { t: 32.0, pos: [5.0, 1.55, -0.72], look: [4.4, 0.86, -1.6], fov: 36 },
  { t: 39.6, pos: [4.82, 1.45, -0.86], look: [4.4, 0.86, -1.6], fov: 34 },
  // 5 press: wide, both presses side by side
  { t: 41.8, pos: [4.6, 1.75, 1.8], look: [5.3, 1.15, -2.2], fov: 42 },
  { t: 47.0, pos: [4.55, 1.68, 1.45], look: [5.2, 1.12, -2.2], fov: 42 },
  { t: 50.6, pos: [4.85, 1.6, 0.6], look: [4.5, 1.0, -1.8], fov: 40 },
  // 6 the sheet: tympan opens, the page comes up to the camera
  { t: 52.2, pos: [4.95, 1.6, -0.35], look: [4.4, 0.95, -1.3], fov: 36 },
  { t: 55.4, pos: [4.4, 1.45, 0.45], look: [4.4, 1.42, -0.55], fov: 34 },
  { t: 60.8, pos: [4.4, 1.44, 0.22], look: [4.4, 1.42, -0.55], fov: 34 },
  // 7 print run: pull back to the whole workshop
  { t: 61.0, pos: [4.4, 1.44, 0.22], look: [4.4, 1.42, -0.55], fov: 34 },
  { t: 63.6, pos: [2.5, 1.75, 2.9], look: [4.7, 1.75, -1.3], fov: 42 },
  { t: 68.6, pos: [2.9, 1.95, 3.3], look: [4.8, 1.75, -1.2], fov: 42 },
  // 8 map: crane over the table
  { t: 71.6, pos: [5.6, 3.2, 3.15], look: [5.6, 0.8, 1.98], fov: 40 },
  { t: 80, pos: [5.6, 3.4, 3.3], look: [5.6, 0.8, 1.98], fov: 40 },
];

const WORKSHOP: LightPreset = { ...LIGHT.candle, hemiIntensity: 0.6, sunIntensity: 0.25, fogNear: 14, fogFar: 40 };

export default function MainzPressScene({ time, quality }: SceneProps) {
  const pose = useCameraPath(CAMERA, time);
  const high = quality === "high";
  const tex = useMemo(() => createTextures(), []);
  const floor = useMemo(() => new MeshStandardMaterial({ map: tex.planks, roughness: 0.9 }), [tex]);
  useEffect(
    () => () => {
      disposeTextures(tex);
      floor.dispose();
      disposeMainzMaterials();
    },
    [tex, floor],
  );
  const day = daylight(time);

  return (
    <Diorama quality={quality} bloom={0.5}>
      <Environment light={WORKSHOP} />
      <Room floor={floor} windowDay={day} />
      <Scribe time={time} tex={tex} />
      <Casting time={time} quality={quality} />
      <Compose time={time} tex={tex} quality={quality} />
      <Press time={time} tex={tex} quality={quality} />
      <MapTable time={time} tex={tex} />

      <LightRig time={time} look={pose.look} />
      <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={[-1.8, 0.9, -3.05]} scale={[0.035, 0.21, 0.035]} />
      {/* candle bodies */}
      <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={[PRESS[0] - 0.83, 0.8, PRESS[2] + 0.7]} scale={[0.035, 0.22, 0.035]} />
      <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={MAP_CANDLE} scale={[0.04, 0.18, 0.04]} />
      {(
        <group position={[PRESS[0] + 1.25, 1.35, -3.4]}>
          <mesh geometry={GEO.box()} material={matte("#3e2a1a")} scale={[0.16, 0.04, 0.16]} />
          <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={[0, 0.02, 0.06]} scale={[0.035, 0.25, 0.035]} />
        </group>
      )}

      {/* dust motes drifting in the candlelight */}
      <Particles
        preset={PARTICLES.dust}
        time={time}
        position={[0.5, 2.6, -1.4]}
        prewarm
        seed={17}
        density={high ? 1 : 0.5}
        overrides={{
          count: 200,
          life: 10,
          spread: [6.5, 0.55, 1.8],
          velocity: [0, 0.03, 0],
          jitter: [0.05, 0.04, 0.05],
          gravity: 0,
          wind: [0.01, 0],
          size: [0.008, 0.011],
          colorStart: "#ffd9a0",
          colorEnd: "#ffc880",
          opacity: 0.5,
          additive: true,
        }}
      />
      <Dip pose={pose} opacity={dipOpacity(time)} />
    </Diorama>
  );
}
