"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, NormalBlending, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from "three";
import { createRng } from "./prng";

/**
 * Deterministic GPU particles: each particle's state is computed in the vertex shader from `time`,
 * a per-particle seed and a fixed lifetime (no simulation state), so seeking is exact.
 */
export type ParticlePreset = {
  count: number;
  life: number;
  /** Emitter half-extents around `position`. */
  spread: [number, number, number];
  velocity: [number, number, number];
  /** Random velocity jitter per axis. */
  jitter: [number, number, number];
  gravity: number;
  /** Horizontal drift growing with age (wind). */
  wind: [number, number];
  size: [number, number];
  colorStart: string;
  colorEnd: string;
  opacity: number;
  additive?: boolean;
};

export const PARTICLES = {
  smoke: { count: 260, life: 9, spread: [0.4, 0.1, 0.4], velocity: [0, 1.6, 0], jitter: [0.3, 0.4, 0.3], gravity: -0.05, wind: [0.5, 0.1], size: [2.2, 9], colorStart: "#4a4642", colorEnd: "#9a948c", opacity: 0.55 },
  ash: { count: 900, life: 6, spread: [30, 2, 30], velocity: [0, -2.4, 0], jitter: [0.6, 0.6, 0.6], gravity: 0, wind: [0.8, 0.2], size: [0.18, 0.3], colorStart: "#cfc8bc", colorEnd: "#8a837a", opacity: 0.9 },
  dust: { count: 160, life: 3, spread: [0.6, 0.05, 0.6], velocity: [0, 0.5, 0], jitter: [0.8, 0.3, 0.8], gravity: 0.1, wind: [0.2, 0], size: [0.8, 3], colorStart: "#d9c39b", colorEnd: "#e8dcc4", opacity: 0.35 },
  sparks: { count: 120, life: 0.9, spread: [0.05, 0.05, 0.05], velocity: [0, 2.4, 0], jitter: [1.6, 1.2, 1.6], gravity: 4, wind: [0, 0], size: [0.25, 0.08], colorStart: "#ffd27a", colorEnd: "#ff6a2a", opacity: 1, additive: true },
  steam: { count: 120, life: 2.5, spread: [0.05, 0.05, 0.05], velocity: [0, 1.2, 0], jitter: [0.25, 0.2, 0.25], gravity: -0.1, wind: [0.3, 0], size: [0.4, 2], colorStart: "#f2f0ec", colorEnd: "#d8d4ce", opacity: 0.4 },
  eruption: { count: 700, life: 14, spread: [1.2, 0.2, 1.2], velocity: [0, 14, 0], jitter: [1.2, 3, 1.2], gravity: -0.15, wind: [1.8, 0.4], size: [6, 38], colorStart: "#3d3632", colorEnd: "#8a8178", opacity: 0.7 },
} satisfies Record<string, ParticlePreset>;

const vertex = /* glsl */ `
  #include <fog_pars_vertex>
  attribute vec4 aSeed;
  uniform float uTime, uLife, uStart, uEnd, uGravity, uPixel;
  uniform vec3 uOrigin, uSpread, uVel, uJitter;
  uniform vec2 uWind, uSize;
  varying float vAge;
  varying float vAlive;
  void main() {
    float born = uStart + aSeed.w * uLife;
    float t = uTime - born;
    float age = mod(max(t, 0.0), uLife) / uLife;
    float cycleStart = born + floor(max(t, 0.0) / uLife) * uLife;
    vAlive = (t >= 0.0 && cycleStart <= uEnd) ? 1.0 : 0.0;
    vAge = age;
    vec3 r = aSeed.xyz * 2.0 - 1.0;
    float a = age * uLife;
    vec3 p = uOrigin + r * uSpread + (uVel + r * uJitter) * a;
    p.y -= 0.5 * uGravity * a * a;
    p.xz += uWind * a * a * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = mix(uSize.x, uSize.y, age) * uPixel / -mvPosition.z * vAlive;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  #include <fog_pars_fragment>
  uniform vec3 uColorStart, uColorEnd;
  uniform float uOpacity;
  varying float vAge;
  varying float vAlive;
  void main() {
    if (vAlive < 0.5) discard;
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float soft = smoothstep(0.5, 0.0, d);
    float fade = smoothstep(0.0, 0.12, vAge) * (1.0 - smoothstep(0.65, 1.0, vAge));
    gl_FragColor = vec4(mix(uColorStart, uColorEnd, vAge), soft * fade * uOpacity);
    #include <fog_fragment>
  }
`;

type Props = {
  preset: ParticlePreset;
  time: number;
  position?: [number, number, number];
  /** Emission window in scene seconds (particles born after `end` are not shown). */
  start?: number;
  end?: number;
  seed?: number;
  /** Overall opacity multiplier (0 hides). */
  intensity?: number;
  /** Count multiplier (use < 1 on quality "low"). */
  density?: number;
  overrides?: Partial<ParticlePreset>;
  /** Start already full (as if it had been emitting for one lifetime before `start`). */
  prewarm?: boolean;
};

export function Particles({ preset: base, time, position = [0, 0, 0], start = 0, end = Infinity, seed = 1, intensity = 1, density = 1, overrides, prewarm = false }: Props) {
  const pixel = useThree((s) => s.size.height * s.viewport.dpr / (2 * Math.tan((("fov" in s.camera ? (s.camera as { fov: number }).fov : 40) * Math.PI) / 360)));
  const preset = { ...base, ...overrides };
  const count = Math.max(1, Math.round(preset.count * density));
  const geometry = useMemo(() => {
    const rng = createRng(seed);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = rng.next();
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute("aSeed", new BufferAttribute(seeds, 4));
    g.boundingSphere = null;
    return g;
  }, [count, seed]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          UniformsLib.fog,
          {
            uTime: { value: 0 }, uLife: { value: 1 }, uStart: { value: 0 }, uEnd: { value: 1e9 }, uGravity: { value: 0 }, uPixel: { value: 300 },
            uOrigin: { value: new Vector3() }, uSpread: { value: new Vector3() }, uVel: { value: new Vector3() }, uJitter: { value: new Vector3() },
            uWind: { value: [0, 0] }, uSize: { value: [1, 1] },
            uColorStart: { value: new Color() }, uColorEnd: { value: new Color() }, uOpacity: { value: 1 },
          },
        ]),
        vertexShader: vertex,
        fragmentShader: fragment,
        transparent: true,
        depthWrite: false,
        fog: true,
      }),
    [],
  );
  useLayoutEffect(() => {
    const u = material.uniforms;
    u.uTime.value = time;
    u.uLife.value = preset.life;
    u.uStart.value = prewarm ? start - preset.life : start;
    u.uPixel.value = pixel;
    u.uEnd.value = end;
    u.uGravity.value = preset.gravity;
    u.uOrigin.value.set(...position);
    u.uSpread.value.set(...preset.spread);
    u.uVel.value.set(...preset.velocity);
    u.uJitter.value.set(...preset.jitter);
    u.uWind.value = preset.wind;
    u.uSize.value = preset.size;
    u.uColorStart.value.set(preset.colorStart);
    u.uColorEnd.value.set(preset.colorEnd);
    u.uOpacity.value = preset.opacity * intensity;
    material.blending = preset.additive ? AdditiveBlending : NormalBlending;
  });
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  return <points geometry={geometry} material={material} frustumCulled={false} visible={intensity > 0.001 && time >= (prewarm ? start - preset.life : start)} />;
}
