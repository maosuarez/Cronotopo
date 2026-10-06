"use client";

import { useMemo } from "react";
import { CylinderGeometry, SphereGeometry } from "three";
import { cached, matte } from "./geometry";
import { Instances, type InstanceSpec } from "./Instanced";
import type { Vec3 } from "./math";
import { PALETTE } from "./palette";
import { pointOnPath, pathLength } from "./path";
import { createRng } from "./prng";

/** Simplified instanced figure: robe-body + head (2 draw calls for the whole crowd). */
const bodyGeo = () => cached("crowd-body", () => new CylinderGeometry(0.14, 0.26, 1.45, 7).translate(0, 0.72, 0));
const headGeo = () => cached("crowd-head", () => new SphereGeometry(0.11, 8, 6));

export type CrowdAgent = {
  /** Path in world space; agents walk along it at `speed` m/s starting at `offset` m. */
  path: readonly Vec3[];
  speed?: number;
  offset?: number;
  /** Sideways offset from the path (m). */
  lateral?: number;
  loop?: boolean;
  /** Stand still at the start point (gathered crowds). */
  idle?: boolean;
  color?: string;
  scale?: number;
};

/** Builds `count` agents spread along one path with seeded variety. */
export function crowdOnPath(seed: number, count: number, path: readonly Vec3[], opts: Partial<CrowdAgent> & { spread?: number; colors?: readonly string[] } = {}): CrowdAgent[] {
  const rng = createRng(seed);
  const L = pathLength(path);
  const colors = opts.colors ?? [PALETTE.linen, PALETTE.wool, PALETTE.dyeOchre, PALETTE.dyeRed, PALETTE.dyeBlue];
  return Array.from({ length: count }, (_, i) => ({
    path,
    speed: (opts.speed ?? 1.1) * rng.range(0.85, 1.15),
    offset: (i / count) * L + rng.range(-0.5, 0.5),
    lateral: rng.range(-(opts.spread ?? 1), opts.spread ?? 1),
    loop: opts.loop ?? true,
    idle: opts.idle,
    color: rng.pick(colors),
    scale: rng.range(0.92, 1.06),
  }));
}

/** Instanced crowd; positions are a pure function of `time`. `visible` 0..1 scales agents in/out. */
export function Crowd({ agents, time, visible = 1, skin = PALETTE.skinTones[1], castShadow = false }: { agents: readonly CrowdAgent[]; time: number; visible?: number; skin?: string; castShadow?: boolean }) {
  const { bodies, headsSpecs } = useMemo(() => {
    const bodies: InstanceSpec[] = [];
    const headsSpecs: InstanceSpec[] = [];
    agents.forEach((a, i) => {
      const d = a.idle ? a.offset ?? 0 : (a.offset ?? 0) + time * (a.speed ?? 1.1);
      const { p, heading } = pointOnPath(a.path, d, a.loop ?? true);
      const lx = Math.cos(heading) * (a.lateral ?? 0);
      const lz = -Math.sin(heading) * (a.lateral ?? 0);
      const bob = a.idle ? 0 : Math.abs(Math.sin(time * 5.5 + i)) * 0.04;
      const s = (a.scale ?? 1) * Math.max(0.001, visible);
      const sway = a.idle ? 0 : Math.sin(time * 5.5 + i) * 0.05;
      bodies.push({ position: [p[0] + lx, p[1] + bob, p[2] + lz], rotation: [0, heading, sway], scale: s, color: a.color });
      headsSpecs.push({ position: [p[0] + lx, p[1] + bob + 1.58 * s, p[2] + lz], scale: s });
    });
    return { bodies, headsSpecs };
  }, [agents, time, visible]);
  return (
    <>
      <Instances geometry={bodyGeo()} material={matte()} items={bodies} castShadow={castShadow} />
      <Instances geometry={headGeo()} material={matte(skin)} items={headsSpecs} castShadow={castShadow} />
    </>
  );
}
