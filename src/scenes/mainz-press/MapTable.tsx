"use client";

import { useMemo } from "react";
import { BoxGeometry, CircleGeometry, PlaneGeometry, RingGeometry } from "three";
import { ACCENT, cached, clamp, ease, hash01, Label3D, matte, merge, PALETTE, progress, window01, type Vec3 } from "../kit";
import { Batch } from "./Batch";
import { MAINZ, MAP_ASPECT, PRESS_TOWNS, project } from "./europe";
import { glowMat, texturedMat } from "./materials";
import { Table } from "./parts";
import type { SceneTextures } from "./textures";
import { mainzOn, MAP_TABLE, MAP_TOP, mapInk, SPREAD } from "./timing";

const MAP_W = 2.0;
const MAP_D = MAP_W / MAP_ASPECT;
const Y = MAP_TOP + 0.003;

const toWorld = (lonlat: [number, number]): Vec3 => {
  const [u, v] = project(lonlat);
  return [MAP_TABLE[0] + (u - 0.5) * MAP_W, Y, MAP_TABLE[2] + (v - 0.5) * MAP_D];
};

/** Tiny printing-press glyph: two cheeks, head and bed (base at y = 0, ~1 unit tall). */
const pressGlyph = () =>
  cached("mainz-press-glyph", () =>
    merge([
      new BoxGeometry(0.16, 1, 0.22).translate(-0.36, 0.5, 0),
      new BoxGeometry(0.16, 1, 0.22).translate(0.36, 0.5, 0),
      new BoxGeometry(0.95, 0.18, 0.28).translate(0, 0.92, 0),
      new BoxGeometry(0.6, 0.1, 0.6).translate(0, 0.4, 0.15),
      new BoxGeometry(0.06, 0.4, 0.06).translate(0, 0.62, 0),
    ]),
  );
const disc = () => cached("mainz-disc", () => new CircleGeometry(1, 24).rotateX(-Math.PI / 2));
const ring = () => cached("mainz-ring", () => new RingGeometry(0.82, 1, 40).rotateX(-Math.PI / 2));
const strip = () => cached("mainz-strip", () => new PlaneGeometry(1, 1).rotateX(-Math.PI / 2).translate(0.5, 0, 0));

export function MapTable({ time, tex }: { time: number; tex: SceneTextures }) {
  const ink = mapInk(time);
  const mainz = toWorld(MAINZ);
  const towns = useMemo(() => {
    const list = PRESS_TOWNS.map((t, i) => {
      const p = toWorld(t);
      return { p, d: Math.hypot(p[0] - mainz[0], p[2] - mainz[2]) + 0.12 * hash01(i, 11) };
    }).sort((a, b) => a.d - b.d);
    const maxD = list[list.length - 1].d;
    // outward wave: nearer towns first, accelerating towards the end
    return list.map((x) => ({ ...x, at: SPREAD.start + (SPREAD.end - SPREAD.start) * (x.d / maxD) ** 0.8 }));
  }, [mainz]);
  const on = mainzOn(time);
  const glyph = matte(ACCENT.renaissance, { emissive: ACCENT.renaissance, emissiveIntensity: 0.55 });
  return (
    <group>
      <Table p={MAP_TABLE} size={[2.3, 1.85]} top={MAP_TOP} color={PALETTE.woodDark} topColor={PALETTE.wood} />
      <group position={[MAP_TABLE[0], MAP_TOP + 0.001, MAP_TABLE[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh material={texturedMat(tex.parchment)} scale={[MAP_W, MAP_D, 1]} receiveShadow>
          <planeGeometry />
        </mesh>
        {ink > 0.001 && (
          <mesh scale={[MAP_W, MAP_D, 1]} position={[0, 0, 0.001]}>
            <planeGeometry />
            <meshStandardMaterial map={tex.mapInk} transparent opacity={ink} roughness={0.9} depthWrite={false} />
          </mesh>
        )}
      </group>
      {/* spreading lines, markers and pulses */}
      <Batch
        geometry={strip()}
        material={glowMat()}
        capacity={towns.length}
        count={time > SPREAD.start - 0.1 ? towns.length : 0}
        place={(i, o, c) => {
          const tw = towns[i];
          const g = ease.out(progress(time, tw.at - 0.45, tw.at));
          const fade = 1 - progress(time, tw.at + 0.2, tw.at + 1.6);
          const dx = tw.p[0] - mainz[0];
          const dz = tw.p[2] - mainz[2];
          o.position.set(mainz[0], Y + 0.002, mainz[2]);
          o.rotation.y = -Math.atan2(dz, dx);
          o.scale.set(Math.max(1e-4, Math.hypot(dx, dz) * g), 1, 0.006);
          c.set(ACCENT.renaissance).multiplyScalar(0.7 * fade * (g > 0 ? 1 : 0));
        }}
      />
      <Batch
        geometry={pressGlyph()}
        material={glyph}
        capacity={towns.length}
        castShadow
        place={(i, o) => {
          const tw = towns[i];
          const g = ease.backOut(progress(time, tw.at, tw.at + 0.4));
          o.position.set(...tw.p);
          o.rotation.y = (hash01(i, 2) - 0.5) * 0.6;
          o.scale.setScalar(Math.max(1e-4, 0.045 * g));
        }}
      />
      <Batch
        geometry={disc()}
        material={glowMat(tex.glow)}
        capacity={towns.length + 1}
        place={(i, o, c) => {
          if (i === towns.length) {
            o.position.set(mainz[0], Y + 0.003, mainz[2]);
            o.scale.setScalar(0.11 + 0.02 * Math.sin(time * 3));
            c.set(ACCENT.renaissance).multiplyScalar(on);
            return;
          }
          const tw = towns[i];
          const g = progress(time, tw.at, tw.at + 0.3);
          o.position.set(tw.p[0], Y + 0.003, tw.p[2]);
          o.scale.setScalar(0.06);
          c.set(ACCENT.renaissance).multiplyScalar(0.8 * g);
        }}
      />
      <Batch
        geometry={ring()}
        material={glowMat()}
        capacity={towns.length + 1}
        place={(i, o, c) => {
          const at = i === towns.length ? 71.0 : towns[i].at;
          const p = i === towns.length ? mainz : towns[i].p;
          const age = progress(time, at, at + (i === towns.length ? 1.6 : 1.0));
          o.position.set(p[0], Y + 0.004, p[2]);
          o.scale.setScalar(0.01 + (i === towns.length ? 0.35 : 0.12) * ease.out(age));
          c.set(ACCENT.renaissance).multiplyScalar(age > 0 && age < 1 ? 0.9 * (1 - age) : 0);
        }}
      />
      {/* Mainz marker */}
      <mesh geometry={pressGlyph()} material={glyph} position={mainz} scale={Math.max(1e-4, 0.075 * ease.backOut(clamp(on)))} castShadow />
      <Label3D position={[mainz[0], Y + 0.16, mainz[2] - 0.02]} opacity={on * window01(time, 71.0, 71.6, 80.5, 81)}>
        Maguncia
      </Label3D>
      <Label3D position={[MAP_TABLE[0] + MAP_W * 0.33, Y + 0.05, MAP_TABLE[2] - MAP_D * 0.36]} opacity={window01(time, 77.2, 77.8, 80.5, 81)} size="lg">
        hacia 1500
      </Label3D>
      {/* candle and inkwell on the table */}
      <mesh geometry={cached("mainz-candle-dish", () => new BoxGeometry(1, 1, 1))} material={matte(PALETTE.iron)} position={[MAP_TABLE[0] - 1.02, MAP_TOP + 0.006, MAP_TABLE[2] - 0.8]} scale={[0.09, 0.012, 0.09]} />
    </group>
  );
}

export const MAP_CANDLE: Vec3 = [MAP_TABLE[0] - 1.02, MAP_TOP + 0.012, MAP_TABLE[2] - 0.8];
