"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import type { BufferAttribute, Points } from "three";
import { sceneMotion } from "@/lib/choreography";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * drei's star material has no opacity uniform and is additive, so the fade
 * scales the vertex colors (only while `sceneMotion.stars` changes).
 * Radius is 25/20 (not 50/40): the star shader uses w=0.5, doubling the effective distance,
 * which would push stars beyond camera far=100 and clip them all.
 */
export function Starfield() {
  const points = useRef<Points>(null);
  const baseColors = useRef<Float32Array | null>(null);
  const applied = useRef(-1);
  const reduced = useReducedMotion();

  useEffect(() => {
    const attr = points.current?.geometry.getAttribute("color") as BufferAttribute | undefined;
    if (attr) baseColors.current = Float32Array.from(attr.array as Float32Array);
  }, []);

  useFrame(() => {
    const attr = points.current?.geometry.getAttribute("color") as BufferAttribute | undefined;
    const base = baseColors.current;
    if (!attr || !base || applied.current === sceneMotion.stars) return;
    applied.current = sceneMotion.stars;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < arr.length; i++) arr[i] = base[i] * sceneMotion.stars;
    attr.needsUpdate = true;
  });

  return <Stars ref={points} radius={25} depth={20} count={4000} factor={2.5} saturation={0} fade speed={reduced ? 0 : 1} />;
}
