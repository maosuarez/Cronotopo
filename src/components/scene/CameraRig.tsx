"use client";

import { useEffect, useRef, type ComponentRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { PerspectiveCamera } from "three";
import { CAMERA, FRAMING, sceneMotion, type CameraDriver } from "@/lib/choreography";
import { poseFromPosition, positionFromPose } from "@/lib/camera";
import { useAtlasStore } from "@/store/useAtlasStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cameraDriverRef } from "./sceneState";

const MIN_APPLIED_DISTANCE = 1.2;

export function CameraRig() {
  const controlsRef = useRef<ComponentRef<typeof OrbitControls>>(null);
  const camera = useThree((s) => s.camera);
  const reduced = useReducedMotion();
  const applied = useRef({ f: -1, w: 0, h: 0 });

  // Shifts the projection so the focus point clears the UI panel (see FRAMING). Cheap: only touches
  // the camera when factor or viewport change; resizes are picked up on the next frame.
  useFrame(({ camera: cam, size }) => {
    const f = sceneMotion.frameShift;
    const a = applied.current;
    if ((f === a.f && size.width === a.w && size.height === a.h) || !("setViewOffset" in cam)) return;
    a.f = f;
    a.w = size.width;
    a.h = size.height;
    const persp = cam as PerspectiveCamera;
    if (f < 0.0005) {
      persp.clearViewOffset();
      return;
    }
    const { width, height } = size;
    // Positive offset moves the content left / up on screen.
    const shiftX = width >= FRAMING.desktopBreakpoint ? FRAMING.panelWidthDesktop / 2 : 0;
    const shiftY =
      width >= FRAMING.desktopBreakpoint
        ? 0
        : height / 2 - FRAMING.mobileFocusY * height * (1 - FRAMING.sheetHeightMobile);
    persp.setViewOffset(width, height, shiftX * f, shiftY * f, width, height);
  });

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

