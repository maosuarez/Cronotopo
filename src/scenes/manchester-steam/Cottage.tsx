"use client";

import { useMemo } from "react";
import { Figure, Instances, Label3D, matte, PALETTE, Particles, PARTICLES, window01, GEO, type InstanceSpec } from "../kit";
import { Box, Rod, Wheel } from "./parts";

/** Spinning-wheel geometry (local to the cottage set); exported for the match-cut camera. */
export const SPIN_WHEEL = { x: -1.2, y: 0.78, z: 0.6, r: 0.42 };
const LOOM = { x: 1.5, z: -0.7 };
const STONE = "#8b8277";
const PLASTER = "#cdbfa5";

/** Wheel angle of the spinning wheel (rad); the same rate is reused by the engine flywheel at the match cut. */
export const spinAngle = (t: number) => t * 2.6;

function SpinningWheel({ t }: { t: number }) {
  const { x, y, z, r } = SPIN_WHEEL;
  const a = spinAngle(t);
  const treadle = 0.12 * Math.sin(a);
  const flyer = a * 3.2;
  return (
    <group position={[x, 0, z]}>
      {/* slanted bench and legs */}
      <Box p={[0.15, 0.42, 0]} s={[1.1, 0.08, 0.26]} rot={[0, 0, 0.12]} color={PALETTE.wood} />
      <Rod a={[-0.3, 0, 0.1]} b={[-0.3, 0.38, 0.05]} r={0.025} color={PALETTE.woodDark} />
      <Rod a={[0.6, 0, 0.12]} b={[0.6, 0.48, 0.05]} r={0.025} color={PALETTE.woodDark} />
      <Rod a={[0.6, 0, -0.12]} b={[0.6, 0.48, -0.05]} r={0.025} color={PALETTE.woodDark} />
      {/* uprights holding the wheel axle */}
      <Rod a={[0, 0.42, 0.08]} b={[0, y + 0.02, 0.08]} r={0.022} color={PALETTE.woodDark} />
      <Rod a={[0, 0.42, -0.08]} b={[0, y + 0.02, -0.08]} r={0.022} color={PALETTE.woodDark} />
      <group position={[0, y, 0]}>
        <Wheel radius={r} tube={0.025} spokes={6} angle={a} color={PALETTE.wood} hubColor={PALETTE.woodDark} depth={0.03} />
      </group>
      {/* treadle and footman */}
      <Box p={[0.05, 0.08 + treadle * 0.4, 0.22]} s={[0.5, 0.03, 0.14]} rot={[0, 0, treadle]} color={PALETTE.woodDark} />
      <Rod a={[0.05, 0.1 + treadle * 0.4, 0.15]} b={[0.06 * Math.cos(a), y + 0.06 * Math.sin(a), 0.05]} r={0.012} color={PALETTE.woodDark} />
      {/* mother-of-all with the flyer and bobbin, driven by the band */}
      <Rod a={[0.62, 0.48, 0]} b={[0.62, 0.82, 0]} r={0.03} color={PALETTE.woodDark} />
      <group position={[0.62, 0.86, 0]} rotation={[flyer, 0, 0]}>
        <mesh geometry={GEO.box()} material={matte(PALETTE.wood)} scale={[0.2, 0.14, 0.02]} />
        <mesh geometry={GEO.sphere()} material={matte(PALETTE.wool)} scale={[0.12, 0.09, 0.09]} />
      </group>
      <Rod a={[0, y + r, 0]} b={[0.62, 0.9, 0]} r={0.006} color={PALETTE.linen} />
      <Rod a={[0, y - r, 0]} b={[0.62, 0.82, 0]} r={0.006} color={PALETTE.linen} />
      {/* distaff with the wool */}
      <Rod a={[0.72, 0.48, -0.05]} b={[0.85, 1.35, -0.05]} r={0.015} color={PALETTE.woodDark} />
      <mesh geometry={GEO.cone()} material={matte(PALETTE.linen)} position={[0.83, 1.12, -0.05]} scale={[0.16, 0.32, 0.16]} />
      {/* the yarn running from the distaff to the flyer */}
      <Rod a={[0.82, 1.12, -0.05]} b={[0.72, 0.86, 0]} r={0.004} color={PALETTE.linen} />
    </group>
  );
}

function HandLoom({ t, warp }: { t: number; warp: number }) {
  const P = 2.6;
  const cycle = Math.floor(t / P);
  const u = (t % P) / P;
  const dir = cycle % 2 === 0 ? 1 : -1;
  const shuttle = Math.min(1, Math.max(0, u / 0.42));
  const shuttleX = dir * (-0.85 + 1.7 * (shuttle * shuttle * (3 - 2 * shuttle)));
  const beat = window01(u, 0.46, 0.58, 0.6, 0.72);
  const swap = Math.min(1, Math.max(0, (u - 0.75) / 0.2));
  // Heddles swap the two warp sheets after each pick.
  const shedNow = (cycle % 2 === 0 ? 1 : -1) * (1 - 2 * swap) * 0.08;
  const items = useMemo(() => {
    const up: InstanceSpec[] = [];
    const down: InstanceSpec[] = [];
    for (let i = 0; i < warp; i++) {
      const xx = -0.75 + (1.5 * i) / (warp - 1);
      (i % 2 === 0 ? up : down).push({ position: [xx, 0, 0], scale: [0.008, 0.008, 1.25] });
    }
    return { up, down };
  }, [warp]);
  const yWarp = 0.95;
  return (
    <group position={[LOOM.x, 0, LOOM.z]}>
      {/* frame */}
      {[[-1, -0.75], [1, -0.75], [-1, 0.7], [1, 0.7]].map(([sx, zz], i) => (
        <Box key={i} p={[sx * 0.98, 0.95, zz]} s={[0.09, 1.9, 0.09]} color={PALETTE.woodDark} />
      ))}
      <Box p={[-0.98, 1.85, 0]} s={[0.09, 0.09, 1.55]} color={PALETTE.woodDark} />
      <Box p={[0.98, 1.85, 0]} s={[0.09, 0.09, 1.55]} color={PALETTE.woodDark} />
      <Box p={[0, 1.85, -0.1]} s={[2.05, 0.08, 0.08]} color={PALETTE.woodDark} />
      {/* warp beam (back) and breast beam with cloth (front) */}
      <mesh geometry={GEO.cylinder()} material={matte(PALETTE.wood)} position={[-0.95, yWarp - 0.1, -0.7]} rotation={[0, 0, -Math.PI / 2]} scale={[0.14, 1.9, 0.14]} />
      <Box p={[0, 0.88, 0.62]} s={[1.9, 0.08, 0.12]} color={PALETTE.wood} />
      <Box p={[0, 0.89, 0.38]} s={[1.55, 0.02, 0.42]} color={PALETTE.dyeBlue} />
      {/* two sheets of warp threads forming the shed */}
      <group position={[0, yWarp, -0.2]}>
        <group position={[0, shedNow, 0]} rotation={[-shedNow * 1.2, 0, 0]}>
          <Instances geometry={GEO.box()} material={matte(PALETTE.linen)} items={items.up} />
        </group>
        <group position={[0, -shedNow, 0]} rotation={[shedNow * 1.2, 0, 0]}>
          <Instances geometry={GEO.box()} material={matte(PALETTE.linen)} items={items.down} />
        </group>
      </group>
      {/* heddle frames */}
      <Box p={[0, yWarp + 0.25 + shedNow, -0.35]} s={[1.65, 0.05, 0.04]} color={PALETTE.wood} />
      <Box p={[0, yWarp + 0.25 - shedNow, -0.45]} s={[1.65, 0.05, 0.04]} color={PALETTE.wood} />
      <Box p={[0, yWarp - 0.25 + shedNow, -0.35]} s={[1.65, 0.05, 0.04]} color={PALETTE.wood} />
      <Box p={[0, yWarp - 0.25 - shedNow, -0.45]} s={[1.65, 0.05, 0.04]} color={PALETTE.wood} />
      {/* batten swinging from the top rail */}
      <group position={[0, 1.8, -0.1]} rotation={[0.08 + beat * 0.32, 0, 0]}>
        <Box p={[-0.85, -0.45, 0]} s={[0.05, 0.9, 0.05]} color={PALETTE.wood} />
        <Box p={[0.85, -0.45, 0]} s={[0.05, 0.9, 0.05]} color={PALETTE.wood} />
        <Box p={[0, -0.9, 0]} s={[1.8, 0.1, 0.08]} color={PALETTE.wood} />
      </group>
      {/* shuttle */}
      <Box p={[shuttleX, yWarp, 0.05]} s={[0.24, 0.05, 0.07]} color={PALETTE.trunk} />
      {/* bench */}
      <Box p={[0, 0.45, 1.25]} s={[1.3, 0.07, 0.32]} color={PALETTE.wood} />
      <Box p={[-0.55, 0.21, 1.25]} s={[0.07, 0.42, 0.28]} color={PALETTE.woodDark} />
      <Box p={[0.55, 0.21, 1.25]} s={[0.07, 0.42, 0.28]} color={PALETTE.woodDark} />
    </group>
  );
}

/** Set A: a weaver's cottage before the mills (cutaway room: two walls, floor, hearth, window). */
export function Cottage({ t, high }: { t: number; high: boolean }) {
  const flicker = 0.85 + 0.1 * Math.sin(t * 11) + 0.05 * Math.sin(t * 23);
  return (
    <group>
      {/* dark yard around the cutaway room, floor of flagstones */}
      <Box p={[0, -0.12, 0]} s={[80, 0.1, 80]} color="#2a2622" />
      <Box p={[0, -0.05, 0]} s={[8, 0.1, 6]} color={STONE} shadow={high} />
      {/* back wall with a window opening */}
      <Box p={[-1.75, 1.6, -2.6]} s={[3.5, 3.2, 0.25]} color={PLASTER} shadow={high} />
      <Box p={[3.05, 1.6, -2.6]} s={[1.9, 3.2, 0.25]} color={PLASTER} shadow={high} />
      <Box p={[1.05, 0.6, -2.6]} s={[2.1, 1.2, 0.25]} color={PLASTER} shadow={high} />
      <Box p={[1.05, 2.75, -2.6]} s={[2.1, 0.9, 0.25]} color={PLASTER} shadow={high} />
      <Box p={[1.05, 1.75, -2.72]} s={[2.1, 1.1, 0.02]} color="#c9ccd0" emissive="#b8bfc6" emissiveIntensity={0.9} />
      <Box p={[1.05, 1.75, -2.6]} s={[0.05, 1.1, 0.27]} color={PALETTE.woodDark} />
      <Box p={[1.05, 1.75, -2.6]} s={[2.1, 0.05, 0.27]} color={PALETTE.woodDark} />
      <Box p={[1.05, 1.18, -2.45]} s={[2.2, 0.06, 0.18]} color={PALETTE.wood} />
      {/* left wall with the hearth */}
      <Box p={[-4, 1.6, 0]} s={[0.25, 3.2, 5.4]} color={PLASTER} shadow={high} />
      <Box p={[-3.7, 0.65, -0.6]} s={[0.5, 1.3, 1.8]} color={STONE} />
      <Box p={[-3.55, 0.45, -0.6]} s={[0.25, 0.8, 1.1]} color="#2a2420" />
      <Box p={[-3.6, 1.38, -0.6]} s={[0.7, 0.14, 2.0]} color={PALETTE.woodDark} />
      <mesh geometry={GEO.cone()} material={matte("#ff9a45", { emissive: "#ff7a2a", emissiveIntensity: 2.2 })} position={[-3.5, 0.1, -0.6]} scale={[0.4, 0.45 * flicker, 0.4]} />
      <mesh geometry={GEO.cone()} material={matte("#ffd27a", { emissive: "#ffc060", emissiveIntensity: 2.5 })} position={[-3.48, 0.1, -0.45]} scale={[0.2, 0.32 * (2 - flicker), 0.2]} />
      <pointLight position={[-3.1, 0.7, -0.6]} color="#ff9b52" intensity={9 * flicker} distance={9} decay={1.5} />
      <pointLight position={[1.05, 1.9, -1.8]} color="#c8d0d8" intensity={5} distance={7} decay={1.4} />
      {high && <Particles preset={PARTICLES.sparks} time={t} position={[-3.45, 0.3, -0.6]} overrides={{ count: 30, velocity: [0, 1.2, 0], jitter: [0.2, 0.6, 0.3], size: [0.1, 0.04] }} prewarm />}
      {/* ceiling beams (cut) */}
      {[-2.4, -0.4, 1.6].map((x) => (
        <Box key={x} p={[x, 3.15, -0.3]} s={[0.22, 0.24, 5]} color={PALETTE.woodDark} />
      ))}
      {/* shelves, basket of carded wool, stool */}
      <Box p={[-3.8, 2.1, 1.4]} s={[0.35, 0.05, 1.2]} color={PALETTE.wood} />
      <mesh geometry={GEO.cylinder()} material={matte(PALETTE.wool)} position={[-2.6, 0, 1.2]} scale={[0.5, 0.35, 0.5]} />
      <mesh geometry={GEO.sphere()} material={matte(PALETTE.linen)} position={[-2.6, 0.38, 1.2]} scale={[0.45, 0.22, 0.45]} />

      <SpinningWheel t={t} />
      <Box p={[SPIN_WHEEL.x + 1.25, 0.22, SPIN_WHEEL.z]} s={[0.4, 0.44, 0.4]} color={PALETTE.wood} />
      <Figure
        position={[SPIN_WHEEL.x + 1.25, 0, SPIN_WHEEL.z]}
        rotationY={-Math.PI / 2}
        pose="sit"
        t={t}
        outfit={{ tunic: PALETTE.dyeRed, skin: PALETTE.skinTones[4], robe: true, head: "veil", headColor: PALETTE.linen }}
        castShadow={high}
      />
      <HandLoom t={t} warp={high ? 36 : 20} />
      <Figure
        position={[LOOM.x, 0, LOOM.z + 1.25]}
        rotationY={Math.PI}
        pose="sit"
        t={t}
        outfit={{ tunic: PALETTE.wool, skin: PALETTE.skinTones[2], head: "cap", headColor: PALETTE.woodDark }}
        castShadow={high}
      />
      <Label3D position={[SPIN_WHEEL.x, 1.65, SPIN_WHEEL.z]} opacity={window01(t, 1.6, 2.4, 6.2, 7)}>Rueca</Label3D>
      <Label3D position={[LOOM.x, 2.25, LOOM.z]} opacity={window01(t, 2.6, 3.4, 6.6, 7.4)}>Telar manual</Label3D>
    </group>
  );
}
