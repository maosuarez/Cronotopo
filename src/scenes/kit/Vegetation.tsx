"use client";

import { useMemo } from "react";
import { GEO, matte } from "./geometry";
import { Instances, type InstanceSpec } from "./Instanced";
import { PALETTE } from "./palette";
import { createRng } from "./prng";
import type { HeightFn } from "./Terrain";

export type PlantKind = "palm" | "tree" | "cypress" | "bush" | "reeds";

export type ScatterArea = {
  /** Centre and half-extents of a rectangle on XZ. */
  x: number;
  z: number;
  w: number;
  d: number;
};

/** Deterministic scatter of points in an area, skipping excluded spots. */
export function scatter(
  seed: number,
  count: number,
  area: ScatterArea,
  exclude?: (x: number, z: number) => boolean,
): [number, number][] {
  const rng = createRng(seed);
  const out: [number, number][] = [];
  let guard = 0;
  while (out.length < count && guard++ < count * 20) {
    const x = area.x + rng.range(-area.w, area.w);
    const z = area.z + rng.range(-area.d, area.d);
    if (!exclude?.(x, z)) out.push([x, z]);
  }
  return out;
}

type Props = {
  kind: PlantKind;
  /** Explicit positions or a scatter definition. */
  points?: [number, number][];
  count?: number;
  area?: ScatterArea;
  exclude?: (x: number, z: number) => boolean;
  height?: HeightFn;
  seed?: number;
  /** Base size multiplier. */
  size?: number;
  /** 0..1 growth (e.g. vegetation reclaiming a site in a time-lapse). */
  growth?: number;
  castShadow?: boolean;
};

/** Instanced low-poly vegetation (2 draw calls per kind). */
export function Vegetation({ kind, points, count = 30, area = { x: 0, z: 0, w: 20, d: 20 }, exclude, height, seed = 7, size = 1, growth = 1, castShadow = false }: Props) {
  const layout = useMemo(() => {
    const pts = points ?? scatter(seed, count, area, exclude);
    const rng = createRng(seed + 99);
    return pts.map(([x, z]) => ({ x, z, y: height ? height(x, z) : 0, s: rng.range(0.75, 1.25), r: rng.range(0, Math.PI * 2), tint: rng.next() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, count, seed, area.x, area.z, area.w, area.d, exclude, height]);

  const g = Math.max(0.001, growth);
  const { trunks, crowns } = useMemo(() => {
    const trunks: InstanceSpec[] = [];
    const crowns: InstanceSpec[] = [];
    for (const p of layout) {
      const s = p.s * size * g;
      const leaf = p.tint > 0.5 ? PALETTE.leaf : PALETTE.palmLeaf;
      if (kind === "palm") {
        const h = 3.2 * s;
        trunks.push({ position: [p.x, p.y, p.z], rotation: [0.06 * Math.sin(p.r), p.r, 0.06 * Math.cos(p.r)], scale: [s * 1.4, h, s * 1.4] });
        crowns.push({ position: [p.x, p.y + h - s * 1.3, p.z], rotation: [0, p.r, 0], scale: s * 1.3, color: leaf });
      } else if (kind === "tree") {
        trunks.push({ position: [p.x, p.y, p.z], scale: [s * 0.25, s * 1.2, s * 0.25] });
        crowns.push({ position: [p.x, p.y + s * 0.4, p.z], rotation: [0, p.r, 0], scale: s * 1.4, color: leaf });
      } else if (kind === "cypress") {
        crowns.push({ position: [p.x, p.y, p.z], rotation: [0, p.r, 0], scale: [s, s * 1.6, s], color: PALETTE.leaf });
      } else if (kind === "bush") {
        crowns.push({ position: [p.x, p.y, p.z], rotation: [0, p.r, 0], scale: s * 1.2, color: p.tint > 0.5 ? PALETTE.grassDry : PALETTE.leaf });
      } else {
        crowns.push({ position: [p.x, p.y, p.z], rotation: [0, p.r, 0], scale: s * 1.4, color: PALETTE.grass });
      }
    }
    return { trunks, crowns };
  }, [layout, kind, size, g]);

  const crownGeo =
    kind === "palm" ? GEO.palmCrown() : kind === "tree" ? GEO.treeCrown() : kind === "cypress" ? GEO.cypress() : kind === "bush" ? GEO.bush() : GEO.reeds();
  return (
    <>
      {trunks.length > 0 && <Instances geometry={kind === "palm" ? GEO.palmTrunk() : GEO.cylinder()} material={matte(PALETTE.trunk)} items={trunks} castShadow={castShadow} />}
      <Instances geometry={crownGeo} material={matte()} items={crowns} castShadow={castShadow} />
    </>
  );
}
