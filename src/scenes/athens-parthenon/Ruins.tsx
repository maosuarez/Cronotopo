"use client";

import { useMemo } from "react";
import { createRng, GEO, Instances, matte, smoothstep, type InstanceSpec } from "../kit";
import { COL, COLUMNS, DRUM_H, S, STYLO } from "./layout";

const CHARRED = ["#4a3d34", "#5e4e40", "#77654f", "#8f7c63", "#a39074"];

type Piece = InstanceSpec & { onPlatform: boolean; order: number; kind: "drum" | "block" | "beam" };

/** Debris of the Persian sack (480 a.C.): blackened column stumps, fallen drums, charred blocks and beams. */
function buildRuins(): Piece[] {
  const rng = createRng(480);
  const out: Piece[] = [];
  const color = () => rng.pick(CHARRED);
  // stumps of the unfinished older temple, on the same platform
  COLUMNS.filter((c) => !c.porch).forEach((c) => {
    if (rng.next() > 0.5) return;
    const n = rng.int(1, 4);
    for (let j = 0; j < n; j++) {
      const partial = j === n - 1 ? rng.range(0.35, 0.9) : 1;
      out.push({
        position: [c.x + rng.range(-0.06, 0.06), S + j * DRUM_H, c.z + rng.range(-0.06, 0.06)],
        rotation: [rng.range(-0.03, 0.03), rng.range(0, 6), rng.range(-0.03, 0.03)],
        scale: [COL.r * 2, DRUM_H * partial, COL.r * 2],
        color: color(),
        onPlatform: true,
        order: rng.next(),
        kind: "drum",
      });
    }
  });
  // fallen drums: on the platform and tumbled down its north side
  for (let i = 0; i < 46; i++) {
    const onPlatform = i < 22;
    const x = rng.range(-STYLO.halfX + 2, STYLO.halfX - 2);
    const z = onPlatform ? rng.range(-STYLO.halfZ + 2, STYLO.halfZ - 2) : rng.range(-30, -19);
    out.push({
      position: [x, (onPlatform ? S : 0) + COL.r * 0.9, z],
      rotation: [0, rng.range(0, Math.PI), Math.PI / 2 + rng.range(-0.15, 0.15)],
      scale: [COL.r * 2, DRUM_H, COL.r * 2],
      color: color(),
      onPlatform,
      order: rng.next(),
      kind: "drum",
    });
  }
  // charred blocks and roof beams
  for (let i = 0; i < 70; i++) {
    const onPlatform = i < 30;
    const x = onPlatform ? rng.range(-STYLO.halfX, STYLO.halfX) : rng.range(-50, 30);
    const z = onPlatform ? rng.range(-STYLO.halfZ, STYLO.halfZ) : rng.range(-56, -20);
    const beam = i % 3 === 0;
    const s: [number, number, number] = beam ? [rng.range(4, 7), 0.35, 0.35] : [rng.range(1, 2.4), rng.range(0.6, 1.1), rng.range(0.8, 1.6)];
    out.push({
      position: [x, (onPlatform ? S : 0) + (beam ? 0.17 : 0), z],
      rotation: [0, rng.range(0, Math.PI), beam ? rng.range(-0.1, 0.1) : rng.range(-0.08, 0.08)],
      scale: s,
      color: beam ? "#2c2420" : color(),
      onPlatform,
      order: rng.next(),
      kind: beam ? "beam" : "block",
    });
  }
  return out;
}

/** Platform debris is cleared during the Pericles beat; the rest disappears when construction starts. */
export function Ruins({ time, high }: { time: number; high: boolean }) {
  const all = useMemo(() => buildRuins(), []);
  const key = time < 10.4 ? 0 : time > 14 ? (time >= 20 ? 3 : 2) : Math.round(time * 20) / 20;
  const { drums, blocks } = useMemo(() => {
    const drums: InstanceSpec[] = [];
    const blocks: InstanceSpec[] = [];
    for (const p of all) {
      let k = 1;
      if (key === 3) k = 0;
      else if (p.onPlatform && key !== 0) k = key === 2 ? 0 : 1 - smoothstep(10.4 + p.order * 2.6, 11 + p.order * 2.6, key);
      if (k <= 0.001) continue;
      const s = p.scale as [number, number, number];
      const spec: InstanceSpec = { position: p.position, rotation: p.rotation, scale: [s[0] * k, s[1] * k, s[2] * k], color: p.color };
      (p.kind === "drum" ? drums : blocks).push(spec);
    }
    return { drums, blocks };
  }, [all, key]);
  if (key === 3) return null;
  return (
    <group>
      <Instances geometry={GEO.cylinder()} material={matte()} items={drums} castShadow={high} receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte()} items={blocks} castShadow={high} receiveShadow />
    </group>
  );
}
