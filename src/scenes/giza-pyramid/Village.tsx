"use client";

import { useMemo } from "react";
import { Crowd, GEO, Instances, matte, PALETTE, Particles, PARTICLES, pointOnPath, Town, type CrowdAgent, type InstanceSpec, type Vec3 } from "../kit";
import type { SceneQuality } from "../types";
import { VILLAGE, groundY } from "./world";

/** Route of the work gangs from the town up to the plateau, sampled on the ground. */
const ROUTE_KEYS: [number, number][] = [
  [VILLAGE.x - 22, VILLAGE.z - 4],
  [150, 196],
  [118, 178],
  [80, 160],
  [30, 152],
];
export const GANG_ROUTE: Vec3[] = (() => {
  const out: Vec3[] = [];
  for (let i = 0; i < ROUTE_KEYS.length - 1; i++) {
    const [ax, az] = ROUTE_KEYS[i];
    const [bx, bz] = ROUTE_KEYS[i + 1];
    for (let k = 0; k < 6; k++) {
      const x = ax + ((bx - ax) * k) / 6;
      const z = az + ((bz - az) * k) / 6;
      out.push([x, groundY(x, z) + 0.05, z]);
    }
  }
  const [lx, lz] = ROUTE_KEYS[ROUTE_KEYS.length - 1];
  out.push([lx, groundY(lx, lz) + 0.05, lz]);
  return out;
})();

const GANG_SPEED = 1.15;
const GANG_SPACING = 34;
/** Head of gang `g` along the route at time t (m). */
export const gangHead = (g: number, t: number) => 6 + g * GANG_SPACING + (t - 71) * GANG_SPEED;

const TUNICS = [PALETTE.linen, "#ddd2b8", PALETTE.wool];

export function Village({ time, quality }: { time: number; quality: SceneQuality }) {
  const high = quality === "high";
  const baseY = groundY(VILLAGE.x, VILLAGE.z);
  // Long galleries in two walled blocks separated by streets, plus a looser quarter of houses.
  const galleries = useMemo<InstanceSpec[]>(() => {
    const out: InstanceSpec[] = [];
    for (const bx of [-16, 16]) {
      for (let i = 0; i < 7; i++) {
        const z = VILLAGE.z - 20 + i * 6.4;
        out.push({ position: [VILLAGE.x + bx, baseY - 0.2, z], scale: [26, 3.1, 4.4], color: i % 2 ? PALETTE.mudbrick : "#c7a074" });
        // Roof terrace edge.
        out.push({ position: [VILLAGE.x + bx, baseY + 2.9, z], scale: [26.4, 0.25, 4.8], color: PALETTE.mudbrickDark });
      }
    }
    // Enclosure walls.
    const W = 36;
    const D = 26;
    out.push({ position: [VILLAGE.x, baseY - 0.2, VILLAGE.z - D], scale: [2 * W, 3.6, 1.2], color: PALETTE.mudbrickDark });
    out.push({ position: [VILLAGE.x, baseY - 0.2, VILLAGE.z + D], scale: [2 * W, 3.6, 1.2], color: PALETTE.mudbrickDark });
    out.push({ position: [VILLAGE.x + W, baseY - 0.2, VILLAGE.z], scale: [1.2, 3.6, 2 * D], color: PALETTE.mudbrickDark });
    out.push({ position: [VILLAGE.x - W, baseY - 0.2, VILLAGE.z + 8], scale: [1.2, 3.6, 2 * D - 16], color: PALETTE.mudbrickDark });
    return out;
  }, [baseY]);

  const agents = useMemo(() => {
    const gangs = high ? 4 : 2;
    const perGang = high ? 16 : 10;
    const out: CrowdAgent[] = [];
    for (let g = 0; g < gangs; g++) {
      const head = gangHead(g, time);
      for (let i = 0; i < perGang; i++) {
        const d = head - Math.floor(i / 2) * 1.3;
        if (d < 0) continue;
        // Moving agents (not idle) so Crowd adds the walking bob; offset compensates its own time term.
        out.push({ path: GANG_ROUTE, offset: d - time * GANG_SPEED, speed: GANG_SPEED, loop: false, lateral: i % 2 ? 0.55 : -0.55, color: TUNICS[(g + i) % TUNICS.length], scale: 0.95 + ((i * 7) % 5) * 0.025 });
      }
    }
    // Townsfolk in the streets.
    for (let i = 0; i < (high ? 16 : 8); i++) {
      const z = VILLAGE.z - 17 + (i % 8) * 6.4;
      const x = VILLAGE.x + (i < 8 ? -1.5 : 1.5) + Math.sin(time * 0.3 + i) * 1.5;
      out.push({ path: [[x, baseY, z], [x + 1, baseY, z + 0.3]], idle: true, offset: 0, color: TUNICS[i % 3] });
    }
    return out;
  }, [time, high, baseY]);

  return (
    <group>
      <Instances geometry={GEO.boxBase()} material={matte()} items={galleries} castShadow receiveShadow />
      <Town seed={14} count={high ? 46 : 26} area={{ x: VILLAGE.x + 6, z: VILLAGE.z + 42, w: 34, d: 12 }} height={groundY} minSize={[3, 2, 3]} maxSize={[6, 3, 6]} />
      <Crowd agents={agents} time={time} castShadow={high} />
      <Particles preset={PARTICLES.smoke} time={time} position={[VILLAGE.x + 22, baseY + 3.5, VILLAGE.z + 34]} seed={3} density={high ? 0.6 : 0.3} overrides={{ size: [1.5, 5], opacity: 0.22, wind: [0.6, -0.2], colorStart: "#a89e90", colorEnd: "#e6dfd2" }} prewarm />
      <Particles preset={PARTICLES.smoke} time={time} position={[VILLAGE.x - 8, baseY + 3.5, VILLAGE.z + 40]} seed={5} density={high ? 0.6 : 0.3} overrides={{ size: [1.5, 5], opacity: 0.2, wind: [0.6, -0.2], colorStart: "#a89e90", colorEnd: "#e6dfd2" }} prewarm />
    </group>
  );
}

export const gangLabelPos = (t: number): Vec3 => {
  const { p } = pointOnPath(GANG_ROUTE, gangHead(1, t) - 4);
  return [p[0], p[1] + 4.2, p[2]];
};
