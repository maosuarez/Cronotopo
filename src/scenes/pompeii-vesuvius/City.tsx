"use client";

import { useMemo } from "react";
import { BufferGeometry, ConeGeometry, CylinderGeometry, Float32BufferAttribute, SphereGeometry } from "three";
import { cached, GEO } from "../kit/geometry";
import { Instances, type InstanceSpec } from "../kit/Instanced";
import { clamp, lerp } from "../kit/math";
import { hash01 } from "../kit/prng";
import type { SceneMaterials } from "./materials";
import { pumiceAt } from "./story";
import { BAKERY, BLOCKS, CITY, CURB, FORUM, FORUM_COLUMNS, HOUSES, SIDEWALK, STEPPING_STONES, STREET_X, STREET_Z, TEMPLE, WALLS, ZC, type Rect } from "./world";

/** Gable roof: triangular prism, ridge along z, base at y = 0 (1 × 1 × 1). */
const roofGeo = () =>
  cached("pv-roof", () => {
    const v = [
      [-0.5, 0, -0.5], [0.5, 0, -0.5], [0, 1, -0.5],
      [-0.5, 0, 0.5], [0.5, 0, 0.5], [0, 1, 0.5],
    ];
    const tris = [
      [0, 2, 1], [3, 4, 5], // gables
      [0, 3, 5], [0, 5, 2], // west slope
      [1, 2, 5], [1, 5, 4], // east slope
      [0, 1, 4], [0, 4, 3], // bottom
    ];
    const pos: number[] = [];
    for (const t of tris) for (const i of t) pos.push(...v[i]);
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  });
const columnGeo = () => cached("pv-col", () => new CylinderGeometry(0.42, 0.5, 1, 10).translate(0, 0.5, 0));
const stoneGeo = () => cached("pv-step", () => new CylinderGeometry(0.5, 0.5, 1, 9).translate(0, 0.5, 0));
const coneGeo = () => cached("pv-cone", () => new ConeGeometry(0.5, 1, 12).translate(0, 0.5, 0));
const domeGeo = () => cached("pv-dome", () => new SphereGeometry(1, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2));
const loafGeo = () => cached("pv-loaf", () => new CylinderGeometry(0.2, 0.22, 0.12, 8).translate(0, 0.06, 0));

const box = (r: Rect, y: number, h: number, color?: string): InstanceSpec => ({
  position: [(r.x0 + r.x1) / 2, y, (r.z0 + r.z1) / 2],
  scale: [r.x1 - r.x0, h, r.z1 - r.z0],
  color,
});

/** Static parts of the city that do not change with time (except intact → ruined at the excavation). */
function useStatic(ruined: boolean) {
  return useMemo(() => {
    const walls: InstanceSpec[] = WALLS.map((w) => ({ position: [w.x, CURB, w.z], scale: [w.sx, w.h * (ruined ? w.ruin : 1), w.sz], color: w.color }));
    const sidewalks: InstanceSpec[] = BLOCKS.map((b) => box({ x0: b.x0 - SIDEWALK, x1: b.x1 + SIDEWALK, z0: b.z0 - SIDEWALK, z1: b.z1 + SIDEWALK }, 0, CURB, "#c4b79c"));
    const stones: InstanceSpec[] = STEPPING_STONES.map(([x, z, alongZ]) => ({ position: [x, 0, z], scale: alongZ ? [0.62, 0.42, 1.0] : [1.0, 0.42, 0.62], color: "#7b746c" }));

    // forum: paving, colonnade, entablature
    const forumPaving = [box(FORUM, 0, 0.22, "#e2d8c3")];
    const colH = 3.6;
    const columns: InstanceSpec[] = FORUM_COLUMNS.map(([x, z], i) => ({
      position: [x, 0.22, z],
      scale: [0.62, colH * (ruined ? (hash01(i, 3) > 0.45 ? 1 : 0.25 + 0.5 * hash01(i, 4)) : 1), 0.62],
      color: "#efe8da",
    }));
    const f = FORUM;
    const ent: InstanceSpec[] = ruined
      ? []
      : [
          box({ x0: f.x0 + 1, x1: f.x0 + 1.8, z0: f.z0 + 12.4, z1: f.z1 - 1 }, 0.22 + colH, 0.5, "#e8e0cf"),
          box({ x0: f.x1 - 1.8, x1: f.x1 - 1, z0: f.z0 + 12.4, z1: f.z1 - 1 }, 0.22 + colH, 0.5, "#e8e0cf"),
          box({ x0: f.x0 + 1, x1: f.x1 - 1, z0: f.z1 - 1.8, z1: f.z1 - 1 }, 0.22 + colH, 0.5, "#e8e0cf"),
        ];

    // Temple of Jupiter
    const T = TEMPLE;
    const half = T.w / 2;
    const podiumTop = 0.22 + T.podium;
    const temple: InstanceSpec[] = [
      box({ x0: T.x - half, x1: T.x + half, z0: T.z0, z1: T.z1 }, 0.22, T.podium, "#d9cfbb"),
      box({ x0: T.x - 2.6, x1: T.x + 2.6, z0: T.z1, z1: T.z1 + 1.0 }, 0.22, T.podium * 0.66, "#d9cfbb"),
      box({ x0: T.x - 2.6, x1: T.x + 2.6, z0: T.z1 + 1.0, z1: T.z1 + 2.0 }, 0.22, T.podium * 0.33, "#d9cfbb"),
      box({ x0: T.x - half + 0.7, x1: T.x + half - 0.7, z0: T.z0 + 0.6, z1: T.z0 + 6.4 }, podiumTop, ruined ? 1.6 : T.colH, "#ede6d6"),
    ];
    if (!ruined) temple.push(box({ x0: T.x - half - 0.1, x1: T.x + half + 0.1, z0: T.z0 - 0.1, z1: T.z1 + 0.1 }, podiumTop + T.colH, 0.45, "#ede6d6"));
    const templeCols: InstanceSpec[] = [];
    for (let i = 0; i < 6; i++) templeCols.push({ position: [T.x - half + 0.75 + i * ((T.w - 1.5) / 5), podiumTop, T.z1 - 0.8], scale: [0.62, T.colH, 0.62] });
    for (const z of [T.z1 - 2.8, T.z1 - 4.8]) for (const x of [T.x - half + 0.75, T.x + half - 0.75]) templeCols.push({ position: [x, podiumTop, z], scale: [0.62, T.colH, 0.62] });
    if (ruined) templeCols.forEach((c, i) => ((c.scale as number[])[1] = T.colH * (i === 1 || i === 4 || i === 6 ? 1 : 0.2 + 0.45 * hash01(i, 8))));
    templeCols.forEach((c) => (c.color = "#f1ebde"));
    const templeRoof: InstanceSpec[] = ruined ? [] : [{ position: [T.x, podiumTop + T.colH + 0.45, (T.z0 + T.z1) / 2], scale: [T.w + 0.4, 0.75, T.z1 - T.z0 + 0.4], color: "#b8664a" }];

    // city walls with gates (north gate on the main street, towards Vesuvius)
    const tuff = "#b5a283";
    const wallH = 5.2;
    const cw: InstanceSpec[] = [];
    const run = (x0: number, z0: number, x1: number, z1: number, gaps: number[]) => {
      const alongX = z0 === z1;
      const a = alongX ? x0 : z0;
      const b = alongX ? x1 : z1;
      let s = a;
      for (const g of [...gaps, b + 4]) {
        const e = Math.min(b, g - 4);
        if (e > s) cw.push(alongX ? box({ x0: s, x1: e, z0: z0 - 1.5, z1: z0 + 1.5 }, 0, wallH, tuff) : box({ x0: x0 - 1.5, x1: x0 + 1.5, z0: s, z1: e }, 0, wallH, tuff));
        s = g + 4;
      }
    };
    run(CITY.x0, CITY.z0, CITY.x1, CITY.z0, [6]);
    run(CITY.x0, CITY.z1, CITY.x1, CITY.z1, [6]);
    run(CITY.x0, CITY.z0, CITY.x0, CITY.z1, [20]);
    run(CITY.x1, CITY.z0, CITY.x1, CITY.z1, [20]);
    const towers: [number, number][] = [[CITY.x0, CITY.z0], [CITY.x1, CITY.z0], [CITY.x0, CITY.z1], [CITY.x1, CITY.z1], [2, CITY.z0], [10, CITY.z0], [-35, CITY.z0], [40, CITY.z0], [CITY.x0, -18], [CITY.x1, -18]];
    for (const [x, z] of towers) cw.push(box({ x0: x - 2.6, x1: x + 2.6, z0: z - 2.6, z1: z + 2.6 }, 0, wallH + 1.2, "#a8957a"));
    if (ruined) cw.forEach((c) => ((c.scale as number[])[1] *= 0.7));

    return { walls, sidewalks, stones, forumPaving, columns, ent, temple, templeCols, templeRoof, cw };
  }, [ruined]);
}

/** Roofs: intact until their collapse time, then they sag, drop onto the pumice and stay there, flattened. */
function roofItems(t: number): InstanceSpec[] {
  const out: InstanceSpec[] = [];
  for (const h of HOUSES) {
    const cx = (h.x0 + h.x1) / 2;
    const cz = (h.z0 + h.z1) / 2;
    const w = h.x1 - h.x0;
    const d = h.z1 - h.z0;
    const along = h.ridgeX ? w : d;
    const across = h.ridgeX ? d : w;
    const rotY = h.ridgeX ? Math.PI / 2 : 0;
    const top = CURB + h.h;
    const sag = clamp((t - (h.tc - 0.7)) / 0.7);
    const p = clamp((t - h.tc) / 0.75);
    if (p <= 0) {
      const wob = sag > 0 ? 0.03 * Math.sin(t * 40 + h.seed) * sag : 0;
      out.push({ position: [cx, top - 0.25 * sag * sag, cz], rotation: [wob, rotY, -wob], scale: [across + 0.5, h.roofH * (1 - 0.35 * sag), along + 0.5], color: h.roof });
      continue;
    }
    const rest = pumiceAt(h.tc + 0.75) + 0.12;
    const fall = p * p;
    const tiltA = (hash01(h.seed, 1) - 0.5) * 0.5 * p;
    const tiltB = (hash01(h.seed, 2) - 0.5) * 0.4 * p;
    out.push({
      position: [cx, lerp(top - 0.25, rest, fall), cz],
      rotation: [tiltA, rotY, tiltB],
      scale: [(across + 0.5) * lerp(1, 0.86, p), h.roofH * lerp(0.65, 0.25, p), (along + 0.5) * lerp(1, 0.88, p)],
      color: h.roof,
    });
  }
  return out;
}

function Bakery({ mats, t, ruined }: { mats: SceneMaterials; t: number; ruined: boolean }) {
  const B = BAKERY;
  const y = CURB;
  const mills: [number, number][] = [[B.x0 + 2.6, B.z0 + 2.3], [B.x0 + 2.6, B.z1 - 2.3], [B.x0 + 5.6, (B.z0 + B.z1) / 2 + 0.4]];
  const millItems = useMemo(() => {
    const base: InstanceSpec[] = [];
    const cones: InstanceSpec[] = [];
    for (const [x, z] of mills) {
      base.push({ position: [x, y, z], scale: [1.6, 0.45, 1.6] });
      cones.push({ position: [x, y + 0.45, z], scale: [1.0, 0.95, 1.0] }); // meta (fixed lower stone)
    }
    return { base, cones };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // catillus: hourglass upper stone = two cones apex to apex
  const hourglass: InstanceSpec[] = [];
  mills.forEach(([x, z], i) => {
    const rot = t * 0.7 + i;
    hourglass.push({ position: [x, y + 0.55, z], rotation: [0, rot, 0], scale: [1.15, 0.7, 1.15] });
    hourglass.push({ position: [x, y + 1.95, z], rotation: [Math.PI, rot, 0], scale: [1.05, 0.7, 1.05] });
  });
  const ovenX = B.x1 - 2.1;
  const ovenZ = B.z0 + 2.4;
  return (
    <group>
      <Instances geometry={stoneGeo()} material={mats.lava} items={millItems.base} castShadow receiveShadow />
      <Instances geometry={coneGeo()} material={mats.lava} items={millItems.cones} castShadow />
      {!ruined && <Instances geometry={coneGeo()} material={mats.lava} items={hourglass} castShadow />}
      {/* oven: masonry block, dome, glowing mouth facing the street */}
      <mesh geometry={GEO.boxBase()} material={mats.plaster} position={[ovenX, y, ovenZ]} scale={[3.2, 1.1, 3.4]} castShadow receiveShadow />
      <mesh geometry={domeGeo()} material={mats.plaster} position={[ovenX + 0.1, y + 1.1, ovenZ]} scale={[1.45, 1.2, 1.5]} castShadow />
      {!ruined && <mesh geometry={GEO.boxBase()} material={mats.oven} position={[ovenX - 1.62, y + 1.15, ovenZ]} scale={[0.05, 0.6, 0.9]} />}
      {/* counter with round loaves by the street */}
      <mesh geometry={GEO.boxBase()} material={mats.plaster} position={[B.x0 + 0.9, y, B.z0 + 3.3]} scale={[0.9, 0.95, 2.6]} castShadow />
      {!ruined && (
        <Instances
          geometry={loafGeo()}
          material={mats.stone}
          items={[0, 1, 2, 3, 4, 5].map((i) => ({ position: [B.x0 + 0.75 + (i % 2) * 0.32, y + 0.95, B.z0 + 2.4 + Math.floor(i / 2) * 0.62] as [number, number, number], color: "#b5793c" }))}
        />
      )}
    </group>
  );
}

export function City({ mats, t, ruined, roofs, shadows }: { mats: SceneMaterials; t: number; ruined: boolean; roofs: boolean; shadows: boolean }) {
  const s = useStatic(ruined);
  const roofList = useMemo(() => (roofs ? roofItems(t) : []), [roofs, t]);
  const box = GEO.boxBase();
  return (
    <group>
      <mesh material={mats.road} rotation={[-Math.PI / 2, 0, 0]} position={[(CITY.x0 + CITY.x1) / 2, 0.03, (CITY.z0 + CITY.z1) / 2]} receiveShadow>
        <planeGeometry args={[CITY.x1 - CITY.x0 + 6, CITY.z1 - CITY.z0 + 6]} />
      </mesh>
      <Instances geometry={box} material={mats.stone} items={s.sidewalks} receiveShadow />
      <Instances geometry={stoneGeo()} material={mats.stone} items={s.stones} castShadow={shadows} receiveShadow />
      <Instances geometry={box} material={mats.plaster} items={s.walls} castShadow={shadows} receiveShadow />
      {roofList.length > 0 && <Instances geometry={roofGeo()} material={mats.roof} items={roofList} castShadow={shadows} receiveShadow />}
      <Instances geometry={box} material={mats.stone} items={s.forumPaving} receiveShadow />
      <Instances geometry={columnGeo()} material={mats.stone} items={s.columns} castShadow={shadows} receiveShadow />
      {s.ent.length > 0 && <Instances geometry={box} material={mats.stone} items={s.ent} castShadow={shadows} />}
      <Instances geometry={box} material={mats.stone} items={s.temple} castShadow={shadows} receiveShadow />
      <Instances geometry={columnGeo()} material={mats.stone} items={s.templeCols} castShadow={shadows} receiveShadow />
      {s.templeRoof.length > 0 && <Instances geometry={roofGeo()} material={mats.roof} items={s.templeRoof} castShadow={shadows} />}
      <Instances geometry={box} material={mats.stone} items={s.cw} castShadow={shadows} receiveShadow />
      <Bakery mats={mats} t={t} ruined={ruined} />
    </group>
  );
}

/** Street grid helpers for people paths. */
export const MAIN_STREET_X = STREET_X[2];
export const MAIN_CROSS_Z = STREET_Z[2];

// ---------------------------------------------------------------- deposit

const EXTENT: Rect = { x0: -115, x1: 115, z0: -100, z1: 100 };

function depositPieces(hole: Rect | null): { r: Rect; south: boolean }[] {
  const E = EXTENT;
  const parts: Rect[] = hole
    ? [
        { x0: E.x0, x1: hole.x0, z0: E.z0, z1: E.z1 },
        { x0: hole.x1, x1: E.x1, z0: E.z0, z1: E.z1 },
        { x0: hole.x0, x1: hole.x1, z0: E.z0, z1: hole.z0 },
        { x0: hole.x0, x1: hole.x1, z0: hole.z1, z1: E.z1 },
      ]
    : [E];
  const zc = ZC - 0.03;
  const out: { r: Rect; south: boolean }[] = [];
  for (const r of parts) {
    if (r.x1 - r.x0 < 0.01 || r.z1 - r.z0 < 0.01) continue;
    if (r.z0 < zc) out.push({ r: { ...r, z1: Math.min(r.z1, zc) }, south: false });
    if (r.z1 > zc) out.push({ r: { ...r, z0: Math.max(r.z0, zc) }, south: true });
  }
  return out;
}

/** The volcanic deposit as solid boxes: tops show the surface, cut faces show the strata (shader by height). */
export function Deposit({ mats, level, hole, cut }: { mats: SceneMaterials; level: number; hole: Rect | null; cut: boolean }) {
  if (level <= 0.02) return null;
  const pieces = depositPieces(hole).filter((p) => !(cut && p.south));
  return (
    <group>
      {pieces.map(({ r }, i) => (
        <mesh
          key={i}
          geometry={GEO.boxBase()}
          material={mats.strata}
          position={[(r.x0 + r.x1) / 2, -10, (r.z0 + r.z1) / 2]}
          scale={[r.x1 - r.x0, level + 10.03, r.z1 - r.z0]}
          receiveShadow
        />
      ))}
    </group>
  );
}
