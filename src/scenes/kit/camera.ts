"use client";

import { useThree } from "@react-three/fiber";
import { useLayoutEffect } from "react";
import { PerspectiveCamera } from "three";
import { ease, sample, type EaseFn, type Keyframe, type Vec3 } from "./math";

/** One camera keyframe: where the camera is, what it looks at, optional fov. `ease` shapes the move INTO this key. */
export type CameraKey = { t: number; pos: Vec3; look: Vec3; fov?: number; ease?: EaseFn };

export type CameraPose = { pos: Vec3; look: Vec3; fov: number };

/**
 * Samples a documentary camera path. Hold a shot by repeating the same pose at two times;
 * cut by placing two keys 0.001 s apart.
 */
export function sampleCamera(keys: readonly CameraKey[], t: number, defaultFov = 38): CameraPose {
  const toTrack = <T extends Vec3 | number>(pick: (k: CameraKey) => T): Keyframe<T>[] =>
    keys.map((k) => ({ t: k.t, v: pick(k), ease: k.ease ?? ease.inOut }));
  return {
    pos: sample(toTrack((k) => k.pos), t),
    look: sample(toTrack((k) => k.look), t),
    fov: sample(toTrack((k) => k.fov ?? defaultFov), t),
  };
}

/** Applies the sampled camera pose for `time` (pure: same time → same frame). */
export function useCameraPath(keys: readonly CameraKey[], time: number, defaultFov = 38) {
  const camera = useThree((s) => s.camera);
  const pose = sampleCamera(keys, time, defaultFov);
  useLayoutEffect(() => {
    camera.position.set(...pose.pos);
    camera.lookAt(...pose.look);
    if (camera instanceof PerspectiveCamera && camera.fov !== pose.fov) {
      camera.fov = pose.fov;
      camera.updateProjectionMatrix();
    }
  });
  return pose;
}
