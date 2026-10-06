"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { CanvasTexture, DoubleSide, ExtrudeGeometry, Mesh, MeshStandardMaterial, Shape, SRGBColorSpace } from "three";
import { cached, createRng, Crowd, GEO, Instances, matte, PALETTE, Vegetation, Water, type CrowdAgent, type InstanceSpec, type Vec3 } from "../kit";
import type { SceneQuality } from "../types";
import { CASING_COLOR } from "./Pyramid";
import { CANAL, WATER_Y, groundY } from "./world";

/** Nile-boat silhouette (rising bow and stern) extruded across the beam; 18 m long, base at y = 0. */
const hullGeo = () =>
  cached("giza-hull", () => {
    const s = new Shape();
    s.moveTo(-9, 2.6);
    s.quadraticCurveTo(-7.4, 0.3, -5, 0);
    s.lineTo(5, 0);
    s.quadraticCurveTo(7.6, 0.3, 9.2, 2.2);
    s.lineTo(8.2, 1.3);
    s.lineTo(-8, 1.3);
    s.lineTo(-9, 2.6);
    const g = new ExtrudeGeometry(s, { depth: 4.4, bevelEnabled: false, curveSegments: 5 });
    g.translate(0, 0, -2.2);
    return g;
  });

const BARGE_SPEED = 3;
/** Lead barge position along the canal (x) at time t; barges stop at their berth. */
export function bargeX(k: number, t: number) {
  const berth = CANAL.quayX + 13 + k * 21;
  const start = 245 + k * 46;
  return Math.max(berth, start - BARGE_SPEED * (t - 20));
}
const BARGE_LANES = [-4.5, 4, -3, 5];

function Barges({ time, count }: { time: number; count: number }) {
  const { hulls, cargo, oars, crew } = useMemo(() => {
    const hulls: InstanceSpec[] = [];
    const cargo: InstanceSpec[] = [];
    const oars: InstanceSpec[] = [];
    const crew: CrowdAgent[] = [];
    for (let k = 0; k < count; k++) {
      const x = bargeX(k, time);
      const z = CANAL.z + BARGE_LANES[k % BARGE_LANES.length];
      const bob = Math.sin(time * 1.3 + k * 1.7) * 0.06;
      const y = WATER_Y - 0.55 + bob;
      // The boat points west (towards the quay): flip the hull so the bow (+x in the shape) faces -x.
      hulls.push({ position: [x, y, z], rotation: [0, Math.PI, Math.sin(time * 1.1 + k) * 0.012], color: k % 2 ? PALETTE.wood : PALETTE.woodDark });
      for (let b = 0; b < 3; b++) cargo.push({ position: [x - 3.2 + b * 2.6, y + 1.3, z + (b % 2 ? 0.4 : -0.4)], rotation: [0, 0.05 * b, 0], scale: [2.1, 1.25, 1.7], color: CASING_COLOR });
      oars.push({ position: [x + 8.4, y + 1.6, z + 1.6], rotation: [0, 0.2, 0.9], scale: [0.18, 5, 0.18] });
      oars.push({ position: [x + 8.4, y + 1.6, z - 1.6], rotation: [0, -0.2, 0.9], scale: [0.18, 5, 0.18] });
      const crewSpots: [number, number][] = [[-6.4, 1.2], [-6.4, -1.2], [5, 1.4], [7.4, 0]];
      for (const [dx, dz] of crewSpots) {
        const p: Vec3 = [x + dx, y + 1.3, z + dz];
        crew.push({ path: [p, [p[0] - 1, p[1], p[2]]], idle: true, offset: 0, color: dx > 6 ? PALETTE.dyeOchre : PALETTE.linen, scale: 0.95 });
      }
    }
    return { hulls, cargo, oars, crew };
  }, [time, count]);
  return (
    <group>
      <Instances geometry={hullGeo()} material={matte()} items={hulls} castShadow receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte()} items={cargo} castShadow />
      <Instances geometry={GEO.cylinder()} material={matte(PALETTE.woodDark)} items={oars} />
      <Crowd agents={crew} time={time} />
    </group>
  );
}

/** Flood plain, palm-lined dikes along the canal and the stone quay at the foot of the plateau. */
export function Harbour({ time, quality }: { time: number; quality: SceneQuality }) {
  const high = quality === "high";
  const dikeLen = CANAL.endX - CANAL.quayX - 6;
  const dikeX = CANAL.quayX + 6 + dikeLen / 2;
  const dikes = useMemo<InstanceSpec[]>(
    () => [
      { position: [dikeX, WATER_Y - 2, CANAL.z - CANAL.halfWidth - 3], scale: [dikeLen, 2.6, 6], color: "#a98c62" },
      { position: [dikeX, WATER_Y - 2, CANAL.z + CANAL.halfWidth + 3], scale: [dikeLen, 2.6, 6], color: "#a98c62" },
      // Quay: dressed stone platform and a ramp up to the plateau path.
      { position: [CANAL.quayX - 10, WATER_Y - 2, CANAL.z], scale: [22, 3.2, 34], color: PALETTE.limestoneShade },
    ],
    [dikeLen, dikeX],
  );
  const palms = useMemo<[number, number][]>(() => {
    const rng = createRng(5);
    const pts: [number, number][] = [];
    for (let x = CANAL.quayX + 14; x < CANAL.endX - 20; x += rng.range(9, 16)) {
      pts.push([x, CANAL.z - CANAL.halfWidth - 3 + rng.range(-1.2, 1.2)]);
      if (rng.next() > 0.25) pts.push([x + rng.range(-4, 4), CANAL.z + CANAL.halfWidth + 3 + rng.range(-1.2, 1.2)]);
    }
    return pts;
  }, []);
  const stacked = useMemo<InstanceSpec[]>(() => {
    const out: InstanceSpec[] = [];
    for (let i = 0; i < 10; i++) out.push({ position: [CANAL.quayX - 16 + (i % 5) * 2.6, WATER_Y + 1.2 + Math.floor(i / 5) * 1.3, CANAL.z - 9], scale: [2.1, 1.25, 1.7], color: CASING_COLOR });
    return out;
  }, []);
  const porters = useMemo(() => {
    const path: Vec3[] = [
      [CANAL.quayX - 4, WATER_Y + 1.2, CANAL.z + 4],
      [CANAL.quayX - 18, WATER_Y + 1.2, CANAL.z + 4],
      [CANAL.quayX - 26, groundY(CANAL.quayX - 26, CANAL.z + 4) + 0.1, CANAL.z + 4],
      [CANAL.quayX - 50, groundY(CANAL.quayX - 50, CANAL.z + 10), CANAL.z + 10],
    ];
    return path;
  }, []);
  const porterAgents = useMemo(
    () =>
      Array.from({ length: high ? 14 : 7 }, (_, i): CrowdAgent => ({
        path: porters,
        offset: i * (high ? 4 : 8),
        speed: 0.9,
        loop: true,
        lateral: i % 2 ? 0.7 : -0.7,
        color: i % 3 ? PALETTE.linen : PALETTE.wool,
      })),
    [porters, high],
  );
  return (
    <group>
      {/* Flood sheet (scaled kit water keeps the vertex count low) and the calmer canal surface. */}
      <group position={[720, WATER_Y - 0.12, 0]} scale={10}>
        <Water time={time} width={120} depth={170} wave={0.04} shallow="#5c8f8c" deep="#356a73" sky="#d4e2ea" opacity={1} />
      </group>
      <Water time={time} width={CANAL.endX - CANAL.quayX} depth={2 * CANAL.halfWidth} position={[(CANAL.endX + CANAL.quayX) / 2, WATER_Y, CANAL.z]} wave={0.05} shallow="#4f8790" deep="#2c5f6a" sky="#d4e2ea" opacity={1} />
      <Instances geometry={GEO.boxBase()} material={matte()} items={dikes} castShadow receiveShadow />
      <Vegetation kind="palm" points={palms} size={2.6} seed={8} height={() => WATER_Y + 0.6} castShadow={high} />
      <Instances geometry={GEO.boxBase()} material={matte()} items={stacked} castShadow receiveShadow />
      <Crowd agents={porterAgents} time={time} />
      <Barges time={time} count={high ? 4 : 3} />
    </group>
  );
}

/** Papyrus sheet with pseudo-hieratic lines drawn at runtime (a didactic insert, not a facsimile). */
export function Papyrus({ position, lookAt, opacity, scale = 1 }: { position: Vec3; lookAt: Vec3; opacity: number; scale?: number }) {
  const ref = useRef<Mesh>(null);
  const { texture, material } = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 320;
    const ctx = canvas.getContext("2d");
    const rng = createRng(77);
    if (ctx) {
      ctx.fillStyle = "#e3cf9f";
      ctx.fillRect(0, 0, 640, 320);
      // Papyrus fibres: crossed strips.
      for (let i = 0; i < 90; i++) {
        ctx.strokeStyle = `rgba(150,115,60,${rng.range(0.05, 0.16)})`;
        ctx.lineWidth = rng.range(1, 3);
        const y = rng.range(0, 320);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(640, y + rng.range(-3, 3));
        ctx.stroke();
      }
      for (let i = 0; i < 40; i++) {
        ctx.strokeStyle = `rgba(150,115,60,${rng.range(0.04, 0.1)})`;
        const x = rng.range(0, 640);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + rng.range(-3, 3), 320);
        ctx.stroke();
      }
      // Lines of cursive strokes, first one in red (rubric), written right to left in columns of signs.
      for (let row = 0; row < 7; row++) {
        ctx.strokeStyle = row === 0 ? "#9b3d2e" : "#2a2119";
        ctx.lineWidth = 3.2;
        ctx.lineCap = "round";
        let x = 600;
        const y = 44 + row * 38;
        while (x > 50) {
          const w = rng.range(8, 22);
          ctx.beginPath();
          ctx.moveTo(x, y + rng.range(-8, 4));
          ctx.quadraticCurveTo(x - w * 0.5, y + rng.range(-14, 14), x - w, y + rng.range(-6, 8));
          if (rng.next() > 0.6) {
            ctx.moveTo(x - w * 0.3, y - 10);
            ctx.lineTo(x - w * 0.4, y + 8);
          }
          ctx.stroke();
          x -= w + rng.range(3, 9);
          if (rng.next() > 0.93) x -= 18;
        }
      }
      // Torn, darker edges.
      const grad = ctx.createLinearGradient(0, 0, 640, 0);
      grad.addColorStop(0, "rgba(120,85,40,0.35)");
      grad.addColorStop(0.06, "rgba(120,85,40,0)");
      grad.addColorStop(0.94, "rgba(120,85,40,0)");
      grad.addColorStop(1, "rgba(120,85,40,0.35)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 640, 320);
    }
    const texture = new CanvasTexture(canvas);
    texture.colorSpace = SRGBColorSpace;
    const material = new MeshStandardMaterial({ map: texture, roughness: 1, side: DoubleSide, transparent: true, emissive: "#ffffff", emissiveMap: texture, emissiveIntensity: 0.35 });
    return { texture, material };
  }, []);
  material.opacity = opacity;
  useLayoutEffect(() => {
    ref.current?.lookAt(...lookAt);
  });
  useLayoutEffect(
    () => () => {
      texture.dispose();
      material.dispose();
    },
    [texture, material],
  );
  if (opacity <= 0.01) return null;
  return (
    <mesh ref={ref} position={position} material={material} scale={scale} renderOrder={5}>
      <planeGeometry args={[2, 1]} />
    </mesh>
  );
}
