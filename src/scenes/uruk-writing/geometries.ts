/**
 * Procedural low-poly geometries specific to this scene, cached through the kit (`cached`) so they are built once
 * per player session and freed by the player on close.
 */
import {
  BoxGeometry,
  BufferGeometry,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  SphereGeometry,
  TetrahedronGeometry,
  Vector3,
} from "three";
import { mergeVertices } from "three/addons/utils/BufferGeometryUtils.js";
import { cached, merge } from "../kit";

/** Tablet proportions (metres): proto-cuneiform tablets are small, pillow-shaped and fit in a hand. */
export const TABLET_SIZE = { w: 0.09, h: 0.022, d: 0.066 };

/** Height of the tablet's slightly domed top above its centre at (x, z), shared by the mesh and the stylus. */
export function tabletTop(x: number, z: number, size = TABLET_SIZE): number {
  const u = Math.min(1, Math.abs(x) / (size.w / 2));
  const v = Math.min(1, Math.abs(z) / (size.d / 2));
  return size.h / 2 + 0.0014 * (1 - u * u) * (1 - v * v);
}

/** Rounded box with a domed top and bottom: a clay "pillow". Smooth normals across the rounded edges. */
function pillow(w: number, h: number, d: number, r: number): BufferGeometry {
  const box = new BoxGeometry(w, h, d, 18, 4, 14);
  const p = box.attributes.position;
  const half = new Vector3(w / 2 - r, h / 2 - r, d / 2 - r);
  const v = new Vector3();
  const inner = new Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    inner.set(Math.max(-half.x, Math.min(half.x, v.x)), Math.max(-half.y, Math.min(half.y, v.y)), Math.max(-half.z, Math.min(half.z, v.z)));
    const off = v.clone().sub(inner);
    if (off.lengthSq() > 0) v.copy(inner).addScaledVector(off.normalize(), r);
    // dome both faces a little (pillow shape) with the same profile the stylus uses
    const dome = tabletTop(v.x, v.z, { w, h, d }) - h / 2;
    v.y += Math.sign(v.y) * dome * Math.min(1, Math.abs(v.y) / (h / 2));
    p.setXYZ(i, v.x, v.y, v.z);
  }
  box.deleteAttribute("normal");
  box.deleteAttribute("uv");
  const g = mergeVertices(box, 1e-6);
  box.dispose();
  g.computeVertexNormals();
  return g;
}

export const URUK_GEO = {
  tablet: () => cached("uruk-tablet", () => pillow(TABLET_SIZE.w, TABLET_SIZE.h, TABLET_SIZE.d, 0.008)),
  /** Later, larger and more rectangular tablet. */
  tabletLarge: () => cached("uruk-tablet-large", () => pillow(0.1, 0.022, 0.072, 0.006)),
  /** Sack of barley tied at the neck (base at y = 0, ~0.7 m tall). */
  sack: () =>
    cached("uruk-sack", () =>
      merge([
        new SphereGeometry(0.27, 8, 6).scale(1, 1.05, 0.85).translate(0, 0.27, 0),
        new CylinderGeometry(0.06, 0.12, 0.14, 7).translate(0, 0.58, 0),
        new ConeGeometry(0.1, 0.12, 7).rotateX(Math.PI).translate(0, 0.7, 0),
      ]),
    ),
  /** Sheep in two parts so each gets its own colour: woolly body, and dark head + legs. */
  sheepWool: () =>
    cached("uruk-sheep-wool", () =>
      merge([new IcosahedronGeometry(0.5, 1).scale(0.62, 0.36, 0.34).translate(0, 0.56, 0), new IcosahedronGeometry(0.16, 0).translate(0, 0.66, 0.24)]),
    ),
  sheepDark: () =>
    cached("uruk-sheep-dark", () =>
      merge([
        new BoxGeometry(0.11, 0.13, 0.2).translate(0, 0.66, 0.39),
        ...[
          [-0.1, -0.16],
          [0.1, -0.16],
          [-0.1, 0.16],
          [0.1, 0.16],
        ].map(([x, z]) => new CylinderGeometry(0.03, 0.025, 0.42, 5).translate(x, 0.21, z)),
      ]),
    ),
  /** Clay tokens (about 1–2 cm): the shapes most often illustrated. */
  tokens: () =>
    ([
      () => new ConeGeometry(0.0065, 0.016, 10).translate(0, 0.008, 0),
      () => new SphereGeometry(0.0072, 12, 8).translate(0, 0.0072, 0),
      () => new CylinderGeometry(0.0095, 0.0095, 0.004, 14).translate(0, 0.002, 0),
      () => new TetrahedronGeometry(0.009, 0).translate(0, 0.004, 0),
      () => new CylinderGeometry(0.0045, 0.0045, 0.016, 10).rotateZ(Math.PI / 2).translate(0, 0.0045, 0),
      () => new SphereGeometry(0.0055, 10, 8).translate(0, 0.0055, 0),
    ] as (() => BufferGeometry)[]).map((make, i) => cached(`uruk-token-${i}`, make)),
  /** Bulla halves (hollow clay ball, radius 3 cm) and the sealed ball. */
  bullaBowl: () => cached("uruk-bulla-bowl", () => new SphereGeometry(0.03, 32, 12, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)),
  bullaCap: () => cached("uruk-bulla-cap", () => new SphereGeometry(0.03, 32, 12, 0, Math.PI * 2, 0, Math.PI / 2)),
  bullaSealed: () => cached("uruk-bulla-sealed", () => new SphereGeometry(0.03, 64, 40)),
  /** Stone cylinder seal with carved ribs so its rolling is visible. */
  seal: () =>
    cached("uruk-seal", () =>
      merge([
        new CylinderGeometry(0.0075, 0.0075, 0.028, 18),
        ...Array.from({ length: 8 }, (_, i) => new BoxGeometry(0.0016, 0.024, 0.0016).translate(0.0076, 0, 0).rotateY((i / 8) * Math.PI * 2)),
      ]),
    ),
  /** Reed stylus: tip at the origin, shaft along +y. */
  stylus: () =>
    cached("uruk-stylus", () =>
      merge([new CylinderGeometry(0.0032, 0.0028, 0.17, 8).translate(0, 0.085 + 0.004, 0), new SphereGeometry(0.0028, 8, 6).scale(1, 1.4, 1).translate(0, 0.004, 0)]),
    ),
};
