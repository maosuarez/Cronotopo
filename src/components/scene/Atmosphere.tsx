"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BackSide, Color, FrontSide, type Mesh, ShaderMaterial } from "three";
import { sceneMotion } from "@/lib/choreography";

const BASE = new Color("#4a7bd1");

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

// Outer shell seen from inside: |dot| is 0 at the shell silhouette and ~0.45 at the globe limb.
const haloFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float a = clamp(-dot(vNormal, vView) / 0.5, 0.0, 1.0);
    float glow = pow(a, 2.2);
    gl_FragColor = vec4(uColor * glow * uIntensity, glow * uIntensity);
  }
`;

// Thin front rim hugging the limb.
const rimFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uIntensity;
  varying vec3 vNormal;
  varying vec3 vView;
  void main() {
    float f = pow(1.0 - clamp(dot(vNormal, vView), 0.0, 1.0), 3.5);
    gl_FragColor = vec4(uColor * f * uIntensity, f * uIntensity);
  }
`;

function makeMaterial(fragmentShader: string, side: typeof BackSide | typeof FrontSide) {
  return new ShaderMaterial({
    uniforms: { uColor: { value: new Color() }, uIntensity: { value: 0 } },
    vertexShader,
    fragmentShader,
    side,
    transparent: true,
    blending: AdditiveBlending,
    depthWrite: false,
  });
}

export function Atmosphere() {
  const halo = useMemo(() => makeMaterial(haloFragment, BackSide), []);
  const rim = useMemo(() => makeMaterial(rimFragment, FrontSide), []);
  const haloMesh = useRef<Mesh>(null);
  const rimMesh = useRef<Mesh>(null);
  const color = useRef(new Color());

  useFrame(() => {
    const h = (haloMesh.current?.material as ShaderMaterial | undefined)?.uniforms;
    const r = (rimMesh.current?.material as ShaderMaterial | undefined)?.uniforms;
    if (!h || !r) return;
    color.current.copy(BASE).lerp(sceneMotion.accent, 0.65);
    h.uColor.value.copy(color.current);
    h.uIntensity.value = 1.1 * sceneMotion.atmosphere;
    r.uColor.value.copy(color.current);
    r.uIntensity.value = 0.45 * sceneMotion.atmosphere;
  });

  return (
    <>
      <mesh ref={haloMesh} material={halo} raycast={() => null}>
        <sphereGeometry args={[1.12, 64, 64]} />
      </mesh>
      <mesh ref={rimMesh} material={rim} raycast={() => null}>
        <sphereGeometry args={[1.012, 64, 64]} />
      </mesh>
    </>
  );
}
