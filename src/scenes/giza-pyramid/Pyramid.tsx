"use client";

import { useLayoutEffect, useMemo } from "react";
import {
  BufferAttribute,
  BufferGeometry,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { Crowd, GEO, Instances, matte, PALETTE, pointOnPath, Steps, type CrowdAgent, type InstanceSpec, type Vec3 } from "../kit";
import { COURSE_H, PYR, southFaceZ } from "./world";

export const CORE_COLOR = "#d2b98c";
export const CASING_COLOR = "#e4d9c2";
const HYPOTHESIS_AMBER = "#e8b04a";
/** Horizontal run per metre of rise of the hypothetical straight ramp. */
const RAMP_GRADE = 3.4;

/** Stepped core: `courses` (fractional) laid courses, slightly inside the final slope so the casing hides them. */
function Core({ courses }: { courses: number }) {
  const inset = PYR.half / PYR.courses;
  const width = 2 * (PYR.half - inset - 0.3);
  return (
    <Steps
      position={[PYR.x, 0, PYR.z]}
      width={width}
      depth={width}
      stepHeight={COURSE_H}
      steps={PYR.courses}
      inset={inset}
      color={CORE_COLOR}
      visibleSteps={Math.max(0.001, courses)}
    />
  );
}

/** Polished white casing as a frustum from the base up to `height` (rebuilt only when the height changes). */
function Casing({ height, shine }: { height: number; shine: number }) {
  const h = Math.round(height * 4) / 4;
  const geometry = useMemo(() => {
    if (h <= 0.01) return null;
    const r0 = PYR.half * Math.SQRT2;
    const r1 = r0 * (1 - h / PYR.height);
    return new CylinderGeometry(Math.max(0, r1), r0, h, 4, 1).rotateY(Math.PI / 4).translate(PYR.x, h / 2, PYR.z);
  }, [h]);
  const material = useMemo(
    () => new MeshStandardMaterial({ color: CASING_COLOR, roughness: 0.48, metalness: 0, flatShading: true, emissive: "#fff3d6", emissiveIntensity: 0 }),
    [],
  );
  material.emissiveIntensity = 0.05 * shine;
  useLayoutEffect(() => () => geometry?.dispose(), [geometry]);
  useLayoutEffect(() => () => material.dispose(), [material]);
  if (!geometry) return null;
  return <mesh geometry={geometry} material={material} castShadow receiveShadow />;
}

/** Wedge ramp against the south face whose top meets the working level `h`. */
function rampGeometry(h: number) {
  const zb = southFaceZ(h) - 1.5;
  const zt = southFaceZ(h) + h * RAMP_GRADE;
  const wt = 14;
  const wb = wt + h * 1.1;
  const x = PYR.x;
  const A: Vec3 = [x - wt / 2, h, zb];
  const B: Vec3 = [x + wt / 2, h, zb];
  const C: Vec3 = [x - wb / 2, 0, zb];
  const D: Vec3 = [x + wb / 2, 0, zb];
  const E: Vec3 = [x - wt / 2, 0, zt];
  const F: Vec3 = [x + wt / 2, 0, zt];
  // Counter-clockwise triangles seen from outside.
  const tris: Vec3[] = [A, E, F, A, F, B, A, C, E, B, F, D, A, B, D, A, D, C, C, D, F, C, F, E];
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(new Float32Array(tris.flat()), 3));
  g.computeVertexNormals();
  return g;
}

/** Path of the hauling teams on the ramp surface (toe → top). */
export function rampPath(h: number): Vec3[] {
  return [
    [PYR.x - 3, 0.2, southFaceZ(h) + h * RAMP_GRADE + 12],
    [PYR.x - 3, 0.2, southFaceZ(h) + h * RAMP_GRADE],
    [PYR.x - 3, h + 0.2, southFaceZ(h) + 2],
  ];
}

function Ramp({ height, opacity }: { height: number; opacity: number }) {
  const h = Math.round(height * 2) / 2;
  const geometry = useMemo(() => (h > 0.5 ? rampGeometry(h) : null), [h]);
  const edges = useMemo(() => (geometry ? new EdgesGeometry(geometry) : null), [geometry]);
  const lineMat = useMemo(() => new LineBasicMaterial({ color: HYPOTHESIS_AMBER, transparent: true, toneMapped: false }), []);
  const bodyMat = useMemo(() => new MeshStandardMaterial({ color: "#b99a72", roughness: 1, flatShading: true, transparent: true, side: DoubleSide }), []);
  lineMat.opacity = opacity;
  bodyMat.opacity = opacity;
  bodyMat.depthWrite = opacity > 0.98;
  useLayoutEffect(
    () => () => {
      geometry?.dispose();
      edges?.dispose();
    },
    [geometry, edges],
  );
  useLayoutEffect(
    () => () => {
      lineMat.dispose();
      bodyMat.dispose();
    },
    [lineMat, bodyMat],
  );
  if (!geometry || !edges || opacity <= 0.01) return null;
  return (
    <group>
      <mesh geometry={geometry} material={bodyMat} castShadow={opacity > 0.98} receiveShadow />
      <lineSegments geometry={edges} material={lineMat} />
    </group>
  );
}

/** Teams hauling sledges up the ramp + people on the working level. */
function RampTraffic({ height, time, teams, visible }: { height: number; time: number; teams: number; visible: number }) {
  const path = useMemo(() => rampPath(Math.round(height * 2) / 2), [height]);
  const { agents, blocks } = useMemo(() => {
    const agents: CrowdAgent[] = [];
    const blocks: InstanceSpec[] = [];
    const L = path.reduce((acc, p, i) => (i ? acc + Math.hypot(p[0] - path[i - 1][0], p[1] - path[i - 1][1], p[2] - path[i - 1][2]) : 0), 0);
    const speed = 1.6;
    for (let k = 0; k < teams; k++) {
      const head = ((k / teams) * L + time * speed) % L;
      for (let m = 0; m < 6; m++) {
        const d = head - m * 1.6;
        if (d < 0) continue;
        agents.push({ path, offset: d - time * speed, speed, lateral: m % 2 ? 0.8 : -0.8, color: m % 3 ? PALETTE.linen : PALETTE.wool, loop: false });
      }
      const db = head - 6 * 1.6 - 1.5;
      if (db > 0) {
        const { p, heading } = pointOnPath(path, db);
        blocks.push({ position: [p[0], p[1] + 0.3, p[2]], rotation: [0, heading, 0], scale: [1.4, 1.1, 2], color: CORE_COLOR });
      }
    }
    // Working platform crew.
    const top = path[2];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const r = 6 + (i % 4) * 4;
      agents.push({ path: [[top[0] + Math.cos(a) * r, top[1], top[2] - 12 + Math.sin(a) * r * 0.6], [top[0], top[1], top[2]]], offset: 0, idle: true, color: i % 2 ? PALETTE.linen : PALETTE.wool });
    }
    return { agents, blocks };
  }, [path, teams, time]);
  if (visible <= 0.01) return null;
  return (
    <group>
      <Crowd agents={agents} time={time} visible={visible} />
      <Instances geometry={GEO.boxBase()} material={matte()} items={blocks} />
    </group>
  );
}

export function Pyramid({
  time,
  courses,
  casing,
  shine,
  ramp,
  rampOpacity,
  traffic,
  teams,
}: {
  time: number;
  courses: number;
  casing: number;
  shine: number;
  ramp: number;
  rampOpacity: number;
  traffic: number;
  teams: number;
}) {
  return (
    <group>
      <Core courses={courses} />
      <Casing height={casing} shine={shine} />
      <Ramp height={ramp} opacity={rampOpacity} />
      <RampTraffic height={ramp} time={time} teams={teams} visible={traffic} />
      {/* Levelled bedrock platform around the base. */}
      <mesh geometry={GEO.boxBase()} material={matte(PALETTE.limestoneShade)} position={[PYR.x, -0.6, PYR.z]} scale={[2 * PYR.half + 16, 0.66, 2 * PYR.half + 16]} receiveShadow />
    </group>
  );
}

