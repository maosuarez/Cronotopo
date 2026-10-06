"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { PerspectiveCamera } from "three";
import type { SceneProps } from "../types";
import { Crowd, crowdOnPath } from "../kit/Crowd";
import { Label3D } from "../kit/Didactic";
import { Diorama } from "../kit/Diorama";
import { Figure } from "../kit/Figure";
import { clamp, ease, lerp, progress, smoothstep, window01 } from "../kit/math";
import { PALETTE } from "../kit/palette";
import { Particles, PARTICLES } from "../kit/Particles";
import { Atmosphere } from "./Atmosphere";
import { City, Deposit } from "./City";
import { Lightning, ScreenFade } from "./Effects";
import { Landscape, NewGrowth } from "./Landscape";
import { createSceneMaterials } from "./materials";
import { EruptionColumn, SurgeCloud } from "./Puffs";
import { shotAt } from "./shots";
import { ashCover, B, columnAt, depositLevel, depositTop, flashAt, isCut, lightAt, summitMorph, SURGE_DIR, surgeFront, T } from "./story";
import { BAKERY, CURB, LEVEL, MISENUM, VENT, VOLCANO, WIND, ZC, type Rect } from "./world";

const HOLE_START: Rect = { x0: -41, x1: -31, z0: -26, z1: -14 };
const HOLE_END: Rect = { x0: -72, x1: 50, z0: -52, z1: 47 };

/** New vegetation never grows south of the section plane (it would float in the cutaway) nor inside the dig. */
const excludeSouth = (_x: number, z: number) => z > ZC - 1.5;
const excludeExcavated = (x: number, z: number) =>
  excludeSouth(x, z) || (x > HOLE_END.x0 - 2 && x < HOLE_END.x1 + 2 && z > HOLE_END.z0 - 2 && z < HOLE_END.z1 + 2);

function holeAt(t: number): Rect | null {
  if (t < B.excavation.start + 0.6) return null;
  const k = ease.inOut(progress(t, B.excavation.start + 0.6, 85.5));
  return {
    x0: lerp(HOLE_START.x0, HOLE_END.x0, k),
    x1: lerp(HOLE_START.x1, HOLE_END.x1, k),
    z0: lerp(HOLE_START.z0, HOLE_END.z0, k),
    z1: lerp(HOLE_START.z1, HOLE_END.z1, k),
  };
}

/** Veil over the frame: fade in, dips at chosen cuts, the engulfing surge, the final fade. */
function veil(t: number): { color: string; opacity: number; edge: number } {
  const dip = (c: number, w = 0.35) => window01(t, c - w, c, c, c + w);
  if (t < 1) return { color: "#0d0b0a", opacity: 1 - smoothstep(0, 1, t), edge: 0 };
  if (t > 86.6) return { color: "#0d0b0a", opacity: smoothstep(86.6, 88, t), edge: 0 };
  if (t > 55.4 && t < 58.6) {
    const o = t < B.buried.start ? smoothstep(55.4, 56.9, t) : 1 - smoothstep(B.buried.start + 0.2, 58.6, t);
    return { color: "#4b4038", opacity: o, edge: t < B.buried.start ? 1 : 0 };
  }
  const d = Math.max(dip(B.pine.start), dip(B.pumice.start), dip(B.surge.start, 0.5), dip(T.cut), dip(B.excavation.start));
  return { color: "#0d0b0a", opacity: d, edge: 0 };
}

export default function PompeiiVesuvius({ time, quality }: SceneProps) {
  const t = time;
  const high = quality === "high";
  const camera = useThree((s) => s.camera);
  const gl = useThree((s) => s.gl);

  const mats = useMemo(() => createSceneMaterials(), []);
  useLayoutEffect(() => () => mats.dispose(), [mats]);
  useLayoutEffect(() => {
    const prev = gl.localClippingEnabled;
    gl.localClippingEnabled = true;
    return () => {
      gl.localClippingEnabled = prev;
    };
  }, [gl]);

  // camera (pure function of t, applied before the frame is drawn)
  const pose = shotAt(t);
  useLayoutEffect(() => {
    camera.position.set(...pose.pos);
    camera.lookAt(...pose.look);
    if (camera instanceof PerspectiveCamera) {
      camera.far = 1600;
      if (camera.fov !== pose.fov) camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }
  });

  const flash = flashAt(t);
  const light = lightAt(t, flash.k);
  const cut = isCut(t);
  mats.cut.constant = cut ? ZC + 0.01 : 1e6;

  const level = depositLevel(t);
  const top = depositTop(t);
  mats.strataUniforms.uTopA.value.set(top.color);
  mats.strataUniforms.uTopB.value.set(top.to);
  mats.strataUniforms.uTopMix.value = top.mix;
  mats.landUniforms.uLevel.value = level > 0.02 ? level : -100;

  const column = columnAt(t);
  const front = surgeFront(t);
  const ruined = t >= T.ruins;
  const hole = holeAt(t);
  const showCity = !(t >= B.pine.start && t < B.pumice.start); // the bay shot sees the city as a speck: skip it
  const people = t < T.peopleEnd;
  const growth = progress(t, B.centuries.start + 3, B.centuries.end - 0.5);

  const crowds = useMemo(() => {
    const colors = [PALETTE.linen, PALETTE.wool, PALETTE.dyeOchre, PALETTE.dyeRed, PALETTE.dyeBlue, "#e9e1cf"];
    return {
      north: crowdOnPath(7, 20, [[5.2, 0, 21], [5.2, 0, -52]], { speed: 1.05, spread: 0.8, colors }),
      // walking towards the crossing, then east along the main E–W street and out of the city
      south: crowdOnPath(8, 22, [[6.9, 0, -52], [6.9, 0, 19], [90, 0, 19]], { speed: 1.25, spread: 0.6, loop: false, colors }),
      cross: crowdOnPath(9, 26, [[-70, 0, 19.3], [72, 0, 19.3], [72, 0, 20.8], [-70, 0, 20.8], [-70, 0, 19.3]], { speed: 1.1, spread: 0.5, colors }),
      forum: crowdOnPath(10, 30, [[-43, 0.22, -14], [-29, 0.22, -14], [-29, 0.22, 12], [-43, 0.22, 12], [-43, 0.22, -14]], { idle: true, spread: 2.2, colors }),
      forumWalk: crowdOnPath(11, 14, [[-40, 0.22, 14], [-40, 0.22, -16], [-32, 0.22, -16], [-32, 0.22, 14], [-40, 0.22, 14]], { speed: 0.9, spread: 0.6, colors }),
    };
  }, []);
  const stopT = Math.min(t, 12.7);

  const millAngle = t * 0.7;
  const mill: [number, number] = [BAKERY.x0 + 2.6, BAKERY.z0 + 2.3];
  const yearK = progress(t, B.centuries.start + 0.5, B.centuries.end - 0.6);
  const year = Math.round(lerp(79, 1740, yearK ** 1.15) / (yearK > 0.02 ? 10 : 1)) * (yearK > 0.02 ? 10 : 1);

  const lapilliOn = t >= 32 && t < B.surge.start + 0.2;
  const veilNow = veil(t);
  const density = high ? 1 : 0.5;

  return (
    <Diorama quality={quality} bloom={0.5} vignette={0.6}>
      <Atmosphere light={light} camera={pose.pos} time={t} clouds={t < B.pine.start + 9 || t >= B.centuries.start + 3 ? 0.55 : 0} shadows={high} />
      <Landscape
        mats={mats}
        morph={summitMorph(t)}
        ash={ashCover(t)}
        vines={t < 54 || t >= B.centuries.start + 5}
        oldTrees={t < B.buried.start}
        misenum={t >= B.pine.start && t < B.pumice.start}
        shadows={high}
      />
      {showCity && <City mats={mats} t={t} ruined={ruined} roofs={!ruined} shadows={high} />}
      <Deposit mats={mats} level={level} hole={hole} cut={cut} />
      {t >= B.centuries.start && (
        <NewGrowth
          level={level}
          growth={growth}
          shadows={high}
          exclude={ruined ? excludeExcavated : excludeSouth}
        />
      )}

      {/* the eruption: column + umbrella, vent glow, surge, lightning */}
      <EruptionColumn
        time={t}
        count={high ? 420 : 210}
        seed={79}
        light={light}
        flash={flash.k}
        flashPos={flash.bolt?.origin ?? [0, 0, 0]}
        base="#4a4440"
        top="#ece6dc"
        vent={VENT}
        wind={WIND}
        {...column}
      />
      {t >= T.blast && t < B.buried.start && (
        <mesh material={mats.glow} position={[VENT[0], VENT[1] + 3, VENT[2]]} scale={[9 + 2 * Math.sin(t * 9), 4, 9 + 2 * Math.sin(t * 9)]}>
          <sphereGeometry args={[1, 16, 10]} />
        </mesh>
      )}
      {t >= T.surgeLaunch && t < B.buried.start && (
        <SurgeCloud
          time={t}
          count={high ? 360 : 180}
          seed={80}
          light={light}
          flash={flash.k}
          flashPos={flash.bolt?.origin ?? [0, 0, 0]}
          base="#463b33"
          top="#8f857a"
          heat={1.2}
          vent={[VOLCANO.x, 0, VOLCANO.z]}
          dir={SURGE_DIR}
          front={front}
          backLen={270}
        />
      )}
      <Lightning bolt={flash.bolt} intensity={flash.k} />

      {/* pumice (lapilli) fall and fine ash */}
      {lapilliOn && (
        <>
          <Particles
            preset={PARTICLES.ash}
            time={t}
            position={[20, 46, 20]}
            start={32.4}
            end={B.surge.start}
            seed={33}
            density={density}
            overrides={{ count: 2400, life: 3.6, spread: [60, 4, 60], velocity: [0, -14, 0], jitter: [0.8, 1.5, 0.8], wind: [1.0, 0.8], size: [0.2, 0.24], colorStart: "#f2ecdf", colorEnd: "#d3cab8", opacity: 0.95 }}
          />
          <Particles
            preset={PARTICLES.ash}
            time={t}
            position={[20, 30, 20]}
            start={33}
            end={B.surge.start}
            seed={34}
            density={density}
            overrides={{ count: 260, life: 6, spread: [60, 18, 60], velocity: [0, -3, 0], jitter: [1, 0.5, 1], wind: [1.5, 0.6], size: [2.5, 4], colorStart: "#6b5d52", colorEnd: "#5a4e45", opacity: 0.22 }}
          />
        </>
      )}
      {t >= 51 && t < B.buried.start && (
        <Particles preset={PARTICLES.ash} time={t} position={[6, 30, 10]} start={51} seed={35} density={density} overrides={{ count: 700, life: 4, spread: [30, 4, 40], velocity: [0, -8, 0], wind: [0.4, 2.2], size: [0.1, 0.14], colorStart: "#b8ae9e", colorEnd: "#8d8478" }} />
      )}
      {t >= B.buried.start && t < T.cut && (
        <Particles preset={PARTICLES.ash} time={t} position={[0, 40, 0]} start={B.buried.start - 6} seed={36} density={density} overrides={{ count: 500, life: 9, spread: [110, 5, 110], velocity: [0, -4.5, 0], wind: [0.6, 0.3], size: [0.3, 0.4], colorStart: "#d9d3c8", colorEnd: "#bdb6aa", opacity: 0.6 }} />
      )}
      {/* tremor: dust shaken off the roofs along the main street */}
      {t >= T.tremor && t < 16 &&
        [[9.8, 22.5, 1], [2.2, 10, 2], [9.8, 0, 3], [2.2, -18, 4]].map(([x, z, s]) => (
          <Particles key={s} preset={PARTICLES.dust} time={t} position={[x, 4.4, z]} start={T.tremor + s * 0.12} end={T.tremor + 0.9} seed={50 + s} overrides={{ spread: [0.4, 0.1, 3], velocity: [0, -1.2, 0], gravity: 1.5, size: [0.6, 2.2], colorStart: "#d8c7a6", colorEnd: "#e6dccb", opacity: 0.5 }} />
        ))}

      {/* people: only in the living city; after the tremor they stop or leave southwards, out of the city */}
      {people && (
        <>
          {(t < 5 || t >= 8.3) && <Crowd agents={crowds.north} time={stopT} castShadow={high} />}
          {(t < 5 || t >= 8.3) && <Crowd agents={crowds.south} time={t} castShadow={high} />}
          <Crowd agents={crowds.cross} time={stopT} castShadow={high} />
          <Crowd agents={crowds.forum} time={stopT} />
          <Crowd agents={crowds.forumWalk} time={stopT} />
          <Figure position={[mill[0] + Math.cos(millAngle) * 1.5, CURB, mill[1] - Math.sin(millAngle) * 1.5]} rotationY={millAngle + Math.PI} pose="push" t={t} outfit={{ tunic: PALETTE.wool }} castShadow={high} />
          <Figure position={[BAKERY.x1 - 4.4, CURB, BAKERY.z0 + 2.4]} rotationY={Math.PI / 2} pose="work" t={t * 0.8} outfit={{ tunic: PALETTE.linen, head: "cap", headColor: "#e9e1cf" }} castShadow={high} />
          <Figure position={[BAKERY.x0 - 0.7, CURB, BAKERY.z0 + 3.2]} rotationY={Math.PI / 2} pose="stand" t={t} outfit={{ tunic: PALETTE.dyeRed, robe: true, head: "veil", headColor: "#d8c9a8", skin: PALETTE.skinTones[2] }} castShadow={high} />
        </>
      )}

      {/* in-world labels */}
      <Label3D position={[-36, 11, -24]} opacity={window01(t, 0.8, 1.4, 4.4, 4.9)}>Foro</Label3D>
      <Label3D position={[VOLCANO.x, VOLCANO.h + 22, VOLCANO.z]} opacity={window01(t, 1.2, 1.8, 4.4, 4.9)}>Vesubio</Label3D>
      <Label3D position={[13, 3.6, -1]} opacity={window01(t, 5.5, 6.0, 7.8, 8.25)} size="sm">Panadería · molinos de piedra volcánica</Label3D>
      <Label3D position={[6, 1.1, 25.2]} opacity={window01(t, 8.9, 9.4, 11.6, 12.1)} size="sm">Pasos de piedra</Label3D>
      <Label3D position={[-230, 150, -330]} opacity={window01(t, 18.6, 19.2, 22.4, 22.9)}>24 de agosto del 79 · fecha tradicional</Label3D>
      <Label3D position={[-230, 105, -330]} opacity={window01(t, 19.4, 20.0, 22.4, 22.9)} hypothesis>¿24 de octubre? · indicios recientes</Label3D>
      <Label3D position={[VOLCANO.x, VOLCANO.h + 18, VOLCANO.z]} opacity={window01(t, 24.6, 25.2, 31.2, 31.7)} size="sm">Vesubio</Label3D>
      <Label3D position={[0, 14, 0]} opacity={window01(t, 25.4, 26, 31.2, 31.7)} size="sm">Pompeya</Label3D>
      <Label3D position={[MISENUM.x - 12, 31, MISENUM.z - 4]} opacity={window01(t, 26.2, 26.8, 31.2, 31.7)} size="sm">Miseno · Plinio el Joven</Label3D>
      <Label3D position={[-26, 1.3, ZC + 0.6]} opacity={window01(t, 62, 62.6, 76.4, 76.8)} size="sm">Piedra pómez</Label3D>
      <Label3D position={[-26, (LEVEL.pumice + LEVEL.flow) / 2, ZC + 0.6]} opacity={window01(t, 62.8, 63.4, 76.4, 76.8)} size="sm">Depósitos de las corrientes piroclásticas</Label3D>
      <Label3D position={[-26, -0.6, ZC + 0.6]} opacity={window01(t, 63.6, 64.2, 76.4, 76.8)} size="sm" tone="dark">Calles y casas del 79 d.C.</Label3D>
      <Label3D position={[-26, LEVEL.flow + 0.55, ZC + 0.6]} opacity={window01(t, 70, 70.5, 76.4, 76.8)} size="sm">Suelo nuevo</Label3D>
      <Label3D position={[-10, 15, ZC - 6]} opacity={window01(t, B.centuries.start + 0.4, B.centuries.start + 0.9, 76.4, 76.8)} size="lg">{yearK < 0.02 ? "Año 79 d.C." : `Año ${year}`}</Label3D>
      <Label3D position={[-36, 14, -20]} opacity={window01(t, 78, 78.6, 83.4, 84)} size="lg">1748 · comienzan las excavaciones</Label3D>
      <Label3D position={[-36, 9, -24]} opacity={window01(t, 84.4, 85, 86.4, 86.9)} size="sm">Foro · Templo de Júpiter</Label3D>
      <Label3D position={[VOLCANO.x, VOLCANO.h * 0.85 + 20, VOLCANO.z]} opacity={window01(t, 84.8, 85.4, 86.4, 86.9)} size="sm">Vesubio</Label3D>

      <ScreenFade color={veilNow.color} opacity={clamp(veilNow.opacity)} edge={veilNow.edge} />
    </Diorama>
  );
}
