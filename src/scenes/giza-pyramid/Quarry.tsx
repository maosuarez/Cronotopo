"use client";

import { useMemo } from "react";
import { createRng, Figure, GEO, Instances, matte, PALETTE, Particles, PARTICLES, progress, ease, type InstanceSpec } from "../kit";
import type { SceneQuality } from "../types";
import { CORE_COLOR } from "./Pyramid";
import { QUARRY } from "./world";

const ROCK = "#c9a874";
const ROCK_CUT = "#d9bf91";
const FLOOR_Y = -QUARRY.depth;
const BLOCK = { w: 1.7, h: 1.15, gap: 0.4 };

/** Rectangular ring of four boxes (walls of the pit) between inner and outer half-extents. */
function ring(inner: [number, number], outer: [number, number], y0: number, y1: number, color: string): InstanceSpec[] {
  const [ix, iz] = inner;
  const [ox, oz] = outer;
  const h = y1 - y0;
  const tx = ox - ix;
  return [
    { position: [QUARRY.x, y0, QUARRY.z - (iz + oz) / 2], scale: [2 * ox, h, oz - iz], color },
    { position: [QUARRY.x, y0, QUARRY.z + (iz + oz) / 2], scale: [2 * ox, h, oz - iz], color },
    { position: [QUARRY.x - ix - tx / 2, y0, QUARRY.z], scale: [tx, h, 2 * iz], color },
    { position: [QUARRY.x + ix + tx / 2, y0, QUARRY.z], scale: [tx, h, 2 * iz], color },
  ];
}

/** Block grid still in the bedrock bench: `cut` blocks are already gone (seeded order from the east side). */
function useBench() {
  return useMemo(() => {
    const step = BLOCK.w + BLOCK.gap;
    const cols = 11;
    const rows = 8;
    const x0 = QUARRY.x - 18;
    const z0 = QUARRY.z - ((rows - 1) * step) / 2;
    const rng = createRng(21);
    const slots: { x: number; z: number; gone: boolean; tint: string }[] = [];
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        // The eastern columns are already quarried away, with a ragged front.
        const gone = c > 7 - (r % 3 === 0 ? 1 : 0) || (c === 7 && rng.next() > 0.5);
        slots.push({ x: x0 + c * step, z: z0 + r * step, gone, tint: rng.next() > 0.5 ? ROCK_CUT : ROCK });
      }
    }
    return slots;
  }, []);
}

/** Positions of the workers in the trenches and on the bench. */
const CREW: { p: [number, number]; ry: number; pose: "work" | "point" | "stand" | "carry"; ph: number }[] = [
  { p: [-15.2, -2.5], ry: 0.4, pose: "work", ph: 0 },
  { p: [-11.4, 1.4], ry: -1.2, pose: "work", ph: 0.35 },
  { p: [-7.6, -4.4], ry: 2.6, pose: "work", ph: 0.7 },
  { p: [-3.8, 3.3], ry: 1.1, pose: "work", ph: 0.2 },
  { p: [-0.1, -0.6], ry: -0.6, pose: "work", ph: 0.55 },
  { p: [2.2, 4.8], ry: 3.0, pose: "work", ph: 0.9 },
  { p: [5.0, -2.0], ry: -1.6, pose: "point", ph: 0 },
  { p: [8.5, 1.5], ry: 1.8, pose: "work", ph: 0.15 },
  { p: [10.5, -4.0], ry: 0.2, pose: "work", ph: 0.65 },
  { p: [12.5, 3.0], ry: -2.2, pose: "stand", ph: 0 },
  { p: [-13.3, 5.2], ry: 0.9, pose: "work", ph: 0.45 },
  { p: [6.8, 6.4], ry: 2.2, pose: "work", ph: 0.8 },
];

export function Quarry({ time, quality, dust }: { time: number; quality: SceneQuality; dust: number }) {
  const high = quality === "high";
  const bench = useBench();
  const walls = useMemo(
    () => [
      ...ring([QUARRY.w - QUARRY.wall, QUARRY.d - QUARRY.wall], [QUARRY.w, QUARRY.d], FLOOR_Y - 0.5, 0.15, ROCK),
      ...ring([QUARRY.w - QUARRY.wall - 3.5, QUARRY.d - QUARRY.wall - 3.5], [QUARRY.w - QUARRY.wall + 0.01, QUARRY.d - QUARRY.wall + 0.01], FLOOR_Y - 0.5, FLOOR_Y + 3.4, ROCK_CUT),
    ],
    [],
  );
  const floor = useMemo<InstanceSpec[]>(() => [{ position: [QUARRY.x, FLOOR_Y - 0.3, QUARRY.z], scale: [2 * QUARRY.w - 2, 0.32, 2 * QUARRY.d - 2], color: "#bf9f70" }], []);

  // One block is levered out of the bench and set on a sledge at the edge.
  const lift = ease.inOut(progress(time, 12.5, 15.5));
  const slide = ease.inOut(progress(time, 15.5, 19));
  const liftedSlot = bench.find((s, i) => !s.gone && i % 8 === 3 && bench[i + 8]?.gone) ?? bench[0];

  const blocks = useMemo<InstanceSpec[]>(() => {
    const out: InstanceSpec[] = bench
      .filter((s) => !s.gone && s !== liftedSlot)
      .map((s) => ({ position: [s.x, FLOOR_Y, s.z], scale: [BLOCK.w, BLOCK.h, BLOCK.w], color: s.tint }));
    // Roughly dressed blocks waiting on the floor of the cleared zone.
    for (let i = 0; i < 6; i++) out.push({ position: [QUARRY.x + 6 + (i % 3) * 2.4, FLOOR_Y, QUARRY.z + 5 + Math.floor(i / 3) * 2.4], rotation: [0, 0.1 * i, 0], scale: [1.6, 1.1, 1.9], color: CORE_COLOR });
    return out;
  }, [bench, liftedSlot]);
  const movingBlock: InstanceSpec[] = [
    {
      position: [liftedSlot.x + slide * 4.5, FLOOR_Y + lift * 1.3 - slide * 0.9 + 0.02, liftedSlot.z],
      rotation: [0, 0, lift * (1 - slide) * 0.08],
      scale: [BLOCK.w, BLOCK.h, BLOCK.w],
      color: ROCK_CUT,
    },
  ];
  const crew = high ? CREW : CREW.filter((_, i) => i % 2 === 0);

  return (
    <group>
      <Instances geometry={GEO.boxBase()} material={matte()} items={walls} castShadow receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte()} items={floor} receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte()} items={blocks} castShadow receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte()} items={movingBlock} castShadow />
      {crew.map((c, i) => (
        <Figure
          key={i}
          position={[QUARRY.x + c.p[0], FLOOR_Y, QUARRY.z + c.p[1]]}
          rotationY={c.ry}
          pose={c.pose}
          t={time + c.ph}
          speed={0.9}
          outfit={{ tunic: i % 3 === 0 ? PALETTE.linen : PALETTE.wool, skin: PALETTE.skinTones[i % 4], head: i % 4 === 1 ? "wrap" : "none", headColor: PALETTE.linen }}
          castShadow={high}
        />
      ))}
      {/* Levering crew around the rising block. */}
      <Figure position={[liftedSlot.x - 1.6, FLOOR_Y, liftedSlot.z + 0.2]} rotationY={Math.PI / 2} pose="push" t={time} speed={0.4} outfit={{ tunic: PALETTE.linen, skin: PALETTE.skinTones[0] }} castShadow={high} />
      <Figure position={[liftedSlot.x - 1.5, FLOOR_Y, liftedSlot.z - 1.2]} rotationY={Math.PI / 2} pose="push" t={time + 0.3} speed={0.4} outfit={{ tunic: PALETTE.wool, skin: PALETTE.skinTones[3] }} castShadow={high} />
      <Particles preset={PARTICLES.dust} time={time} position={[QUARRY.x - 8, FLOOR_Y + 0.4, QUARRY.z]} intensity={dust} density={high ? 1 : 0.5} seed={4} overrides={{ spread: [12, 0.2, 6], count: 140, size: [1, 3.5], opacity: 0.22 }} prewarm />
    </group>
  );
}
