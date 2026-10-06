"use client";

import { Color } from "three";
import type { SceneProps } from "../types";

const OCHRE = new Color("#7a4a24");
const RED = new Color("#b2381f");
const GOLD = new Color("#e0a458");

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
  const k = clamp01(x);
  return k * k * (3 - 2 * k);
};

/** Placeholder scene: every visual value is a pure function of `time` (no frame deltas). */
export default function PlaceholderScene({ time, quality }: SceneProps) {
  const toRed = smooth((time - 3.5) / 1.2);
  const toGold = smooth((time - 7) / 1.2);
  const color = new Color().lerpColors(OCHRE, RED, toRed).lerp(GOLD, toGold);
  const grow = smooth(time / 1.5);
  const pulse = toGold * 0.06 * Math.sin((time - 7) * Math.PI * 2);
  // Rotation angle is the integral of a speed that rises during the second beat (closed form, no accumulation).
  const angle = time * 0.5 + 0.35 * Math.max(0, time - 3.5);

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 4, 5]} intensity={2.2} />
      <mesh rotation={[0.35 + 0.15 * Math.sin(time * 0.7), angle, 0]} scale={grow * (1 + pulse)}>
        <icosahedronGeometry args={[1.2, quality === "high" ? 1 : 0]} />
        <meshStandardMaterial color={color} flatShading roughness={0.85} />
      </mesh>
    </>
  );
}
