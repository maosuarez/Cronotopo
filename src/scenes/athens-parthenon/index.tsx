"use client";

import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import {
  ACCENT,
  Arrow,
  createRng,
  Crowd,
  Diorama,
  ease,
  Environment,
  Figure,
  GEO,
  Label3D,
  LIGHT,
  lerp,
  matte,
  mixLight,
  PALETTE,
  Particles,
  PARTICLES,
  pathLength,
  progress,
  useCameraPath,
  type CameraKey,
  type CrowdAgent,
  type LightPreset,
  type Vec3,
} from "../kit";
import type { SceneProps } from "../types";
import { Athena } from "./Athena";
import { Construction, Scaffold } from "./Construction";
import { Landscape, RAMP } from "./Landscape";
import { AX, AZ, BEND_DEMO, COL, COL_TOP, HERO, S, STATUE, STYLO, T } from "./layout";
import { Plan } from "./Plan";
import { Ruins } from "./Ruins";
import { Temple } from "./Temple";

/** Documentary camera. Cuts = two keys 1 ms apart. */
const CUT = 0.001;
const CAMERA: CameraKey[] = [
  // 1 · ruins: aerial approach over the city in raking afternoon light
  { t: 0, pos: [230, 30, 300], look: [-10, -12, -10], fov: 36 },
  { t: T.pericles, pos: [64, 20, 74], look: [2, 1, -2], fov: 36, ease: ease.sine },
  // 2 · Pericles: medium shot of the four men, crane up over the drawn plan
  { t: T.pericles + CUT, pos: [38.5, 3.3, 13.5], look: [24, 2.4, 2.6], fov: 34 },
  { t: 13.5, pos: [37.5, 3.9, 15], look: [23.5, 2.4, 2.2], fov: 34 },
  { t: T.drums, pos: [66, 42, 52], look: [2, 1, 0], fov: 38 },
  // 3 · drums: close on the derrick, then pull back over the time-lapse
  { t: T.drums + CUT, pos: [44, 5.5, 27], look: [HERO.x, 8.6, HERO.z], fov: 36 },
  { t: 24.2, pos: [44.8, 6.6, 27.6], look: [HERO.x, 8.2, HERO.z], fov: 36 },
  { t: 28.6, pos: [58, 30, 92], look: [0, 6, 0], fov: 38 },
  { t: T.entasis, pos: [52, 31, 96], look: [0, 7, 0], fov: 38 },
  // 4 · entasis: low along the south colonnade from the corner
  { t: T.entasis + CUT, pos: [52, 3.0, 25.5], look: [HERO.x - 1, 7.0, HERO.z], fov: 36 },
  { t: T.stylobate, pos: [51, 2.6, 24.5], look: [HERO.x - 1, 7.0, HERO.z], fov: 36 },
  // 5 · stylobate: frontal view of the long south side
  { t: T.stylobate + CUT, pos: [-4, 7, 118], look: [0, 8, 0], fov: 30 },
  { t: T.color, pos: [4, 7, 116], look: [0, 8, 0], fov: 30 },
  // 6 · colour: the south-east corner entablature
  { t: T.color + CUT, pos: [48, 15.5, 28], look: [31, 14, 12], fov: 36 },
  { t: T.athena, pos: [44, 12.5, 32], look: [27, 13.8, 14.5], fov: 36 },
  // 7 · Athena: through the east door into the naos, tilt up
  { t: T.athena + CUT, pos: [50, 4.0, 1.2], look: [20, 6, 0], fov: 40 },
  { t: 65.5, pos: [21, 3.4, 0.8], look: [4, 8, 0], fov: 44 },
  { t: T.procession, pos: [14, 2.1, 3.6], look: [STATUE.x, 9.4, 0], fov: 48 },
  // 8 · procession at dusk: up the ramp, through the Propylaea, final wide view
  { t: T.procession + CUT, pos: [-122, 6, 46], look: [-185, -20, 36], fov: 40 },
  { t: 77.5, pos: [-138, 24, -34], look: [-60, 0, -16], fov: 40 },
  { t: T.end, pos: [-74, 28, -82], look: [6, 7, -2], fov: 40 },
];

/** Sun swung to the south-west so the south flank (where most shots are) catches the raking light. */
const GOLDEN: LightPreset = { ...LIGHT.golden, sunDir: [-0.55, 0.42, 0.72], hemiIntensity: 0.85 };
const DUSK: LightPreset = { ...LIGHT.dusk, sunDir: [-0.85, 0.14, 0.5] };

const INTERIOR: LightPreset = {
  ...LIGHT.dusk,
  sunIntensity: 0.35,
  hemiSky: "#c9a27a",
  hemiGround: "#3a2a1c",
  hemiIntensity: 0.28,
};

/** Late-afternoon gold → dusk, with an "exposure" dip while the camera is inside the cella. */
function lightAt(t: number): { light: LightPreset; inside: number } {
  const dusk = 0.15 * progress(t, 20, 61) + 0.85 * progress(t, 70, 84);
  const inside = t < T.procession ? progress(t, 62.4, 64.6) : 0;
  const base = mixLight(GOLDEN, DUSK, dusk);
  const light = inside > 0 ? mixLight(base, INTERIOR, inside) : base;
  return { light: { ...light, fogNear: lerp(170, 60, inside), fogFar: lerp(950, 300, inside) }, inside };
}

const UP = new Vector3(0, 1, 0);
/** Glowing didactic guide line between two points. */
function Guide({ a, b, k, thickness = 0.06 }: { a: Vec3; b: Vec3; k: number; thickness?: number }) {
  if (k <= 0.01) return null;
  const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = d.length() * k;
  const q = new Quaternion().setFromUnitVectors(UP, d.clone().normalize());
  const mid = d.normalize().multiplyScalar(len / 2);
  return (
    <mesh
      geometry={GEO.box()}
      material={matte(ACCENT.greece, { flat: false, emissive: ACCENT.greece, emissiveIntensity: 1.1 })}
      position={[a[0] + mid.x, a[1] + mid.y, a[2] + mid.z]}
      quaternion={q}
      scale={[thickness, len, thickness]}
    />
  );
}

/** Straight silhouette lines of the hero column as seen from the entasis camera. */
function entasisGuides(): [Vec3, Vec3][] {
  const cam = CAMERA.find((k) => k.t === T.entasis + CUT)!.pos;
  const vx = HERO.x - cam[0];
  const vz = HERO.z - cam[2];
  const n = Math.hypot(vx, vz);
  const [ux, uz] = [vx / n, vz / n];
  const [px, pz] = [-uz, ux];
  const toward = 1.1;
  const top = S + COL.shaft;
  const rTop = COL.r * (1 - COL.taper);
  return [-1, 1].map((s) => [
    [HERO.x + s * px * (COL.r + 0.03) - ux * toward, S, HERO.z + s * pz * (COL.r + 0.03) - uz * toward],
    [HERO.x + s * px * (rTop + 0.03) - ux * toward, top, HERO.z + s * pz * (rTop + 0.03) - uz * toward],
  ]);
}
const ENTASIS_GUIDES = entasisGuides();

/** Golden dust motes hanging in the low sun (opening and closing shots). */
const MOTES = {
  ...PARTICLES.dust,
  count: 260,
  life: 14,
  spread: [60, 10, 60] as Vec3,
  velocity: [0.25, 0.08, 0] as Vec3,
  jitter: [0.3, 0.12, 0.3] as Vec3,
  gravity: 0,
  wind: [0.02, 0] as [number, number],
  size: [0.35, 0.5] as [number, number],
  colorStart: "#ffe3a6",
  colorEnd: "#ffc27a",
  opacity: 0.55,
  additive: true,
};

/** Procession route: up the west ramp, through the Propylaea, along the north flank to the east front. */
const ROUTE: Vec3[] = [
  ...RAMP,
  [-125, 1.2, 0.6],
  [-100, 1.2, 0],
  [-97, 0, -1],
  [-78, 0, -10],
  [-46, 0, -24],
  [16, 0, -24.5],
  [40, 0, -14],
  [43, 0, -4],
];

function procession(count: number): CrowdAgent[] {
  const rng = createRng(437);
  const L = pathLength(ROUTE);
  const colors = [PALETTE.linen, PALETTE.linen, PALETTE.wool, PALETTE.dyeOchre, PALETTE.dyeRed, PALETTE.dyeBlue, "#e9e1cc"];
  return Array.from({ length: count }, (_, i) => ({
    path: ROUTE,
    speed: rng.range(0.85, 1.1),
    offset: (i / count) * (L - 18) + rng.range(-0.6, 0.6),
    lateral: rng.range(-0.9, 0.9),
    loop: false,
    color: rng.pick(colors),
    scale: rng.range(0.92, 1.06),
  }));
}

export default function AthensParthenon({ time, quality }: SceneProps) {
  const high = quality === "high";
  const t = time;
  useCameraPath(CAMERA, t);
  const { light, inside } = lightAt(t);
  const crowd = useMemo(() => procession(high ? 170 : 85), [high]);

  const inB = (a: number, b: number) => t >= a && t < b;
  const entasisUp = progress(t, 34, 35.2) * (1 - progress(t, 41.4, 41.9));
  const exaggerated = progress(t, 34.6, 35.4) * (1 - progress(t, 38.8, 39.3));
  const real = progress(t, 40.6, 41.2);
  const bendRef = progress(t, 42.8, 43.6);
  const bendBig = progress(t, 44.6, 45.4) * (1 - progress(t, 48.2, 48.7));
  const bendReal = progress(t, 49.6, 50.2);
  const lamp = inside;

  return (
    <Diorama quality={quality} bloom={0.4}>
      <Environment light={light} shadows={high} sunDistance={150} shadowSize={50} />
      <Landscape high={high} showRamp />
      <Temple time={t} high={high} />

      {/* 1 · ruins */}
      {t < T.drums && <Ruins time={t} high={high} />}
      <Label3D position={[-10, 8, -10]} size="lg" opacity={progress(t, 1.5, 2.5) * (1 - progress(t, 6, 6.8))}>
        Acrópolis de Atenas
      </Label3D>
      <Label3D position={[6, 6, 8]} opacity={progress(t, 5.6, 6.6) * (1 - progress(t, 9.4, 9.9))}>
        Ruinas del saqueo persa · 480 a.C.
      </Label3D>

      {t < T.pericles && <Particles preset={MOTES} time={t} position={[70, 14, 80]} density={high ? 1 : 0.5} seed={3} prewarm />}

      {/* 2 · Pericles and the plan */}
      {inB(T.pericles, T.drums) && <Plan time={t} high={high} />}

      {/* 3 · drums */}
      {inB(T.drums, T.entasis) && <Construction time={t} high={high} />}

      {/* 4 · entasis */}
      {inB(T.entasis, T.stylobate) && (
        <group>
          {ENTASIS_GUIDES.map(([a, b], i) => (
            <Guide key={i} a={a} b={b} k={ease.inOut(entasisUp)} thickness={0.045} />
          ))}
          <Label3D position={[HERO.x - 1.4, S + 11.6, HERO.z + 1.6]} opacity={exaggerated}>
            Éntasis · exagerada
          </Label3D>
          <Label3D position={[HERO.x - 1.4, S + 11.6, HERO.z + 1.6]} opacity={real}>
            Escala real
          </Label3D>
        </group>
      )}

      {/* 5 · curvature of the stylobate */}
      {inB(T.stylobate, T.color) && (
        <group>
          <Guide a={[-STYLO.halfX, S, STYLO.halfZ + 0.05]} b={[STYLO.halfX, S, STYLO.halfZ + 0.05]} k={ease.inOut(bendRef)} thickness={0.16} />
          <Guide a={[-AX - 1.05, COL_TOP, AZ + 1.1]} b={[AX + 1.05, COL_TOP, AZ + 1.1]} k={ease.inOut(bendRef)} thickness={0.16} />
          <Label3D position={[0, S + 4.5, STYLO.halfZ + 3]} opacity={bendBig}>
            {`Curvatura exagerada × ${BEND_DEMO}`}
          </Label3D>
          <Label3D position={[0, S + 4.5, STYLO.halfZ + 3]} opacity={bendReal}>
            Real: ≈ 11 cm en 69 m
          </Label3D>
          <Label3D position={[-STYLO.halfX - 6, S, STYLO.halfZ + 2]} size="sm" opacity={bendRef * (1 - progress(t, 50.4, 50.9))}>
            Recta de referencia
          </Label3D>
        </group>
      )}

      {/* 6 · polychromy */}
      {inB(T.color, T.athena) && (
        <group>
          <Scaffold time={t} high={high} />
          <Label3D position={[AX + 2, 18.6, AZ + 2]} hypothesis opacity={progress(t, 52.6, 53.4) * (1 - progress(t, 60.3, 60.9))}>
            Colores reconstruidos
          </Label3D>
        </group>
      )}

      {/* 7 · Athena Parthenos */}
      {inB(T.athena, T.procession) && (
        <group>
          <Athena high={high} />
          <pointLight position={[15, 9, 3]} color="#ffc37e" intensity={30 * lamp} distance={40} decay={1.5} />
          <pointLight position={[9, 3, -4]} color="#ffb066" intensity={12 * lamp} distance={22} decay={1.5} />
          <Figure position={[STATUE.x + 3.6, S, 2.7]} rotationY={-Math.PI / 2 - 0.3} pose="stand" outfit={{ tunic: PALETTE.dyeRed, robe: true, skin: PALETTE.skinTones[1] }} castShadow={high} />
          <Arrow from={[STATUE.x + 1.2, S + 6, 4.6]} to={[STATUE.x + 1.2, S + 12, 4.6]} progress={progress(t, 65.4, 66.6)} color={ACCENT.greece} thickness={0.05} />
          <Arrow from={[STATUE.x + 1.2, S + 6, 4.6]} to={[STATUE.x + 1.2, S, 4.6]} progress={progress(t, 65.4, 66.6)} color={ACCENT.greece} thickness={0.05} />
          <Label3D position={[STATUE.x + 1.2, S + 6, 5.4]} size="lg" opacity={progress(t, 66.2, 66.8)}>
            ≈ 12 m
          </Label3D>
          <Label3D position={[STATUE.x + 1.5, S + 7.2, -4.2]} opacity={progress(t, 63.6, 64.4)}>
            Atenea Pártenos
          </Label3D>
          <Label3D position={[STATUE.x + 2.2, S + 4.2, 1.6]} size="sm" opacity={progress(t, 67.2, 67.8)}>
            Oro
          </Label3D>
          <Label3D position={[STATUE.x + 1.2, S + 10.4, 1]} size="sm" opacity={progress(t, 67.8, 68.4)}>
            Marfil
          </Label3D>
        </group>
      )}

      {/* 8 · Panathenaic procession */}
      {t >= T.procession && (
        <group>
          <Crowd agents={crowd} time={t - T.procession} castShadow={high} />
          <Particles preset={MOTES} time={t} position={[-110, 6, 20]} density={high ? 1 : 0.5} seed={5} prewarm />
          <Label3D position={[-112, 16, 0]} opacity={progress(t, 73, 73.8) * (1 - progress(t, 77.6, 78.4))}>
            Propileos
          </Label3D>
          <Label3D position={[0, 24, 0]} size="lg" opacity={progress(t, 79.5, 80.5)}>
            Partenón
          </Label3D>
        </group>
      )}
    </Diorama>
  );
}
