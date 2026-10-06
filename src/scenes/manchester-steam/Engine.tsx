"use client";

import { useMemo } from "react";
import { CylinderGeometry, SphereGeometry } from "three";
import { ACCENT, Arrow, cached, GEO, Instances, Label3D, matte, PALETTE, Particles, PARTICLES, window01, type InstanceSpec } from "../kit";
import { ENGINE, enginePose } from "./mechanism";
import { Box, HalfShell, Rod, Wheel } from "./parts";

const IRON = "#45474c";
const IRON_LIGHT = "#6c6f75";
const BRICK = PALETTE.brick;
const STEAM = "#f4e6c8";
const VACUUM = "#4c6f94";
const CUT = ACCENT.industrial;

const disc = () => cached("ms-disc", () => new CylinderGeometry(1, 1, 1, 24).rotateX(Math.PI / 2));
const ball = () => cached("ms-ball", () => new SphereGeometry(1, 14, 10));

/** Spur gear in the XY plane: disc + instanced teeth. */
function Gear({ r, teeth, angle, color }: { r: number; teeth: number; angle: number; color: string }) {
  const items = useMemo<InstanceSpec[]>(
    () =>
      Array.from({ length: teeth }, (_, i) => {
        const a = (i / teeth) * Math.PI * 2;
        return { position: [Math.cos(a) * r, Math.sin(a) * r, 0], rotation: [0, 0, a], scale: [0.14, 0.09, 0.2] };
      }),
    [r, teeth],
  );
  return (
    <group rotation={[0, 0, angle]}>
      <mesh geometry={disc()} material={matte(color)} scale={[r * 0.96, r * 0.96, 0.2]} />
      <mesh geometry={disc()} material={matte(IRON)} scale={[r * 0.3, r * 0.3, 0.26]} />
      <Instances geometry={GEO.box()} material={matte(color)} items={items} />
    </group>
  );
}

/** Set B: Boulton & Watt rotative beam engine in a cutaway engine house. All motion from `enginePose(t)`. */
export function Engine({ t, high }: { t: number; high: boolean }) {
  const pose = enginePose(t);
  const { pivot, shaft, cylinderX, cylinderBottom, cylinderTop, flywheelR, governor } = ENGINE;
  const cylH = cylinderTop - cylinderBottom;
  const flicker = 0.85 + 0.1 * Math.sin(t * 9) + 0.05 * Math.sin(t * 21);
  const beamLen = ENGINE.arm * 2 + 0.8;
  // Governor: arms open with engine speed (centrifugal); spindle driven from the flywheel shaft.
  const armAngle = 0.32 + 0.62 * Math.min(1, pose.speed * pose.speed * 1.05);
  const govSpin = pose.flywheel * 1.4;
  const armLen = 0.95;
  const sleeveY = -0.3 - Math.cos(armAngle) * 0.55;
  const pistonUp = pose.stroke > 0;
  // Air-pump rod hangs from the beam above the pump.
  const pumpX = -1.3;
  const pumpTop = pivot[1] + pumpX * Math.tan(pose.beam);

  const labels = {
    boiler: window01(t, 12.6, 13.4, 20.4, 21),
    cylinder: window01(t, 15.6, 16.3, 20.4, 21),
    piston: window01(t, 16.4, 17.1, 20.4, 21),
    condenser: window01(t, 17.8, 18.5, 20.4, 21),
    beam: window01(t, 22.2, 23, 31, 31.6),
    rod: window01(t, 24.2, 25, 31, 31.6),
    gears: window01(t, 25, 25.8, 31, 31.6),
    flywheel: window01(t, 25.8, 26.6, 31, 31.6),
    governor: window01(t, 27.6, 28.4, 31.2, 31.8),
  };

  return (
    <group>
      {/* engine house: stone floor, brick back wall, side wall with tall arched window light */}
      <Box p={[0, -0.1, 0]} s={[34, 0.2, 14]} color="#6d675f" shadow={high} />
      <Box p={[0, 7.5, -3.4]} s={[34, 15, 0.6]} color={BRICK} shadow={high} />
      <Box p={[-15, 7.5, 0]} s={[0.6, 15, 14]} color={BRICK} />
      <Box p={[4, 9.5, -3.08]} s={[2.2, 5, 0.05]} color="#c5c9cc" emissive="#aeb6bd" emissiveIntensity={0.7} />
      <Box p={[-9, 11, -3.08]} s={[2.2, 4, 0.05]} color="#c5c9cc" emissive="#aeb6bd" emissiveIntensity={0.7} />
      {/* lever wall carrying the beam bearing */}
      <Box p={[0, 5.2, -1.4]} s={[2.2, 10.4, 1.6]} color="#9a5a42" shadow={high} />
      <Box p={[0, 10.5, -0.5]} s={[1.0, 0.5, 1.6]} color={IRON} />

      {/* ── boiler on its brick setting, coal fire ── */}
      <Box p={[-10, 0.9, 0]} s={[6, 1.8, 3.2]} color="#7e4334" shadow={high} />
      <mesh geometry={GEO.cylinder()} material={matte(IRON_LIGHT, { flat: false })} position={[-12.6, 2.9, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[2.4, 5.2, 2.4]} />
      <mesh geometry={disc()} material={matte(IRON)} position={[-7.35, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1.25, 1.25, 0.12]} />
      <mesh geometry={disc()} material={matte(IRON)} position={[-12.65, 2.9, 0]} rotation={[0, Math.PI / 2, 0]} scale={[1.25, 1.25, 0.12]} />
      <mesh geometry={GEO.cylinder()} material={matte(IRON)} position={[-11.5, 4.0, -0.6]} scale={[0.5, 11, 0.5]} />
      <Box p={[-10, 0.7, 1.62]} s={[1.4, 0.8, 0.05]} color="#ff8a3a" emissive="#ff6a1a" emissiveIntensity={2.2 * flicker} />
      <pointLight position={[-10, 0.9, 2.6]} color="#ff8a45" intensity={14 * flicker} distance={10} decay={1.4} />
      <mesh geometry={GEO.rock()} material={matte(PALETTE.soot)} position={[-7.2, 0.15, 2.4]} scale={[1.4, 0.5, 1.0]} />
      <mesh geometry={GEO.rock()} material={matte("#26221f")} position={[-6.6, 0.1, 2.9]} scale={[0.8, 0.35, 0.7]} />
      {high && <Particles preset={PARTICLES.sparks} time={t} position={[-10, 0.8, 1.7]} overrides={{ count: 40, velocity: [0, 1.0, 0.6], jitter: [0.5, 0.6, 0.3], size: [0.14, 0.05] }} prewarm />}

      {/* steam pipe boiler → valve chest */}
      <Rod a={[-9.2, 3.8, 0]} b={[-9.2, 8.4, 0]} r={0.16} color={IRON_LIGHT} />
      <Rod a={[-9.36, 8.4, 0]} b={[-5.5, 8.4, 0]} r={0.16} color={IRON_LIGHT} />
      <Rod a={[-5.6, 8.5, 0]} b={[-5.6, 7.3, 0]} r={0.16} color={IRON_LIGHT} />
      {/* valve chest beside the cylinder, with ports top and bottom */}
      <Box p={[-5.65, (cylinderBottom + cylinderTop) / 2, 0]} s={[0.5, cylH, 0.7]} color={IRON} />
      <Box p={[-5.2, cylinderTop - 0.3, 0]} s={[0.5, 0.25, 0.4]} color={IRON} />
      <Box p={[-5.2, cylinderBottom + 0.3, 0]} s={[0.5, 0.25, 0.4]} color={IRON} />

      {/* ── cylinder in section ── */}
      <group position={[cylinderX, cylinderBottom, 0]}>
        <HalfShell radius={0.9} height={cylH} color={IRON} />
        {/* section rim in the accent colour */}
        <Box p={[-0.9, cylH / 2, 0]} s={[0.06, cylH, 0.06]} color={CUT} emissive={CUT} emissiveIntensity={0.25} />
        <Box p={[0.9, cylH / 2, 0]} s={[0.06, cylH, 0.06]} color={CUT} emissive={CUT} emissiveIntensity={0.25} />
        <mesh geometry={disc()} material={matte(IRON)} position={[0, cylH, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.98, 0.98, 0.18]} />
        <mesh geometry={disc()} material={matte(IRON)} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.98, 0.98, 0.18]} />
        {/* working fluid on each side of the piston: steam pushes, the other side opens to the condenser */}
        {(() => {
          const py = pose.pistonY - cylinderBottom;
          const below = Math.max(0.01, py - 0.15);
          const above = Math.max(0.01, cylH - py - 0.15);
          return (
            <>
              <mesh geometry={GEO.cylinder()} material={matte(pistonUp ? STEAM : VACUUM, { emissive: pistonUp ? STEAM : VACUUM, emissiveIntensity: pistonUp ? 0.7 : 0.35 })} position={[0, 0.05, -0.05]} scale={[1.6, below, 1.6]} />
              <mesh geometry={GEO.cylinder()} material={matte(pistonUp ? VACUUM : STEAM, { emissive: pistonUp ? VACUUM : STEAM, emissiveIntensity: pistonUp ? 0.35 : 0.7 })} position={[0, py + 0.15, -0.05]} scale={[1.6, above, 1.6]} />
              <mesh geometry={disc()} material={matte(IRON_LIGHT)} position={[0, py, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.86, 0.86, 0.3]} />
              <mesh geometry={disc()} material={matte(CUT)} position={[0, py, 0.02]} rotation={[Math.PI / 2, 0, 0]} scale={[0.88, 0.88, 0.06]} />
            </>
          );
        })()}
      </group>
      {/* piston rod and parallel-motion link to the beam */}
      <Rod a={[cylinderX, pose.pistonY, 0]} b={[cylinderX, pose.pistonEnd[1] - 0.25, 0]} r={0.09} color={IRON_LIGHT} />
      <Rod a={[cylinderX, pose.pistonEnd[1] - 0.25, 0.25]} b={[pose.pistonEnd[0], pose.pistonEnd[1], 0.25]} r={0.07} color={IRON} />

      {/* ── condenser in its cold-water cistern + air pump ── */}
      <Rod a={[cylinderX, cylinderBottom, 0.3]} b={[cylinderX, 1.3, 0.3]} r={0.13} color={IRON} />
      <Rod a={[cylinderX - 0.13, 1.3, 0.3]} b={[-2.3, 1.3, 0.3]} r={0.13} color={IRON} />
      <mesh geometry={GEO.cylinder()} material={matte(VACUUM, { emissive: VACUUM, emissiveIntensity: 0.25 })} position={[-2.4, 0.2, 0.3]} scale={[0.75, 1.7, 0.75]} />
      <mesh geometry={GEO.cylinder()} material={matte(IRON)} position={[-1.3, 0.2, 0.3]} scale={[0.6, 2.0, 0.6]} />
      <Rod a={[pumpX, 2.2, 0.3]} b={[pumpX, pumpTop - 0.2, 0.3]} r={0.06} color={IRON_LIGHT} />
      <mesh position={[-2.1, 1.25, 0.35]} scale={[3.2, 2.5, 2.1]} geometry={GEO.box()}>
        <meshStandardMaterial color="#4f7f96" transparent opacity={0.32} roughness={0.2} depthWrite={false} />
      </mesh>

      {/* ── beam ── */}
      <group position={[pivot[0], pivot[1], 0]} rotation={[0, 0, pose.beam]}>
        <Box p={[0, 0, 0]} s={[beamLen, 0.62, 0.42]} color="#3a3c41" shadow={high} />
        <Box p={[0, 0, 0]} s={[beamLen * 0.7, 0.9, 0.3]} color="#3a3c41" />
        <mesh geometry={disc()} material={matte(PALETTE.brass)} scale={[0.32, 0.32, 0.6]} />
        <mesh geometry={disc()} material={matte(PALETTE.brass)} position={[-ENGINE.arm, 0, 0]} scale={[0.2, 0.2, 0.55]} />
        <mesh geometry={disc()} material={matte(PALETTE.brass)} position={[ENGINE.arm, 0, 0]} scale={[0.2, 0.2, 0.55]} />
      </group>

      {/* ── connecting rod with the planet gear fixed to it ── */}
      <Rod a={[pose.rodEnd[0], pose.rodEnd[1], 0.45]} b={[pose.planet[0], pose.planet[1], 0.45]} r={0.12} color={IRON_LIGHT} />
      <group position={[pose.planet[0], pose.planet[1], 0.45]}>
        <Gear r={ENGINE.rPlanet - 0.06} teeth={12} angle={Math.atan2(pose.rodEnd[1] - pose.planet[1], pose.rodEnd[0] - pose.planet[0])} color={PALETTE.brass} />
      </group>
      <group position={[shaft[0], shaft[1], 0.45]}>
        <Gear r={ENGINE.rSun - 0.06} teeth={12} angle={pose.flywheel} color="#a07b34" />
      </group>
      {/* retaining link keeps the planet on its orbit */}
      <Rod a={[shaft[0], shaft[1], 0.62]} b={[pose.planet[0], pose.planet[1], 0.62]} r={0.05} color={IRON} />

      {/* ── flywheel on the shaft, its bearing pedestal ── */}
      <Rod a={[shaft[0], shaft[1], -1.4]} b={[shaft[0], shaft[1], 0.7]} r={0.16} color={IRON_LIGHT} />
      <group position={[shaft[0], shaft[1], -0.7]}>
        <Wheel radius={flywheelR} tube={0.22} spokes={4} angle={pose.flywheel} color="#3b3d42" hubColor={IRON_LIGHT} depth={0.22} />
      </group>
      <Box p={[shaft[0], shaft[1] / 2 - 0.2, -1.5]} s={[1.1, shaft[1] - 0.4, 0.8]} color="#8a5240" />
      {/* flywheel pit */}
      <Box p={[shaft[0], 0.01, -0.7]} s={[1.0, 0.04, 0.8]} color="#211e1c" />

      {/* ── centrifugal governor driven by a belt from the shaft ── */}
      <Box p={[governor[0], 1.2, 0]} s={[0.9, 2.4, 0.9]} color="#8a5240" />
      <Rod a={[shaft[0], shaft[1] - 0.9, 0.85]} b={[governor[0], shaft[1] - 0.9, 0.85]} r={0.06} color={IRON_LIGHT} />
      <Rod a={[governor[0], shaft[1] - 0.9, 0.85]} b={[governor[0], shaft[1] - 0.9, 0]} r={0.06} color={IRON_LIGHT} />
      <Rod a={[shaft[0], shaft[1], 0.85]} b={[shaft[0], shaft[1] - 0.9, 0.85]} r={0.05} color={IRON_LIGHT} />
      <group position={[governor[0], governor[1] + 0.9, 0]} rotation={[0, govSpin, 0]}>
        <Rod a={[0, -3.1, 0]} b={[0, 0.25, 0]} r={0.05} color={IRON_LIGHT} />
        {[-1, 1].map((side) => {
          const bx = side * Math.sin(armAngle) * armLen;
          const by = -Math.cos(armAngle) * armLen;
          return (
            <group key={side}>
              <Rod a={[0, 0, 0]} b={[bx, by, 0]} r={0.03} color={IRON_LIGHT} />
              <Rod a={[bx * 0.55, by * 0.55, 0]} b={[0, sleeveY, 0]} r={0.022} color={IRON_LIGHT} />
              <mesh geometry={ball()} material={matte(PALETTE.brass, { flat: false })} position={[bx, by, 0]} scale={0.19} />
            </group>
          );
        })}
        <mesh geometry={disc()} material={matte(PALETTE.brass)} position={[0, sleeveY, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.1, 0.1, 0.14]} />
      </group>
      {/* throttle linkage from the governor sleeve to the steam pipe */}
      <Rod a={[governor[0], governor[1] + 0.9 + sleeveY, 0]} b={[governor[0] - 1.4, governor[1] + 0.9 + sleeveY, 0]} r={0.025} color={IRON} />

      {/* didactic arrows: steam flow and exhaust to the condenser */}
      <Arrow from={[-9.2, 4.3, 0.5]} to={[-9.2, 8.0, 0.5]} progress={window01(t, 13.6, 14.6, 20.4, 21)} color="#f2c57c" thickness={0.09} />
      <Arrow from={[-8.8, 8.9, 0.5]} to={[-6.0, 8.9, 0.5]} progress={window01(t, 14.4, 15.4, 20.4, 21)} color="#f2c57c" thickness={0.09} />
      <Arrow from={[cylinderX + 0.2, 2.9, 1.0]} to={[-2.8, 1.5, 1.0]} progress={window01(t, 17.8, 18.8, 20.4, 21)} color="#8fb8e8" thickness={0.08} />
      <Arrow from={[pose.rodEnd[0] + 0.6, 9.4, 0.8]} to={[pose.rodEnd[0] + 0.6, 6.2, 0.8]} progress={window01(t, 24, 25, 27.5, 28.2)} color={CUT} thickness={0.08} />

      <Label3D position={[-10, 5.3, 1]} opacity={labels.boiler}>Caldera</Label3D>
      <Label3D position={[cylinderX - 1.9, 7.2, 1]} opacity={labels.cylinder}>Cilindro</Label3D>
      <Label3D position={[cylinderX + 1.7, pose.pistonY + 0.1, 1]} opacity={labels.piston} size="sm">Pistón</Label3D>
      <Label3D position={[-2.0, 3.0, 1.4]} opacity={labels.condenser}>Condensador separado</Label3D>
      <Label3D position={[-1.8, 12.6, 0.5]} opacity={labels.beam}>Balancín</Label3D>
      <Label3D position={[pose.rodEnd[0] + 1.3, 8.2, 0.8]} opacity={labels.rod} size="sm">Biela</Label3D>
      <Label3D position={[shaft[0] + 1.9, shaft[1] + 0.3, 1]} opacity={labels.gears} size="sm">Sol y planeta</Label3D>
      <Label3D position={[shaft[0] - 2.6, shaft[1] + 2.6, 0]} opacity={labels.flywheel}>Volante</Label3D>
      <Label3D position={[governor[0], governor[1] + 2.0, 0]} opacity={labels.governor}>Regulador centrífugo</Label3D>
    </group>
  );
}
