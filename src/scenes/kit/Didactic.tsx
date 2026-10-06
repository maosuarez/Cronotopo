"use client";

import { Html } from "@react-three/drei";
import { useMemo } from "react";
import { ConeGeometry, CylinderGeometry, Quaternion, Vector3 } from "three";
import { cached, matte } from "./geometry";

/**
 * In-world label in the project's typography (DOM via drei Html: no font files to download).
 * `opacity` 0..1 lets beats fade labels in/out deterministically.
 */
export function Label3D({
  position,
  children,
  opacity = 1,
  tone = "light",
  size = "md",
  hypothesis = false,
}: {
  position: [number, number, number];
  children: string;
  opacity?: number;
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  hypothesis?: boolean;
}) {
  if (opacity <= 0.01) return null;
  const fs = size === "sm" ? "11px" : size === "lg" ? "17px" : "13px";
  return (
    <Html position={position} center zIndexRange={[20, 0]} style={{ pointerEvents: "none", opacity, transition: "none" }}>
      <div
        style={{
          fontFamily: "var(--font-serif), Georgia, serif",
          fontSize: fs,
          letterSpacing: "0.06em",
          whiteSpace: "nowrap",
          padding: "3px 9px",
          borderRadius: 2,
          color: tone === "light" ? "#f4ecda" : "#221c16",
          background: tone === "light" ? "rgba(18,14,10,0.62)" : "rgba(244,236,218,0.78)",
          borderLeft: `2px solid ${hypothesis ? "#e8b04a" : "rgba(244,236,218,0.7)"}`,
        }}
      >
        {children}
        {hypothesis && <span style={{ marginLeft: 8, fontFamily: "var(--font-sans), sans-serif", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8b04a" }}>Hipótesis</span>}
      </div>
    </Html>
  );
}

const shaft = () => cached("arrow-shaft", () => new CylinderGeometry(1, 1, 1, 8).translate(0, 0.5, 0));
const head = () => cached("arrow-head", () => new ConeGeometry(1, 1, 10).translate(0, 0.5, 0));
const UP = new Vector3(0, 1, 0);

/** Didactic 3D arrow from `from` to `to`; `progress` 0..1 grows it from the tail. */
export function Arrow({
  from,
  to,
  progress = 1,
  color = "#f2c57c",
  thickness = 0.06,
}: {
  from: [number, number, number];
  to: [number, number, number];
  progress?: number;
  color?: string;
  thickness?: number;
}) {
  const { len, quat } = useMemo(() => {
    const d = new Vector3(...to).sub(new Vector3(...from));
    const len = d.length();
    return { len, quat: new Quaternion().setFromUnitVectors(UP, d.normalize()) };
  }, [from, to]);
  if (progress <= 0.001) return null;
  const L = len * Math.min(1, progress);
  const headLen = Math.min(thickness * 5, L * 0.4);
  const mat = matte(color, { flat: false, emissive: color, emissiveIntensity: 0.35 });
  return (
    <group position={from} quaternion={quat}>
      <mesh geometry={shaft()} material={mat} scale={[thickness, Math.max(0.001, L - headLen), thickness]} />
      <mesh geometry={head()} material={mat} position={[0, L - headLen, 0]} scale={[thickness * 2.6, headLen, thickness * 2.6]} />
    </group>
  );
}
