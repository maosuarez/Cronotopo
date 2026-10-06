"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { BackSide, DirectionalLight, MeshBasicMaterial, Object3D, Vector3 } from "three";
import type { SceneProps } from "../types";
import {
  ACCENT,
  Diorama,
  ease,
  Environment,
  GEO,
  LIGHT,
  Label3D,
  PALETTE,
  Terrain,
  Vegetation,
  lerp,
  lerp3,
  sample,
  smoothstep,
  useCameraPath,
  window01,
  type CameraKey,
  type CameraPose,
  type Keyframe,
  type LightPreset,
  type Vec3,
} from "../kit";
import { Harbour, Papyrus, bargeX } from "./Harbour";
import { Pyramid } from "./Pyramid";
import { Quarry } from "./Quarry";
import { Sledge, sledgeX } from "./Sledge";
import { Village, gangLabelPos } from "./Village";
import { CANAL, COURSE_H, PYR, TERRAIN_OPTS, VILLAGE, WATER_Y, groundY, southFaceZ } from "./world";

/** Zenith sun: the kit "noon" preset with a longer haze for a 230 m monument. The sun itself is our own light. */
const GIZA_LIGHT: LightPreset = { ...LIGHT.noon, sunDir: [0.42, 1, 0.55], fogColor: "#e6dfcd", fogNear: 320, fogFar: 1450, skyHorizon: "#d9e3e6", sunIntensity: 0 };
const SUN_INTENSITY = 3.0;

/** Cuts (dip to dark) between shots that change place; the other beats flow in one continuous move. */
const CUTS = [10, 20, 31, 41, 62];
const DIP = 0.32;

const sledgeAt = (t: number) => sledgeX(t);

const CAMERA: CameraKey[] = [
  // 1 · plateau: high over the flood, descending towards the plateau
  { t: 0, pos: [560, 150, 40], look: [-40, -45, -40] },
  { t: 10, pos: [470, 92, 10], look: [-70, -22, -60], ease: ease.sine },
  // 2 · quarry: push into the pit
  { t: 10.001, pos: [86, 11, 113], look: [52, -6, 88] },
  { t: 20, pos: [73, 4.5, 101], look: [50, -6.5, 88], ease: ease.sine },
  // 3 · barges: low over the canal, tracking the lead barge towards the quay
  { t: 20.001, pos: [264, -10, 9], look: [200, -12.5, -3] },
  { t: 31, pos: [228, -11, 8], look: [184, -12, -4], ease: ease.linear },
  // 4 · sledge: close tracking shot ending on the water pourer
  { t: 31.001, pos: [sledgeAt(31) - 11, 4.2, 163], look: [sledgeAt(31) - 2.5, 0.9, 150] },
  { t: 41, pos: [sledgeAt(41) - 5.3, 1.8, 154.8], look: [sledgeAt(41) - 2.1, 0.7, 150], ease: ease.sine },
  // 5 · ramp (hypothesis) → 6 · time-lapse orbit, one continuous move
  { t: 41.001, pos: [70, 75, 265], look: [-100, 28, 50] },
  { t: 51, pos: [42, 66, 245], look: [-100, 32, 30], ease: ease.linear },
  { t: 56.5, pos: [-185, 120, 255], look: [-100, 55, -80] },
  { t: 62, pos: [-390, 105, 250], look: [-100, 58, -80], ease: ease.out },
  // 7 · gleam: low hero shot from the south-east → 8 · crane to the workers' town
  { t: 62.001, pos: [118, 8, 198], look: [-100, 62, -80] },
  { t: 71, pos: [98, 7, 174], look: [-100, 64, -80], ease: ease.linear },
  { t: 76.5, pos: [208, 2.5, 278], look: [163, 4, 195], fov: 44, ease: ease.inOut },
  { t: 82, pos: [218, 2, 288], look: [165, 4, 198], fov: 44, ease: ease.linear },
];

const COURSES: Keyframe<number>[] = [
  { t: 0, v: 2.2 },
  { t: 10, v: 3, ease: ease.linear },
  { t: 20, v: 5, ease: ease.linear },
  { t: 31, v: 9, ease: ease.linear },
  { t: 41, v: 18.6, ease: ease.linear },
  { t: 51.5, v: 19.4, ease: ease.linear },
  { t: 58.6, v: PYR.courses, ease: ease.inOut },
];

/** Shadow frustum that follows the subject of each shot (one 2048² map can't cover 400 m sharply). */
const SHADOW: { t: number; focus: Vec3; size: number }[] = [
  { t: 0, focus: [-20, 0, -30], size: 230 },
  { t: 10, focus: [58, -5, 92], size: 48 },
  { t: 20, focus: [210, -15, 0], size: 70 },
  { t: 31, focus: [-14, 0, 150], size: 16 },
  { t: 41, focus: [-100, 20, 50], size: 175 },
  { t: 62, focus: [-90, 30, -60], size: 190 },
];

function shadowAt(t: number) {
  let i = 0;
  while (i < SHADOW.length - 1 && t >= SHADOW[i + 1].t) i++;
  const s = SHADOW[i];
  if (s.t === 31) return { focus: [sledgeAt(t) - 3, 0, 150] as Vec3, size: s.size };
  if (s.t === 62) {
    // Slide the frustum to the town during the final crane.
    const k = ease.inOut(smoothstep(71, 77, t));
    return { focus: lerp3(s.focus, [150, -6, 190], k), size: lerp(s.size, 110, k) };
  }
  return s;
}

/** Directional sun whose shadow camera is centred on `focus`. */
function Sun({ dir, focus, size, shadows }: { dir: Vec3; focus: Vec3; size: number; shadows: boolean }) {
  const ref = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Object3D(), []);
  const d = new Vector3(...dir).normalize();
  const dist = size * 2 + 60;
  useLayoutEffect(() => {
    const light = ref.current;
    if (!light) return;
    const cam = light.shadow.camera;
    cam.left = -size;
    cam.right = size;
    cam.top = size;
    cam.bottom = -size;
    cam.near = 1;
    cam.far = dist * 2 + size;
    cam.updateProjectionMatrix();
  });
  return (
    <>
      <primitive object={target} position={focus} />
      <directionalLight
        ref={ref}
        target={target}
        position={[focus[0] + d.x * dist, focus[1] + d.y * dist, focus[2] + d.z * dist]}
        color={GIZA_LIGHT.sunColor}
        intensity={SUN_INTENSITY}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={size > 100 ? 0.6 : 0.05}
      />
    </>
  );
}

/** Dark sphere around the camera for dips between shots. */
function Dip({ pose, amount }: { pose: CameraPose; amount: number }) {
  const material = useMemo(() => new MeshBasicMaterial({ color: "#120d09", side: BackSide, transparent: true, depthTest: false, depthWrite: false, fog: false, toneMapped: false }), []);
  material.opacity = amount;
  useLayoutEffect(() => () => material.dispose(), [material]);
  if (amount <= 0.002) return null;
  return <mesh geometry={GEO.sphere()} material={material} position={pose.pos} renderOrder={1000} frustumCulled={false} />;
}

/** Point `dist` m in front of the camera, shifted right/up (for floating didactic inserts). */
function inFrontOf(pose: CameraPose, dist: number, right: number, up: number): Vec3 {
  const f = new Vector3(...pose.look).sub(new Vector3(...pose.pos)).normalize();
  const r = new Vector3().crossVectors(f, new Vector3(0, 1, 0)).normalize();
  const u = new Vector3().crossVectors(r, f);
  const p = new Vector3(...pose.pos).addScaledVector(f, dist).addScaledVector(r, right).addScaledVector(u, up);
  return [p.x, p.y, p.z];
}

/** Vertical dimension line through the pyramid axis, drawn over the stone (X-ray). */
function HeightLine({ grow, opacity }: { grow: number; opacity: number }) {
  const material = useMemo(() => new MeshBasicMaterial({ color: ACCENT.egypt, transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false }), []);
  material.opacity = opacity;
  useLayoutEffect(() => () => material.dispose(), [material]);
  if (opacity <= 0.01 || grow <= 0.001) return null;
  const h = PYR.height * grow;
  return (
    <group position={[PYR.x, 0, PYR.z]} renderOrder={20}>
      <mesh geometry={GEO.cylinder()} material={material} scale={[0.9, h, 0.9]} renderOrder={20} />
      <mesh geometry={GEO.box()} material={material} scale={[16, 0.9, 0.9]} renderOrder={20} />
      <mesh geometry={GEO.box()} material={material} position={[0, h, 0]} scale={[16, 0.9, 0.9]} renderOrder={20} />
    </group>
  );
}

export default function GizaPyramidScene({ time, quality }: SceneProps) {
  const t = time;
  const high = quality === "high";
  const pose = useCameraPath(CAMERA, t, 38);

  // Sun: zenith; during the time-lapse it swings east → west a few times (days passing).
  const swing = window01(t, 51.6, 52.6, 59.4, 60.6) * Math.sin(((t - 51.6) / 2.4) * Math.PI * 2);
  const sunDir: Vec3 = [GIZA_LIGHT.sunDir[0] + swing * 1.1, 1 - Math.abs(swing) * 0.35, GIZA_LIGHT.sunDir[2]];
  const light: LightPreset = { ...GIZA_LIGHT, sunDir };
  const shadow = shadowAt(t);

  // Construction state.
  const courses = sample(COURSES, t);
  const courseTop = courses * COURSE_H;
  const casing = PYR.height * ease.inOut(smoothstep(57.4, 61.2, t));
  const rampH = Math.min(courseTop, 96);
  const rampOpacity = smoothstep(41.4, 43.2, t) * (1 - smoothstep(55.6, 57.6, t));
  const traffic = smoothstep(41.6, 43.4, t) * (1 - smoothstep(55, 57, t));
  const shine = smoothstep(61, 64.5, t);

  // Dips between shots + fade in from black.
  const dip = Math.max(1 - smoothstep(0, 1.1, t), ...CUTS.map((c) => 1 - smoothstep(0, DIP, Math.abs(t - c))));

  // Labels.
  const leadX = bargeX(0, t);
  const papyrusPos = inFrontOf(pose, 9, -3.2, 1.15);
  const sx = sledgeX(t);
  const rampLabelZ = southFaceZ(rampH) + rampH * 1.6;
  const showHarbour = t < 33 || t > 60;
  const showSledge = t > 28 && t < 44;
  const showQuarry = t < 33 || t > 40;
  const showVillage = t < 12 || t > 60;

  return (
    <Diorama quality={quality} bloom={0.32 + 0.25 * shine} vignette={0.5}>
      {/* Sky dome follows the camera (its built-in sun is off: GIZA_LIGHT.sunIntensity = 0), so wide shots can go far. */}
      <group position={pose.pos}>
        <Environment light={light} shadows={false} />
      </group>
      <Sun dir={sunDir} focus={shadow.focus} size={shadow.size} shadows={high} />
      <Terrain
        size={1700}
        segments={high ? 170 : 110}
        {...TERRAIN_OPTS}
        bands={[
          [-99, "#6f7f45"],
          [-16.2, PALETTE.grassDry],
          [-14.6, PALETTE.sandDark],
          [-6.5, PALETTE.sand],
          [4, "#cfae7f"],
        ]}
      />
      <Pyramid time={t} courses={courses} casing={casing} shine={shine} ramp={rampH} rampOpacity={rampOpacity} traffic={traffic} teams={high ? 7 : 4} />
      {showQuarry && <Quarry time={t} quality={quality} dust={window01(t, 9, 11, 19, 21) + 0.35} />}
      {showHarbour && <Harbour time={t} quality={quality} />}
      {showSledge && <Sledge time={t} quality={quality} />}
      {showVillage && <Village time={t} quality={quality} />}
      <Vegetation kind="palm" count={high ? 40 : 20} area={{ x: 205, z: 150, w: 30, d: 60 }} exclude={(x, z) => groundY(x, z) < WATER_Y + 0.3 || (Math.abs(x - VILLAGE.x) < 40 && Math.abs(z - VILLAGE.z) < 30)} height={groundY} size={3.4} seed={31} castShadow={high} />

      {/* 1 · plateau */}
      <Label3D position={[250, WATER_Y + 4, -190]} opacity={window01(t, 1.4, 2.8, 9.2, 9.8)}>Nilo en crecida</Label3D>
      <Label3D position={[PYR.x + 40, 16, PYR.z + 60]} opacity={window01(t, 3.6, 5, 9.2, 9.8)}>Gran Pirámide · primeras hiladas</Label3D>
      {/* 2 · quarry */}
      <Label3D position={[60, -2, 80]} opacity={window01(t, 11.4, 12.8, 19.2, 19.8)}>Cantera · bloques del núcleo</Label3D>
      {/* 3 · barges */}
      <Label3D position={[leadX - 0.5, WATER_Y + 6.5, CANAL.z - 4.5]} opacity={window01(t, 21, 22.4, 30.2, 30.8)}>Caliza fina de Tura</Label3D>
      <Papyrus position={papyrusPos} lookAt={pose.pos} opacity={window01(t, 23, 24.4, 30.2, 30.8)} scale={1.25} />
      <Label3D position={inFrontOf(pose, 9, -3.2, 0.15)} opacity={window01(t, 23.4, 24.8, 30.2, 30.8)} size="sm">
        Diario de Merer · papiros de Wadi al-Jarf
      </Label3D>
      {/* 4 · sledge */}
      <Label3D position={[sx - 3.6, 0.45, 151.8]} opacity={window01(t, 32.6, 34, 40.3, 40.9)}>Arena mojada: menos fricción</Label3D>
      {/* 5 · ramp (hypothesis) */}
      <Label3D position={[PYR.x + 14, rampH * 0.42 + 6, rampLabelZ]} opacity={window01(t, 43.2, 44.6, 50.4, 51)} hypothesis>
        Rampa · una de las hipótesis
      </Label3D>
      {/* 6 · casing */}
      <Label3D position={[PYR.x + 60, 30, southFaceZ(30) + 8]} opacity={window01(t, 59.4, 60.4, 61.5, 61.95)}>Revestimiento de caliza blanca</Label3D>
      {/* 7 · gleam */}
      <HeightLine grow={ease.out(smoothstep(63.2, 66, t))} opacity={window01(t, 63, 63.6, 70.2, 71.4)} />
      <Label3D position={[PYR.x, PYR.height + 12, PYR.z]} opacity={window01(t, 65.4, 66.6, 70.2, 71.4)} size="lg">
        ≈ 146 m · altura original
      </Label3D>
      {/* 8 · village */}
      <Label3D position={[VILLAGE.x - 18, groundY(VILLAGE.x, VILLAGE.z) + 7, VILLAGE.z - 4]} opacity={smoothstep(74.4, 75.8, t)}>
        Poblado de los trabajadores
      </Label3D>
      <Label3D position={gangLabelPos(t)} opacity={smoothstep(75.6, 77, t)}>Cuadrillas organizadas</Label3D>

      <Dip pose={pose} amount={dip} />
    </Diorama>
  );
}
