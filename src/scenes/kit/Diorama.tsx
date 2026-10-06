"use client";

import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { useLayoutEffect, type ReactNode } from "react";
import { ACESFilmicToneMapping, PCFSoftShadowMap } from "three";
import type { SceneQuality } from "../types";

/**
 * Common wrapper of every scene: tone mapping, shadows and post-processing (vignette + soft bloom) on "high";
 * plain render on "low". Keeps the six scenes visually consistent.
 */
export function Diorama({
  quality,
  children,
  bloom = 0.35,
  vignette = 0.55,
}: {
  quality: SceneQuality;
  children: ReactNode;
  bloom?: number;
  vignette?: number;
}) {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.toneMapping = ACESFilmicToneMapping;
    gl.toneMappingExposure = 1.05;
    gl.shadowMap.enabled = quality === "high";
    gl.shadowMap.type = PCFSoftShadowMap;
    gl.shadowMap.needsUpdate = true;
  }, [gl, quality]);

  return (
    <>
      {children}
      {quality === "high" && (
        <EffectComposer multisampling={4}>
          <Bloom intensity={bloom} luminanceThreshold={0.82} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette offset={0.28} darkness={vignette} />
        </EffectComposer>
      )}
    </>
  );
}
