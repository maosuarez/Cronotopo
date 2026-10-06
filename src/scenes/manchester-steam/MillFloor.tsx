"use client";

import { useMemo } from "react";
import { ACCENT, Arrow, Figure, GEO, Instances, Label3D, matte, PALETTE, Particles, PARTICLES, smoothstep, window01, type InstanceSpec } from "../kit";
import { enginePose } from "./mechanism";
import { Box, Rod, Wheel } from "./parts";

const SHAFT_Y = 3.5;
const PULLEY_R = 0.45;
const MULE_PULLEY_R = 0.25;
const BEAM_Z = 5.0;
const MULE_LEN = 4.4;
const PULLEYS = [-15, -10, -5, 0, 5, 10, 15];
const IRON = "#3f4146";
const FLOOR = "#7a6248";

type Mule = { x: number; side: 1 | -1; phase: number };

/** Carriage travel 0..1 (out while drawing and twisting, then winding back in), period 7 s. */
function draw(t: number, phase: number) {
  const u = (((t + phase) % 7) + 7) % 7 / 7;
  if (u < 0.55) return smoothstep(0, 0.55, u);
  if (u < 0.65) return 1;
  if (u < 0.92) return 1 - smoothstep(0.65, 0.92, u);
  return 0;
}

/** Set C: one floor of a cotton mill. Line shaft (turning with the engine) → belts → spinning mules. */
export function MillFloor({ t, high }: { t: number; high: boolean }) {
  const shaftAngle = enginePose(t).flywheel * 1.6;
  const spindles = high ? 22 : 12;
  const mules = useMemo<Mule[]>(() => PULLEYS.flatMap((x, i) => [
    { x, side: -1 as const, phase: i * 1.3 },
    { x, side: 1 as const, phase: i * 1.3 + 3.1 },
  ]), []);

  const { carriages, spindleItems, threads } = (() => {
    const carriages: { x: number; z: number; side: number }[] = [];
    const spindleItems: InstanceSpec[] = [];
    const threads: InstanceSpec[] = [];
    for (const m of mules) {
      const reach = 0.5 + 1.7 * draw(t, m.phase);
      const cz = m.side * (BEAM_Z - reach);
      carriages.push({ x: m.x, z: cz, side: m.side });
      for (let k = 0; k < spindles; k++) {
        const sx = m.x - MULE_LEN / 2 + 0.2 + (k / (spindles - 1)) * (MULE_LEN - 0.4);
        spindleItems.push({ position: [sx, 0.85, cz], rotation: [m.side * 0.15, 0, 0], scale: [0.025, 0.3, 0.025] });
        const z0 = m.side * BEAM_Z;
        const y0 = 1.08;
        const y1 = 1.12;
        const len = Math.hypot(z0 - cz, y1 - y0);
        threads.push({ position: [sx, (y0 + y1) / 2, (z0 + cz) / 2], rotation: [m.side * Math.atan2(y1 - y0, Math.abs(z0 - cz)), 0, 0], scale: [0.006, 0.006, len] });
      }
    }
    return { carriages, spindleItems, threads };
  })();

  const windows = useMemo(() => {
    const out: number[] = [];
    for (let x = -18.75; x <= 18.76; x += 2.5) out.push(x);
    return out;
  }, []);

  return (
    <group>
      {/* floor, ceiling with joists */}
      <Box p={[0, -0.05, 0]} s={[42, 0.1, 13]} color={FLOOR} shadow={high} />
      <Box p={[0, 4.3, 0]} s={[42, 0.2, 13]} color="#6b5a48" />
      {[-4, 0, 4].map((z) => (
        <Box key={z} p={[0, 4.12, z]} s={[42, 0.18, 0.3]} color="#4e4034" />
      ))}
      {/* side walls with tall windows */}
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box p={[0, 0.5, s * 6.3]} s={[42, 1.0, 0.4]} color={PALETTE.brick} />
          <Box p={[0, 3.85, s * 6.3]} s={[42, 0.9, 0.4]} color={PALETTE.brick} />
          {windows.map((x) => (
            <Box key={x} p={[x + 1.25, 2.2, s * 6.3]} s={[0.8, 2.4, 0.4]} color={PALETTE.brick} />
          ))}
          {windows.map((x) => (
            <Box key={`g${x}`} p={[x, 2.2, s * 6.45]} s={[1.7, 2.4, 0.04]} color="#cfd2d3" emissive="#c1c7cb" emissiveIntensity={0.85} />
          ))}
        </group>
      ))}
      {/* end wall with the drive from the engine house */}
      <Box p={[-21, 2.1, 0]} s={[0.4, 4.4, 13]} color={PALETTE.brick} />
      <group position={[-20.4, SHAFT_Y - 0.4, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wheel radius={1.5} tube={0.12} spokes={6} angle={shaftAngle * 0.33} color={IRON} />
      </group>
      <group position={[-20.1, SHAFT_Y, 0]} rotation={[0, Math.PI / 2, 0]}>
        <Wheel radius={0.6} tube={0.08} spokes={4} angle={-shaftAngle} color={PALETTE.brass} />
      </group>

      {/* cast-iron columns */}
      {[-1, 1].map((s) =>
        [-17.5, -12.5, -7.5, -2.5, 2.5, 7.5, 12.5, 17.5].map((x) => (
          <mesh key={`${s}${x}`} geometry={GEO.cylinder()} material={matte(IRON, { flat: false })} position={[x, 0, s * 2.3]} scale={[0.22, 4.2, 0.22]} />
        )),
      )}

      {/* line shaft with hangers and pulleys */}
      <Rod a={[-20.2, SHAFT_Y, 0]} b={[20, SHAFT_Y, 0]} r={0.07} color="#7b7e84" />
      {PULLEYS.map((x) => (
        <group key={x}>
          <Box p={[x - 0.6, (SHAFT_Y + 4.1) / 2, 0]} s={[0.1, 4.1 - SHAFT_Y, 0.1]} color={IRON} />
          <group position={[x, SHAFT_Y, 0]} rotation={[0, Math.PI / 2, 0]}>
            <Wheel radius={PULLEY_R} tube={0.06} spokes={4} angle={shaftAngle} color="#8a6a45" hubColor={IRON} depth={0.2} />
          </group>
        </group>
      ))}

      {/* belts, mules */}
      {mules.map((m, i) => {
        const dy = 1.3 - SHAFT_Y;
        const dz = m.side * 4.6;
        const L = Math.hypot(dy, dz);
        const ny = dz / L;
        const nz = -dy / L;
        const c = carriages[i];
        return (
          <group key={i}>
            <Rod a={[m.x, SHAFT_Y + PULLEY_R * ny, PULLEY_R * nz]} b={[m.x, 1.3 + MULE_PULLEY_R * ny, dz + MULE_PULLEY_R * nz]} r={0.03} color="#5a4030" />
            <Rod a={[m.x, SHAFT_Y - PULLEY_R * ny, -PULLEY_R * nz]} b={[m.x, 1.3 - MULE_PULLEY_R * ny, dz - MULE_PULLEY_R * nz]} r={0.03} color="#5a4030" />
            <group position={[m.x, 1.3, dz]} rotation={[0, Math.PI / 2, 0]}>
              <Wheel radius={MULE_PULLEY_R} tube={0.04} spokes={4} angle={shaftAngle * 1.8} color="#8a6a45" depth={0.15} />
            </group>
            {/* headstock and fixed roller beam with the creel of rovings */}
            <Box p={[m.x, 0.65, m.side * 4.8]} s={[0.7, 1.3, 0.8]} color={IRON} />
            <Box p={[m.x, 1.05, m.side * BEAM_Z]} s={[MULE_LEN, 0.14, 0.25]} color="#55575c" />
            <Box p={[m.x, 0.5, m.side * (BEAM_Z + 0.35)]} s={[MULE_LEN, 1.0, 0.18]} color="#4a3b2e" />
            <Box p={[m.x, 1.45, m.side * (BEAM_Z + 0.45)]} s={[MULE_LEN, 0.18, 0.3]} color={PALETTE.linen} />
            {/* the travelling carriage on rails */}
            <Box p={[m.x, 0.02, m.side * 3.6]} s={[MULE_LEN * 0.9, 0.04, 2.6]} color="#5e4d3c" />
            <Box p={[m.x, 0.6, c.z]} s={[MULE_LEN, 0.5, 0.3]} color={PALETTE.wood} />
            <Box p={[m.x, 0.2, c.z]} s={[MULE_LEN * 0.95, 0.12, 0.2]} color={IRON} />
          </group>
        );
      })}
      <Instances geometry={GEO.cylinder()} material={matte(PALETTE.linen)} items={spindleItems} />
      <Instances geometry={GEO.box()} material={matte("#f1ead8")} items={threads} />

      {/* spinners in the aisle, young piecers at the threads */}
      {mules.filter((_, i) => i % 3 === 0).map((m, i) => (
        <Figure
          key={i}
          position={[m.x + 1.2, 0, m.side * 1.7]}
          rotationY={m.side > 0 ? 0 : Math.PI}
          pose={i % 2 ? "work" : "stand"}
          t={t + i}
          speed={0.6}
          outfit={{ tunic: i % 2 ? PALETTE.wool : PALETTE.dyeBlue, skin: PALETTE.skinTones[i % 5], head: "cap", headColor: PALETTE.woodDark }}
          castShadow={high}
        />
      ))}
      {[[-5, -1], [5, 1], [10, -1]].map(([x, s], i) => (
        <Figure key={`p${i}`} position={[x + 2.4, 0, s * 3.4]} rotationY={s > 0 ? 0 : Math.PI} pose="work" t={t * 1.3 + i} scale={0.68} outfit={{ tunic: PALETTE.linen, skin: PALETTE.skinTones[(i + 2) % 5] }} />
      ))}

      {/* cotton fluff in the air */}
      {high && <Particles preset={PARTICLES.dust} time={t} position={[0, 2.2, 0]} overrides={{ count: 140, spread: [18, 1.8, 5], velocity: [0.1, 0.05, 0], jitter: [0.2, 0.1, 0.2], gravity: 0, size: [0.02, 0.04], colorStart: "#f4efe2", colorEnd: "#ffffff", opacity: 0.5, life: 8 }} prewarm />}

      <Arrow from={[-18.5, SHAFT_Y + 0.45, 0.25]} to={[-3, SHAFT_Y + 0.45, 0.25]} progress={window01(t, 33, 35.5, 42.6, 43.5)} color={ACCENT.industrial} thickness={0.06} />
      <Label3D position={[-13, SHAFT_Y + 0.6, 0]} opacity={window01(t, 33.2, 34, 43, 43.6)}>Eje de transmisión</Label3D>
      <Label3D position={[-4.2, 2.4, -2.2]} opacity={window01(t, 35.5, 36.3, 43, 43.6)} size="sm">Correas</Label3D>
      <Label3D position={[2.5, 1.9, -4.4]} opacity={window01(t, 38.4, 39.2, 43, 43.6)}>Mula de hilar</Label3D>
    </group>
  );
}
