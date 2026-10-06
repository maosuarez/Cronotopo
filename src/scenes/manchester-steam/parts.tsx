"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color, CylinderGeometry, DoubleSide, MeshStandardMaterial, PlaneGeometry, Quaternion, ShaderMaterial, TorusGeometry, Vector3 } from "three";
import { cached, GEO, matte } from "../kit";

/** Centred box (unit box scaled). */
export function Box({
  p,
  s,
  color,
  rot = [0, 0, 0],
  shadow = false,
  emissive,
  emissiveIntensity,
}: {
  p: [number, number, number];
  s: [number, number, number];
  color: string;
  rot?: [number, number, number];
  shadow?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
}) {
  return (
    <mesh
      geometry={GEO.box()}
      material={matte(color, emissive ? { emissive, emissiveIntensity } : {})}
      position={p}
      scale={s}
      rotation={rot}
      castShadow={shadow}
      receiveShadow={shadow}
    />
  );
}

const unitCyl = () => cached("ms-cyl-c", () => new CylinderGeometry(1, 1, 1, 14));
const UP = new Vector3(0, 1, 0);
const tmpA = new Vector3();
const tmpQ = new Quaternion();

/** Cylinder of radius `r` between two points (rods, pipes, belts with r small). */
export function Rod({ a, b, r, color, smooth = true }: { a: [number, number, number]; b: [number, number, number]; r: number; color: string; smooth?: boolean }) {
  tmpA.set(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = Math.max(1e-4, tmpA.length());
  tmpQ.setFromUnitVectors(UP, tmpA.normalize());
  return (
    <mesh
      geometry={unitCyl()}
      material={matte(color, { flat: !smooth })}
      position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]}
      quaternion={[tmpQ.x, tmpQ.y, tmpQ.z, tmpQ.w]}
      scale={[r, len, r]}
    />
  );
}

/** Spoked wheel in the XY plane (rim torus + spokes + hub), rotating `angle` around Z. */
export function Wheel({
  radius,
  tube,
  spokes = 6,
  angle,
  color,
  hubColor,
  depth = 0.12,
}: {
  radius: number;
  tube: number;
  spokes?: number;
  angle: number;
  color: string;
  hubColor?: string;
  depth?: number;
}) {
  const rim = cached(`ms-rim-${radius}-${tube}`, () => new TorusGeometry(radius, tube, 6, 36));
  return (
    <group rotation={[0, 0, angle]}>
      <mesh geometry={rim} material={matte(color)} />
      {Array.from({ length: spokes }, (_, i) => (
        <mesh key={i} geometry={GEO.box()} material={matte(color)} rotation={[0, 0, (i / spokes) * Math.PI]} scale={[radius * 2, tube * 0.9, depth]} />
      ))}
      <mesh geometry={unitCyl()} material={matte(hubColor ?? color)} rotation={[Math.PI / 2, 0, 0]} scale={[tube * 2.2, depth * 2.2, tube * 2.2]} />
    </group>
  );
}

/** Half-cylinder shell (cutaway): open towards +Z so the inside is visible. Axis along Y, base at 0. */
export function HalfShell({ radius, height, color }: { radius: number; height: number; color: string }) {
  const geo = cached(`ms-half-${radius}-${height}`, () => new CylinderGeometry(radius, radius, height, 20, 1, true, Math.PI / 2, Math.PI).translate(0, height / 2, 0));
  const mat = useMemo(() => new MeshStandardMaterial({ color, roughness: 0.8, metalness: 0.15, side: DoubleSide, flatShading: true }), [color]);
  useLayoutEffect(() => () => mat.dispose(), [mat]);
  return <mesh geometry={geo} material={mat} />;
}

const gradeVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const gradeFragment = /* glsl */ `
  uniform float uFade;
  uniform vec3 uFadeColor;
  uniform float uGrain;
  uniform float uTime;
  uniform float uTint;
  varying vec2 vUv;
  float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
  void main() {
    // Soot grade: faint warm-grey veil heavier at the top edge, deterministic film grain, dip to black.
    float top = smoothstep(0.55, 1.0, vUv.y);
    float n = hash(floor(gl_FragCoord.xy) + floor(uTime * 24.0) * 17.0) - 0.5;
    vec3 col = mix(vec3(0.16, 0.14, 0.12), uFadeColor, uFade);
    float a = max(uFade, uTint * (0.05 + 0.18 * top));
    gl_FragColor = vec4(col + n * uGrain, clamp(a + abs(n) * uGrain, 0.0, 1.0));
  }
`;

/**
 * Screen-space overlay: soot colour grade, film grain (high quality only) and dip-to-black transitions.
 * Rendered last, independent of the camera.
 */
export function Grade({ fade, time, grain, tint }: { fade: number; time: number; grain: number; tint: number }) {
  const geo = useMemo(() => new PlaneGeometry(2, 2), []);
  const mat = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: { uFade: { value: 0 }, uFadeColor: { value: new Color("#0b0a09") }, uGrain: { value: 0 }, uTime: { value: 0 }, uTint: { value: 0 } },
        vertexShader: gradeVertex,
        fragmentShader: gradeFragment,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      }),
    [],
  );
  useLayoutEffect(() => {
    mat.uniforms.uFade.value = fade;
    mat.uniforms.uGrain.value = grain;
    mat.uniforms.uTime.value = time;
    mat.uniforms.uTint.value = tint;
  });
  useLayoutEffect(
    () => () => {
      geo.dispose();
      mat.dispose();
    },
    [geo, mat],
  );
  return <mesh geometry={geo} material={mat} frustumCulled={false} renderOrder={1000} />;
}
