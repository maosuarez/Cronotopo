"use client";

import { Component, Suspense, useEffect, useMemo, useRef, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import {
  AdditiveBlending,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  LineBasicMaterial,
  type Mesh,
  type ShaderMaterial,
  SRGBColorSpace,
} from "three";
import { sceneMotion } from "@/lib/choreography";
import { latLonToVector3 } from "@/lib/geo";
import { useSceneState } from "./sceneState";

/**
 * Texture orientation: geo.ts `latLonToVector3` is defined for SphereGeometry's default UV
 * mapping (u=0 at lon -180), so the mesh needs no rotation. The globe never rotates at runtime;
 * the camera orbits instead, keeping marker world positions fixed.
 */
const TEXTURE_URL = "/textures/earth-day-2048.jpg";

function TexturedGlobe() {
  const texture = useTexture(TEXTURE_URL, (t) => {
    const tex = Array.isArray(t) ? t[0] : t;
    tex.colorSpace = SRGBColorSpace;
    tex.anisotropy = 8;
    tex.needsUpdate = true;
  });
  useEffect(() => {
    useSceneState.getState().setTextureLoaded(true);
  }, []);
  return (
    <mesh>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial map={texture} roughness={0.95} metalness={0} />
    </mesh>
  );
}

/** Dark sphere + 15° graticule, used when the texture fails to load. */
function FallbackGlobe() {
  const { geometry, material } = useMemo(() => {
    const positions: number[] = [];
    const push = (lat: number, lon: number) => {
      const v = latLonToVector3(lat, lon, 1.001);
      positions.push(v.x, v.y, v.z);
    };
    for (let lat = -75; lat <= 75; lat += 15) {
      for (let lon = -180; lon < 180; lon += 5) {
        push(lat, lon);
        push(lat, lon + 5);
      }
    }
    for (let lon = -180; lon < 180; lon += 15) {
      for (let lat = -90; lat < 90; lat += 5) {
        push(lat, lon);
        push(lat + 5, lon);
      }
    }
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const material = new LineBasicMaterial({ transparent: true, opacity: 0.5 });
    return { geometry, material };
  }, []);

  useEffect(() => {
    useSceneState.getState().setTextureLoaded(true);
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    material.color.copy(sceneMotion.accent).multiplyScalar(0.5);
  });

  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial color="#0a0d14" roughness={1} metalness={0} />
      </mesh>
      <lineSegments geometry={geometry} material={material} />
    </>
  );
}

class TextureBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const sweepVertex = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = normalize(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const sweepFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uSweep;
  uniform float uStrength;
  varying vec3 vPos;
  const float PI = 3.14159265;

  float line(float v, float spacing, float width) {
    float d = abs(fract(v / spacing + 0.5) - 0.5) * spacing;
    return 1.0 - smoothstep(0.0, width, d);
  }

  void main() {
    float center = 1.0 - 2.0 * uSweep;
    float d = (vPos.y - center) / 0.14;
    float band = exp(-d * d);
    float lat = asin(clamp(vPos.y, -1.0, 1.0));
    float lon = atan(vPos.z, vPos.x);
    float grid = max(line(lat, radians(15.0), 0.006), line(lon, radians(15.0), 0.006));
    float a = band * (0.55 + 0.9 * grid) * uStrength;
    gl_FragColor = vec4(uColor * a, a);
  }
`;

function SweepShell() {
  const mesh = useRef<Mesh>(null);
  const uniforms = useMemo(
    () => ({ uColor: { value: new Color() }, uSweep: { value: 0 }, uStrength: { value: 0 } }),
    [],
  );

  useFrame(() => {
    const m = mesh.current;
    if (!m) return;
    const visible = sceneMotion.sweepStrength > 0.001;
    m.visible = visible;
    if (!visible) return;
    const u = (m.material as ShaderMaterial).uniforms;
    u.uColor.value.copy(sceneMotion.accent);
    u.uSweep.value = sceneMotion.sweep;
    u.uStrength.value = sceneMotion.sweepStrength;
  });

  return (
    <mesh ref={mesh} visible={false} raycast={() => null}>
      <sphereGeometry args={[1.004, 96, 96]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={sweepVertex}
        fragmentShader={sweepFragment}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </mesh>
  );
}

export function Earth() {
  return (
    <>
      <TextureBoundary fallback={<FallbackGlobe />}>
        <Suspense fallback={null}>
          <TexturedGlobe />
        </Suspense>
      </TextureBoundary>
      <SweepShell />
    </>
  );
}
