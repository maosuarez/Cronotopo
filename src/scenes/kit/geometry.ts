import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  MeshStandardMaterial,
  SphereGeometry,
} from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

/**
 * Shared low-poly geometries and matte materials, created lazily and cached for the whole session
 * (they are tiny). Scenes reuse them instead of allocating their own per render.
 */
const cache = new Map<string, BufferGeometry>();
const mats = new Map<string, MeshStandardMaterial>();

export function cached<T extends BufferGeometry>(key: string, make: () => T): T {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g as T;
}

/** Matte, flat-shaded "diorama" material. White by default so instance colours tint it. */
export function matte(color = "#ffffff", opts: { flat?: boolean; emissive?: string; emissiveIntensity?: number } = {}) {
  const key = `${color}|${opts.flat ?? true}|${opts.emissive ?? ""}|${opts.emissiveIntensity ?? 0}`;
  let m = mats.get(key);
  if (!m) {
    m = new MeshStandardMaterial({
      color,
      roughness: 0.95,
      metalness: 0,
      flatShading: opts.flat ?? true,
      emissive: opts.emissive ?? "#000000",
      emissiveIntensity: opts.emissiveIntensity ?? 0,
    });
    mats.set(key, m);
  }
  return m;
}

/** Merge helper that tolerates mixed indexed/non-indexed inputs. */
export function merge(parts: BufferGeometry[]): BufferGeometry {
  const norm = parts.map((p) => (p.index ? p.toNonIndexed() : p));
  const g = mergeGeometries(norm, false);
  if (!g) throw new Error("mergeGeometries failed");
  g.computeVertexNormals();
  return g;
}

export const GEO = {
  box: () => cached("box", () => new BoxGeometry(1, 1, 1)),
  /** Unit box with its base at y = 0. */
  boxBase: () => cached("boxBase", () => new BoxGeometry(1, 1, 1).translate(0, 0.5, 0)),
  sphere: () => cached("sphere", () => new SphereGeometry(0.5, 10, 8)),
  rock: () => cached("rock", () => new IcosahedronGeometry(0.5, 0)),
  cylinder: () => cached("cylinder", () => new CylinderGeometry(0.5, 0.5, 1, 10).translate(0, 0.5, 0)),
  cone: () => cached("cone", () => new ConeGeometry(0.5, 1, 8).translate(0, 0.5, 0)),
  /** Palm trunk (base at 0, height 1) and crown of drooping fronds centred at y = 1. */
  palmTrunk: () => cached("palmTrunk", () => new CylinderGeometry(0.06, 0.1, 1, 6).translate(0, 0.5, 0)),
  palmCrown: () =>
    cached("palmCrown", () => {
      const fronds: BufferGeometry[] = [];
      for (let i = 0; i < 7; i++) {
        const f = new ConeGeometry(0.08, 0.7, 4);
        f.translate(0, 0.35, 0);
        f.rotateZ(Math.PI / 2 - 0.5);
        f.rotateY((i / 7) * Math.PI * 2);
        f.translate(0, 1, 0);
        fronds.push(f);
      }
      return merge(fronds);
    }),
  /** Rounded tree crown (olive/oak) centred at y = 1, trunk separate. */
  treeCrown: () => cached("treeCrown", () => new IcosahedronGeometry(0.45, 0).translate(0, 1, 0)),
  /** Mediterranean cypress: tall narrow cone. */
  cypress: () => cached("cypress", () => new ConeGeometry(0.22, 1.6, 6).translate(0, 1.0, 0)),
  bush: () => cached("bush", () => new IcosahedronGeometry(0.3, 0).translate(0, 0.2, 0)),
  /** Reeds clump. */
  reeds: () =>
    cached("reeds", () =>
      merge(
        [0, 1, 2, 3, 4].map((i) =>
          new ConeGeometry(0.02, 0.8, 3)
            .translate(0, 0.4, 0)
            .rotateZ((i - 2) * 0.12)
            .translate((i - 2) * 0.05, 0, (i % 2) * 0.04),
        ),
      ),
    ),
};

/** Frees every cached geometry/material. The player calls it when it closes. */
export function disposeKitCache() {
  cache.forEach((g) => g.dispose());
  mats.forEach((m) => m.dispose());
  cache.clear();
  mats.clear();
}
