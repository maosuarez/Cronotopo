"use client";

import { CatmullRomCurve3, PlaneGeometry, SphereGeometry, TubeGeometry, Vector3 } from "three";
import { cached, clamp, ease, Figure, GEO, hash01, Label3D, lerp, lerp3, matte, PALETTE, progress, window01, type Vec3 } from "../kit";
import type { SceneQuality } from "../types";
import { Batch } from "./Batch";
import { ironMat, paperMat, texturedMat } from "./materials";
import { Box, ClippedPage, Table } from "./parts";
import { PAGE_ASPECT, type SceneTextures } from "./textures";
import {
  BAR_REST,
  hungSheets,
  inkSweep,
  pressState,
  PRESS,
  PRINTED_AT,
  SHEET_PRESENT,
  SHEET_W,
  sheetLift,
  sheetToLine,
  STACK,
  stackSheets,
  winePressRise,
  WINE_PRESS,
} from "./timing";
import { Forme, FORME_H } from "./Workshop";

const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const OAK = "#4a3020";
const OAK_LIGHT = "#6a4a30";

/** Helical thread of the screw (unit: radius 1, height 1, 5 turns). */
const helix = () =>
  cached("mainz-helix", () => {
    const pts: Vector3[] = [];
    for (let i = 0; i <= 160; i++) {
      const a = (i / 160) * Math.PI * 2 * 5;
      pts.push(new Vector3(Math.cos(a), i / 160, Math.sin(a)));
    }
    return new TubeGeometry(new CatmullRomCurve3(pts), 320, 0.09, 5, false);
  });
const ball = () => cached("mainz-inkball", () => new SphereGeometry(1, 16, 10));

// layout of the press (local coordinates, front = +z)
const BED_TOP = 0.815;
const HINGE: Vec3 = [0, 0.835, 0.33];
const SHEET_ON_TYMPAN = 0.33;
const PLATEN_UP = 1.0;
const PLATEN_TRAVEL = 0.155;
const BAR_Y = 1.3;
const BAR_LEN = 0.78;

/** World transform of the sheet while it lies on the (rotating) tympan. */
function sheetOnTympan(carriage: number, tympan: number): { pos: Vec3; rotX: number } {
  const y = 0.012;
  const z = SHEET_ON_TYMPAN;
  const local: Vec3 = [0, y * Math.cos(tympan) - z * Math.sin(tympan), y * Math.sin(tympan) + z * Math.cos(tympan)];
  return { pos: add(PRESS, add([HINGE[0], HINGE[1], HINGE[2] + carriage], local)), rotX: tympan - Math.PI / 2 };
}

/** Slot of the k-th hung sheet on the drying lines (nearest to the press first). */
const LINE_Y = 2.55;
const LINE_Z = [-1.15, -0.5];
const SLOT_X = Array.from({ length: 14 }, (_, i) => 1.75 + i * 0.42).sort((a, b) => Math.abs(a - 4.6) - Math.abs(b - 4.6));
function hungSlot(k: number): Vec3 {
  const line = k % 2;
  const col = Math.floor(k / 2);
  return [SLOT_X[col % SLOT_X.length], LINE_Y - FORME_H / 2 - 0.015, LINE_Z[line]];
}

export function Press({ time, tex, quality }: { time: number; tex: SceneTextures; quality: SceneQuality }) {
  const st = pressState(time);
  const drop = st.platen * PLATEN_TRAVEL;
  const sweep = inkSweep(time);
  const inking = time > 32.2 && time < 39.6;
  const formeLocal: Vec3 = [0, BED_TOP, st.carriage];
  const formeWorld = add(PRESS, formeLocal);
  const high = quality === "high";

  // ink balls: rest on the slab, travel to the forme, dab while sweeping from the page top (front) to its foot
  const slab = add(PRESS, [-0.95, 0.8, 0.8]);
  const engage = ease.inOut(progress(time, 32.3, 33.0)) * (1 - ease.inOut(progress(time, 38.7, 39.4)));
  const balls: { pos: Vec3; tilt: number }[] = [0, 1].map((i) => {
    const side = i ? 1 : -1;
    const rest: Vec3 = add(slab, [side * 0.09, 0.045, 0]);
    const vz = formeWorld[2] + FORME_H / 2 - lerp(0.06, FORME_H - 0.06, sweep) + 0.03 * Math.sin(time * 5.3 + i * 2);
    const dab = Math.abs(Math.sin(time * Math.PI * 2.2 + i * 1.4));
    const work: Vec3 = [formeWorld[0] + side * (0.075 + 0.03 * Math.sin(time * 3.7 + i)), BED_TOP + 0.042 + 0.05 * dab, vz];
    return { pos: lerp3(rest, work, engage), tilt: side * (0.25 + 0.1 * Math.sin(time * 4 + i)) * engage };
  });

  return (
    <group>
      <group position={PRESS}>
        {/* frame: feet, cheeks, head, cap, winter */}
        <Box p={[0, 0.06, 0]} s={[1.55, 0.12, 0.5]} c={OAK} />
        <Box p={[-0.6, 1.15, 0]} s={[0.17, 2.3, 0.25]} c={OAK} />
        <Box p={[0.6, 1.15, 0]} s={[0.17, 2.3, 0.25]} c={OAK} />
        <Box p={[0, 1.86, 0]} s={[1.45, 0.28, 0.34]} c={OAK_LIGHT} />
        <Box p={[0, 2.34, 0]} s={[1.62, 0.1, 0.42]} c={OAK} />
        <Box p={[0, 0.62, 0]} s={[1.3, 0.16, 0.3]} c={OAK_LIGHT} />
        {/* rails reaching out to the front + stay */}
        <Box p={[-0.3, 0.72, 0.5]} s={[0.1, 0.06, 2.0]} c={OAK_LIGHT} />
        <Box p={[0.3, 0.72, 0.5]} s={[0.1, 0.06, 2.0]} c={OAK_LIGHT} />
        <Box p={[0, 0.35, 1.42]} s={[0.72, 0.7, 0.08]} c={OAK} />
        {/* rounce (crank that runs the carriage in and out) */}
        <group position={[0.42, 0.72, 0.95]} rotation={[st.carriage * 9, 0, 0]}>
          <mesh geometry={GEO.cylinder()} material={matte(OAK)} rotation={[0, 0, Math.PI / 2]} position={[0.06, 0, 0]} scale={[0.1, 0.12, 0.1]} />
          <Box p={[0.1, 0.08, 0]} s={[0.025, 0.18, 0.025]} c={OAK} />
        </group>

        {/* carriage: coffin with the forme, tympan hinged at its outer end */}
        <group position={[0, 0, st.carriage]}>
          <Box p={[0, 0.775, 0]} s={[0.66, 0.05, 0.7]} c={OAK_LIGHT} />
          <group position={[0, BED_TOP, 0]} rotation={[0, Math.PI, 0]}>
            <Forme tex={tex} lines={42} />
            {/* ink sticks to the raised letters (alpha = forme letters), spreading with the sweep */}
            <group rotation={[-Math.PI / 2, 0, 0]}>
              <ClippedPage texture={tex.forme} width={SHEET_W} height={FORME_H} color="#2c2724" roughness={0.18} v1={time >= 39 ? 1 : sweep} z={0.0012} />
            </group>
          </group>
          <group position={HINGE} rotation={[st.tympan, 0, 0]}>
            {/* tympan frame (open = lying towards the front) */}
            <mesh geometry={GEO.box()} material={matte("#d9c9a3")} position={[0, 0.004, 0.31]} scale={[0.44, 0.006, 0.58]} />
            <Box p={[-0.23, 0.006, 0.31]} s={[0.025, 0.016, 0.62]} c={PALETTE.iron} shadow={false} />
            <Box p={[0.23, 0.006, 0.31]} s={[0.025, 0.016, 0.62]} c={PALETTE.iron} shadow={false} />
            <Box p={[0, 0.006, 0.61]} s={[0.48, 0.016, 0.025]} c={PALETTE.iron} shadow={false} />
          </group>
        </group>

        {/* screw, hose and platen move down together; the bar turns the screw */}
        <group position={[0, -drop, 0]}>
          <group rotation={[0, st.bar - BAR_REST, 0]}>
            <mesh geometry={GEO.cylinder()} material={matte(OAK_LIGHT)} position={[0, 1.15, 0]} scale={[0.09, 0.62, 0.09]} />
            <mesh geometry={helix()} material={matte("#7b5a3a")} position={[0, 1.42, 0]} scale={[0.05, 0.3, 0.05]} />
          </group>
          <group rotation={[0, st.bar, 0]}>
            <mesh geometry={GEO.cylinder()} material={ironMat()} position={[0, BAR_Y, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.035, BAR_LEN, 0.035]} castShadow />
            <mesh geometry={GEO.cylinder()} material={matte(OAK)} position={[BAR_LEN - 0.02, BAR_Y, 0]} rotation={[0, 0, -Math.PI / 2]} scale={[0.05, 0.16, 0.05]} />
          </group>
          <Box p={[0, PLATEN_UP + 0.14, 0]} s={[0.17, 0.24, 0.17]} c={OAK} />
          <Box p={[0, PLATEN_UP + 0.025, 0]} s={[0.46, 0.05, 0.52]} c={OAK_LIGHT} />
          <mesh geometry={GEO.box()} material={ironMat()} position={[0, PLATEN_UP + 0.002, 0]} scale={[0.44, 0.006, 0.5]} />
        </group>
      </group>

      {/* ink slab and the two leather ink balls */}
      <Table p={add(PRESS, [-0.95, 0, 0.8])} size={[0.5, 0.42]} top={0.8} color={OAK} topColor="#625d58" />
      <mesh geometry={GEO.cylinder()} material={matte("#141110", { flat: false })} position={add(slab, [0, 0.001, 0.08])} scale={[0.2, 0.004, 0.14]} />
      {balls.map((b, i) => (
        <group key={i} position={b.pos} rotation={[0, 0, b.tilt]}>
          <mesh geometry={ball()} material={matte("#6b4a30", { flat: false })} scale={[0.065, 0.042, 0.065]} castShadow />
          <mesh geometry={ball()} material={matte("#141110", { flat: false })} position={[0, -0.03, 0]} scale={[0.05, 0.014, 0.05]} />
          <mesh geometry={GEO.cylinder()} material={matte(OAK_LIGHT)} position={[0, 0.02, 0]} scale={[0.03, 0.22, 0.03]} />
        </group>
      ))}

      {/* figures: inker and pressman */}
      <Figure position={add(PRESS, [-1.3, 0, 0.95])} rotationY={1.84} pose={inking ? "work" : "stand"} t={time} speed={1.1} outfit={{ tunic: PALETTE.dyeOchre, skin: PALETTE.skinTones[1], head: "cap", headColor: "#3a2c20" }} castShadow />
      <Figure position={add(PRESS, [0.95, 0, 0.42])} rotationY={Math.PI + 0.9} pose={st.platen > 0.05 ? "push" : "stand"} t={0} outfit={{ tunic: PALETTE.dyeRed, skin: PALETTE.skinTones[3], sash: "#3a2a1e" }} castShadow />

      <WinePress time={time} quality={quality} pressing={st.platen} />
      <Sheet time={time} tex={tex} />
      <PrintRun time={time} tex={tex} high={high} />

      <Label3D position={add(slab, [0, 0.42, 0.05])} opacity={window01(time, 33.2, 33.7, 36.4, 36.8)}>
        balas de cuero
      </Label3D>
      <Label3D position={add(formeWorld, [0, 0.12, -0.32])} opacity={window01(time, 36.6, 37.0, 39.5, 39.9)}>
        tinta al aceite
      </Label3D>
      <Label3D position={add(PRESS, [0.0, 1.62, 0.32])} opacity={window01(time, 42.2, 42.7, 49.2, 49.7)}>
        husillo
      </Label3D>
      <Label3D position={add(PRESS, [-0.42, PLATEN_UP - drop + 0.04, 0.3])} opacity={window01(time, 44.2, 44.7, 49.2, 49.7)} size="sm">
        platina
      </Label3D>
    </group>
  );
}

/** Wine press model rising from the floor: same screw principle, pressing grapes in a tub. */
function WinePress({ time, quality, pressing }: { time: number; quality: SceneQuality; pressing: number }) {
  const rise = winePressRise(time);
  if (rise <= 0.001) return null;
  const grapes = quality === "high" ? 70 : 34;
  const p = pressing;
  return (
    <group position={add(WINE_PRESS, [0, -1.9 * (1 - ease.out(rise)), 0])} scale={0.95}>
      <mesh geometry={GEO.cylinder()} material={matte(PALETTE.wood)} scale={[0.95, 0.42, 0.95]} castShadow receiveShadow />
      {[0.08, 0.32].map((y) => (
        <mesh key={y} geometry={GEO.cylinder()} material={matte(PALETTE.iron)} position={[0, y, 0]} scale={[0.97, 0.035, 0.97]} />
      ))}
      <Batch
        geometry={ball()}
        material={matte("#ffffff", { flat: false })}
        capacity={grapes}
        place={(i, o, c) => {
          const a = i * 2.39996;
          const r = 0.4 * Math.sqrt((i + 0.5) / grapes);
          o.position.set(Math.cos(a) * r, 0.43 + 0.05 * (1 - p * 0.8) * (1 - r / 0.45) + 0.02 * hash01(i), Math.sin(a) * r);
          o.scale.setScalar(0.04 * (1 - 0.4 * p));
          c.set(hash01(i, 4) > 0.5 ? "#4f2445" : "#6a2f55");
        }}
      />
      <Box p={[-0.58, 0.85, 0]} s={[0.12, 1.7, 0.14]} c={OAK} />
      <Box p={[0.58, 0.85, 0]} s={[0.12, 1.7, 0.14]} c={OAK} />
      <Box p={[0, 1.6, 0]} s={[1.32, 0.18, 0.2]} c={OAK_LIGHT} />
      <group position={[0, -0.18 * p, 0]}>
        <group rotation={[0, p * 1.2, 0]}>
          <mesh geometry={GEO.cylinder()} material={matte(OAK_LIGHT)} position={[0, 0.62, 0]} scale={[0.08, 1.45, 0.08]} />
          <mesh geometry={helix()} material={matte("#7b5a3a")} position={[0, 1.15, 0]} scale={[0.045, 0.55, 0.045]} />
          <mesh geometry={GEO.cylinder()} material={ironMat()} position={[0, 1.95, 0]} rotation={[0, 0, Math.PI / 2]} scale={[0.03, 0.9, 0.03]} />
        </group>
        <mesh geometry={GEO.cylinder()} material={matte(OAK)} position={[0, 0.58, 0]} scale={[0.72, 0.06, 0.72]} castShadow />
      </group>
      <Label3D position={[0, 2.25, 0]} opacity={rise * window01(time, 40.8, 41.4, 49.4, 49.9)}>
        prensa de vino
      </Label3D>
    </group>
  );
}

/** The single sheet followed from tympan (blank) → press → close-up (printed) → drying line. */
function Sheet({ time, tex }: { time: number; tex: SceneTextures }) {
  const toLine = sheetToLine(time);
  if (toLine >= 1) return null;
  const st = pressState(time);
  const on = sheetOnTympan(st.carriage, st.tympan);
  const lift = sheetLift(time);
  let pos = lerp3(on.pos, SHEET_PRESENT, lift);
  pos = add(pos, [0, 0.18 * Math.sin(Math.PI * lift), 0]);
  let rotX = lerp(on.rotX, 0, lift);
  let rotY = 0.35 * Math.sin(Math.PI * lift);
  if (toLine > 0) {
    pos = add(lerp3(SHEET_PRESENT, hungSlot(0), toLine), [0, 0.25 * Math.sin(Math.PI * toLine), 0]);
    rotX = 0;
    rotY = 0.4 * Math.sin(Math.PI * toLine);
  }
  // a slight curl while it travels
  const bend = 0.12 * Math.sin(Math.PI * Math.max(lift < 1 ? lift : 0, toLine));
  const printed = time >= PRINTED_AT;
  return (
    <group position={pos} rotation={[rotX, rotY, bend]}>
      <mesh material={printed ? texturedMat(tex.page, { double: true }) : paperMat()} scale={[SHEET_W, SHEET_W / PAGE_ASPECT, 1]} castShadow>
        <planeGeometry />
      </mesh>
      <Label3D position={[-SHEET_W / 2 - 0.09, 0.12, 0]} opacity={window01(time, 55.6, 56.1, 60.4, 60.9)} size="sm">
        2 columnas
      </Label3D>
      <Label3D position={[SHEET_W / 2 + 0.1, -0.02, 0]} opacity={window01(time, 56.6, 57.1, 60.4, 60.9)} size="sm">
        42 líneas
      </Label3D>
    </group>
  );
}

/** Drying lines filling with identical sheets and a stack growing on the bench. */
function PrintRun({ time, tex, high }: { time: number; tex: SceneTextures; high: boolean }) {
  const hungCap = high ? 28 : 16;
  const stackCap = high ? 60 : 30;
  const hung = hungSheets(time, hungCap);
  const stacked = stackSheets(time, stackCap);
  const thick = high ? 0.005 : 0.01;
  const H = SHEET_W / PAGE_ASPECT;
  return (
    <group>
      {LINE_Z.map((z) => (
        <mesh key={z} geometry={GEO.cylinder()} material={matte("#8a7a62")} position={[1.4, LINE_Y, z]} rotation={[0, 0, -Math.PI / 2]} scale={[0.008, 6.4, 0.008]} />
      ))}
      <Batch
        geometry={unitPlaneGeo()}
        material={texturedMat(tex.page, { double: true })}
        capacity={hungCap}
        count={Math.ceil(hung)}
        place={(i, o) => {
          const slot = hungSlot(i);
          const grow = clamp(hung - i);
          o.position.set(slot[0], slot[1] + (1 - grow) * 0.25, slot[2]);
          o.rotation.set(0.04 * Math.sin(time * 0.8 + i), 0.12 * Math.sin(time * 0.6 + i * 1.7), 0.02 * Math.sin(time * 0.9 + i));
          o.scale.set(SHEET_W, H * Math.max(0.02, grow), 1);
        }}
      />
      <Table p={STACK} size={[0.9, 0.62]} top={0.72} color={OAK} topColor={PALETTE.wood} />
      <Batch
        geometry={GEO.boxBase()}
        material={paperMat()}
        capacity={stackCap}
        count={Math.floor(stacked)}
        castShadow
        place={(i, o, c) => {
          o.position.set(STACK[0] + 0.006 * Math.sin(i * 2.3), 0.72 + i * thick, STACK[2] + 0.006 * Math.cos(i * 1.9));
          o.rotation.y = 0.03 * Math.sin(i * 3.1);
          o.scale.set(SHEET_W, thick * 0.9, H);
          c.setScalar(0.94 + 0.06 * hash01(i, 8));
        }}
      />
      {stacked >= 1 && (
        <group position={[STACK[0], 0.72 + Math.floor(stacked) * thick + 0.0015, STACK[2]]} rotation={[-Math.PI / 2, 0, 0]}>
          <ClippedPage texture={tex.page} width={SHEET_W} height={H} />
        </group>
      )}
    </group>
  );
}

const unitPlaneGeo = () => cached("mainz-plane", () => new PlaneGeometry(1, 1));
