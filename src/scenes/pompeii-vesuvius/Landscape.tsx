"use client";

import { useLayoutEffect, useMemo } from "react";
import { BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, Float32BufferAttribute, IcosahedronGeometry, PlaneGeometry } from "three";
import { cached, matte, merge } from "../kit/geometry";
import { Instances, type InstanceSpec } from "../kit/Instanced";
import { fbm2 } from "../kit/noise";
import { createRng, hash01 } from "../kit/prng";
import { Vegetation } from "../kit/Vegetation";
import type { SceneMaterials } from "./materials";
import { CITY, MISENUM, VOLCANO, ground, plain, volcanoPost, volcanoPre } from "./world";

const FIELD_COLORS = ["#7f8f4e", "#a59a5a", "#8d9a52", "#6f8546", "#b8a865", "#93904f"].map((c) => new Color(c));

function terrainColor(x: number, z: number, h: number, out: Color) {
  const inCity = x > CITY.x0 - 4 && x < CITY.x1 + 4 && z > CITY.z0 - 4 && z < CITY.z1 + 4;
  if (h < -2) return out.set("#9c8a66");
  if (h < 0.6 && plain(x, z) < 0.6 && x + 0.55 * z + 260 < 30) return out.set("#d6c296");
  if (inCity) return out.set("#8d7d64");
  const cx = Math.floor((x + 1000) / 38);
  const cz = Math.floor((z + 1000) / 30);
  out.copy(FIELD_COLORS[Math.floor(hash01(cx * 31.7 + cz * 7.3, 5) * FIELD_COLORS.length)]);
  const v = volcanoPre(x, z);
  if (v > 2) out.lerp(new Color("#56703a"), Math.min(1, v / 40));
  if (Math.hypot(x - MISENUM.x, z - MISENUM.z) < 70) out.set("#7d8a4c");
  return out.multiplyScalar(0.9 + 0.2 * fbm2(x * 0.05, z * 0.05, 3));
}

/** Face-coloured (flat) copy of an indexed/non-indexed geometry: colour picked at the face centroid. */
function colorFaces(g: BufferGeometry, pick: (x: number, y: number, z: number, out: Color) => Color) {
  const flat = g.index ? g.toNonIndexed() : g;
  const p = flat.attributes.position;
  const colors = new Float32Array(p.count * 3);
  const c = new Color();
  for (let i = 0; i < p.count; i += 3) {
    const x = (p.getX(i) + p.getX(i + 1) + p.getX(i + 2)) / 3;
    const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
    const z = (p.getZ(i) + p.getZ(i + 1) + p.getZ(i + 2)) / 3;
    pick(x, y, z, c);
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
  }
  flat.setAttribute("color", new BufferAttribute(colors, 3));
  flat.computeVertexNormals();
  return flat;
}

function buildTerrain() {
  const g = new PlaneGeometry(1250, 1150, 125, 115);
  g.rotateX(-Math.PI / 2);
  g.translate(-110, 0, -220);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) pos.setY(i, ground(pos.getX(i), pos.getZ(i)));
  const flat = colorFaces(g, (x, y, z, out) => terrainColor(x, z, y, out));
  g.dispose();
  return flat;
}

/** Polar grid cone (pre-79 heights) with the truncated post-79 summit as a morph target. */
function buildVolcano() {
  const rings = 52;
  const segs = 132;
  const radius = (i: number) => VOLCANO.r * 1.02 * (i / rings) ** 1.25;
  const tri: number[] = [];
  const post: number[] = [];
  const at = (i: number, j: number): [number, number] => {
    const r = radius(i);
    const a = (j / segs) * Math.PI * 2;
    return [VOLCANO.x + Math.cos(a) * r, VOLCANO.z + Math.sin(a) * r];
  };
  const push = (xz: [number, number]) => {
    tri.push(xz[0], volcanoPre(xz[0], xz[1]) + 0.6, xz[1]);
    post.push(xz[0], volcanoPost(xz[0], xz[1]) + 0.6, xz[1]);
  };
  for (let i = 0; i < rings; i++) {
    for (let j = 0; j < segs; j++) {
      const a = at(i, j);
      const b = at(i + 1, j);
      const c = at(i + 1, j + 1);
      const d = at(i, j + 1);
      if (i > 0) [a, d, b].forEach(push);
      [d, c, b].forEach(push);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(tri, 3));
  const colored = colorFaces(g, (x, y, z, out) => {
    const r = Math.hypot(x - VOLCANO.x, z - VOLCANO.z);
    const k = 1 - r / VOLCANO.r;
    const theta = Math.atan2(z - VOLCANO.z, x - VOLCANO.x);
    const n = fbm2(x * 0.03, z * 0.03, 11);
    if (k < 0.24) out.set(Math.sin(theta * 90) > 0 ? "#8fa055" : "#77893f");
    else if (k < 0.58) out.set(n > 0.5 ? "#4d6a33" : "#5b7a3b");
    else if (k < 0.86) out.set(n > 0.45 ? "#7b8452" : "#6d7a48");
    else out.set("#8a7c66");
    return out.multiplyScalar(0.88 + 0.24 * n);
  });
  colored.morphAttributes.position = [new Float32BufferAttribute(post, 3)];
  return colored;
}

/** Vineyard rows on the lower slopes and the plain north of the city. */
function vineyardRows(): InstanceSpec[] {
  const rng = createRng(31);
  const out: InstanceSpec[] = [];
  let guard = 0;
  while (out.length < 420 && guard++ < 400) {
    const a = rng.range(0.9, 2.3);
    const r = rng.range(VOLCANO.r * 0.62, VOLCANO.r * 1.25);
    const cx = VOLCANO.x + Math.cos(a) * r;
    const cz = VOLCANO.z + Math.sin(a) * r;
    if (cz > CITY.z0 - 20 || plain(cx, cz) < 1) continue;
    const rot = rng.range(-0.4, 0.4) + a;
    for (let row = 0; row < 7; row++) {
      for (let s = -1; s <= 1; s++) {
        const ox = Math.cos(rot) * row * 2.6 + Math.sin(rot) * s * 9;
        const oz = -Math.sin(rot) * row * 2.6 + Math.cos(rot) * s * 9;
        const x = cx + ox;
        const z = cz + oz;
        out.push({ position: [x, plain(x, z) + volcanoPre(x, z), z], rotation: [0, rot, 0], scale: [0.9, 1.3, 8.5], color: row % 2 ? "#5f7a35" : "#6c853c" });
      }
    }
  }
  return out;
}

const pineTrunk = () => cached("pv-pine-trunk", () => new CylinderGeometry(0.22, 0.42, 11, 6).translate(0, 5.5, 0).rotateZ(0.08));
const pineCrown = () =>
  cached("pv-pine-crown", () => {
    const lobes = [
      [0, 11.6, 0, 3.4],
      [2.6, 11.2, 1.2, 2.6],
      [-2.7, 11.0, 0.8, 2.5],
      [0.8, 11.3, -2.6, 2.6],
      [-1.2, 11.1, 2.4, 2.4],
      [3.4, 10.7, -1.6, 2.0],
      [-3.4, 10.6, -1.8, 2.1],
    ].map(([x, y, z, r]) => new IcosahedronGeometry(r, 1).scale(1.25, 0.42, 1.25).translate(x + 0.9, y, z));
    return merge(lobes);
  });

/** Italian stone pine: tall bare trunk opening into a flat umbrella crown (Pliny's image). */
function StonePine({ position, scale = 1, rotationY = 0 }: { position: [number, number, number]; scale?: number; rotationY?: number }) {
  return (
    <group position={position} scale={scale} rotation={[0, rotationY, 0]}>
      <mesh geometry={pineTrunk()} material={matte("#5a4431")} castShadow />
      <mesh geometry={pineCrown()} material={matte("#3c5a2c")} castShadow />
    </group>
  );
}

const vineGeo = () => cached("pv-vine", () => new BoxGeometry(1, 1, 1).translate(0, 0.5, 0));

export function Landscape({ mats, morph, ash, vines, oldTrees, misenum, shadows }: { mats: SceneMaterials; morph: number; ash: number; vines: boolean; oldTrees: boolean; misenum: boolean; shadows: boolean }) {
  const terrain = useMemo(() => buildTerrain(), []);
  const volcano = useMemo(() => buildVolcano(), []);
  const rows = useMemo(() => vineyardRows(), []);
  useLayoutEffect(() => () => terrain.dispose(), [terrain]);
  useLayoutEffect(() => () => volcano.dispose(), [volcano]);
  mats.landUniforms.uAsh.value = ash;
  const notInCity = useMemo(
    () => (x: number, z: number) => (x > CITY.x0 - 8 && x < CITY.x1 + 8 && z > CITY.z0 - 8 && z < CITY.z1 + 8) || plain(x, z) < 0.8 || volcanoPre(x, z) > 25,
    [],
  );
  return (
    <group>
      <mesh geometry={terrain} material={mats.land} receiveShadow />
      <mesh geometry={volcano} material={mats.volcano} morphTargetInfluences={[morph]} receiveShadow />
      <mesh material={mats.sea} rotation={[-Math.PI / 2, 0, 0]} position={[-200, -1.2, 0]}>
        <planeGeometry args={[3000, 3000]} />
      </mesh>
      {vines && <Instances geometry={vineGeo()} material={matte()} items={rows} />}
      {oldTrees && (
        <>
          <Vegetation kind="tree" count={150} seed={12} area={{ x: 0, z: -40, w: 230, d: 200 }} exclude={notInCity} height={ground} size={2.4} castShadow={shadows} />
          <Vegetation kind="cypress" count={40} seed={13} area={{ x: 0, z: -40, w: 200, d: 170 }} exclude={notInCity} height={ground} size={3} castShadow={shadows} />
          <Vegetation kind="cypress" points={[...Array(9)].map((_, i) => [i % 2 ? 1 : 11, -66 - i * 9] as [number, number])} height={ground} size={2.6} castShadow={shadows} />
        </>
      )}
      {misenum && (
        <>
          <StonePine position={[MISENUM.x - 12, ground(MISENUM.x - 12, MISENUM.z - 4) - 0.3, MISENUM.z - 4]} scale={1.15} />
          <StonePine position={[MISENUM.x + 14, ground(MISENUM.x + 14, MISENUM.z - 16) - 0.3, MISENUM.z - 16]} scale={0.8} rotationY={1.3} />
          <StonePine position={[MISENUM.x - 30, ground(MISENUM.x - 30, MISENUM.z + 6) - 0.3, MISENUM.z + 6]} scale={0.95} rotationY={2.2} />
          <Vegetation kind="bush" count={40} seed={5} area={{ x: MISENUM.x, z: MISENUM.z, w: 40, d: 40 }} exclude={(x, z) => plain(x, z) < 2} height={ground} size={2.2} />
        </>
      )}
    </group>
  );
}

/** Modern vegetation over the buried city: grows during the time-lapse. */
export function NewGrowth({ level, growth, exclude, shadows }: { level: number; growth: number; exclude: (x: number, z: number) => boolean; shadows: boolean }) {
  const height = useMemo(() => () => level, [level]);
  if (growth <= 0.01) return null;
  return (
    <>
      <Vegetation kind="bush" count={160} seed={41} area={{ x: -10, z: 0, w: 120, d: 33 }} exclude={exclude} height={height} size={1.8} growth={Math.min(1, growth * 1.6)} castShadow={shadows} />
      <Vegetation kind="tree" count={60} seed={42} area={{ x: -10, z: -10, w: 130, d: 43 }} exclude={exclude} height={height} size={2.3} growth={Math.max(0, growth * 1.3 - 0.3)} castShadow={shadows} />
      <Vegetation kind="reeds" count={200} seed={43} area={{ x: -10, z: 10, w: 120, d: 23 }} exclude={exclude} height={height} size={1.5} growth={Math.min(1, growth * 2)} />
    </>
  );
}
