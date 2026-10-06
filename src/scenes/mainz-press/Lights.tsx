"use client";

import { CandleLight, smoothstep, type Vec3 } from "../kit";
import { daylight, PRESS, SCRIBE } from "./timing";
import { MAP_CANDLE } from "./MapTable";
import { COMPOSE_CANDLE, FURNACE_GLOW, scribeCandleTop } from "./Workshop";

type Source = { pos: Vec3; color: string; intensity: number; distance: number; flame: boolean; seed: number };

const flicker = (t: number, seed: number) => 0.85 + 0.1 * Math.sin(t * 13 + seed) + 0.05 * Math.sin(t * 29 + seed * 3);

/**
 * Every light source of the workshop, grouped into a fixed pool of point-light slots. Sources sharing a slot
 * are several metres apart, and each one fades with the distance between it and the camera's look point,
 * so only the lights around the current station are live. The light count never changes (no shader
 * recompiles) and stays small enough for software rendering and phones; candle flames stay visible everywhere.
 */
function slots(t: number): Source[][] {
  return [
    [
      { pos: scribeCandleTop(t), color: "#ffae5c", intensity: 1.4, distance: 3.5, flame: true, seed: 1 },
      { pos: [PRESS[0] - 0.83, 1.05, PRESS[2] + 0.7], color: "#ffae5c", intensity: 4, distance: 5, flame: true, seed: 3 },
    ],
    [
      { pos: [SCRIBE.window[0], 1.9, SCRIBE.window[2] + 0.7], color: "#ffe2b0", intensity: 4 * daylight(t), distance: 6, flame: false, seed: 0 },
      { pos: [PRESS[0] + 1.25, 1.65, -3.3], color: "#ffae5c", intensity: 3, distance: 5, flame: true, seed: 4 },
    ],
    [
      { pos: FURNACE_GLOW, color: "#ff8a3c", intensity: 6, distance: 5, flame: false, seed: 7 },
      { pos: COMPOSE_CANDLE, color: "#ffae5c", intensity: 1.8, distance: 4, flame: true, seed: 2 },
      { pos: [5.6, 2.4, 2.1], color: "#ffd9a8", intensity: 1.6 * smoothstep(68.6, 70.6, t), distance: 4, flame: false, seed: 0 },
    ],
    [
      { pos: [-1.8, 1.14, -3.05], color: "#ffae5c", intensity: 2.5, distance: 4, flame: true, seed: 6 },
      { pos: [MAP_CANDLE[0], MAP_CANDLE[1] + 0.21, MAP_CANDLE[2]], color: "#ffae5c", intensity: 1.4, distance: 5, flame: true, seed: 5 },
    ],
  ];
}

const reach = (look: Vec3, p: Vec3) => 1 - smoothstep(2.6, 4.6, Math.hypot(look[0] - p[0], look[1] - p[1], look[2] - p[2]));

export function LightRig({ time, look }: { time: number; look: Vec3 }) {
  const pool = slots(time);
  const lit = new Set<Source>();
  const lights = pool.map((sources, i) => {
    let best = sources[0];
    let w = -1;
    for (const s of sources) {
      const k = reach(look, s.pos);
      if (k > w) {
        w = k;
        best = s;
      }
    }
    // candle-only slots use the kit CandleLight (light + flame); mixed slots a plain flickering point light
    if (sources.every((s) => s.flame)) {
      lit.add(best);
      return <CandleLight key={i} position={best.pos} time={time} intensity={best.intensity * w} distance={best.distance} seed={best.seed} />;
    }
    return (
      <pointLight key={i} position={best.pos} color={best.color} intensity={best.intensity * w * flicker(time, best.seed)} distance={best.distance} decay={1.6} />
    );
  });
  return (
    <>
      {lights}
      {pool
        .flat()
        .filter((s) => s.flame && !lit.has(s))
        .map((s) => (
          <mesh key={s.seed} position={s.pos} scale={[1, 1.6 + 0.2 * Math.sin(time * 17 + s.seed), 1]}>
            <sphereGeometry args={[0.03, 8, 6]} />
            <meshBasicMaterial color="#ffd18a" toneMapped={false} />
          </mesh>
        ))}
    </>
  );
}
