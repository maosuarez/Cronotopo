"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { MeshStandardMaterial, PlaneGeometry, type Mesh, type Texture } from "three";
import { cached, clamp, GEO, matte, type CameraPose, type Vec3 } from "../kit";

type BoxProps = {
  /** Centre of the box. */
  p: Vec3;
  s: Vec3;
  c: string;
  r?: Vec3;
  shadow?: boolean;
};

/** Centred matte box (most of the workshop furniture is made of these). */
export function Box({ p, s, c, r, shadow = true }: BoxProps) {
  return <mesh geometry={GEO.box()} material={matte(c)} position={p} scale={s} rotation={r} castShadow={shadow} receiveShadow />;
}

/** Table with four legs; `top` = height of the top surface. */
export function Table({ p, size, top, color, topColor }: { p: Vec3; size: [number, number]; top: number; color: string; topColor?: string }) {
  const [w, d] = size;
  const leg = 0.07;
  const legs: Vec3[] = [
    [-w / 2 + leg, 0, -d / 2 + leg],
    [w / 2 - leg, 0, -d / 2 + leg],
    [-w / 2 + leg, 0, d / 2 - leg],
    [w / 2 - leg, 0, d / 2 - leg],
  ];
  return (
    <group position={p}>
      <Box p={[0, top - 0.03, 0]} s={[w, 0.06, d]} c={topColor ?? color} />
      {legs.map((l, i) => (
        <Box key={i} p={[l[0], (top - 0.06) / 2, l[2]]} s={[leg, top - 0.06, leg]} c={color} />
      ))}
      <Box p={[0, 0.16, 0]} s={[w - 0.2, 0.04, 0.04]} c={color} shadow={false} />
    </group>
  );
}

const unitPlane = () => cached("mainz-plane", () => new PlaneGeometry(1, 1));

/**
 * A page (plane facing +z, size width × height) that shows only the strip u0..u1 of its texture,
 * from the top down to `v1` (0 = nothing, 1 = full height). Used for every line-by-line reveal.
 * `mode="alpha"` uses the texture as alpha map (ink sticking to the letters only).
 */
export function ClippedPage({
  texture,
  width,
  height,
  u0 = 0,
  u1 = 1,
  v1 = 1,
  mode = "map",
  color = "#ffffff",
  opacity = 1,
  roughness = 0.9,
  z = 0,
}: {
  texture: Texture;
  width: number;
  height: number;
  u0?: number;
  u1?: number;
  v1?: number;
  mode?: "map" | "alpha";
  color?: string;
  opacity?: number;
  roughness?: number;
  z?: number;
}) {
  const { tex, mat } = useMemo(() => {
    const tex = texture.clone();
    const mat = new MeshStandardMaterial({ roughness: 0.9, metalness: 0, transparent: mode === "alpha", depthWrite: mode !== "alpha" });
    if (mode === "alpha") mat.alphaMap = tex;
    else mat.map = tex;
    return { tex, mat };
  }, [texture, mode]);
  useEffect(
    () => () => {
      tex.dispose();
      mat.dispose();
    },
    [tex, mat],
  );
  const vis = clamp(v1, 0.0005, 1);
  useLayoutEffect(() => {
    tex.repeat.set(u1 - u0, vis);
    tex.offset.set(u0, 1 - vis);
    mat.color.set(color);
    mat.opacity = opacity;
    mat.roughness = roughness;
  });
  if (v1 <= 0 || opacity <= 0.001) return null;
  return (
    <mesh
      geometry={unitPlane()}
      material={mat}
      position={[((u0 + u1) / 2) * width - width / 2, height / 2 - (vis * height) / 2, z]}
      scale={[(u1 - u0) * width, vis * height, 1]}
      receiveShadow
    />
  );
}

/** Black plane just in front of the camera for dips to black on hard cuts. */
export function Dip({ pose, opacity }: { pose: CameraPose; opacity: number }) {
  const ref = useRef<Mesh>(null);
  const [px, py, pz] = pose.pos;
  const [lx, ly, lz] = pose.look;
  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    const dx = lx - px;
    const dy = ly - py;
    const dz = lz - pz;
    const len = Math.hypot(dx, dy, dz) || 1;
    m.position.set(px + (dx / len) * 0.15, py + (dy / len) * 0.15, pz + (dz / len) * 0.15);
    m.lookAt(px, py, pz);
  });
  if (opacity <= 0.001) return null;
  return (
    <mesh ref={ref} geometry={unitPlane()} scale={[2, 2, 1]} renderOrder={999} frustumCulled={false}>
      <meshBasicMaterial color="#000000" transparent opacity={opacity} depthTest={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}
