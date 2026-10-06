"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import type { Line2 } from "three/examples/jsm/lines/Line2.js";
import type { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import type { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { getEra } from "@/data/index";
import { sceneMotion } from "@/lib/choreography";
import { greatCirclePoints, latLonToVector3, angleBetweenUnit } from "@/lib/geo";
import type { Coordinates } from "@/domain/types";
import { useAtlasStore } from "@/store/useAtlasStore";

const SEGMENTS = 96;
const noRaycast = () => null;
const PAIRS = [
  [0, 1],
  [1, 2],
  [2, 0],
] as const;

function arcPoints(a: Coordinates, b: Coordinates) {
  const angle = angleBetweenUnit(latLonToVector3(a.lat, a.lon, 1), latLonToVector3(b.lat, b.lon, 1));
  return greatCirclePoints(a, b, SEGMENTS, 1.003, 0.05 + (0.25 * angle) / Math.PI);
}

function Arc({ points, index }: { points: ReturnType<typeof arcPoints>; index: number }) {
  const line = useRef<Line2>(null);

  useFrame(() => {
    const l = line.current;
    if (!l) return;
    l.raycast = noRaycast;
    const { progress, opacity } = sceneMotion.arcs[index];
    const count = Math.floor(progress * SEGMENTS);
    const visible = count > 0 && opacity > 0.005;
    l.visible = visible;
    if (!visible) return;
    (l.geometry as LineSegmentsGeometry & { instanceCount: number }).instanceCount = count;
    const material = l.material as LineMaterial;
    material.color.copy(sceneMotion.accent);
    material.opacity = opacity * 0.85;
  });

  return (
    <Line
      ref={line}
      points={points}
      color="white"
      lineWidth={1.5}
      transparent
      depthWrite={false}
    />
  );
}

export function EraArcs() {
  const era = getEra(useAtlasStore((s) => s.displayedEraId));
  const arcs = useMemo(
    () => (era ? PAIRS.map(([a, b]) => arcPoints(era.locations[a].coordinates, era.locations[b].coordinates)) : []),
    [era],
  );
  if (!era) return null;
  return (
    <>
      {arcs.map((points, i) => (
        <Arc key={`${era.id}-${i}`} points={points} index={i} />
      ))}
    </>
  );
}
