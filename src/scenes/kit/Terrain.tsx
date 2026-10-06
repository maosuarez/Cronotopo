"use client";

import { useLayoutEffect, useMemo } from "react";
import { BufferAttribute, Color, PlaneGeometry } from "three";
import { fbm2 } from "./noise";

export type HeightFn = (x: number, z: number) => number;

export type TerrainOptions = {
  size?: number;
  segments?: number;
  /** Noise amplitude and frequency. */
  amplitude?: number;
  frequency?: number;
  seed?: number;
  /** Extra shaping (e.g. a river bed, a raised plateau). Added to the noise. */
  shape?: HeightFn;
  /** Multiplies the noise (0 = perfectly flat area for buildings). */
  mask?: HeightFn;
};

/** Builds the height function used both for the mesh and for placing objects on the ground. */
export function makeHeightFn({ amplitude = 1.5, frequency = 0.04, seed = 1, shape, mask }: TerrainOptions = {}): HeightFn {
  return (x, z) => {
    const n = (fbm2(x * frequency + 100, z * frequency + 100, seed) - 0.5) * 2 * amplitude;
    return n * (mask ? mask(x, z) : 1) + (shape ? shape(x, z) : 0);
  };
}

type Props = TerrainOptions & {
  /** Colour bands by height: [height, colour] sorted ascending. */
  bands?: [number, string][];
  receiveShadow?: boolean;
};

/** Low-poly procedural ground: flat-shaded, vertex-coloured by height. */
export function Terrain({ size = 200, segments = 96, bands = [[-99, "#b8925f"], [0.5, "#d8b98a"]], receiveShadow = true, ...opts }: Props) {
  const height = useMemo(() => makeHeightFn(opts), [opts.amplitude, opts.frequency, opts.seed, opts.shape, opts.mask]); // eslint-disable-line react-hooks/exhaustive-deps
  const bandsKey = JSON.stringify(bands);
  const geometry = useMemo(() => {
    const g = new PlaneGeometry(size, size, segments, segments);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) pos.setY(i, height(pos.getX(i), pos.getZ(i)));
    const flat = g.toNonIndexed();
    g.dispose();
    const p = flat.attributes.position;
    const colors = new Float32Array(p.count * 3);
    const c = new Color();
    for (let i = 0; i < p.count; i += 3) {
      const y = (p.getY(i) + p.getY(i + 1) + p.getY(i + 2)) / 3;
      let col = bands[0][1];
      for (const [h, hex] of bands) if (y >= h) col = hex;
      c.set(col);
      for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
    }
    flat.setAttribute("color", new BufferAttribute(colors, 3));
    flat.computeVertexNormals();
    return flat;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [height, size, segments, bandsKey]);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  return (
    <mesh geometry={geometry} receiveShadow={receiveShadow}>
      <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
    </mesh>
  );
}
