"use client";

import { useMemo } from "react";
import { createRng, Figure, Instances, Label3D, lerp, matte, PALETTE, pathLength, pointOnPath, progress, window01, type InstanceSpec, type Vec3 } from "../kit";
import { URUK_GEO } from "./geometries";

/**
 * Beat "temple-economy": barley and livestock flowing into the Eanna. Porters carry sacks through the gate into
 * the storeroom, a shepherd drives a flock into the courtyard and the pile of sacks grows. Pure functions of time.
 */

/** Porters: from the street, through the gate, across the courtyard and in at the storeroom door. */
const PORTER_PATH: Vec3[] = [
  [21, 0, 40],
  [20.5, 0, 23],
  [22.5, 0, 15],
  [27.5, 0, 7.4],
  [30.2, 0, 7.4],
];
const PORTER_SPEED = 1.15;

/** Flock: up the street, through the gate, to a pen beside the small hall. */
const FLOCK_PATH: Vec3[] = [
  [14, 0, 80],
  [16, 0, 40],
  [19, 0, 23],
  [19, 0, 15.5],
  [13.5, 0, 12.5],
];
const FLOCK_SPEED = 1.0;

const SACK_COLORS = [PALETTE.linen, PALETTE.wool, "#d9c9a3", "#bfa77c"];
const WOOL_COLORS = ["#efe6d2", "#e4d8bf", "#d8c8a8", "#8a6f55", "#f2ead8"];

function Porters({ time, count, shadows }: { time: number; count: number; shadows: boolean }) {
  const L = pathLength(PORTER_PATH);
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const d = (((i / count) * L + time * PORTER_SPEED) % L + L) % L;
        const { p, heading } = pointOnPath(PORTER_PATH, d);
        // grow in at the street end and shrink away inside the doorway, so the loop never pops
        const s = Math.min(1, d / 2, (L - d) / 1.2);
        if (s <= 0.02) return null;
        return (
          <group key={i} position={p} rotation={[0, heading, 0]} scale={s}>
            <Figure pose="carry" t={time + i * 0.37} outfit={{ tunic: i % 2 ? PALETTE.linen : PALETTE.wool, skin: PALETTE.skinTones[i % 5] }} castShadow={shadows} />
            <mesh geometry={URUK_GEO.sack()} material={matte(SACK_COLORS[i % SACK_COLORS.length])} position={[0, 1.66, 0.02]} rotation={[0, 0, Math.PI / 2]} scale={0.62} castShadow={shadows} />
          </group>
        );
      })}
    </>
  );
}

function Flock({ time, count, shadows }: { time: number; count: number; shadows: boolean }) {
  const L = pathLength(FLOCK_PATH);
  const sheep = useMemo(() => {
    const rng = createRng(12);
    return Array.from({ length: count }, (_, i) => ({
      start: 57 - i * 1.45 + rng.range(-0.4, 0.4),
      stop: L - 0.3 - i * 0.62,
      lateral: rng.range(-0.9, 0.9),
      color: rng.pick(WOOL_COLORS),
      phase: rng.range(0, 6),
      scale: rng.range(0.85, 1.05),
    }));
  }, [count, L]);

  const { wool, dark, last } = useMemo(() => {
    const wool: InstanceSpec[] = [];
    const dark: InstanceSpec[] = [];
    let last = Infinity;
    for (const s of sheep) {
      const free = s.start + FLOCK_SPEED * (time - 12);
      const d = Math.min(free, s.stop);
      const moving = free < s.stop;
      last = Math.min(last, d);
      const { p, heading } = pointOnPath(FLOCK_PATH, d);
      const lx = Math.cos(heading) * s.lateral;
      const lz = -Math.sin(heading) * s.lateral;
      const bob = moving ? Math.abs(Math.sin(time * 7 + s.phase)) * 0.05 : 0;
      // grazing sheep at rest turn a little and lower the head (whole-body tilt, cheap)
      const graze = moving ? 0 : 0.12 + 0.06 * Math.sin(time * 0.8 + s.phase);
      const pose = { position: [p[0] + lx, bob, p[2] + lz] as Vec3, rotation: [graze, heading + (moving ? 0 : s.phase - 3) * 0.3, 0] as Vec3, scale: s.scale };
      wool.push({ ...pose, color: s.color });
      dark.push(pose);
    }
    return { wool, dark, last };
  }, [sheep, time]);

  // the shepherd follows the last sheep and stops when the flock settles
  const shepherdD = Math.max(0, last - 2.2);
  const shepherd = pointOnPath(FLOCK_PATH, shepherdD);
  const walking = last < sheep[sheep.length - 1].stop - 0.01;

  return (
    <>
      <Instances geometry={URUK_GEO.sheepWool()} material={matte()} items={wool} castShadow={shadows} />
      <Instances geometry={URUK_GEO.sheepDark()} material={matte("#3b3029")} items={dark} castShadow={shadows} />
      <Figure
        position={[shepherd.p[0] + 0.8, 0, shepherd.p[2]]}
        rotationY={shepherd.heading}
        pose={walking ? "walk" : "stand"}
        t={time}
        outfit={{ tunic: PALETTE.wool, robe: true, head: "wrap", headColor: PALETTE.linen, skin: PALETTE.skinTones[3] }}
        castShadow={shadows}
      />
    </>
  );
}

/** Pyramid of sacks that grows as porters arrive (one instanced draw call). */
function SackPile({ time, origin }: { time: number; origin: Vec3 }) {
  const all = useMemo(() => {
    const rng = createRng(31);
    const out: InstanceSpec[] = [];
    const layers: [number, number][] = [
      [5, 3],
      [4, 2],
      [3, 1],
      [2, 1],
    ];
    layers.forEach(([nx, nz], layer) => {
      for (let iz = 0; iz < nz; iz++) {
        for (let ix = 0; ix < nx; ix++) {
          out.push({
            position: [origin[0] + (ix - (nx - 1) / 2) * 0.52, layer * 0.48, origin[2] + (iz - (nz - 1) / 2) * 0.5],
            rotation: [rng.range(-0.15, 0.15), rng.range(0, Math.PI), rng.range(-0.1, 0.1)],
            scale: [rng.range(0.9, 1.05), 0.8, rng.range(0.9, 1.05)],
            color: rng.pick(SACK_COLORS),
          });
        }
      }
    });
    return out;
  }, [origin]);
  const shown = Math.round(lerp(9, all.length, progress(time, 12.5, 23)));
  const items = useMemo(() => all.slice(0, shown), [all, shown]);
  return <Instances geometry={URUK_GEO.sack()} material={matte()} items={items} castShadow receiveShadow />;
}

const PILE_ORIGIN: Vec3 = [25.2, 0, 5.6];

export function TempleEconomy({ time, quality }: { time: number; quality: "low" | "high" }) {
  const high = quality === "high";
  const labels = window01(time, 14.6, 15.4, 22.4, 23.2);
  return (
    <group>
      <Porters time={time} count={high ? 8 : 5} shadows={high} />
      <Flock time={time} count={high ? 16 : 9} shadows={high} />
      <SackPile time={time} origin={PILE_ORIGIN} />
      {/* an overseer directs the porters; two workers stack sacks */}
      <Figure position={[25.8, 0, 11.2]} rotationY={-2.4} pose="point" outfit={{ tunic: PALETTE.dyeBlue, robe: true, head: "cap", headColor: PALETTE.linen, skin: PALETTE.skinTones[2] }} castShadow={high} />
      <Figure position={[23.8, 0, 6.6]} rotationY={1.2} pose="work" t={time} outfit={{ tunic: PALETTE.linen, skin: PALETTE.skinTones[0] }} castShadow={high} />
      <Figure position={[26.6, 0, 6.8]} rotationY={-1.6} pose="work" t={time + 0.6} outfit={{ tunic: PALETTE.wool, skin: PALETTE.skinTones[4] }} castShadow={high} />

      <Label3D position={[PILE_ORIGIN[0], 2.7, PILE_ORIGIN[2]]} opacity={labels} size="sm">
        Cebada
      </Label3D>
      <Label3D position={[14.5, 2.2, 13]} opacity={labels} size="sm">
        Rebaños
      </Label3D>
    </group>
  );
}
