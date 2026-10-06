"use client";

import { useMemo } from "react";
import { createRng, GEO, Instances, matte, PALETTE, scatter, Terrain, Vegetation, Water, type InstanceSpec, type ScatterArea } from "../kit";
import { CANALS, CITY, RIVER } from "./layout";

/**
 * The alluvial plain: flat irrigated land along the Euphrates, canals cutting through a patchwork of fields
 * and palm groves on every bank. Gentle relief only appears far from water and city (the desert edge).
 */

/** Distance (m) from (x, z) to the nearest water edge. */
function distanceToWater(x: number, z: number): number {
  const river = Math.abs(z - RIVER.z) - RIVER.halfWidth;
  const inSpan = (z0: number, z1: number) => (z >= z0 && z <= z1 ? 0 : Math.min(Math.abs(z - z0), Math.abs(z - z1)));
  const west = Math.hypot(Math.abs(x - CANALS.west.x) - CANALS.halfWidth, inSpan(CANALS.west.z0, CANALS.west.z1));
  const east = Math.hypot(Math.abs(x - CANALS.east.x) - CANALS.halfWidth, inSpan(CANALS.east.z0, CANALS.east.z1));
  const cross = Math.abs(z - CANALS.cross.z) - CANALS.halfWidth;
  return Math.max(0, Math.min(river, west, east, cross));
}

const distanceToCity = (x: number, z: number) => Math.max(0, Math.abs(x) - CITY.halfX, Math.abs(z) - CITY.halfZ);

/** Relief mask: 0 (perfectly flat) near water and city, 1 on the far plain. */
const reliefMask = (x: number, z: number) => {
  const d = Math.min(distanceToWater(x, z), distanceToCity(x, z) + 10);
  const k = Math.min(1, Math.max(0, (d - 45) / 60));
  return k * k * (3 - 2 * k);
};

/** Plain sits a hair below the water planes so canals never z-fight with the ground. */
const PLAIN_LEVEL = () => -0.05;

const nearWater = (pad: number) => (x: number, z: number) => distanceToWater(x, z) < pad;

/** Field patchwork between the canals (thin coloured slabs, one draw call). */
function useFields(density: number): InstanceSpec[] {
  return useMemo(() => {
    const rng = createRng(41);
    const colors = [PALETTE.grass, PALETTE.grassDry, PALETTE.leaf, PALETTE.soil, PALETTE.grassDry, PALETTE.grass];
    const out: InstanceSpec[] = [];
    const rows: { z0: number; z1: number }[] = [
      { z0: CANALS.cross.z + 5, z1: 240 },
      { z0: RIVER.z + RIVER.halfWidth + 6, z1: CANALS.cross.z - 5 },
    ];
    for (const { z0, z1 } of rows) {
      for (let x = -300; x < 300; x += 15) {
        for (let z = z0; z < z1; z += 9.5) {
          if (rng.next() > density) continue;
          const w = rng.range(10, 13.5);
          const d = rng.range(6.5, 8.5);
          const cx = x + 7.5;
          const cz = z + 4.75;
          if (distanceToWater(cx, cz) < 4 || distanceToCity(cx, cz) < 6 || reliefMask(cx, cz) > 0.02) continue;
          out.push({ position: [cx, -0.02, cz], scale: [w, 0.06, d], color: rng.pick(colors) });
        }
      }
    }
    return out;
  }, [density]);
}

const RIVER_BANKS: ScatterArea[] = [
  { x: 0, z: RIVER.z + RIVER.halfWidth + 4, w: 320, d: 3.5 },
  { x: 0, z: RIVER.z - RIVER.halfWidth - 4, w: 320, d: 3.5 },
];
const CANAL_BANKS: ScatterArea[] = [
  { x: CANALS.west.x, z: 80, w: 6, d: 170 },
  { x: CANALS.east.x, z: 80, w: 6, d: 170 },
  { x: 0, z: CANALS.cross.z, w: 300, d: 5.5 },
];
const GROVES: ScatterArea[] = [
  { x: -60, z: -65, w: 40, d: 8 },
  { x: 60, z: -66, w: 30, d: 7 },
  { x: -95, z: 40, w: 10, d: 30 },
  { x: 105, z: 20, w: 9, d: 30 },
];

export function Landscape({ time, quality }: { time: number; quality: "low" | "high" }) {
  const high = quality === "high";
  const fields = useFields(high ? 0.9 : 0.55);
  const canalBank = useMemo(() => nearWater(1.2), []);
  const palmCount = high ? 1 : 0.5;

  return (
    <group>
      <Terrain
        size={900}
        segments={high ? 150 : 100}
        amplitude={0.9}
        frequency={0.012}
        seed={11}
        mask={reliefMask}
        shape={PLAIN_LEVEL}
        bands={[
          [-99, "#c4a374"],
          [0.1, PALETTE.sand],
          [0.5, "#dcc49a"],
        ]}
      />
      <Instances geometry={GEO.boxBase()} material={matte()} items={fields} receiveShadow />

      {/* Euphrates and the canals that feed the fields */}
      <Water time={time} width={900} depth={RIVER.halfWidth * 2} position={[0, 0.03, RIVER.z]} />
      <Water time={time} width={CANALS.west.z1 - CANALS.west.z0} depth={CANALS.halfWidth * 2} position={[CANALS.west.x, 0.03, (CANALS.west.z0 + CANALS.west.z1) / 2]} rotationY={Math.PI / 2} wave={0.02} />
      <Water time={time} width={CANALS.east.z1 - CANALS.east.z0} depth={CANALS.halfWidth * 2} position={[CANALS.east.x, 0.03, (CANALS.east.z0 + CANALS.east.z1) / 2]} rotationY={Math.PI / 2} wave={0.02} />
      <Water time={time} width={CANALS.cross.x1 - CANALS.cross.x0} depth={CANALS.halfWidth * 2} position={[0, 0.03, CANALS.cross.z]} wave={0.02} />

      {/* palms along every bank, groves near the city, reeds at the river's edge */}
      {RIVER_BANKS.map((area, i) => (
        <Vegetation key={`r${i}`} kind="palm" area={area} count={Math.round(150 * palmCount)} seed={100 + i} size={1.9} castShadow={high} />
      ))}
      {CANAL_BANKS.map((area, i) => (
        <Vegetation key={`c${i}`} kind="palm" area={area} count={Math.round(90 * palmCount)} seed={200 + i} size={1.7} exclude={canalBank} castShadow={high} />
      ))}
      {GROVES.map((area, i) => (
        <Vegetation key={`g${i}`} kind="palm" area={area} count={Math.round(45 * palmCount)} seed={300 + i} size={1.8} castShadow={high} />
      ))}
      <Vegetation kind="reeds" area={{ x: 0, z: RIVER.z + RIVER.halfWidth + 0.8, w: 300, d: 0.8 }} count={Math.round(160 * palmCount)} seed={400} size={2} />
      <ScatteredBushes count={Math.round(70 * palmCount)} />
    </group>
  );
}

/** Dry scrub on the far plain, where the relief starts. */
function ScatteredBushes({ count }: { count: number }) {
  const points = useMemo(() => scatter(500, count, { x: 0, z: 120, w: 380, d: 160 }, (x, z) => reliefMask(x, z) < 0.3), [count]);
  return <Vegetation kind="bush" points={points} size={2.2} seed={501} />;
}
