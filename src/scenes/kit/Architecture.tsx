"use client";

import { useMemo } from "react";
import { BoxGeometry, CylinderGeometry } from "three";
import { cached, GEO, matte } from "./geometry";
import { Instances, type InstanceSpec } from "./Instanced";
import { PALETTE } from "./palette";
import { createRng } from "./prng";
import type { HeightFn } from "./Terrain";
import type { ScatterArea } from "./Vegetation";

/** Box with its base on y = position[1]. */
export function Block({
  position,
  size,
  color = PALETTE.mudbrick,
  rotationY = 0,
  castShadow = true,
  receiveShadow = true,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color?: string;
  rotationY?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
}) {
  return (
    <mesh geometry={GEO.boxBase()} material={matte(color)} position={position} scale={size} rotation={[0, rotationY, 0]} castShadow={castShadow} receiveShadow={receiveShadow} />
  );
}

/** Stepped platform / terrace (ziggurat, stylobate, pyramid courses). `steps` levels shrinking by `inset`. */
export function Steps({
  position = [0, 0, 0],
  width,
  depth,
  stepHeight,
  steps,
  inset,
  color = PALETTE.limestone,
  visibleSteps = steps,
}: {
  position?: [number, number, number];
  width: number;
  depth: number;
  stepHeight: number;
  steps: number;
  inset: number;
  color?: string;
  /** Build-up animation: only the first n (fractional → last one scales up) are shown. */
  visibleSteps?: number;
}) {
  const items = useMemo(() => {
    const out: InstanceSpec[] = [];
    for (let i = 0; i < steps; i++) {
      const grow = Math.min(1, Math.max(0, visibleSteps - i));
      if (grow <= 0) break;
      out.push({ position: [position[0], position[1] + i * stepHeight, position[2]], scale: [width - 2 * inset * i, stepHeight * grow, depth - 2 * inset * i] });
    }
    return out;
  }, [position, width, depth, stepHeight, steps, inset, visibleSteps]);
  return <Instances geometry={GEO.boxBase()} material={matte(color)} items={items} castShadow receiveShadow />;
}

/** Instanced flat-roofed houses scattered in an area (towns of mud-brick, stone or brick). */
export function Town({
  seed = 3,
  count = 80,
  area,
  exclude,
  height,
  colors = [PALETTE.mudbrick, PALETTE.mudbrickDark, PALETTE.sandDark],
  minSize = [2, 1.6, 2],
  maxSize = [4.5, 3.2, 4.5],
  growth = 1,
}: {
  seed?: number;
  count?: number;
  area: ScatterArea;
  exclude?: (x: number, z: number) => boolean;
  height?: HeightFn;
  colors?: readonly string[];
  minSize?: [number, number, number];
  maxSize?: [number, number, number];
  /** 0..1: fraction of houses shown (time-lapse growth), in seeded order. */
  growth?: number;
}) {
  const all = useMemo(() => {
    const rng = createRng(seed);
    const out: InstanceSpec[] = [];
    let guard = 0;
    while (out.length < count && guard++ < count * 30) {
      const x = area.x + rng.range(-area.w, area.w);
      const z = area.z + rng.range(-area.d, area.d);
      if (exclude?.(x, z)) continue;
      const sx = rng.range(minSize[0], maxSize[0]);
      const sy = rng.range(minSize[1], maxSize[1]);
      const sz = rng.range(minSize[2], maxSize[2]);
      out.push({ position: [x, height ? height(x, z) - 0.2 : 0, z], scale: [sx, sy, sz], rotation: [0, rng.int(0, 3) * (Math.PI / 2) + rng.range(-0.05, 0.05), 0], color: rng.pick(colors) });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed, count, area.x, area.z, area.w, area.d, exclude, height]);
  const items = useMemo(() => all.slice(0, Math.round(all.length * Math.min(1, Math.max(0, growth)))), [all, growth]);
  return <Instances geometry={GEO.boxBase()} material={matte()} items={items} castShadow receiveShadow />;
}

const shaftGeo = () => cached("col-shaft", () => new CylinderGeometry(0.42, 0.5, 1, 16, 1).translate(0, 0.5, 0));
const capitalGeo = () => cached("col-capital", () => new BoxGeometry(1.25, 0.25, 1.25).translate(0, 0.125, 0));
const echinusGeo = () => cached("col-echinus", () => new CylinderGeometry(0.62, 0.45, 0.22, 16).translate(0, 0.11, 0));

/**
 * Doric-style column made of `drums`; `built` (0..drums) animates the stacking, drum by drum.
 * `entasis` (0..1) exaggerates the bulge for didactic shots.
 */
export function Column({
  position,
  height = 10,
  radius = 0.95,
  drums = 10,
  built = drums,
  color = PALETTE.marble,
  entasis = 0,
}: {
  position: [number, number, number];
  height?: number;
  radius?: number;
  drums?: number;
  built?: number;
  color?: string;
  entasis?: number;
}) {
  const capH = height * 0.06;
  const shaftH = height - capH;
  const drumH = shaftH / drums;
  const parts: InstanceSpec[] = [];
  for (let i = 0; i < drums; i++) {
    const k = Math.min(1, Math.max(0, built - i));
    if (k <= 0) break;
    const u = (i + 0.5) / drums;
    const bulge = 1 + entasis * 0.18 * Math.sin(Math.PI * u) - 0.12 * u;
    // falling-into-place: the drum descends during its last fraction
    const drop = (1 - k) * drumH * 3;
    parts.push({ position: [position[0], position[1] + i * drumH + drop, position[2]], scale: [radius * bulge * 2, drumH * 0.985, radius * bulge * 2] });
  }
  const done = built >= drums;
  return (
    <group>
      <Instances geometry={shaftGeo()} material={matte(color, { flat: false })} items={parts} castShadow receiveShadow />
      {done && (
        <group position={[position[0], position[1] + shaftH, position[2]]}>
          <mesh geometry={echinusGeo()} material={matte(color)} scale={[radius, 1, radius]} castShadow />
          <mesh geometry={capitalGeo()} material={matte(color)} position={[0, 0.2, 0]} scale={[radius * 1.1, capH / 0.25 * 0.6, radius * 1.1]} castShadow />
        </group>
      )}
    </group>
  );
}
