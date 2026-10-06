"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Color, DirectionalLight } from "three";
import { sceneMotion } from "@/lib/choreography";
import { useAtlasStore } from "@/store/useAtlasStore";
import { Atmosphere } from "./Atmosphere";
import { CameraRig } from "./CameraRig";
import { Earth } from "./Earth";
import { EraArcs } from "./EraArcs";
import { LocationMarkers } from "./LocationMarkers";
import { SceneDirector } from "./SceneDirector";
import { useSceneState } from "./sceneState";
import { Starfield } from "./Starfield";

const SUN_BASE = new Color("#fff4e0");

function Lights() {
  const sun = useRef<DirectionalLight>(null);
  useFrame(() => {
    sun.current?.color.copy(SUN_BASE).lerp(sceneMotion.accent, 0.2);
  });
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight ref={sun} position={[5, 2.5, 4]} intensity={2.4} />
    </>
  );
}

/** Syncs the canvas element's opacity with sceneMotion.canvasOpacity (reduced-motion cuts). */
function CanvasFade() {
  const applied = useRef(1);
  useFrame(({ gl }) => {
    if (applied.current === sceneMotion.canvasOpacity) return;
    applied.current = sceneMotion.canvasOpacity;
    gl.domElement.style.opacity = String(applied.current);
  });
  return null;
}

/** Signals readiness once the Earth texture is in and a frame has been rendered with it. */
function SceneReady({ onReady }: { onReady?: () => void }) {
  const done = useRef(false);
  const seenLoaded = useRef(false);
  useFrame(() => {
    if (done.current) return;
    if (!useSceneState.getState().textureLoaded) return;
    // First frame after the texture mounts is rendered after this callback; signal on the next one.
    if (!seenLoaded.current) {
      seenLoaded.current = true;
      return;
    }
    done.current = true;
    document.documentElement.dataset.sceneReady = "true";
    useAtlasStore.getState().setSceneReady(true);
    onReady?.();
  });
  useEffect(
    () => () => {
      delete document.documentElement.dataset.sceneReady;
      useSceneState.setState({ textureLoaded: false });
      useAtlasStore.getState().setSceneReady(false);
    },
    [],
  );
  return null;
}

export default function Experience({ onReady }: { onReady?: () => void }) {
  return (
    <div data-testid="atlas-canvas" className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0, 7.5] }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#05060a"]} />
        <Lights />
        <Starfield />
        <Earth />
        <Atmosphere />
        <LocationMarkers />
        <EraArcs />
        <CameraRig />
        <SceneDirector />
        <CanvasFade />
        <SceneReady onReady={onReady} />
      </Canvas>
    </div>
  );
}
