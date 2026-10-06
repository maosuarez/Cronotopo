"use client";

import { useEffect, useRef, type ComponentType } from "react";
import { disposeKitCache } from "@/scenes/kit/geometry";
import { Canvas, useFrame } from "@react-three/fiber";
import type { SceneProps, SceneQuality } from "@/scenes/types";

/** Calls `onReady` once a frame containing the scene has actually been rendered. */
function FirstFrame({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    // useFrame runs before render: on the 2nd callback the 1st frame is already on screen.
    if (frames.current > 1) return;
    frames.current += 1;
    if (frames.current === 2) onReady();
  });
  return null;
}

type Props = {
  Scene: ComponentType<SceneProps>;
  time: number;
  quality: SceneQuality;
  onReady: () => void;
};

/** The player's own canvas. Loaded on demand (keeps three/R3F out of the initial bundle); unmounting disposes it. */
export default function SceneCanvas({ Scene, time, quality, onReady }: Props) {
  // Shared kit geometries/materials live for the player session only.
  useEffect(() => () => disposeKitCache(), []);
  return (
    <Canvas
      dpr={quality === "low" ? 1 : [1, 2]}
      camera={{ fov: 40, near: 0.1, far: 1000, position: [0, 0, 6] }}
      gl={{ antialias: true }}
      style={{ background: "var(--color-void)" }}
    >
      <Scene time={time} quality={quality} />
      <FirstFrame onReady={onReady} />
    </Canvas>
  );
}
