"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color, ShaderMaterial, UniformsLib, UniformsUtils } from "three";

const vertex = /* glsl */ `
  #include <fog_pars_vertex>
  uniform float uTime;
  uniform float uWave;
  varying vec3 vWorld;
  varying float vRipple;
  void main() {
    vec3 p = position;
    float r = sin(p.x * 0.35 + uTime * 0.9) * 0.5 + sin(p.y * 0.5 - uTime * 0.7) * 0.5;
    vRipple = r;
    p.z += r * uWave;
    vec4 world = modelMatrix * vec4(p, 1.0);
    vWorld = world.xyz;
    vec4 mvPosition = viewMatrix * world;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  #include <fog_pars_fragment>
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform vec3 uSky;
  uniform float uTime;
  uniform float uOpacity;
  varying vec3 vWorld;
  varying float vRipple;
  void main() {
    vec3 view = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - clamp(view.y, 0.0, 1.0), 3.0);
    float sparkle = smoothstep(0.86, 1.0, sin(vWorld.x * 1.7 + uTime * 1.3) * sin(vWorld.z * 1.3 - uTime));
    vec3 col = mix(uDeep, uShallow, 0.5 + 0.25 * vRipple);
    col = mix(col, uSky, fres * 0.6) + sparkle * 0.08;
    gl_FragColor = vec4(col, uOpacity);
    #include <fog_fragment>
  }
`;

/**
 * Stylised water surface (flat-ish plane with deterministic ripples). `time` drives the waves.
 * `width`/`depth` in world units, lies on the XZ plane at `y`.
 */
export function Water({
  time,
  width = 200,
  depth = 30,
  position = [0, 0, 0],
  rotationY = 0,
  shallow = "#4f8f98",
  deep = "#2a5866",
  sky = "#cfe0ec",
  wave = 0.06,
  opacity = 0.95,
}: {
  time: number;
  width?: number;
  depth?: number;
  position?: [number, number, number];
  rotationY?: number;
  shallow?: string;
  deep?: string;
  sky?: string;
  wave?: number;
  opacity?: number;
}) {
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          UniformsLib.fog,
          {
            uTime: { value: 0 },
            uWave: { value: 0.06 },
            uShallow: { value: new Color() },
            uDeep: { value: new Color() },
            uSky: { value: new Color() },
            uOpacity: { value: 1 },
          },
        ]),
        vertexShader: vertex,
        fragmentShader: fragment,
        fog: true,
        transparent: true,
      }),
    [],
  );
  useLayoutEffect(() => {
    const u = material.uniforms;
    u.uTime.value = time;
    u.uWave.value = wave;
    u.uShallow.value.set(shallow);
    u.uDeep.value.set(deep);
    u.uSky.value.set(sky);
    u.uOpacity.value = opacity;
  }, [material, time, wave, shallow, deep, sky, opacity]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, rotationY]} material={material}>
      <planeGeometry args={[width, depth, Math.ceil(width / 2), Math.ceil(depth / 2)]} />
    </mesh>
  );
}
