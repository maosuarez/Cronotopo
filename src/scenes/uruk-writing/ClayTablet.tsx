"use client";

import { useLayoutEffect, useMemo } from "react";
import { Color } from "three";
import type { Vec3 } from "../kit";
import { createClayMaterial, SD_TAPERED_CAPSULE } from "./clay";
import { TABLET_SIZE, URUK_GEO } from "./geometries";
import { MAX_STROKES, packStrokes, type Stroke } from "./signs";

/** Fresh clay is dark and satin; dried clay is pale and matte. */
const WET = "#7e5a3e";
const WET_COLOR = new Color(WET);
const DRY = new Color("#c9a77f");

/** Height field of a tablet: grooves along each stroke with a little clay pushed up at their rims. */
const TABLET_HEIGHT = /* glsl */ `
  #define MAX_STROKES ${MAX_STROKES}
  uniform vec4 uStrokeAB[MAX_STROKES];
  uniform vec4 uStrokeR[MAX_STROKES];
  ${SD_TAPERED_CAPSULE}
  float clayHeight(vec3 p, out float shade) {
    shade = 0.0;
    if (p.y < 0.0) return 0.0;
    float groove = 0.0;
    float rim = 0.0;
    for (int i = 0; i < MAX_STROKES; i++) {
      vec4 ab = uStrokeAB[i];
      vec4 r = uStrokeR[i];
      if (r.z <= 0.0) continue;
      float d = sdTaperedCapsule(p.xz, ab.xy, ab.zw, r.x, r.y);
      if (d > 0.004) continue;
      vec2 ba = ab.zw - ab.xy;
      float along = clamp(dot(p.xz - ab.xy, ba) / max(dot(ba, ba), 1e-12), 0.0, 1.0);
      float falloff = r.w >= 0.0 ? mix(1.0, 1.0 - r.w, along) : mix(1.0 + r.w, 1.0, along);
      float width = max(mix(r.x, r.y, along), 0.0004);
      float depth = r.z * falloff;
      // rounded U profile inside the stroke, soft lip just outside it
      float inside = clamp(-d / width, 0.0, 1.0);
      groove = max(groove, depth * sqrt(inside) * smoothstep(0.0, 0.00025, -d + 0.00012));
      float lip = (d - 0.35 * width) / (0.55 * width);
      rim = max(rim, depth * 0.28 * exp(-lip * lip));
      shade = max(shade, inside * falloff * clamp(r.z / 0.0015, 0.0, 1.0));
    }
    return rim - groove;
  }
`;

/**
 * A clay tablet whose marks are driven by `strokes` (tablet-local, see signs.ts). `wetness` 1 = freshly
 * smoothed clay (dark, satin), 0 = dried (pale, matte). `scale` animates its appearance in time-lapses.
 */
export function ClayTablet({
  position,
  strokes,
  wetness = 1,
  large = false,
  scale = 1,
  rotationY = 0,
  castShadow = false,
}: {
  position: Vec3;
  strokes: readonly Stroke[];
  wetness?: number;
  large?: boolean;
  scale?: number;
  rotationY?: number;
  castShadow?: boolean;
}) {
  const uniforms = useMemo(
    () => ({ uStrokeAB: { value: new Float32Array(MAX_STROKES * 4) }, uStrokeR: { value: new Float32Array(MAX_STROKES * 4) } }),
    [],
  );
  const material = useMemo(() => createClayMaterial({ key: "tablet", heightGLSL: TABLET_HEIGHT, uniforms, color: WET, roughness: 0.5 }), [uniforms]);
  useLayoutEffect(() => () => material.dispose(), [material]);

  useLayoutEffect(() => {
    packStrokes(strokes, uniforms.uStrokeAB.value, uniforms.uStrokeR.value);
    material.color.copy(DRY).lerp(WET_COLOR, wetness);
    material.roughness = 0.92 - 0.4 * wetness;
  });

  if (scale <= 0.001) return null;
  return (
    <mesh
      geometry={large ? URUK_GEO.tabletLarge() : URUK_GEO.tablet()}
      material={material}
      position={[position[0], position[1] + TABLET_SIZE.h / 2 * scale, position[2]]}
      rotation={[0, rotationY, 0]}
      scale={scale}
      castShadow={castShadow}
      receiveShadow
    />
  );
}
