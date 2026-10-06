"use client";

import { useLayoutEffect, useMemo } from "react";
import { CylinderGeometry, MeshBasicMaterial } from "three";
import {
  ACCENT,
  Arrow,
  cached,
  createRng,
  Crowd,
  crowdOnPath,
  Figure,
  GEO,
  Instances,
  Label3D,
  matte,
  PALETTE,
  Particles,
  PARTICLES,
  smoothstep,
  Water,
  window01,
  type CrowdAgent,
  type InstanceSpec,
} from "../kit";
import { Box, Rod } from "./parts";

/** Main mill: six storeys beside the canal. Front facade faces +Z. */
export const MILL = { w: 50, d: 14, floors: 6, floorH: 3.2, chimney: [34, -4] as const, chimneyH: 55 };
const MILL_H = MILL.floors * MILL.floorH;
const CANAL_Z = 22;
export const TRACK_Z = 42;
const STATION_X = -24;
const LIT = "#ffc677";
const DARK_GLASS = "#2a2b2f";
const BRICKS = ["#7f4231", "#8e4a35", "#74402f", "#94553d"];

const chimneyGeo = () => cached("ms-chimney", () => new CylinderGeometry(0.32, 0.5, 1, 10).translate(0, 0.5, 0));

/** Unlit window material: instance colours switch between dark glass and gaslight. */
function useWindowMaterial() {
  const mat = useMemo(() => new MeshBasicMaterial({ color: "#ffffff", toneMapped: false }), []);
  useLayoutEffect(() => () => mat.dispose(), [mat]);
  return mat;
}

/** When window `i` on floor `f` lights up (beat "mill": ground floor first). */
const lightTime = (f: number, i: number) => 45.4 + f * 1.15 + ((i * 37) % 11) / 11 * 0.8;

function MainMill({ t, windowMat, high }: { t: number; windowMat: MeshBasicMaterial; high: boolean }) {
  const lightKey = t < 45 ? -1 : t > 53.5 ? 99 : Math.floor(t * 8);
  const windows = useMemo(() => {
    const out: InstanceSpec[] = [];
    const cols = 20;
    for (let f = 0; f < MILL.floors; f++) {
      const y = f * MILL.floorH + 1.0;
      for (let i = 0; i < cols; i++) {
        const lit = t >= lightTime(f, i) ? LIT : DARK_GLASS;
        const x = -MILL.w / 2 + 2.2 + (i * (MILL.w - 4.4)) / (cols - 1);
        out.push({ position: [x, y, MILL.d / 2 + 0.06], scale: [1.1, 1.7, 0.05], color: lit });
        out.push({ position: [x, y, -MILL.d / 2 - 0.06], scale: [1.1, 1.7, 0.05], color: lit });
      }
      for (let i = 0; i < 5; i++) {
        const lit = t >= lightTime(f, i + 3) ? LIT : DARK_GLASS;
        const z = -MILL.d / 2 + 2 + i * ((MILL.d - 4) / 4);
        out.push({ position: [-MILL.w / 2 - 0.06, y, z], scale: [0.05, 1.7, 1.1], color: lit });
        out.push({ position: [MILL.w / 2 + 0.06, y, z], scale: [0.05, 1.7, 1.1], color: lit });
      }
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightKey]);
  const [cx, cz] = MILL.chimney;
  return (
    <group>
      <Box p={[0, MILL_H / 2, 0]} s={[MILL.w, MILL_H, MILL.d]} color={PALETTE.brick} shadow={high} />
      {/* string courses between floors, cornice and slate roof */}
      {Array.from({ length: MILL.floors }, (_, f) => (
        <Box key={f} p={[0, f * MILL.floorH + 0.02, 0]} s={[MILL.w + 0.3, 0.18, MILL.d + 0.3]} color="#6d3a2b" />
      ))}
      <Box p={[0, MILL_H + 0.2, 0]} s={[MILL.w + 0.6, 0.4, MILL.d + 0.6]} color="#5d3326" />
      <mesh geometry={GEO.box()} material={matte("#3b3a3d")} position={[0, MILL_H + 1.2, 0]} rotation={[Math.PI / 4, 0, 0]} scale={[MILL.w, 2.2, 2.2]} />
      {/* stair and privy tower, door */}
      <Box p={[-8, (MILL_H + 3) / 2, MILL.d / 2 + 2]} s={[5, MILL_H + 3, 4]} color="#86472f" shadow={high} />
      <Box p={[-8, 1.5, MILL.d / 2 + 4.03]} s={[2, 3, 0.05]} color="#16130f" />
      <Instances geometry={GEO.box()} material={windowMat} items={windows} />
      {/* engine house and chimney */}
      <Box p={[MILL.w / 2 + 4, 6, -2]} s={[8, 12, 9]} color="#86472f" shadow={high} />
      <mesh geometry={chimneyGeo()} material={matte("#6a3729")} position={[cx, 0, cz]} scale={[6, MILL.chimneyH, 6]} castShadow={high} />
      <Box p={[cx, MILL.chimneyH, cz]} s={[2.6, 0.7, 2.6]} color="#4a2a20" />
    </group>
  );
}

type Building = { kind: "terrace" | "mill"; x: number; z: number; w: number; d: number; h: number; color: string; appear: number };

/** Seeded city layout around the first mill. `appear` = scene second at which it rises (time-lapse). */
function cityLayout(dense: boolean): Building[] {
  const rng = createRng(1830);
  const out: Building[] = [];
  const reach = dense ? 230 : 170;
  for (let gx = -11; gx <= 11; gx++) {
    for (let gz = -12; gz <= 6; gz++) {
      const bx = gx * 22;
      const bz = gz * 19;
      const dist = Math.hypot(bx, bz);
      if (dist > reach) continue;
      if (Math.abs(bx) < 50 && bz > -26 && bz < 30) continue; // mill, street and canal
      if (bz > 24 && bz < 60 && bx < 30) continue; // railway corridor and station
      if (bz > 6 && bz < 30) continue; // street and canal strip
      const old = dist < 75 && rng.next() < 0.35;
      const appear = old ? -1 : 54.6 + Math.min(1, dist / reach) * 7.6 + rng.range(0, 1.1);
      if (rng.next() < 0.09 && dist > 60) {
        out.push({ kind: "mill", x: bx + rng.range(-2, 2), z: bz, w: rng.range(26, 36), d: 12, h: rng.range(13, 20), color: rng.pick(BRICKS), appear });
        continue;
      }
      for (const row of [-4.2, 4.2]) {
        const len = rng.range(15, 19);
        out.push({ kind: "terrace", x: bx + rng.range(-1, 1), z: bz + row, w: len, d: 5, h: rng.range(5.6, 7), color: rng.pick(BRICKS), appear: appear + rng.range(0, 0.4) });
      }
    }
  }
  return out;
}

function CityGrowth({ t, windowMat, high }: { t: number; windowMat: MeshBasicMaterial; high: boolean }) {
  const layout = useMemo(() => cityLayout(high), [high]);
  const key = t < 54.5 ? -1 : t > 64.5 ? 999 : Math.round(t * 20);
  const sets = useMemo(() => {
    const bodies: InstanceSpec[] = [];
    const roofs: InstanceSpec[] = [];
    const bands: InstanceSpec[] = [];
    const stacks: InstanceSpec[] = [];
    const smokers: { pos: [number, number, number]; g: number }[] = [];
    const now = key === -1 ? 54 : key === 999 ? 65 : key / 20;
    for (const b of layout) {
      const g = b.appear < 0 ? 1 : smoothstep(b.appear, b.appear + 0.8, now);
      if (g <= 0.002) continue;
      const h = b.h * g;
      bodies.push({ position: [b.x, 0, b.z], scale: [b.w, h, b.d], color: b.color });
      if (b.kind === "terrace") {
        roofs.push({ position: [b.x, h, b.z], rotation: [Math.PI / 4, 0, 0], scale: [b.w + 0.3, 2.6 * g, 2.6 * g], color: "#3d3b3e" });
      } else {
        for (let f = 0; f < Math.floor(h / 3.2); f++) {
          bands.push({ position: [b.x, f * 3.2 + 1.5, b.z + b.d / 2 + 0.05], scale: [b.w - 2, 1.2, 0.05], color: LIT });
          bands.push({ position: [b.x, f * 3.2 + 1.5, b.z - b.d / 2 - 0.05], scale: [b.w - 2, 1.2, 0.05], color: LIT });
        }
        const sh = (b.h * 2.4) * g;
        stacks.push({ position: [b.x + b.w / 2 + 3, 0, b.z], scale: [4, sh, 4], color: "#5e3226" });
        smokers.push({ pos: [b.x + b.w / 2 + 3, sh, b.z], g });
      }
    }
    return { bodies, roofs, bands, stacks, smokers };
  }, [layout, key]);
  const maxSmoke = high ? 7 : 3;
  return (
    <group>
      <Instances geometry={GEO.boxBase()} material={matte()} items={sets.bodies} castShadow={high} receiveShadow={high} />
      <Instances geometry={GEO.box()} material={matte()} items={sets.roofs} />
      {sets.bands.length > 0 && <Instances geometry={GEO.box()} material={windowMat} items={sets.bands} />}
      {sets.stacks.length > 0 && <Instances geometry={chimneyGeo()} material={matte()} items={sets.stacks} />}
      {sets.smokers.slice(0, maxSmoke).map((s, i) => (
        <Particles
          key={i}
          preset={PARTICLES.smoke}
          time={t}
          seed={40 + i}
          position={s.pos}
          intensity={smoothstep(0.7, 1, s.g) * 0.9}
          density={high ? 0.6 : 0.3}
          overrides={{ size: [3, 14], velocity: [0, 3, 0], jitter: [0.5, 0.5, 0.5], wind: [1.4, 0.3], life: 9, colorStart: "#2f2c2a", colorEnd: "#7d776f", opacity: 0.45 }}
          prewarm
        />
      ))}
    </group>
  );
}

/** Railway 1830: double track west to Liverpool, station, locomotive with tender and carriages. */
const trainTravel = (t: number) => (t < 66.5 ? 0 : 0.45 * (t - 66.5) ** 2);
const trainSpeed = (t: number) => (t < 66.5 ? 0 : 0.9 * (t - 66.5));

function Locomotive({ travel }: { travel: number }) {
  const drive = travel / 0.72;
  const small = travel / 0.4;
  const yellow = "#c79a3a";
  const black = "#24221f";
  return (
    <group>
      <Box p={[2.2, 0.75, 0]} s={[4.4, 0.18, 1.5]} color={black} />
      <mesh geometry={GEO.cylinder()} material={matte(yellow, { flat: false })} position={[0.5, 1.6, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.1, 2.8, 1.1]} />
      <Box p={[3.7, 1.55, 0]} s={[0.9, 1.3, 1.25]} color={yellow} />
      <mesh geometry={GEO.cylinder()} material={matte(black)} position={[0.6, 2.1, 0]} scale={[0.36, 2.1, 0.36]} />
      <mesh geometry={GEO.cylinder()} material={matte(black)} position={[0.6, 4.1, 0]} scale={[0.5, 0.18, 0.5]} />
      {[-0.74, 0.74].map((z) => (
        <group key={z}>
          <group position={[1.0, 0.72, z]} rotation={[0, 0, drive]}>
            <mesh geometry={cached("ms-loco-wheel", () => new CylinderGeometry(0.72, 0.72, 0.08, 18).rotateX(Math.PI / 2))} material={matte(yellow)} />
            <Box p={[0, 0, 0.05]} s={[1.3, 0.08, 0.04]} color={black} />
            <Box p={[0, 0, 0.05]} s={[0.08, 1.3, 0.04]} color={black} />
          </group>
          <group position={[3.4, 0.4, z]} rotation={[0, 0, small]}>
            <mesh geometry={cached("ms-loco-wheel-s", () => new CylinderGeometry(0.4, 0.4, 0.08, 14).rotateX(Math.PI / 2))} material={matte(yellow)} />
          </group>
          {/* inclined cylinder driving the crank */}
          <Rod a={[3.2, 1.9, z * 1.05]} b={[1.6, 1.0, z * 1.05]} r={0.13} color={black} />
          <Rod a={[1.6, 1.0, z * 1.1]} b={[1.0 + 0.35 * Math.cos(drive), 0.72 + 0.35 * Math.sin(drive), z * 1.1]} r={0.04} color="#777" />
        </group>
      ))}
      {/* tender with coal and water barrel */}
      <Box p={[5.6, 0.9, 0]} s={[2.4, 0.9, 1.5]} color="#5b4630" />
      <mesh geometry={GEO.cylinder()} material={matte("#6b5338")} position={[5.0, 1.35, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[1.0, 1.3, 1.0]} />
      <mesh geometry={GEO.rock()} material={matte(PALETTE.soot)} position={[6.3, 1.45, 0]} scale={[0.9, 0.4, 1.1]} />
      {[4.9, 6.3].map((x) => [-0.74, 0.74].map((z) => (
        <mesh key={`${x}${z}`} geometry={cached("ms-loco-wheel-s", () => new CylinderGeometry(0.4, 0.4, 0.08, 14).rotateX(Math.PI / 2))} material={matte(black)} position={[x, 0.4, z]} />
      )))}
    </group>
  );
}

function Carriage({ x, open, seed }: { x: number; open: boolean; seed: number }) {
  const rng = createRng(seed);
  const body = open ? "#6d5a42" : seed % 2 ? "#3f5a4a" : "#c9a24a";
  return (
    <group position={[x, 0, 0]}>
      <Box p={[2.6, 0.75, 0]} s={[5.2, 0.16, 1.7]} color="#2a2724" />
      {open ? (
        <>
          <Box p={[2.6, 1.15, 0]} s={[5.0, 0.7, 1.7]} color={body} />
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={i} geometry={GEO.sphere()} material={matte(PALETTE.skinTones[rng.int(0, 4)])} position={[0.6 + (i % 4) * 1.2, 1.75, i < 4 ? -0.4 : 0.4]} scale={0.24} />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <mesh key={`b${i}`} geometry={GEO.box()} material={matte(rng.pick([PALETTE.dyeBlue, PALETTE.wool, PALETTE.soot, PALETTE.dyeRed]))} position={[0.6 + (i % 4) * 1.2, 1.4, i < 4 ? -0.4 : 0.4]} scale={[0.36, 0.5, 0.3]} />
          ))}
        </>
      ) : (
        [0.9, 2.6, 4.3].map((cx) => (
          <group key={cx}>
            <Box p={[cx, 1.45, 0]} s={[1.6, 1.3, 1.7]} color={body} />
            <Box p={[cx, 1.6, 0.86]} s={[0.8, 0.5, 0.02]} color="#1d1c1b" />
            <Box p={[cx, 2.15, 0]} s={[1.5, 0.14, 1.6]} color="#2b2826" />
          </group>
        ))
      )}
      {[0.9, 4.3].map((wx) => [-0.74, 0.74].map((z) => (
        <mesh key={`${wx}${z}`} geometry={cached("ms-loco-wheel-s", () => new CylinderGeometry(0.4, 0.4, 0.08, 14).rotateX(Math.PI / 2))} material={matte("#1e1c1a")} position={[wx, 0.4, z]} />
      )))}
    </group>
  );
}

function Railway({ t, high }: { t: number; high: boolean }) {
  const travel = trainTravel(t);
  const headX = STATION_X - travel;
  const sleepers = useMemo<InstanceSpec[]>(() => {
    const out: InstanceSpec[] = [];
    const step = high ? 1 : 2;
    for (let x = 20; x > -320; x -= step) {
      out.push({ position: [x, 0.08, TRACK_Z], scale: [0.35, 0.12, 2.6] });
      out.push({ position: [x, 0.08, TRACK_Z - 4], scale: [0.35, 0.12, 2.6] });
    }
    return out;
  }, [high]);
  const onlookers = useMemo<CrowdAgent[]>(() => {
    const colors = [PALETTE.dyeRed, PALETTE.dyeBlue, PALETTE.wool, PALETTE.soot, PALETTE.linen, PALETTE.dyeGreen];
    return [
      ...crowdOnPath(7, high ? 26 : 14, [[-6, 0.6, TRACK_Z + 3], [-40, 0.6, TRACK_Z + 3]], { idle: true, spread: 0.8, colors }),
      ...crowdOnPath(8, high ? 30 : 14, [[-48, 0, TRACK_Z + 4.5], [-130, 0, TRACK_Z + 4.5]], { idle: true, spread: 1.4, colors }),
      ...crowdOnPath(9, high ? 24 : 10, [[-70, 0, TRACK_Z - 9], [-140, 0, TRACK_Z - 9]], { idle: true, spread: 1.4, colors }),
    ];
  }, [high]);
  const v = trainSpeed(t);
  return (
    <group>
      {/* embankment, sleepers and rails */}
      <Box p={[-150, 0.02, TRACK_Z - 2]} s={[340, 0.06, 10]} color="#6a6157" />
      <Instances geometry={GEO.box()} material={matte("#4a3a2c")} items={sleepers} />
      {[TRACK_Z - 0.72, TRACK_Z + 0.72, TRACK_Z - 4.72, TRACK_Z - 3.28].map((z) => (
        <Box key={z} p={[-150, 0.2, z]} s={[340, 0.1, 0.08]} color="#8c8f94" />
      ))}
      {/* Manchester terminus and platform */}
      <Box p={[-26, 0.3, TRACK_Z + 3]} s={[34, 0.6, 3.4]} color="#8a8278" />
      <Box p={[-26, 4.5, TRACK_Z + 9]} s={[24, 9, 7]} color="#c4b394" shadow={high} />
      <Box p={[-26, 9.2, TRACK_Z + 9]} s={[24.6, 0.4, 7.6]} color="#7d6b55" />
      {[-34, -30, -26, -22, -18].map((x) => [2.2, 5.6].map((y) => (
        <Box key={`${x}${y}`} p={[x, y, TRACK_Z + 5.47]} s={[1.2, 1.8, 0.05]} color="#2b2a2c" />
      )))}
      <Crowd agents={onlookers} time={t} castShadow={false} />
      {/* the train leaves the station heading west */}
      <group position={[headX, 0.2, TRACK_Z]}>
        <Locomotive travel={travel} />
        <Carriage x={7.6} open={false} seed={1} />
        <Carriage x={13.4} open={false} seed={2} />
        <Carriage x={19.2} open seed={3} />
        <Carriage x={25.0} open seed={4} />
      </group>
      <Particles
        preset={PARTICLES.steam}
        time={t}
        seed={77}
        position={[headX + 0.6, 4.5, TRACK_Z]}
        density={high ? 1 : 0.5}
        overrides={{ count: 160, life: 3.2, velocity: [v * 0.85, 1.8, 0], jitter: [0.6, 0.5, 0.6], size: [0.9, 4.2], wind: [0.4, 0.2], opacity: 0.55, colorEnd: "#c9c4bc" }}
        prewarm
      />
      <Label3D position={[-26, 11.2, TRACK_Z + 9]} opacity={window01(t, 66, 67, 74.6, 75.6)}>Mánchester, 1830</Label3D>
      <Arrow from={[-70, 0.9, TRACK_Z - 2]} to={[-110, 0.9, TRACK_Z - 2]} progress={window01(t, 68.5, 70.5, 75, 75.8)} color={ACCENT.industrial} thickness={0.18} />
      <Label3D position={[-100, 3.2, TRACK_Z - 2]} opacity={window01(t, 69, 70, 75, 75.8)}>Hacia Liverpool</Label3D>
    </group>
  );
}

/** Street → stair-tower door → inside the mill (agents vanish behind the facade). */
const DOOR_PATH: [number, number, number][] = [[-50, 0, 13.9], [-12, 0, 13.6], [-8, 0, 12.4], [-8, 0, 5]];

/** Shift going in at the mill door under falling soot (closing beat). */
function ShiftChange({ t, high }: { t: number; high: boolean }) {
  const adults = useMemo(
    () => crowdOnPath(21, high ? 26 : 14, DOOR_PATH, { speed: 1.05, spread: 0.7, colors: [PALETTE.wool, PALETTE.soot, "#4f4a44", PALETTE.dyeBlue, "#6b5d4a", PALETTE.linen] }),
    [high],
  );
  const children = useMemo(
    () => crowdOnPath(22, high ? 10 : 6, DOOR_PATH, { speed: 1.1, spread: 0.6, colors: [PALETTE.linen, PALETTE.wool, "#5d5348"] }).map((a) => ({ ...a, scale: 0.62 + (a.scale ?? 1) * 0.05 - 0.05 })),
    [high],
  );
  return (
    <group>
      <Crowd agents={adults} time={t} castShadow={high} />
      <Crowd agents={children} time={t} castShadow={high} />
      {/* a still figure at the door: the overlooker */}
      <Figure position={[-5.8, 0, 12.2]} rotationY={-0.6} pose="stand" t={t} outfit={{ tunic: "#2f2c29", head: "hat", headColor: "#1c1a18" }} castShadow={high} />
    </group>
  );
}

/** Set D: the city (main mill, canal, growth time-lapse, railway, street). Sub-parts are mounted by time window. */
export function City({ t, high }: { t: number; high: boolean }) {
  const windowMat = useWindowMaterial();
  const showRail = t >= 64.4 && t < 76.6;
  const showStreet = t >= 75.4;
  const bargeX = -60 + 1.4 * (t - 44);
  const [cx, cz] = MILL.chimney;
  const smokeBoost = smoothstep(54, 64, t);
  return (
    <group>
      {/* ground, cobbled street, canal with stone banks */}
      <Box p={[0, -0.1, 0]} s={[900, 0.2, 900]} color="#57514a" shadow={high} />
      <Box p={[0, 0.01, 14.5]} s={[160, 0.04, 7]} color="#6c665e" />
      <Box p={[0, -0.2, CANAL_Z]} s={[300, 0.4, 7.4]} color="#35322f" />
      <Water time={t} width={300} depth={6.4} position={[0, -0.25, CANAL_Z]} shallow="#66726f" deep="#36403f" sky="#b3a998" wave={0.03} />
      <Box p={[0, 0.1, CANAL_Z - 3.5]} s={[300, 0.5, 0.5]} color="#7c756c" />
      <Box p={[0, 0.1, CANAL_Z + 3.5]} s={[300, 0.5, 0.5]} color="#7c756c" />
      {t < 56 && (
        <group position={[bargeX, 0, CANAL_Z]}>
          <Box p={[0, 0.15, 0]} s={[14, 0.9, 2.2]} color="#3a2c20" />
          <Box p={[0.8, 0.8, 0]} s={[10, 0.5, 1.9]} color="#e8e1cf" />
          <Figure position={[-6.3, 0.6, 0]} rotationY={Math.PI / 2} pose="stand" t={t} outfit={{ tunic: PALETTE.wool, head: "cap", headColor: PALETTE.soot }} />
        </group>
      )}

      <MainMill t={t} windowMat={windowMat} high={high} />
      <Particles
        preset={PARTICLES.smoke}
        time={t}
        seed={9}
        position={[cx, MILL.chimneyH + 0.5, cz]}
        density={high ? 1 : 0.45}
        overrides={{ size: [6, 34], velocity: [0, 4, 0], jitter: [0.8, 0.8, 0.8], wind: [1.6, 0.4], life: 13, colorStart: "#2a2725", colorEnd: "#77716a", opacity: 0.65 + 0.2 * smokeBoost }}
        prewarm
      />
      <CityGrowth t={t} windowMat={windowMat} high={high} />
      {showRail && <Railway t={t} high={high} />}
      {showStreet && <ShiftChange t={t} high={high} />}
      {showStreet && (
        <Particles
          preset={PARTICLES.ash}
          time={t}
          seed={31}
          position={[-12, 9, 14]}
          density={high ? 1 : 0.45}
          overrides={{ count: 520, spread: [18, 4, 9], velocity: [0, -0.9, 0], jitter: [0.3, 0.2, 0.3], size: [0.08, 0.16], colorStart: "#3b3734", colorEnd: "#55504b", opacity: 0.85, life: 10, wind: [0.15, 0.05] }}
          prewarm
        />
      )}
      <Label3D position={[-20, 45, -30]} size="lg" opacity={window01(t, 58.5, 59.8, 64.2, 64.9)}>Cottonopolis</Label3D>
    </group>
  );
}
