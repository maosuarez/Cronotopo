"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color } from "three";
import { ease, type InstanceSpec } from "../kit";
import { TG } from "./geometry";
import { AX, AZ, ARCH_TOP, CELLA, COL, COLUMNS, CORNICE_TOP, DRUM_H, IONIC_BOTTOM, PORCH_X, ROOF_H, S } from "./layout";
import { Parts } from "./Parts";
import { archDrop, bendAt, entasisAt, friezeDrop, paintAt, pedimentPaint, piecesBuilt, stripPaint, topDrop, wallsRise } from "./schedule";
import { createRefinedMaterial, createRefinementUniforms, disposeRefined } from "./templeMaterials";

const MARBLE = "#efe7d8";
const PAINT = {
  triglyph: "#24345a",
  metope: "#9b3d2e",
  ionicGround: "#2f5a92",
  tympanum: "#2f5a8e",
  strip: "#a8402e",
  gold: "#c9a040",
  figures: ["#9b3d2e", "#3e5a7a", "#c08a3e", "#5d6b3a", "#e6dcc3"],
  skin: "#c99a72",
};

const tmp = new Color();
/** Marble → paint colour, quantised so per-frame updates stay cheap and stable. */
function painted(hex: string, p: number): string {
  const q = Math.round(p * 12) / 12;
  return `#${tmp.set(MARBLE).lerp(new Color(hex), q).getHexString()}`;
}

type Side = { rotY: number; at: (u: number) => [number, number]; from: number; to: number; count: number };

/** Frieze sides: position along the side → (x, z) on the frieze face, and the rotation facing outwards. */
function friezeSides(offset: number): Side[] {
  return [
    { rotY: 0, at: (u) => [u, AZ + offset], from: -AX, to: AX, count: 32 },
    { rotY: Math.PI, at: (u) => [u, -AZ - offset], from: -AX, to: AX, count: 32 },
    { rotY: Math.PI / 2, at: (u) => [AX + offset, u], from: -AZ, to: AZ, count: 14 },
    { rotY: -Math.PI / 2, at: (u) => [-AX - offset, u], from: -AZ, to: AZ, count: 14 },
  ];
}

const distSE = (x: number, z: number) => Math.hypot(x - AX, z - AZ);

type StaticLayout = {
  triglyphs: { pos: [number, number, number]; rotY: number; d: number }[];
  metopes: { pos: [number, number, number]; rotY: number; d: number; n: [number, number] }[];
  walkers: { pos: [number, number, number]; rotY: number; d: number; c: string }[];
  horses: { pos: [number, number, number]; rotY: number; d: number; c: string }[];
  statues: { body: InstanceSpec; head: InstanceSpec; c: string; x: number }[];
  acroteria: [number, number, number][];
};

function buildLayout(): StaticLayout {
  const triglyphs: StaticLayout["triglyphs"] = [];
  const metopes: StaticLayout["metopes"] = [];
  for (const side of friezeSides(0.92)) {
    const step = (side.to - side.from) / side.count;
    const nx = Math.round(Math.sin(side.rotY));
    const nz = Math.round(Math.cos(side.rotY));
    for (let k = 0; k <= side.count; k++) {
      const [x, z] = side.at(side.from + k * step);
      triglyphs.push({ pos: [x + nx * 0.11, ARCH_TOP, z + nz * 0.11], rotY: side.rotY, d: distSE(x, z) });
    }
    for (let k = 0; k < side.count; k++) {
      const [x, z] = side.at(side.from + (k + 0.5) * step);
      metopes.push({ pos: [x + nx * 0.03, ARCH_TOP + 0.06, z + nz * 0.03], rotY: side.rotY, d: distSE(x, z), n: [nx, nz] });
    }
  }
  // Ionic frieze: a procession in relief around the cella (riders and walkers heading east).
  const walkers: StaticLayout["walkers"] = [];
  const horses: StaticLayout["horses"] = [];
  const ionicSides: Side[] = [
    { rotY: 0, at: (u) => [u, CELLA.halfZ + 0.2], from: -28.6, to: 28.6, count: 60 },
    { rotY: Math.PI, at: (u) => [u, -CELLA.halfZ - 0.2], from: -28.6, to: 28.6, count: 60 },
    { rotY: Math.PI / 2, at: (u) => [PORCH_X + 1.1, u], from: -10, to: 10, count: 21 },
    { rotY: -Math.PI / 2, at: (u) => [-PORCH_X - 1.1, u], from: -10, to: 10, count: 21 },
  ];
  ionicSides.forEach((side, si) => {
    const step = (side.to - side.from) / side.count;
    for (let k = 0; k <= side.count; k++) {
      const [x, z] = side.at(side.from + k * step);
      const c = PAINT.figures[(k * 7 + si * 3) % PAINT.figures.length];
      const spec = { pos: [x, IONIC_BOTTOM + 0.1, z] as [number, number, number], rotY: side.rotY, d: distSE(x, z), c };
      if (si < 2 && k % 4 === 1) horses.push(spec);
      else walkers.push(spec);
    }
  });
  // Pediment sculptures: standing gods in the middle, seated/reclining figures towards the corners.
  const statues: StaticLayout["statues"] = [];
  const half = AZ + 1.2;
  for (const sx of [-1, 1]) {
    for (let k = -6; k <= 6; k++) {
      const z = k * 2.05;
      const room = ROOF_H * (1 - Math.abs(z) / half) - 0.35;
      const x = sx * (AX + 0.95);
      const c = PAINT.figures[(k + 6 + (sx > 0 ? 0 : 2)) % PAINT.figures.length];
      if (room > 1.6) {
        const s = Math.min(1.85, room / 1.72);
        statues.push({ body: { position: [x, CORNICE_TOP, z], scale: s }, head: { position: [x, CORNICE_TOP + 1.58 * s, z], scale: s }, c, x: sx });
      } else {
        // reclining: head towards the centre of the pediment
        const s = 1.25;
        const phi = -Math.sign(z) * 1.25;
        statues.push({
          body: { position: [x, CORNICE_TOP + 0.05, z], rotation: [phi, 0, 0], scale: s },
          head: { position: [x, CORNICE_TOP + 0.05 + 1.58 * s * Math.cos(phi), z + 1.58 * s * Math.sin(phi)], scale: s },
          c,
          x: sx,
        });
      }
    }
  }
  const acroteria: [number, number, number][] = [];
  for (const sx of [-1, 1]) {
    acroteria.push([sx * (AX + 1.2), CORNICE_TOP + ROOF_H + 0.3, 0], [sx * (AX + 1.2), CORNICE_TOP, AZ + 1.4], [sx * (AX + 1.2), CORNICE_TOP, -AZ - 1.4]);
  }
  return { triglyphs, metopes, walkers, horses, statues, acroteria };
}

/** Drop-in offset for time-lapse assembly (k: 0 → hidden above, 1 → in place). */
const dropY = (k: number) => (1 - ease.out(k)) * 5;

/**
 * The Parthenon, assembled over time: crepidoma always present, columns stacked drum by drum, cella walls rising,
 * entablature dropped in, then painted. All meshes share the optical-refinement shader (curvature + entasis).
 */
export function Temple({ time, high }: { time: number; high: boolean }) {
  const uniforms = useMemo(() => createRefinementUniforms(), []);
  const mats = useMemo(
    () => ({
      marble: createRefinedMaterial(uniforms, MARBLE),
      roof: createRefinedMaterial(uniforms, "#ddd3c2"),
      drum: createRefinedMaterial(uniforms, MARBLE, { entasis: true }),
      tinted: createRefinedMaterial(uniforms, "#ffffff"),
      tympanum: createRefinedMaterial(uniforms, MARBLE),
      strip: createRefinedMaterial(uniforms, MARBLE),
      ionic: createRefinedMaterial(uniforms, MARBLE),
    }),
    [uniforms],
  );
  useLayoutEffect(() => () => disposeRefined(mats), [mats]);

  const [bx, bz] = bendAt(time);
  uniforms.uBend.value.set(bx, bz);
  uniforms.uEntasis.value = entasisAt(time);

  const layout = useMemo(() => buildLayout(), []);

  // Column drums + capitals.
  const buildKey = time < 20 ? 0 : time > 29.5 ? 2 : time;
  const { drums, capitals } = useMemo(() => {
    const drums: InstanceSpec[] = [];
    const capitals: InstanceSpec[] = [];
    const t = buildKey === 0 ? 0 : buildKey === 2 ? 99 : buildKey;
    COLUMNS.forEach((c, i) => {
      const built = piecesBuilt(i, t);
      for (let j = 0; j < 11; j++) {
        const k = Math.min(1, Math.max(0, built - j));
        if (k <= 0) break;
        const drop = (1 - ease.out(k)) * 2.4;
        if (j < COL.drums) drums.push({ position: [c.x, S + j * DRUM_H + drop, c.z], scale: [c.r, DRUM_H * 0.992, c.r] });
        else capitals.push({ position: [c.x, S + COL.shaft + drop, c.z], scale: c.r / COL.r });
      }
    });
    return { drums, capitals };
  }, [buildKey]);

  // Polychromy (only recomputed while the paint wave is moving).
  const paintKey = time < 51.5 ? 0 : time > 60 ? 1 : Math.round(time * 15) / 15;
  const paint = useMemo(() => {
    const t = paintKey === 0 ? 0 : paintKey === 1 ? 99 : paintKey;
    const ped = pedimentPaint(t);
    const turn = (rotY: number): [number, number, number] => [0, rotY, 0];
    return {
      triglyphs: layout.triglyphs.map((g) => ({ position: g.pos, rotation: turn(g.rotY), color: painted(PAINT.triglyph, paintAt(t, g.d)) })),
      metopes: layout.metopes.map((m) => ({ position: m.pos, rotation: turn(m.rotY), color: painted(PAINT.metope, paintAt(t, m.d)) })),
      reliefs: layout.metopes.map((m, i) => ({
        position: [m.pos[0] + m.n[0] * 0.08, m.pos[1] + 0.12, m.pos[2] + m.n[1] * 0.08] as [number, number, number],
        rotation: turn(m.rotY),
        color: painted(i % 2 ? PAINT.skin : PAINT.figures[i % 4], paintAt(t, m.d + 2)),
      })),
      walkers: layout.walkers.map((w) => ({ position: w.pos, rotation: turn(w.rotY), color: painted(w.c, paintAt(t, w.d + 4)) })),
      horses: layout.horses.map((w) => ({ position: w.pos, rotation: turn(w.rotY), color: painted("#8a6a4a", paintAt(t, w.d + 4)) })),
      bodies: layout.statues.map((s) => ({ ...s.body, color: painted(s.c, ped) })),
      heads: layout.statues.map((s) => ({ ...s.head, color: painted(PAINT.skin, ped) })),
      acroteria: layout.acroteria.map((p) => ({ position: p, color: painted(PAINT.gold, ped) })),
      ionicGround: painted(PAINT.ionicGround, paintAt(t, 18)),
      tympanum: painted(PAINT.tympanum, ped),
      strip: painted(PAINT.strip, stripPaint(t)),
    };
  }, [paintKey, layout]);
  mats.tympanum.material.color.set(paint.tympanum);
  mats.strip.material.color.set(paint.strip);
  mats.ionic.material.color.set(paint.ionicGround);

  const walls = wallsRise(time);
  const arch = archDrop(time);
  const frieze = friezeDrop(time);
  const top = topDrop(time);
  const cs = high;
  const m = (k: keyof typeof mats) => ({ material: mats[k].material, customDepthMaterial: mats[k].depth });

  return (
    <group>
      <mesh geometry={TG.crepidoma()} {...m("marble")} castShadow={cs} receiveShadow />
      <Parts geometry={TG.drum()} material={mats.drum.material} depth={mats.drum.depth} items={drums} castShadow={cs} receiveShadow />
      <Parts geometry={TG.capital()} material={mats.marble.material} depth={mats.marble.depth} items={capitals} castShadow={cs} receiveShadow />
      {walls > 0.001 && (
        <group position={[0, S, 0]} scale={[1, walls, 1]}>
          <mesh geometry={TG.walls()} {...m("marble")} castShadow={cs} receiveShadow />
          <mesh geometry={TG.innerColonnade()} {...m("marble")} castShadow={cs} receiveShadow />
        </group>
      )}
      {arch > 0 && (
        <group position={[0, dropY(arch), 0]}>
          <mesh geometry={TG.architrave()} {...m("marble")} castShadow={cs} receiveShadow />
        </group>
      )}
      {frieze > 0 && (
        <group position={[0, dropY(frieze), 0]}>
          <mesh geometry={TG.frieze()} {...m("marble")} castShadow={cs} receiveShadow />
          <Parts geometry={TG.triglyph()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.triglyphs} castShadow={cs} />
          <Parts geometry={TG.metope()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.metopes} />
          <Parts geometry={TG.metopeRelief()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.reliefs} />
          <mesh geometry={TG.ionicSkin()} {...m("ionic")} />
          <Parts geometry={TG.ionicWalker()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.walkers} />
          <Parts geometry={TG.ionicHorse()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.horses} />
        </group>
      )}
      {top > 0 && (
        <group position={[0, dropY(top), 0]}>
          <mesh geometry={TG.cornice()} {...m("marble")} castShadow={cs} receiveShadow />
          <mesh geometry={TG.roof()} {...m("roof")} castShadow={cs} receiveShadow />
          <mesh geometry={TG.tympanum()} {...m("tympanum")} />
          <mesh geometry={TG.strip()} {...m("strip")} />
          <Parts geometry={TG.statueBody()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.bodies} castShadow={cs} />
          <Parts geometry={TG.statueHead()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.heads} />
          <Parts geometry={TG.acroterion()} material={mats.tinted.material} depth={mats.tinted.depth} items={paint.acroteria} />
        </group>
      )}
    </group>
  );
}
