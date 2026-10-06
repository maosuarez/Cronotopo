"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color, InstancedBufferAttribute, InstancedBufferGeometry, PlaneGeometry, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from "three";
import { createRng } from "../kit/prng";
import type { LightPreset } from "../kit/lighting";
import { NOISE_GLSL } from "./materials";
import { VOLCANO } from "./world";

/**
 * Volumetric-looking clouds made of opaque "cauliflower" sphere impostors: each puff is a camera-facing quad whose
 * fragment shader carves a noisy silhouette, rebuilds a sphere normal, writes spherical depth (puffs interpenetrate
 * like real convective lobes) and is lit by the sun, the sky, an internal heat glow and lightning.
 * Every puff position is a closed-form function of `time` and its seed: no simulation state, exact seeking.
 *
 * Two trajectories share the shading: the Plinian eruption column with its umbrella ("pine"), and the
 * pyroclastic surge rolling down the slope.
 */

const COLUMN_GLSL = /* glsl */ `
  uniform float uT0, uT1, uLife, uHc, uRc0, uSpread, uDrift, uScale;
  uniform vec3 uVent;
  uniform vec2 uWind;
  vec3 trajectory(vec4 s, out float size, out float heat, out float shade) {
    float a = fract((uTime - uT0) / uLife + s.w);
    float birth = uTime - a * uLife;
    heat = 0.0; shade = 0.0;
    if (birth < uT0 || birth > uT1) { size = 0.0; return vec3(0.0); }
    float kc = 0.44;
    float ang = s.y * 6.2831853;
    vec3 p;
    float rTop = uRc0 + 0.14 * uHc;
    if (a < kc) {
      float u = a / kc;
      float h = uHc * (1.0 - pow(1.0 - u, 2.1));
      float rc = uRc0 + 0.14 * h;
      float off = rc * 0.8 * sqrt(s.x);
      ang += h * 0.007 + uTime * 0.06;
      p = uVent + vec3(cos(ang) * off, h, sin(ang) * off);
      p.xz += uWind * pow(h / uHc, 2.0) * 45.0;
      size = rc * (0.55 + 0.55 * s.z);
      heat = exp(-h / 55.0);
      shade = 0.15 + 0.6 * h / uHc;
    } else {
      float u = (a - kc) / (1.0 - kc);
      float R = rTop * 0.6 + uSpread * pow(u, 0.5) * (0.3 + 0.7 * s.x);
      float lift = 30.0 * sin(3.14159 * min(u * 1.6, 1.0));
      p = uVent + vec3(cos(ang) * R, uHc + lift + (s.z - 0.5) * 70.0 * (0.35 + u) - 80.0 * u * u, sin(ang) * R * 0.8);
      p.xz += uWind * (45.0 + uDrift * pow(u, 1.15));
      size = (rTop * 0.85 + 46.0 * u) * (0.6 + 0.5 * s.z);
      shade = 0.7 + 0.3 * s.x - 0.25 * u;
    }
    size *= uScale * smoothstep(0.0, 0.025, a) * (1.0 - smoothstep(0.92, 1.0, a));
    return p;
  }
`;

const SURGE_GLSL = /* glsl */ `
  uniform float uFront, uBackLen, uScale;
  uniform vec3 uVent;
  uniform vec2 uDir;
  uniform vec4 uVolcano; // x, z, r, h
  float groundH(vec2 xz) {
    float q = min(length(xz - uVolcano.xy) / uVolcano.z, 1.0);
    float sq = q * q * (3.0 - 2.0 * q);
    float rc = length(vec2(xz.x, xz.y * 1.15));
    return uVolcano.w * pow(1.0 - sq, 1.5) + 0.035 * max(0.0, rc - 170.0);
  }
  vec3 trajectory(vec4 s, out float size, out float heat, out float shade) {
    float back = pow(s.w, 1.35) * uBackLen;
    float d = uFront - back;
    heat = 0.0; shade = 0.0;
    if (d <= 0.0) { size = 0.0; return vec3(0.0); }
    vec2 perp = vec2(-uDir.y, uDir.x);
    float w = 22.0 + 0.42 * d;
    float lat = (s.x - 0.5) * 2.0 * w;
    vec2 xz = uVent.xz + uDir * d + perp * lat;
    float head = exp(-back / 38.0);
    float edge = 1.0 - smoothstep(0.55, 1.0, abs(s.x - 0.5) * 2.0);
    float roll = -uTime * 1.7 + s.z * 6.2831853;
    float rr = 9.0 * s.y * (0.4 + head);
    float hgt = (5.0 + 30.0 * s.y) * (0.65 + 0.95 * head) * (0.55 + 0.45 * edge) + back * 0.24;
    xz += uDir * cos(roll) * rr;
    vec3 p = vec3(xz.x, groundH(xz) + hgt + sin(roll) * rr, xz.y);
    size = ((11.0 + 22.0 * s.z) * (0.8 + 0.7 * head) + back * 0.05) * (0.6 + 0.4 * edge);
    size *= uScale * smoothstep(0.0, 30.0, d);
    heat = head * exp(-hgt / 16.0);
    shade = clamp(hgt / 90.0, 0.0, 1.0) * 0.55;
    return p;
  }
`;

const vertex = (trajectory: string) => /* glsl */ `
  #include <fog_pars_vertex>
  attribute vec4 aSeed;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vViewCenter;
  varying vec3 vCenter;
  varying float vRadius;
  varying float vSeed;
  varying float vHeat;
  varying float vShade;
  ${trajectory}
  void main() {
    float size; float heat; float shade;
    vec3 c = trajectory(aSeed, size, heat, shade);
    vSeed = aSeed.x * 7.0 + aSeed.y * 13.0;
    vHeat = heat; vShade = shade; vCenter = c; vRadius = size;
    vUv = position.xy * 2.0;
    if (size <= 0.01) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    vec4 mvPosition = viewMatrix * vec4(c, 1.0);
    vViewCenter = mvPosition.xyz;
    mvPosition.xy += position.xy * 2.0 * size;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }
`;

const fragment = /* glsl */ `
  #include <common>
  #include <fog_pars_fragment>
  uniform mat4 projectionMatrix;
  uniform float uTime, uSunI, uAmbI, uHeat, uFlash, uFlashRange;
  uniform vec3 uSunDir, uSunColor, uSky, uGround, uBase, uTop, uHeatColor, uFlashPos;
  varying vec2 vUv;
  varying vec3 vViewCenter;
  varying vec3 vCenter;
  varying float vRadius;
  varying float vSeed;
  varying float vHeat;
  varying float vShade;
  ${NOISE_GLSL}
  void main() {
    vec2 uv = vUv;
    float r2 = dot(uv, uv);
    vec2 q = uv * 1.7 + vec2(vSeed, vSeed * 0.37) + vec2(0.0, uTime * 0.035);
    float n = pvFbm(q);
    float edge = 0.5 + 0.5 * n;
    if (r2 > edge) discard;
    float z = sqrt(max(1.0 - r2 / edge, 0.0));
    vec3 nrm = normalize(vec3(uv / sqrt(edge), z));
    vec2 q2 = uv * 3.6 + vSeed * 1.9;
    float e = 0.07;
    vec2 g = vec2(pvFbm(q2 + vec2(e, 0.0)) - pvFbm(q2 - vec2(e, 0.0)), pvFbm(q2 + vec2(0.0, e)) - pvFbm(q2 - vec2(0.0, e)));
    nrm = normalize(nrm - vec3(g * 2.2, 0.0));

    vec3 viewPos = vViewCenter + vec3(uv * vRadius, z * vRadius * 0.9);
    vec4 clip = projectionMatrix * vec4(viewPos, 1.0);
    gl_FragDepth = clamp(clip.z / clip.w * 0.5 + 0.5, 0.0, 1.0);

    vec3 sunV = normalize((viewMatrix * vec4(uSunDir, 0.0)).xyz);
    vec3 upV = normalize((viewMatrix * vec4(0.0, 1.0, 0.0, 0.0)).xyz);
    float diff = clamp((dot(nrm, sunV) + 0.1) / 1.1, 0.0, 1.0);
    diff = diff * diff * (3.0 - 2.0 * diff);
    float hemi = dot(nrm, upV) * 0.5 + 0.5;
    float cavity = mix(0.5, 1.0, z) * (0.78 + 0.44 * n);
    vec3 base = mix(uBase, uTop, clamp(vShade, 0.0, 1.0));
    vec3 col = base * (mix(uGround, uSky, hemi) * uAmbI + uSunColor * diff * uSunI) * cavity;
    float below = clamp(-dot(nrm, upV), 0.0, 1.0);
    col += uHeatColor * uHeat * vHeat * (0.35 + 1.1 * below) * (0.7 + 0.6 * n);
    vec3 toF = uFlashPos - vCenter;
    float fd = length(toF);
    vec3 toFV = normalize((viewMatrix * vec4(toF, 0.0)).xyz);
    col += vec3(0.78, 0.84, 1.0) * uFlash * exp(-fd / uFlashRange) * (0.3 + 0.9 * clamp(dot(nrm, toFV), 0.0, 1.0));
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
  }
`;

type Common = {
  time: number;
  count: number;
  seed: number;
  light: LightPreset;
  flash: number;
  flashPos: [number, number, number];
  base: string;
  top: string;
  heat: number;
};

function usePuffMesh(kind: "column" | "surge", { count, seed }: { count: number; seed: number }) {
  const geometry = useMemo(() => {
    const quad = new PlaneGeometry(1, 1);
    const g = new InstancedBufferGeometry();
    g.index = quad.index;
    g.setAttribute("position", quad.getAttribute("position"));
    const rng = createRng(seed);
    const seeds = new Float32Array(count * 4);
    for (let i = 0; i < count * 4; i++) seeds[i] = rng.next();
    g.setAttribute("aSeed", new InstancedBufferAttribute(seeds, 4));
    g.instanceCount = count;
    return g;
  }, [count, seed]);
  const material = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: UniformsUtils.merge([
          UniformsLib.fog,
          {
            uTime: { value: 0 }, uSunI: { value: 1 }, uAmbI: { value: 1 }, uHeat: { value: 0 }, uFlash: { value: 0 }, uFlashRange: { value: 150 },
            uSunDir: { value: new Vector3(0, 1, 0) }, uSunColor: { value: new Color() }, uSky: { value: new Color() }, uGround: { value: new Color() },
            uBase: { value: new Color() }, uTop: { value: new Color() }, uHeatColor: { value: new Color("#ff7a2e") }, uFlashPos: { value: new Vector3() },
            // column
            uT0: { value: 0 }, uT1: { value: 0 }, uLife: { value: 16 }, uHc: { value: 400 }, uRc0: { value: 16 }, uSpread: { value: 250 }, uDrift: { value: 200 }, uScale: { value: 1 },
            uVent: { value: new Vector3() }, uWind: { value: [0, 1] },
            // surge
            uFront: { value: 0 }, uBackLen: { value: 260 }, uDir: { value: [0, 1] }, uVolcano: { value: [VOLCANO.x, VOLCANO.z, VOLCANO.r, VOLCANO.h] },
          },
        ]),
        vertexShader: vertex(kind === "column" ? COLUMN_GLSL : SURGE_GLSL),
        fragmentShader: fragment,
        fog: true,
      }),
    [kind],
  );
  useLayoutEffect(() => () => geometry.dispose(), [geometry]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  return { geometry, material };
}

function applyCommon(material: ShaderMaterial, p: Common) {
  const u = material.uniforms;
  u.uTime.value = p.time;
  u.uSunDir.value.set(...p.light.sunDir).normalize();
  u.uSunColor.value.set(p.light.sunColor);
  u.uSunI.value = p.light.sunIntensity * 0.5;
  u.uSky.value.set(p.light.hemiSky);
  u.uGround.value.set(p.light.hemiGround);
  u.uAmbI.value = p.light.hemiIntensity * 0.5;
  u.uBase.value.set(p.base);
  u.uTop.value.set(p.top);
  u.uHeat.value = p.heat;
  u.uFlash.value = p.flash;
  u.uFlashPos.value.set(...p.flashPos);
}

export function EruptionColumn(
  props: Common & { vent: [number, number, number]; wind: [number, number]; t0: number; t1: number; life: number; hc: number; rc0: number; spread: number; drift: number; scale: number },
) {
  const { geometry, material } = usePuffMesh("column", props);
  useLayoutEffect(() => {
    applyCommon(material, props);
    const u = material.uniforms;
    u.uT0.value = props.t0;
    u.uT1.value = props.t1;
    u.uLife.value = props.life;
    u.uHc.value = props.hc;
    u.uRc0.value = props.rc0;
    u.uSpread.value = props.spread;
    u.uDrift.value = props.drift;
    u.uScale.value = props.scale;
    u.uVent.value.set(...props.vent);
    u.uWind.value = props.wind;
  });
  const visible = props.time >= props.t0 && props.scale > 0.01;
  return <mesh geometry={geometry} material={material} frustumCulled={false} visible={visible} />;
}

export function SurgeCloud(props: Common & { vent: [number, number, number]; dir: [number, number]; front: number; backLen: number; scale?: number }) {
  const { geometry, material } = usePuffMesh("surge", props);
  useLayoutEffect(() => {
    applyCommon(material, props);
    const u = material.uniforms;
    u.uFront.value = props.front;
    u.uBackLen.value = props.backLen;
    u.uScale.value = props.scale ?? 1;
    u.uVent.value.set(...props.vent);
    u.uDir.value = props.dir;
  });
  return <mesh geometry={geometry} material={material} frustumCulled={false} visible={props.front > 1} />;
}
