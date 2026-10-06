"use client";

import { useEffect, useRef, type ComponentRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { CAMERA, type CameraDriver } from "@/lib/choreography";
import { poseFromPosition, positionFromPose } from "@/lib/camera";
import { useAtlasStore } from "@/store/useAtlasStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cameraDriverRef } from "./sceneState";

const MIN_APPLIED_DISTANCE = 1.2;

export function CameraRig() {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((s) => s.camera);
  const reduced = useReducedMotion();

  // Controls enabled / idle rotation follow the store without re-rendering.
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    let interacting = false;
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;

    const sync = () => {
      const { isTransitioning, selectedLocationId } = useAtlasStore.getState();
      controls.enabled = !isTransitioning;
      controls.autoRotate = !reduced && !interacting && !isTransitioning && selectedLocationId === null;
    };
    const onStart = () => {
      interacting = true;
      clearTimeout(resumeTimer);
      sync();
    };
    const onEnd = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => {
        interacting = false;
        sync();
      }, CAMERA.idleResumeMs);
    };

    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);
    const unsubscribe = useAtlasStore.subscribe(sync);
    sync();
    return () => {
      clearTimeout(resumeTimer);
      unsubscribe();
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
    };
  }, [reduced]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;
    const driver: CameraDriver = {
      getPose: () => poseFromPosition(camera.position),
      applyPose: (pose) => {
        positionFromPose(
          { direction: pose.direction, distance: Math.max(MIN_APPLIED_DISTANCE, pose.distance) },
          camera.position,
        );
        controls.target.set(0, 0, 0);
        camera.lookAt(0, 0, 0);
        controls.update();
      },
    };
    cameraDriverRef.current = driver;
    return () => {
      if (cameraDriverRef.current === driver) cameraDriverRef.current = null;
    };
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan={false}
      enableDamping
      minDistance={CAMERA.minDistance}
      maxDistance={CAMERA.maxDistance}
      rotateSpeed={0.5}
      zoomSpeed={0.6}
      autoRotateSpeed={CAMERA.idleSpeed}
    />
  );
}

