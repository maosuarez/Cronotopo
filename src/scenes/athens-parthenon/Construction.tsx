"use client";

import { useMemo } from "react";
import { Quaternion, Vector3 } from "three";
import { ease, Figure, GEO, Instances, Label3D, matte, PALETTE, progress, type InstanceSpec, type Vec3 } from "../kit";
import { TG } from "./geometry";
import { ARCH_TOP, COL, DRUM_H, HERO, S } from "./layout";
import { HERO_DRUM_INDEX, HERO_SEAT } from "./schedule";

const MAST: Vec3 = [39.2, 0, 19.8];
const MAST_TOP: Vec3 = [39.2, 15.5, 19.8];
const TIP: Vec3 = [HERO.x + 0.1, 18.4, HERO.z + 0.1];
const PILE: Vec3 = [44, 0, 27];
const MARBLE = "#ece4d4";
const UP = new Vector3(0, 1, 0);

/** Wooden beam or rope between two points. */
function Beam({ a, b, thickness, color = PALETTE.wood }: { a: Vec3; b: Vec3; thickness: number; color?: string }) {
  const d = new Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const len = d.length();
  const q = new Quaternion().setFromUnitVectors(UP, d.normalize());
  return (
    <mesh
      geometry={GEO.box()}
      material={matte(color)}
      position={[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2]}
      quaternion={q}
      scale={[thickness, len, thickness]}
      castShadow
    />
  );
}

/** Seated height of drum `j` on a column. */
const seatY = (j: number) => S + j * DRUM_H;
/** Shader taper at the middle of drum `j` (the hanging drum is drawn without the temple shader). */
const taperAt = (j: number) => 1 - COL.taper * ((j + 0.5) / COL.drums);

/**
 * Construction beat: a wooden derrick lowers a Pentelic marble drum onto the south-east corner column,
 * two men turn the winch, a foreman guides; a pile of drums waits on the ground.
 */
export function Construction({ time, high }: { time: number; high: boolean }) {
  const lower = ease.out(progress(time, 20, HERO_SEAT));
  const seated = time >= HERO_SEAT;
  const sway = (1 - lower) * 0.12;
  const drumY = seatY(HERO_DRUM_INDEX) + (1 - lower) * 4.6;
  const drumPos: Vec3 = [HERO.x + sway * Math.sin(time * 2.1), drumY, HERO.z + sway * Math.cos(time * 1.7)];
  const hookY = seated ? Math.min(TIP[1] - 1, seatY(HERO_DRUM_INDEX) + DRUM_H + (time - HERO_SEAT) * 3) : drumY + DRUM_H + 0.4;
  const r = COL.r * taperAt(HERO_DRUM_INDEX);

  const pile = useMemo<InstanceSpec[]>(() => {
    const out: InstanceSpec[] = [];
    const rows = [4, 3, 2];
    rows.forEach((n, row) => {
      for (let i = 0; i < n; i++) {
        const along = (i - (n - 1) / 2) * 1.95;
        out.push({ position: [PILE[0] + 0.5, PILE[1] + COL.r + row * 1.62, PILE[2] + along], rotation: [0, 0, Math.PI / 2], scale: [COL.r * 1.95, DRUM_H, COL.r * 1.95], color: MARBLE });
      }
    });
    out.push({ position: [PILE[0] - 4, 0.0, PILE[2] + 2.5], scale: [COL.r * 1.95, DRUM_H, COL.r * 1.95], color: MARBLE });
    out.push({ position: [PILE[0] - 4.4, 0.0, PILE[2] - 1.5], scale: [COL.r * 1.95, DRUM_H, COL.r * 1.95], color: "#e4dccb" });
    return out;
  }, []);

  const winch: Vec3 = [MAST[0] + 2.4, 0, MAST[2] + 2.2];
  const labelOpacity = progress(time, 20.4, 21.2) * (1 - progress(time, 25.4, 26.2));
  const drumLabel = progress(time, 20.8, 21.4) * (1 - progress(time, 23.4, 23.9));

  return (
    <group>
      {/* derrick: mast, two stays, boom, rope */}
      <Beam a={MAST} b={MAST_TOP} thickness={0.42} />
      <Beam a={[MAST[0] + 3.5, 0, MAST[2] + 3]} b={[MAST_TOP[0], MAST_TOP[1] - 1, MAST_TOP[2]]} thickness={0.26} />
      <Beam a={[MAST[0] + 4, 0, MAST[2] - 2.5]} b={[MAST_TOP[0], MAST_TOP[1] - 1, MAST_TOP[2]]} thickness={0.26} />
      <Beam a={[MAST_TOP[0], MAST_TOP[1] - 3, MAST_TOP[2]]} b={TIP} thickness={0.32} />
      <Beam a={TIP} b={[HERO.x, hookY, HERO.z]} thickness={0.05} color="#6b5a40" />
      <Beam a={TIP} b={[winch[0], 1.0, winch[2]]} thickness={0.05} color="#6b5a40" />
      {/* winch with two men turning it */}
      <mesh geometry={GEO.cylinder()} material={matte(PALETTE.woodDark)} position={winch} scale={[0.6, 1.2, 0.6]} castShadow={high} />
      <Beam a={[winch[0] - 1.4, 1.0, winch[2]]} b={[winch[0] + 1.4, 1.0, winch[2]]} thickness={0.12} />
      {[0, Math.PI].map((ph, i) => {
        const a = time * 0.6 + ph;
        return (
          <Figure
            key={i}
            position={[winch[0] + Math.cos(a) * 1.5, 0, winch[2] - Math.sin(a) * 1.5]}
            rotationY={a + Math.PI}
            pose="push"
            t={time + i * 0.4}
            outfit={{ tunic: i ? PALETTE.wool : PALETTE.linen, skin: PALETTE.skinTones[i ? 3 : 1] }}
            castShadow={high}
          />
        );
      })}
      {/* foreman on the stylobate guiding the drum */}
      <Figure position={[HERO.x - 2.6, S, HERO.z + 0.5]} rotationY={Math.PI / 2 - 0.2} pose="point" t={time} outfit={{ tunic: PALETTE.dyeOchre, skin: PALETTE.skinTones[2] }} castShadow={high} />
      <Figure position={[HERO.x + 2.4, 0, HERO.z + 3.6]} rotationY={-2.6} pose="work" t={time} outfit={{ tunic: PALETTE.linen, skin: PALETTE.skinTones[0], head: "cap", headColor: PALETTE.wool }} castShadow={high} />
      {!seated && (
        <mesh geometry={TG.drum()} material={matte(MARBLE)} position={drumPos} scale={[r, DRUM_H * 0.99, r]} castShadow={high} />
      )}
      <Instances geometry={GEO.cylinder()} material={matte()} items={pile} castShadow={high} receiveShadow />
      <Label3D position={[PILE[0], 6, PILE[2]]} opacity={labelOpacity}>
        Mármol del Pentélico
      </Label3D>
      <Label3D position={[drumPos[0] + 2.2, drumPos[1] + 0.5, drumPos[2] + 1.2]} size="sm" opacity={drumLabel}>
        Tambor
      </Label3D>
    </group>
  );
}

/** Painters' scaffold in front of the south frieze (polychromy beat). */
export function Scaffold({ time, high }: { time: number; high: boolean }) {
  const deck = ARCH_TOP - 1.25;
  return (
    <group>
      {[24, 30].flatMap((x) => [17.05, 18.05].map((z) => <Beam key={`${x}-${z}`} a={[x, 0, z]} b={[x, deck, z]} thickness={0.2} />))}
      <mesh geometry={GEO.boxBase()} material={matte(PALETTE.wood)} position={[27, deck, 17.55]} scale={[7, 0.16, 1.3]} castShadow={high} />
      {[25.3, 28.4].map((x, i) => (
        <Figure key={x} position={[x, deck + 0.16, 17.3]} rotationY={Math.PI} pose="work" t={time + i * 0.5} speed={0.8} outfit={{ tunic: i ? PALETTE.dyeBlue : PALETTE.linen, skin: PALETTE.skinTones[i + 1] }} castShadow={high} />
      ))}
      <mesh geometry={GEO.cylinder()} material={matte(PALETTE.clay)} position={[26.8, deck + 0.16, 17.7]} scale={[0.35, 0.35, 0.35]} />
    </group>
  );
}
