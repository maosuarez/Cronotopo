"use client";

import { useEffect, useMemo } from "react";
import { Color, MeshStandardMaterial, SphereGeometry, type Material } from "three";
import { cached, clamp, ease, Figure, GEO, hash01, Label3D, lerp, matte, PALETTE, Particles, PARTICLES, progress, window01, type Vec3 } from "../kit";
import type { SceneQuality } from "../types";
import { Batch } from "./Batch";
import { leadMat, ironMat, paperMat, emissiveMat } from "./materials";
import { Box, ClippedPage, Table } from "./parts";
import { PAGE, TEXT_V0, TEXT_V1, PAGE_ASPECT, type SceneTextures } from "./textures";
import {
  CAST,
  castState,
  COMPOSE,
  formeLines,
  LINE_TEXT,
  lineSlide,
  SCRIBE,
  scribeLines,
  SHEET_W,
  sortDrop,
  timeLapseWord,
} from "./timing";

const PLASTER = "#5a4836";
const BEAM = "#3e2a1a";
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

/** u of the gutter between the two text columns. */
const U_MID = (PAGE.inner + (PAGE.w - PAGE.inner - PAGE.outer - PAGE.gap) / 2 + PAGE.gap / 2) / PAGE.w;
const lineV = (lines: number) => TEXT_V0 + (clamp(lines, 0, PAGE.lines) / PAGE.lines) * (TEXT_V1 - TEXT_V0);

// ============================================================================ room
export function Room({ floor, windowDay }: { floor: Material; windowDay: number }) {
  const posts = [-6.6, -4.4, -2.2, 0, 2.2, 3.3, 5.6, 7.7];
  const glass = `#${new Color("#1a2230").lerp(new Color("#f6e2b0"), windowDay).getHexString()}`;
  return (
    <group>
      <mesh material={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0.5, 0, 0.3]} receiveShadow>
        <planeGeometry args={[16.4, 8.2]} />
      </mesh>
      {/* walls */}
      <Box p={[0.5, 1.8, -3.6]} s={[16.4, 3.6, 0.2]} c={PLASTER} />
      <Box p={[-7.3, 1.8, 0.3]} s={[0.2, 3.6, 8.2]} c={PLASTER} />
      <Box p={[8.3, 1.8, 0.3]} s={[0.2, 3.6, 8.2]} c={PLASTER} />
      {/* half-timbering */}
      {posts.map((x) => (
        <Box key={x} p={[x, 1.8, -3.47]} s={[0.18, 3.6, 0.08]} c={BEAM} shadow={false} />
      ))}
      <Box p={[0.5, 0.95, -3.47]} s={[16.4, 0.14, 0.08]} c={BEAM} shadow={false} />
      <Box p={[0.5, 3.15, -3.47]} s={[16.4, 0.14, 0.08]} c={BEAM} shadow={false} />
      <Box p={[-1.1, 2.05, -3.46]} s={[0.14, 2.6, 0.06]} r={[0, 0, 0.72]} c={BEAM} shadow={false} />
      <Box p={[1.1, 2.05, -3.46]} s={[0.14, 2.6, 0.06]} r={[0, 0, -0.72]} c={BEAM} shadow={false} />
      <Box p={[6.65, 2.05, -3.46]} s={[0.14, 2.6, 0.06]} r={[0, 0, 0.6]} c={BEAM} shadow={false} />
      {/* ceiling */}
      <Box p={[0.5, 3.66, 0.3]} s={[16.4, 0.08, 8.2]} c="#24180f" shadow={false} />
      {[-6, -4.4, -2.8, -1.2, 0.4, 2, 3.6, 5.2, 6.8].map((x) => (
        <Box key={x} p={[x, 3.48, 0.3]} s={[0.2, 0.24, 8.2]} c={BEAM} shadow={false} />
      ))}
      {/* window above the scribe (time-lapse sky) */}
      <group position={SCRIBE.window}>
        <mesh position={[0, 0, -0.06]}>
          <planeGeometry args={[0.72, 0.95]} />
          <meshBasicMaterial color={glass} toneMapped={false} />
        </mesh>
        <Box p={[0, 0.5, 0]} s={[0.86, 0.08, 0.12]} c={BEAM} shadow={false} />
        <Box p={[0, -0.5, 0]} s={[0.9, 0.08, 0.16]} c={BEAM} shadow={false} />
        <Box p={[-0.4, 0, 0]} s={[0.08, 1.06, 0.12]} c={BEAM} shadow={false} />
        <Box p={[0.4, 0, 0]} s={[0.08, 1.06, 0.12]} c={BEAM} shadow={false} />
        <Box p={[0, 0, -0.02]} s={[0.04, 0.95, 0.04]} c={BEAM} shadow={false} />
        <Box p={[0, 0.05, -0.02]} s={[0.72, 0.04, 0.04]} c={BEAM} shadow={false} />
      </group>
      {/* props: barrels, reams of paper, shelf */}
      {[[7.55, -2.95], [7.6, -2.15], [-6.7, 1.4]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh geometry={GEO.cylinder()} material={matte(PALETTE.wood)} scale={[0.62, 0.85, 0.62]} castShadow receiveShadow />
          <mesh geometry={GEO.cylinder()} material={matte(PALETTE.iron)} scale={[0.64, 0.05, 0.64]} position={[0, 0.15, 0]} />
          <mesh geometry={GEO.cylinder()} material={matte(PALETTE.iron)} scale={[0.64, 0.05, 0.64]} position={[0, 0.65, 0]} />
        </group>
      ))}
      <group position={[2.3, 0, -3.25]}>
        <Box p={[0, 0.9, 0]} s={[1.3, 0.05, 0.4]} c={PALETTE.wood} />
        <Box p={[0, 1.55, 0]} s={[1.3, 0.05, 0.4]} c={PALETTE.wood} />
        <Box p={[-0.62, 0.8, 0]} s={[0.06, 1.6, 0.4]} c={PALETTE.woodDark} />
        <Box p={[0.62, 0.8, 0]} s={[0.06, 1.6, 0.4]} c={PALETTE.woodDark} />
        {[-0.4, -0.05, 0.3].map((x, i) => (
          <Box key={x} p={[x, 0.93 + 0.06 + i * 0.02, 0]} s={[0.3, 0.12 + i * 0.04, 0.34]} c={PALETTE.paper} />
        ))}
        {[-0.45, -0.35, -0.25, -0.1, 0.05, 0.2, 0.32, 0.45].map((x, i) => (
          <Box key={x} p={[x, 1.68, 0]} s={[0.07, 0.2 + (i % 3) * 0.03, 0.26]} c={[PALETTE.dyeRed, PALETTE.woodDark, PALETTE.dyeOchre, "#3a2a1e"][i % 4]} />
        ))}
      </group>
    </group>
  );
}

// ============================================================================ scribe (beat 1)
export function Scribe({ time, tex }: { time: number; tex: SceneTextures }) {
  const W = 0.24;
  const H = W / PAGE_ASPECT;
  const lines = scribeLines(time);
  const col1 = Math.min(PAGE.lines, Math.ceil(lines));
  const col2 = Math.max(0, Math.ceil(lines - PAGE.lines));
  // quill tip on the line being written
  const cur = Math.min(lines, 2 * PAGE.lines - 0.001);
  const col = cur < PAGE.lines ? 0 : 1;
  const line = Math.floor(cur % PAGE.lines);
  const frac = cur % 1;
  const colW = (PAGE.w - PAGE.inner - PAGE.outer - PAGE.gap) / 2;
  const u = (PAGE.inner + col * (colW + PAGE.gap) + frac * colW) / PAGE.w;
  const v = TEXT_V0 + ((line + 0.75) / PAGE.lines) * (TEXT_V1 - TEXT_V0);
  const quill: Vec3 = [W / 2 + 0.006 + (u - 0.5) * W, (0.5 - v) * H, 0.004];
  const burn = time > 1.8 && time < 9.8 ? ((time - 1.8) / 2.2) % 1 : 0.3;
  const candleH = 0.22 - 0.16 * burn;
  const quires = Math.floor(7 * progress(time, 2.2, 9.6));
  return (
    <group>
      <group position={SCRIBE.desk}>
        {/* writing desk with a sloped board */}
        {[[-0.38, -0.24], [0.38, -0.24], [-0.38, 0.24], [0.38, 0.24]].map(([x, z], i) => (
          <Box key={i} p={[x, 0.42, z]} s={[0.06, 0.84, 0.06]} c={PALETTE.woodDark} />
        ))}
        <Box p={[0.55, 0.86, -0.05]} s={[0.3, 0.04, 0.32]} c={PALETTE.wood} />
        <Box p={[0.55, 0.43, -0.05]} s={[0.05, 0.84, 0.05]} c={PALETTE.woodDark} />
        <group position={[0, 0.94, 0]} rotation={[0.38, 0, 0]}>
          <Box p={[0, 0, 0]} s={[0.86, 0.035, 0.62]} c={PALETTE.wood} />
          <group position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <Box p={[0, 0, -0.008]} s={[0.52, 0.35, 0.014]} c="#5a2a1c" />
            {/* left page: finished; right page: being written */}
            <group position={[-W / 2 - 0.006, 0, 0.002]}>
              <ClippedPage texture={tex.manuscript} width={W} height={H} />
            </group>
            <group position={[W / 2 + 0.006, 0, 0.002]}>
              <mesh material={paperMat()} scale={[W, H, 1]}>
                <planeGeometry />
              </mesh>
              <ClippedPage texture={tex.manuscript} width={W} height={H} u0={0} u1={U_MID} v1={lineV(col1)} z={0.0008} />
              {col2 > 0 && <ClippedPage texture={tex.manuscript} width={W} height={H} u0={U_MID} u1={1} v1={lineV(col2)} z={0.0008} />}
            </group>
            {/* quill: tip on the page, feather leaning back towards the scribe */}
            <group position={quill} rotation={[2.0, 0, -0.35]}>
              <mesh geometry={GEO.cone()} material={matte("#e9e1cd")} scale={[0.012, 0.22, 0.004]} position={[0, 0.02, 0]} />
              <mesh geometry={GEO.cylinder()} material={matte("#cbbf9f")} scale={[0.003, 0.24, 0.003]} />
            </group>
          </group>
        </group>
        {/* inkhorn and candle on the side ledge */}
        <mesh geometry={GEO.cylinder()} material={matte("#2a1d14")} position={[0.48, 0.88, 0.02]} scale={[0.05, 0.07, 0.05]} />
        <mesh geometry={GEO.cylinder()} material={ironMat()} position={[0.6, 0.88, -0.1]} scale={[0.09, 0.015, 0.09]} />
        <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={[0.6, 0.895, -0.1]} scale={[0.035, candleH, 0.035]} />
      </group>
      {/* stool + scribe */}
      <Box p={[SCRIBE.seat[0], 0.23, SCRIBE.seat[2] + 0.1]} s={[0.4, 0.46, 0.36]} c={PALETTE.woodDark} />
      <Figure position={[SCRIBE.seat[0], -0.04, SCRIBE.seat[2] + 0.06]} rotationY={Math.PI} pose="sit" t={time} outfit={{ tunic: "#4b3a2b", robe: true, skin: PALETTE.skinTones[2], head: "cap", headColor: "#3b2c20" }} castShadow />
      {/* finished quires pile up on the chest */}
      <group position={[-6.45, 0, -2.75]}>
        <Box p={[0, 0.25, 0]} s={[0.62, 0.5, 0.46]} c={PALETTE.woodDark} />
        {Array.from({ length: quires }, (_, i) => (
          <Box key={i} p={[0.02 * Math.sin(i * 2.1), 0.515 + i * 0.03, 0.02 * Math.cos(i * 1.7)]} s={[0.26, 0.026, 0.34]} c={i % 2 ? "#e6d7b4" : "#dccaa3"} r={[0, 0.06 * Math.sin(i * 3.3), 0]} />
        ))}
      </group>
      <Label3D position={add(SCRIBE.desk, [-0.05, 1.42, -0.15])} opacity={window01(time, 2.2, 2.8, 9.4, 9.9)} size="lg">
        {timeLapseWord(time)}
      </Label3D>
    </group>
  );
}

/** World position of the scribe's candle flame (for the CandleLight). */
export function scribeCandleTop(time: number): Vec3 {
  const burn = time > 1.8 && time < 9.8 ? ((time - 1.8) / 2.2) % 1 : 0.3;
  return add(SCRIBE.desk, [0.6, 0.895 + 0.22 - 0.16 * burn + 0.03, -0.1]);
}

// ============================================================================ casting (beat 2)
const SORT: Vec3 = [0.02, 0.05, 0.026];
const halfSphere = () => cached("mainz-ladle", () => new SphereGeometry(0.055, 14, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2));
const sortSlot = (i: number): Vec3 => add(CAST.mould, [0.17 + (i % 8) * 0.028, 0, -0.07 + Math.floor(i / 8) * 0.034]);

export function Casting({ time, quality }: { time: number; quality: SceneQuality }) {
  const M = CAST.mould;
  const s = castState(time);
  const open = s.open * 0.05;
  const ladle = add(M, s.ladle);
  const lip = add(ladle, [0.055 * Math.cos(s.tilt), -0.055 * Math.sin(s.tilt) + 0.01, 0]);
  const mouth = add(M, [0, 0.13, 0]);
  const streamH = Math.max(0.001, lip[1] - mouth[1]);
  const flying = s.eject > 0 && s.eject < 1;
  const target = sortSlot(Math.max(0, s.sorts));
  const fly: Vec3 = [lerp(M[0], target[0], ease.inOut(s.eject)), M[1] + 0.06 + 0.12 * Math.sin(Math.PI * s.eject) * (1 - s.eject * 0.6), lerp(M[2], target[2], s.eject)];
  const F = CAST.furnace;
  const high = quality === "high";
  return (
    <group>
      <Table p={CAST.bench} size={[1.5, 0.7]} top={0.9} color={PALETTE.woodDark} topColor={PALETTE.wood} />
      {/* furnace, coals, pot of molten type metal */}
      <group position={F}>
        <Box p={[0, 0.31, 0]} s={[0.64, 0.62, 0.6]} c="#5b4636" />
        <Box p={[0, 0.635, 0]} s={[0.5, 0.03, 0.46]} c="#2b1a12" shadow={false} />
        <mesh geometry={GEO.box()} material={emissiveMat("#ff6a28")} position={[0, 0.645, 0]} scale={[0.44, 0.012, 0.4]} />
        <mesh geometry={GEO.cylinder()} material={ironMat()} position={[0, 0.62, 0]} scale={[0.32, 0.19, 0.32]} castShadow />
        <mesh geometry={GEO.cylinder()} material={emissiveMat("#ffb357")} position={[0, 0.78, 0]} scale={[0.27, 0.012, 0.27]} />
      </group>
      <Particles
        preset={PARTICLES.sparks}
        time={time}
        position={add(F, [0, 0.8, 0])}
        prewarm
        seed={5}
        density={high ? 1 : 0.5}
        overrides={{ count: 26, life: 1.2, velocity: [0, 0.5, 0], jitter: [0.2, 0.35, 0.2], spread: [0.1, 0.01, 0.1], size: [0.022, 0.008], gravity: 0.6 }}
      />
      {high && (
        <Particles
          preset={PARTICLES.smoke}
          time={time}
          position={add(F, [0, 0.82, 0])}
          prewarm
          seed={9}
          overrides={{ count: 30, life: 4, velocity: [0, 0.35, 0], jitter: [0.06, 0.08, 0.06], spread: [0.08, 0.01, 0.08], size: [0.12, 0.6], wind: [0.06, 0], opacity: 0.18, colorStart: "#6a5a4c", colorEnd: "#3a322c" }}
        />
      )}
      {/* hand mould: two wooden halves around the steel cavity; the matrix sits at its foot */}
      <group position={M}>
        <mesh geometry={GEO.box()} material={matte(PALETTE.brass, { emissive: "#6b4a10", emissiveIntensity: 0.25 })} position={[0, 0.009, 0]} scale={[0.05, 0.018, 0.07]} castShadow />
        {[-1, 1].map((side) => (
          <group key={side} position={[side * (0.033 + open), 0.078, 0]}>
            <Box p={[side * 0.012, 0, 0]} s={[0.05, 0.12, 0.11]} c="#7a5232" />
            <mesh geometry={GEO.box()} material={ironMat()} position={[-side * 0.016, 0, 0]} scale={[0.012, 0.115, 0.08]} />
            <Box p={[side * 0.03, 0.0, 0]} s={[0.012, 0.03, 0.15]} c="#5a3a22" />
          </group>
        ))}
        {/* the new sort inside the open mould */}
        {s.open > 0.3 && !flying && s.eject <= 0 && <mesh geometry={GEO.boxBase()} material={leadMat()} position={[0, 0.02, 0]} scale={SORT} />}
      </group>
      {flying && <mesh geometry={GEO.boxBase()} material={leadMat()} position={fly} rotation={[s.eject * 4, 0, s.eject * 2]} scale={SORT} castShadow />}
      {/* the growing grid of finished sorts */}
      <Batch
        geometry={GEO.boxBase()}
        material={leadMat()}
        capacity={41}
        count={s.sorts}
        castShadow
        place={(i, o, c) => {
          o.position.set(...sortSlot(i));
          o.rotation.y = (hash01(i, 3) - 0.5) * 0.2;
          o.scale.set(...SORT);
          c.setScalar(0.92 + 0.12 * hash01(i, 7));
        }}
      />
      {/* ladle */}
      <group position={ladle} rotation={[0, 0, -s.tilt]}>
        <mesh geometry={halfSphere()} material={ironMat()} castShadow />
        {s.full && <mesh geometry={GEO.cylinder()} material={emissiveMat("#ffb357")} position={[0, -0.012, 0]} scale={[0.095, 0.004, 0.095]} />}
        <mesh geometry={GEO.cylinder()} material={ironMat()} position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2 + 0.35]} scale={[0.012, 0.32, 0.012]} />
        <mesh geometry={GEO.cylinder()} material={matte(PALETTE.woodDark)} position={[-0.33, 0.11, 0]} rotation={[0, 0, Math.PI / 2 + 0.35]} scale={[0.026, 0.18, 0.026]} />
      </group>
      {s.stream > 0.01 && <mesh geometry={GEO.cylinder()} material={emissiveMat("#ffc06a")} position={mouth} scale={[0.009 * s.stream, streamH, 0.009 * s.stream]} />}
      {/* caster */}
      <Figure position={[-1.5, 0, -2.3]} rotationY={-1.9} pose="work" t={time} speed={0.5} outfit={{ tunic: PALETTE.wool, skin: PALETTE.skinTones[0], sash: "#4a3524" }} castShadow />
      <Label3D position={add(F, [0, 1.1, 0])} opacity={window01(time, 10.6, 11.2, 20.4, 20.9)}>
        plomo · estaño · antimonio
      </Label3D>
      <Label3D position={add(M, [0.0, -0.035, 0.11])} opacity={window01(time, 15.4, 15.9, 20.4, 20.9)} size="sm">
        matriz
      </Label3D>
      <Label3D position={add(M, [0.27, 0.16, 0.0])} opacity={window01(time, 17.6, 18.1, 20.4, 20.9)} size="sm">
        tipos
      </Label3D>
    </group>
  );
}

// ============================================================================ composing (beat 3)
export const FORME_H = SHEET_W / PAGE_ASPECT;
const SORT_STEP_X = 0.0195;

/** Forme lying face up: dark ground + the mirrored page clipped to `lines`, inside an iron chase. */
export function Forme({ tex, lines }: { tex: SceneTextures; lines: number }) {
  const W = SHEET_W;
  const H = FORME_H;
  return (
    <group>
      {[[0, -H / 2 - 0.015, W + 0.06, 0.03], [0, H / 2 + 0.015, W + 0.06, 0.03]].map(([x, z, w, d], i) => (
        <mesh key={i} geometry={GEO.box()} material={ironMat()} position={[x, 0.0, z]} scale={[w, 0.03, d]} castShadow />
      ))}
      {[-1, 1].map((sd) => (
        <mesh key={sd} geometry={GEO.box()} material={ironMat()} position={[sd * (W / 2 + 0.015), 0, 0]} scale={[0.03, 0.03, H]} castShadow />
      ))}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.0, 0]}>
        <mesh material={matte("#24211f")} scale={[W, H, 1]} receiveShadow>
          <planeGeometry />
        </mesh>
        {lines > 0 && <ClippedPage texture={tex.forme} width={W} height={H} v1={lineV(lines)} roughness={0.5} z={0.0006} />}
      </group>
    </group>
  );
}

export function Compose({ time, tex, quality }: { time: number; tex: SceneTextures; quality: SceneQuality }) {
  const S = COMPOSE.stick;
  const F = COMPOSE.forme;
  const letterMats = useMemo(() => {
    const out: Record<string, MeshStandardMaterial> = {};
    for (const [ch, t] of Object.entries(tex.letters)) out[ch] = new MeshStandardMaterial({ map: t, roughness: 0.4, metalness: 0.25 });
    return out;
  }, [tex]);
  useEffect(() => () => Object.values(letterMats).forEach((m) => m.dispose()), [letterMats]);
  const slide = lineSlide(time);
  const rowX0 = S[0] + 0.13 - 0.01;
  const rowCenter = rowX0 - ((LINE_TEXT.length - 1) / 2) * SORT_STEP_X;
  const firstLine: Vec3 = [F[0], F[1] + 0.03, F[2] - FORME_H / 2 + (TEXT_V0 + 0.5 / PAGE.lines) * FORME_H];
  const rowOffset: Vec3 = [(firstLine[0] - rowCenter) * slide, 0.06 * Math.sin(Math.PI * slide) + (firstLine[1] - S[1] - 0.01) * slide, (firstLine[2] - S[2]) * slide];
  const rowScale = lerp(1, 0.32, slide);
  const pileCount = quality === "high" ? 60 : 40;
  return (
    <group>
      {/* type case: sloped tray of compartments with type */}
      <group position={COMPOSE.case}>
        <Box p={[0, 0.45, 0.05]} s={[1.0, 0.9, 0.45]} c={PALETTE.woodDark} />
        <group position={[0, 1.02, 0.05]} rotation={[0.55, 0, 0]}>
          <Box p={[0, 0, 0]} s={[1.06, 0.04, 0.66]} c={PALETTE.wood} />
          <Batch
            geometry={GEO.box()}
            material={matte(PALETTE.woodDark)}
            capacity={18}
            place={(i, o) => {
              if (i < 7) {
                o.position.set(0, 0.03, -0.3 + i * 0.1);
                o.scale.set(1.02, 0.03, 0.012);
              } else {
                o.position.set(-0.5 + (i - 7) * 0.1, 0.03, 0);
                o.scale.set(0.012, 0.03, 0.62);
              }
            }}
          />
          <Batch
            geometry={GEO.box()}
            material={leadMat()}
            capacity={pileCount}
            place={(i, o, c) => {
              const cx = i % 10;
              const cz = Math.floor(i / 10) % 6;
              o.position.set(-0.45 + cx * 0.1, 0.03, -0.25 + cz * 0.1);
              o.scale.set(0.07, 0.02 + 0.015 * hash01(i, 2), 0.07);
              c.setScalar(0.7 + 0.3 * hash01(i, 5));
            }}
          />
        </group>
      </group>
      {/* imposing stone */}
      <Table p={COMPOSE.stone} size={[1.15, 0.78]} top={0.88} color={PALETTE.woodDark} topColor="#6d6862" />
      <group position={F}>
        <Forme tex={tex} lines={formeLines(time)} />
      </group>
      {/* composing stick */}
      <group position={S}>
        <mesh geometry={GEO.box()} material={ironMat()} position={[0, 0.004, 0]} scale={[0.3, 0.008, 0.05]} castShadow />
        <mesh geometry={GEO.box()} material={ironMat()} position={[0, 0.026, -0.027]} scale={[0.3, 0.045, 0.006]} />
        <mesh geometry={GEO.box()} material={ironMat()} position={[0.149, 0.026, 0]} scale={[0.006, 0.045, 0.05]} />
        <mesh geometry={GEO.box()} material={ironMat()} position={[-0.125, 0.026, 0]} scale={[0.008, 0.045, 0.05]} />
      </group>
      {slide < 1 && (
        <group position={add(S, rowOffset)}>
          <group position={[rowCenter - S[0], 0.008, 0]} scale={rowScale}>
            {[...LINE_TEXT].map((ch, k) => {
              const d = sortDrop(time, k);
              if (d <= 0) return null;
              const x = rowX0 - k * SORT_STEP_X - rowCenter;
              const y = (1 - ease.out(d)) * 0.12;
              const space = ch === " ";
              const h = space ? 0.026 : 0.036;
              return (
                <group key={k} position={[x, y, 0]}>
                  <mesh geometry={GEO.boxBase()} material={leadMat()} scale={[0.0185, h, 0.044]} castShadow />
                  {!space && (
                    <mesh material={letterMats[ch]} position={[0, h + 0.0004, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[0.0185, 0.044, 1]}>
                      <planeGeometry />
                    </mesh>
                  )}
                </group>
              );
            })}
          </group>
        </group>
      )}
      {/* a candle on the stone */}
      <mesh geometry={GEO.cylinder()} material={ironMat()} position={add(COMPOSE.stone, [0.45, 0.88, -0.28])} scale={[0.08, 0.012, 0.08]} />
      <mesh geometry={GEO.cylinder()} material={matte("#efe2c0")} position={add(COMPOSE.stone, [0.45, 0.89, -0.28])} scale={[0.032, 0.16, 0.032]} />
      <Figure position={[-0.2, 0, -2.45]} rotationY={Math.PI + 0.2} pose="work" t={time} speed={0.35} outfit={{ tunic: PALETTE.dyeBlue, skin: PALETTE.skinTones[4], head: "cap", headColor: "#2f2a26" }} castShadow />
      <Label3D position={add(S, [-0.02, 0.1, 0.04])} opacity={window01(time, 22.0, 22.4, 24.3, 24.7)}>
        componedor
      </Label3D>
      <Label3D position={add(S, [-0.02, 0.1, 0.04])} opacity={window01(time, 24.7, 25.1, 26.4, 26.8)}>
        letras en espejo
      </Label3D>
      <Label3D position={add(F, [0, 0.08, -FORME_H / 2 - 0.06])} opacity={window01(time, 28.0, 28.4, 31.4, 31.8)}>
        la forma: dos columnas en espejo
      </Label3D>
    </group>
  );
}

export const COMPOSE_CANDLE: Vec3 = add(COMPOSE.stone, [0.45, 0.89 + 0.16 + 0.03, -0.28]);
export const FURNACE_GLOW: Vec3 = add(CAST.furnace, [0.1, 1.0, 0.3]);

