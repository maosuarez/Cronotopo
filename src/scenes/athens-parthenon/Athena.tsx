"use client";

import { useLayoutEffect, useMemo } from "react";
import { BoxGeometry, ConeGeometry, CylinderGeometry, MeshStandardMaterial, SphereGeometry, TorusGeometry } from "three";
import { cached, merge } from "../kit";
import { S, STATUE } from "./layout";

/** Statue base height and the top of the figure (~12 m in total with the base). */
export const ATHENA_BASE = 1.2;
export const ATHENA_TOP = S + 12;

/**
 * Athena Parthenos (chryselephantine: gold drapery and arms, face in ivory). Local frame: facing +X, her right = +Z.
 * Proportions are a stylised reading of the widely published reconstructions (shield at her left, Nike on the right hand).
 */
const G = {
  base: () => cached("ath-a-base", () => new BoxGeometry(4.4, ATHENA_BASE, 8.4).translate(0, ATHENA_BASE / 2, 0)),
  gold: () =>
    cached("ath-a-gold", () => {
      const y0 = ATHENA_BASE;
      return merge([
        // peplos: long skirt with folds, overfold, aegis on the chest, helmet with crest
        new CylinderGeometry(1.15, 1.75, 5.4, 14).translate(0, y0 + 2.7, 0),
        new CylinderGeometry(1.32, 1.45, 1.3, 14).translate(0, y0 + 5.5, 0),
        new CylinderGeometry(1.2, 1.12, 2.2, 12).translate(0, y0 + 7.2, 0),
        new CylinderGeometry(1.35, 1.2, 0.5, 12).translate(0, y0 + 8.2, 0),
        new SphereGeometry(0.8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2).translate(-0.1, y0 + 9.45, 0),
        new BoxGeometry(1.9, 0.9, 0.18).translate(-0.1, y0 + 10.25, 0),
        new BoxGeometry(0.5, 0.8, 0.14).translate(0.6, y0 + 10.15, 0.42),
        new BoxGeometry(0.5, 0.8, 0.14).translate(0.6, y0 + 10.15, -0.42),
        // shield resting at her left side, serpent coiled inside it
        new CylinderGeometry(2.3, 2.3, 0.16, 24).rotateX(Math.PI / 2).rotateY(0.35).translate(0.3, y0 + 2.35, -2.35),
        new TorusGeometry(1.4, 0.12, 5, 20).rotateX(Math.PI / 2).rotateY(0.35).translate(0.36, y0 + 2.35, -2.2),
        // spear held in the left hand
        new CylinderGeometry(0.07, 0.09, 10.6, 6).translate(0.8, y0 + 5.3, -1.75),
        new ConeGeometry(0.22, 0.9, 6).translate(0.8, y0 + 11.05, -1.75),
        // Nike on the palm of the right hand
        new CylinderGeometry(0.2, 0.42, 1.25, 8).translate(3.05, y0 + 6.75, 1.5),
        new SphereGeometry(0.2, 8, 6).translate(3.05, y0 + 7.6, 1.5),
        new BoxGeometry(0.12, 0.9, 1.1).rotateX(0.5).translate(2.85, y0 + 7.2, 1.95),
        new BoxGeometry(0.12, 0.9, 1.1).rotateX(-0.5).translate(2.85, y0 + 7.2, 1.05),
      ]);
    }),
  ivory: () =>
    cached("ath-a-ivory", () => {
      const y0 = ATHENA_BASE;
      return merge([
        new CylinderGeometry(0.34, 0.4, 0.6, 10).translate(0, y0 + 8.65, 0),
        new SphereGeometry(0.66, 14, 10).translate(0.12, y0 + 9.15, 0),
        // right arm: upper arm down, forearm forward holding Nike
        new CylinderGeometry(0.26, 0.3, 2.0, 8).translate(0, y0 + 7.0, 1.45),
        new CylinderGeometry(0.24, 0.26, 2.6, 8).rotateZ(Math.PI / 2).translate(1.5, y0 + 6.1, 1.5),
        // left arm down to the shield rim
        new CylinderGeometry(0.26, 0.3, 2.4, 8).rotateX(0.25).translate(0.2, y0 + 6.7, -1.55),
        new CylinderGeometry(0.22, 0.25, 1.9, 8).rotateZ(-0.5).translate(0.6, y0 + 5.0, -1.75),
      ]);
    }),
};

export function Athena({ high }: { high: boolean }) {
  const mats = useMemo(
    () => ({
      gold: new MeshStandardMaterial({ color: "#eebd4e", metalness: 0.45, roughness: 0.32, emissive: "#6a4510", emissiveIntensity: 0.3, flatShading: true }),
      ivory: new MeshStandardMaterial({ color: "#f2e7cf", roughness: 0.55, metalness: 0, emissive: "#3a2c1c", emissiveIntensity: 0.25 }),
      base: new MeshStandardMaterial({ color: "#d9cfbd", roughness: 0.9, flatShading: true }),
    }),
    [],
  );
  useLayoutEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);
  return (
    <group position={[STATUE.x, S, STATUE.z]}>
      <mesh geometry={G.base()} material={mats.base} castShadow={high} receiveShadow />
      <mesh geometry={G.gold()} material={mats.gold} castShadow={high} receiveShadow />
      <mesh geometry={G.ivory()} material={mats.ivory} castShadow={high} receiveShadow />
    </group>
  );
}
