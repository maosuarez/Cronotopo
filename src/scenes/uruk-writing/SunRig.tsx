"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { DirectionalLight, Object3D, Vector3 } from "three";
import type { LightPreset, Vec3 } from "../kit";

/**
 * Sun with a shadow camera that tracks a focus point and size. The kit Environment aims its sun at the world
 * origin with a fixed frustum, which cannot resolve centimetre-sized tablets; this rig is used instead (the
 * Environment receives the same preset with its sun intensity at 0, so it only contributes sky, fog and fill).
 */
export function SunRig({ light, focus, size, shadows }: { light: LightPreset; focus: Vec3; size: number; shadows: boolean }) {
  const ref = useRef<DirectionalLight>(null);
  const target = useMemo(() => new Object3D(), []);
  const distance = Math.max(4, size * 2.5);
  const position = new Vector3(...light.sunDir).normalize().multiplyScalar(distance).add(new Vector3(...focus));

  useLayoutEffect(() => {
    const sun = ref.current;
    if (!sun) return;
    target.position.set(...focus);
    target.updateMatrixWorld();
    sun.target = target;
    const cam = sun.shadow.camera;
    cam.left = -size;
    cam.right = size;
    cam.top = size;
    cam.bottom = -size;
    cam.near = distance * 0.05;
    cam.far = distance * 2.5;
    cam.updateProjectionMatrix();
    // Biases scale with the frustum: world-space offsets that suit a city would swallow a tablet's relief.
    sun.shadow.bias = -0.0003;
    sun.shadow.normalBias = size * 0.0012;
  });

  return (
    <>
      <primitive object={target} />
      <directionalLight
        ref={ref}
        position={position.toArray()}
        color={light.sunColor}
        intensity={light.sunIntensity}
        castShadow={shadows}
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}
