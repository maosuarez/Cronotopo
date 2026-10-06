"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect, useMemo } from "react";
import { BackSide, Color, Fog, ShaderMaterial, Vector3 } from "three";
import type { LightPreset } from "../kit/lighting";
import type { Vec3 } from "../kit/math";
import { NOISE_GLSL } from "./materials";

const skyVertex = /* glsl */ `
  varying vec3 vDir;
  void main() {
    vDir = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop, uHorizon, uGround, uSunDir, uSunColor;
  uniform float uSunGlow, uClouds, uTime;
  varying vec3 vDir;
  ${NOISE_GLSL}
  void main() {
    vec3 d = normalize(vDir);
    float h = d.y;
    vec3 col = h > 0.0 ? mix(uHorizon, uTop, pow(smoothstep(0.0, 1.0, h), 0.55)) : mix(uHorizon, uGround, smoothstep(0.0, 0.2, -h));
    float s = max(dot(d, normalize(uSunDir)), 0.0);
    col += uSunColor * uSunGlow * (pow(s, 90.0) * 1.4 + pow(s, 8.0) * 0.22);
    // thin high cirrus, projected on a dome; brighter towards the sun
    if (h > 0.02 && uClouds > 0.0) {
      vec2 p = d.xz / (h + 0.12) * 1.6 + vec2(uTime * 0.004, 0.0);
      float c = smoothstep(0.52, 0.85, pvFbm(p * vec2(1.0, 2.6)));
      col = mix(col, mix(uHorizon, vec3(1.0), 0.6) + uSunColor * pow(s, 4.0) * 0.25, c * uClouds * smoothstep(0.02, 0.25, h));
    }
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`;

/**
 * Like the kit Environment (sky dome + hemisphere + sun + fog from one LightPreset) but the dome follows the camera:
 * this scene films from several hundred metres away (the bay, the wide eruption shots), outside the kit's fixed dome.
 * Adds faint cirrus so the bright Campanian sky reads as air, not a flat gradient.
 */
export function Atmosphere({ light, camera, time, clouds, shadows }: { light: LightPreset; camera: Vec3; time: number; clouds: number; shadows: boolean }) {
  const scene = useThree((s) => s.scene);
  const sky = useMemo(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        fog: false,
        uniforms: {
          uTop: { value: new Color() }, uHorizon: { value: new Color() }, uGround: { value: new Color() },
          uSunDir: { value: new Vector3() }, uSunColor: { value: new Color() }, uSunGlow: { value: 0 }, uClouds: { value: 0 }, uTime: { value: 0 },
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
    u.uClouds.value = clouds;
    u.uTime.value = time;
    fog.color.set(light.fogColor);
    fog.near = light.fogNear;
    fog.far = light.fogFar;
  });
  useLayoutEffect(() => {
    scene.fog = fog;
    return () => {
      scene.fog = null;
    };
  }, [scene, fog]);
  useLayoutEffect(() => () => sky.dispose(), [sky]);

  const sunDistance = 320;
  const sun = new Vector3(...light.sunDir).normalize().multiplyScalar(sunDistance);
  const shadowSize = 125;
  return (
    <>
      <mesh material={sky} renderOrder={-1} frustumCulled={false} position={camera}>
        <sphereGeometry args={[940, 32, 16]} />
      </mesh>
      <hemisphereLight args={[light.hemiSky, light.hemiGround, light.hemiIntensity]} />
      <directionalLight
        position={sun.toArray()}
        color={light.sunColor}
        intensity={light.sunIntensity}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
        shadow-normalBias={0.05}
        shadow-camera-left={-shadowSize}
        shadow-camera-right={shadowSize}
        shadow-camera-top={shadowSize}
        shadow-camera-bottom={-shadowSize}
        shadow-camera-near={1}
        shadow-camera-far={sunDistance * 2.2}
      />
    </>
  );
}
