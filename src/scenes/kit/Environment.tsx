"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { BackSide, Color, Fog, ShaderMaterial, Vector3 } from "three";
import type { LightPreset } from "./lighting";

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHorizon;
  uniform vec3 uGround;
  uniform vec3 uSunDir;
  uniform vec3 uSunColor;
  uniform float uSunGlow;
  varying vec3 vDir;
  void main() {
    float h = vDir.y;
    vec3 col = h > 0.0 ? mix(uHorizon, uTop, pow(smoothstep(0.0, 1.0, h), 0.6)) : mix(uHorizon, uGround, smoothstep(0.0, 0.25, -h));
    float s = max(dot(normalize(vDir), normalize(uSunDir)), 0.0);
    col += uSunColor * uSunGlow * (pow(s, 64.0) * 1.2 + pow(s, 6.0) * 0.18);
    gl_FragColor = vec4(col, 1.0);
  }
`;

type Props = {
  light: LightPreset;
  /** Cast shadows from the sun (only with quality "high"). */
  shadows?: boolean;
  /** Sun distance and shadow camera half-size (world units). */
  sunDistance?: number;
  shadowSize?: number;
};

/**
 * Sky dome + hemisphere fill + directional sun + fog, all from one LightPreset.
 * Pure function of props: pass a blended preset (`mixLight`) to animate the time of day.
 */
export function Environment({ light, shadows = false, sunDistance = 60, shadowSize = 40 }: Props) {
  const scene = useThree((s) => s.scene);
  const sky = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new Color() },
          uHorizon: { value: new Color() },
          uGround: { value: new Color() },
          uSunDir: { value: new Vector3() },
          uSunColor: { value: new Color() },
          uSunGlow: { value: 0 },
        },
        vertexShader: skyVertex,
        fragmentShader: skyFragment,
      }),
    [],
  );
  const fog = useMemo(() => new Fog("#000", 10, 100), []);

  useLayoutEffect(() => {
    const u = sky.uniforms;
    u.uTop.value.set(light.skyTop);
    u.uHorizon.value.set(light.skyHorizon);
    u.uGround.value.set(light.skyGround);
    u.uSunDir.value.set(...light.sunDir);
    u.uSunColor.value.set(light.sunColor);
    u.uSunGlow.value = light.sunGlow;
    fog.color.set(light.fogColor);
    fog.near = light.fogNear;
    fog.far = light.fogFar;
  }, [light, sky, fog]);

  useLayoutEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);

  useLayoutEffect(() => () => sky.dispose(), [sky]);

  const sun = new Vector3(...light.sunDir).normalize().multiplyScalar(sunDistance);
  return (
    <>
      <mesh material={sky} renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[400, 32, 16]} />
      </mesh>
      <hemisphereLight args={[light.hemiSky, light.hemiGround, light.hemiIntensity]} />
      <directionalLight
        position={sun.toArray()}
        color={light.sunColor}
        intensity={light.sunIntensity}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
        shadow-camera-left={-shadowSize}
        shadow-camera-right={shadowSize}
        shadow-camera-top={shadowSize}
        shadow-camera-bottom={-shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={sunDistance * 2.5}
      />
    </>
  );
}

/** Warm flickering point light (deterministic flicker from `time`). */
export function CandleLight({
  position,
  time,
  intensity = 6,
  distance = 8,
  seed = 0,
}: {
  position: [number, number, number];
  time: number;
  intensity?: number;
  distance?: number;
  seed?: number;
}) {
  const flicker = 0.85 + 0.1 * Math.sin(time * 13 + seed) + 0.05 * Math.sin(time * 29 + seed * 3);
  return (
    <group position={position}>
      <pointLight color="#ffae5c" intensity={intensity * flicker} distance={distance} decay={1.6} />
      <mesh scale={[1, 1.6 + 0.2 * Math.sin(time * 17 + seed), 1]}>
        <sphereGeometry args={[0.03, 8, 6]} />
        <meshBasicMaterial color="#ffd18a" toneMapped={false} />
      </mesh>
    </group>
  );
}
