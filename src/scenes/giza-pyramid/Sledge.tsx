"use client";

import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { Figure, GEO, matte, PALETTE, Particles, PARTICLES, type Vec3 } from "../kit";
import type { SceneQuality } from "../types";
import { CORE_COLOR } from "./Pyramid";

/** Close-up sledge: starts at SLEDGE.start at SLEDGE.t0 and is hauled west at SLEDGE.speed m/s. */
export const SLEDGE = { start: [-10, 0, 150] as Vec3, t0: 31, speed: 0.45 };
export const sledgeX = (t: number) => SLEDGE.start[0] - SLEDGE.speed * (t - SLEDGE.t0);

const WET = "#8f6f48";
const UP = new Vector3(0, 1, 0);

/** Thin rope between two local points. */
function Rope({ from, to }: { from: Vec3; to: Vec3 }) {
  const { len, quat } = useMemo(() => {
    const d = new Vector3(...to).sub(new Vector3(...from));
    return { len: d.length(), quat: new Quaternion().setFromUnitVectors(UP, d.normalize()) };
  }, [from, to]);
  return <mesh geometry={GEO.cylinder()} material={matte("#c9b08a")} position={from} quaternion={quat} scale={[0.045, len, 0.045]} />;
}

const ROPE_L: Vec3[] = [[-0.55, 0.3, 1.7], [-0.95, 1.0, 4.2], [-0.95, 1.0, 15]];
const ROPE_R: Vec3[] = [[0.55, 0.3, 1.7], [0.95, 1.0, 4.2], [0.95, 1.0, 15]];

/**
 * Sledge, block, two rope teams and the water pourer, modelled in local space facing +z and rotated to face west.
 * Pure function of `time`.
 */
export function Sledge({ time, quality }: { time: number; quality: SceneQuality }) {
  const high = quality === "high";
  const x = sledgeX(time);
  const z = SLEDGE.start[2];
  const haulers = high ? 7 : 4;
  const walk = time * SLEDGE.speed * 1.4;
  const pour = 0.75 + 0.25 * Math.sin(time * 2.1);
  const outfits = [PALETTE.linen, PALETTE.wool, PALETTE.linen, "#d9cdb0"];
  return (
    <group>
      {/* Wet strip: the trail left behind and the freshly wetted sand just ahead of the runners. */}
      <mesh geometry={GEO.boxBase()} material={matte(WET)} position={[(x - 3.1 + SLEDGE.start[0] + 6) / 2, 0.005, z]} scale={[Math.max(0.1, SLEDGE.start[0] + 6 - (x - 3.1)), 0.02, 1.9]} receiveShadow />
      {/* Older packed haul track. */}
      <mesh geometry={GEO.boxBase()} material={matte("#c7a777")} position={[-40, 0.0, z]} scale={[120, 0.01, 4.2]} receiveShadow />

      <group position={[x, 0, z]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Runners with upturned fronts. */}
        {[-0.55, 0.55].map((rx) => (
          <group key={rx}>
            <mesh geometry={GEO.boxBase()} material={matte(PALETTE.wood)} position={[rx, 0, 0]} scale={[0.2, 0.24, 3.3]} castShadow={high} receiveShadow />
            <mesh geometry={GEO.boxBase()} material={matte(PALETTE.wood)} position={[rx, 0.08, 1.75]} rotation={[0.7, 0, 0]} scale={[0.2, 0.22, 0.6]} castShadow={high} />
          </group>
        ))}
        {[-1.2, -0.4, 0.4, 1.2].map((cz) => (
          <mesh key={cz} geometry={GEO.boxBase()} material={matte(PALETTE.woodDark)} position={[0, 0.24, cz]} scale={[1.45, 0.12, 0.2]} castShadow={high} />
        ))}
        <mesh geometry={GEO.boxBase()} material={matte(CORE_COLOR)} position={[0, 0.36, -0.25]} scale={[1.35, 1.1, 1.9]} castShadow={high} receiveShadow />
        {/* Lashing ropes around the block. */}
        {[-0.8, 0.3].map((lz) => (
          <mesh key={lz} geometry={GEO.boxBase()} material={matte("#bfa47c")} position={[0, 0.34, lz]} scale={[1.39, 1.14, 0.06]} />
        ))}

        {/* Pourer standing on the front of the sledge. */}
        <Figure position={[0, 0.3, 1.15]} pose="push" t={0} outfit={{ tunic: PALETTE.linen, skin: PALETTE.skinTones[3], head: "wrap", headColor: PALETTE.linen }} castShadow={high} />
        <group position={[0, 1.42, 1.95]} rotation={[1.1 + 0.15 * pour, 0, 0]}>
          <mesh geometry={GEO.sphere()} material={matte(PALETTE.clay)} scale={[0.34, 0.46, 0.34]} castShadow={high} />
          <mesh geometry={GEO.cylinder()} material={matte(PALETTE.clay)} position={[0, 0.16, 0]} scale={[0.14, 0.14, 0.14]} />
        </group>
        {/* Water stream and wet splash. */}
        <mesh geometry={GEO.cylinder()} position={[0, 0.05, 2.45]} rotation={[-0.3, 0, 0]} scale={[0.05 * pour, 1.4, 0.05 * pour]}>
          <meshStandardMaterial color="#cfe6ee" transparent opacity={0.75} roughness={0.2} emissive="#9fc6d4" emissiveIntensity={0.35} />
        </mesh>
        <mesh geometry={GEO.cylinder()} material={matte("#7c5f3d")} position={[0, 0.006, 2.5]} scale={[1.1, 0.012, 0.9]} />

        {/* Ropes and the two hauling teams. */}
        <Rope from={ROPE_L[0]} to={ROPE_L[1]} />
        <Rope from={ROPE_L[1]} to={ROPE_L[2]} />
        <Rope from={ROPE_R[0]} to={ROPE_R[1]} />
        <Rope from={ROPE_R[1]} to={ROPE_R[2]} />
        {Array.from({ length: haulers }, (_, i) =>
          [-1, 1].map((side) => (
            <Figure
              key={`${i}${side}`}
              position={[side * (0.95 + 0.42 * ((i + (side > 0 ? 1 : 0)) % 2 ? 1 : -1)), 0, 4.7 + i * 1.45]}
              pose="push"
              t={walk + i * 0.37 + (side > 0 ? 0.5 : 0)}
              speed={0.8}
              outfit={{ tunic: outfits[(i + (side > 0 ? 1 : 0)) % outfits.length], skin: PALETTE.skinTones[(i + (side > 0 ? 2 : 0)) % 5], head: i % 3 === 2 ? "wrap" : "none", headColor: PALETTE.linen }}
              castShadow={high}
            />
          )),
        )}
      </group>
      <Particles
        preset={PARTICLES.sparks}
        time={time}
        position={[x - 2.45, 0.05, z]}
        seed={9}
        density={high ? 1 : 0.5}
        overrides={{ count: 70, life: 0.7, spread: [0.12, 0.02, 0.12], velocity: [0, 0.9, 0], jitter: [0.7, 0.5, 0.7], gravity: 5, size: [0.09, 0.04], colorStart: "#e9f4f7", colorEnd: "#a9cbd6", opacity: 0.8, additive: false }}
        prewarm
      />
      <Particles preset={PARTICLES.dust} time={time} position={[x + 1.8, 0.05, z]} seed={12} density={high ? 1 : 0.5} overrides={{ spread: [1.4, 0.05, 0.8], size: [0.6, 2.2], opacity: 0.18 }} prewarm />
    </group>
  );
}
