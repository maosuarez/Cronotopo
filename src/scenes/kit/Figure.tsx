"use client";

import { ConeGeometry, CylinderGeometry, SphereGeometry } from "three";
import { cached, matte } from "./geometry";
import { PALETTE } from "./palette";

/**
 * Stylised faceless human (≈1.7 world units tall, 1 unit = 1 m), museum-diorama style.
 * Every pose is a pure function of `t` (seconds) so the figure is deterministic.
 */
export type Pose = "stand" | "walk" | "carry" | "work" | "push" | "write" | "kneel" | "sit" | "point" | "pray";
export type Headwear = "none" | "cap" | "wrap" | "hat" | "veil" | "helmet";

export type Outfit = {
  tunic?: string;
  skin?: string;
  /** Long robe to the ankles instead of a knee-length tunic. */
  robe?: boolean;
  head?: Headwear;
  headColor?: string;
  /** Optional cloak/sash colour. */
  sash?: string;
};

const G = {
  tunic: () => cached("fig-tunic", () => new CylinderGeometry(0.15, 0.25, 0.72, 8).translate(0, -0.36, 0)),
  robe: () => cached("fig-robe", () => new CylinderGeometry(0.15, 0.3, 1.18, 8).translate(0, -0.59, 0)),
  torso: () => cached("fig-torso", () => new CylinderGeometry(0.17, 0.15, 0.5, 8).translate(0, 0.25, 0)),
  head: () => cached("fig-head", () => new SphereGeometry(0.11, 10, 8)),
  limb: () => cached("fig-limb", () => new CylinderGeometry(0.045, 0.04, 1, 6).translate(0, -0.5, 0)),
  cap: () => cached("fig-cap", () => new SphereGeometry(0.118, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2)),
  wrap: () => cached("fig-wrap", () => new CylinderGeometry(0.12, 0.13, 0.09, 10)),
  hat: () => cached("fig-hat", () => new CylinderGeometry(0.1, 0.2, 0.12, 12)),
  veil: () => cached("fig-veil", () => new ConeGeometry(0.17, 0.42, 10, 1, true).translate(0, -0.1, 0)),
  helmet: () => cached("fig-helmet", () => new ConeGeometry(0.13, 0.22, 8).translate(0, 0.06, 0)),
};

type Props = {
  position?: [number, number, number];
  rotationY?: number;
  pose?: Pose;
  /** Seconds; drives gait/work cycles. */
  t?: number;
  /** Cycle speed multiplier. */
  speed?: number;
  scale?: number;
  outfit?: Outfit;
  castShadow?: boolean;
};

export function Figure({ position = [0, 0, 0], rotationY = 0, pose = "stand", t = 0, speed = 1, scale = 1, outfit = {}, castShadow = false }: Props) {
  const ph = t * speed * Math.PI * 2 * 0.9;
  const s = Math.sin(ph);
  let legL = 0, legR = 0, armL = 0.05, armR = -0.05, armLz = 0.08, armRz = -0.08, lean = 0, bob = 0, hipY = 0.92, kneeBend = 0;
  switch (pose) {
    case "walk":
      legL = 0.45 * s; legR = -0.45 * s; armL = -0.4 * s; armR = 0.4 * s; bob = Math.abs(Math.cos(ph)) * 0.03;
      break;
    case "carry":
      legL = 0.35 * s; legR = -0.35 * s; armL = -2.6; armR = -2.6; armLz = 0.25; armRz = -0.25; bob = Math.abs(Math.cos(ph)) * 0.02;
      break;
    case "push":
      legL = 0.5 * s - 0.2; legR = -0.5 * s - 0.2; armL = -1.4; armR = -1.4; lean = 0.38; bob = Math.abs(Math.cos(ph)) * 0.02;
      break;
    case "work": {
      const w = Math.max(0, Math.sin(ph * 0.8));
      armL = -0.6 - 1.8 * w; armR = -0.6 - 1.8 * w; lean = 0.15 + 0.15 * w;
      break;
    }
    case "write":
      armR = -1.1; armRz = 0.1 + 0.03 * Math.sin(ph * 3); armL = -0.8; lean = 0.25;
      break;
    case "point":
      armR = -1.6; armRz = -0.3; armL = 0.05;
      break;
    case "pray":
      armL = -2.9; armR = -2.9; armLz = 0.15; armRz = -0.15;
      break;
    case "kneel":
      hipY = 0.5; legL = -1.5; legR = 0.1; kneeBend = 1; lean = 0.1; armL = -0.5; armR = -0.5;
      break;
    case "sit":
      hipY = 0.5; legL = -1.45; legR = -1.45; armL = -0.6; armR = -0.6;
      break;
  }
  const skin = matte(outfit.skin ?? PALETTE.skinTones[1]);
  const cloth = matte(outfit.tunic ?? PALETTE.linen);
  const head = outfit.head ?? "none";
  const headMat = matte(outfit.headColor ?? outfit.tunic ?? PALETTE.linen);
  const legLen = kneeBend ? 0.48 : 0.9;
  return (
    <group position={position} rotation={[0, rotationY, 0]} scale={scale}>
      <group position={[0, hipY + bob, 0]} rotation={[lean, 0, 0]}>
        {/* legs */}
        <mesh geometry={G.limb()} material={skin} position={[-0.08, 0, 0]} rotation={[legL, 0, 0]} scale={[1, legLen, 1]} castShadow={castShadow} />
        <mesh geometry={G.limb()} material={skin} position={[0.08, 0, 0]} rotation={[legR, 0, 0]} scale={[1, legLen, 1]} castShadow={castShadow} />
        {/* skirt of the tunic/robe hangs from the waist */}
        <mesh geometry={outfit.robe ? G.robe() : G.tunic()} material={cloth} position={[0, 0.02, 0]} scale={outfit.robe ? [1, kneeBend ? 0.45 : 0.78, 1] : 1} castShadow={castShadow} />
        <mesh geometry={G.torso()} material={cloth} castShadow={castShadow} />
        {outfit.sash && <mesh geometry={G.torso()} material={matte(outfit.sash)} scale={[1.06, 0.35, 1.06]} position={[0, 0.3, 0]} rotation={[0, 0, 0.5]} />}
        {/* arms from the shoulders */}
        <mesh geometry={G.limb()} material={cloth} position={[-0.22, 0.48, 0]} rotation={[armL, 0, armLz]} scale={[1, 0.62, 1]} castShadow={castShadow} />
        <mesh geometry={G.limb()} material={cloth} position={[0.22, 0.48, 0]} rotation={[armR, 0, armRz]} scale={[1, 0.62, 1]} castShadow={castShadow} />
        <group position={[0, 0.64, 0]}>
          <mesh geometry={G.head()} material={skin} castShadow={castShadow} />
          {head === "cap" && <mesh geometry={G.cap()} material={headMat} position={[0, 0.01, 0]} />}
          {head === "wrap" && <mesh geometry={G.wrap()} material={headMat} position={[0, 0.06, 0]} />}
          {head === "hat" && <mesh geometry={G.hat()} material={headMat} position={[0, 0.12, 0]} />}
          {head === "veil" && <mesh geometry={G.veil()} material={headMat} position={[0, 0.08, 0]} />}
          {head === "helmet" && <mesh geometry={G.helmet()} material={headMat} position={[0, 0.06, 0]} />}
        </group>
      </group>
    </group>
  );
}
