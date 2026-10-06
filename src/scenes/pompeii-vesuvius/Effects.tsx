"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color, CylinderGeometry, MeshBasicMaterial, PlaneGeometry, Quaternion, ShaderMaterial, Vector3, Euler } from "three";
import { Instances, type InstanceSpec } from "../kit/Instanced";
import type { Vec3 } from "../kit/math";
import type { Bolt } from "./story";

const UP = new Vector3(0, 1, 0);

function segments(paths: Vec3[][], width: number): InstanceSpec[] {
  const out: InstanceSpec[] = [];
  const q = new Quaternion();
  const e = new Euler();
  const d = new Vector3();
  paths.forEach((path, pi) => {
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1];
      const b = path[i];
      d.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
      const len = d.length();
      q.setFromUnitVectors(UP, d.normalize());
      e.setFromQuaternion(q);
      const w = pi === 0 ? width : width * 0.55;
      out.push({ position: a, rotation: [e.x, e.y, e.z], scale: [w, len, w] });
    }
  });
  return out;
}

/** Volcanic lightning inside the ash cloud: a jagged emissive bolt (blooms on "high"), shown only while flashing. */
export function Lightning({ bolt, intensity }: { bolt: Bolt | null; intensity: number }) {
  const geometry = useMemo(() => new CylinderGeometry(0.5, 0.5, 1, 5, 1).translate(0, 0.5, 0), []);
  const material = useMemo(() => new MeshBasicMaterial({ color: new Color(2.4, 2.6, 3.2), toneMapped: false, fog: false }), []);
  const items = useMemo(() => (bolt ? segments([bolt.path, ...bolt.branches], 3.2) : []), [bolt]);
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  if (!bolt || intensity < 0.3) return null;
  return <Instances geometry={geometry} material={material} items={items} />;
}

const fadeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = position.xy; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;
const fadeFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  uniform float uEdge;
  varying vec2 vUv;
  void main() {
    // uEdge > 0 darkens from the borders first (engulfing cloud), 0 = flat fade
    float r = length(vUv * vec2(1.0, 0.75));
    float a = uOpacity * (1.0 + uEdge) - uEdge * (1.0 - min(r, 1.0));
    gl_FragColor = vec4(uColor, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

/** Full-screen colour veil in clip space (independent of the camera): dips, the engulfing surge, the final fade. */
export function ScreenFade({ color, opacity, edge = 0 }: { color: string; opacity: number; edge?: number }) {
  const geometry = useMemo(() => new PlaneGeometry(2, 2), []);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uColor: { value: new Color() }, uOpacity: { value: 0 }, uEdge: { value: 0 } },
        vertexShader: fadeVertex,
        fragmentShader: fadeFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        toneMapped: false,
      }),
    [],
  );
  useLayoutEffect(() => {
    material.uniforms.uColor.value.set(color);
    material.uniforms.uOpacity.value = opacity;
    material.uniforms.uEdge.value = edge;
  });
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={1000} visible={opacity > 0.002} />;
}
