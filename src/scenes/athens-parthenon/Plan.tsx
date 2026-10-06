"use client";

import { useLayoutEffect, useMemo } from "react";
import { MeshBasicMaterial, TorusGeometry } from "three";
import { ACCENT, cached, ease, Figure, GEO, Instances, Label3D, matte, PALETTE, progress, type InstanceSpec } from "../kit";
import { AX, AZ, CELLA, COL, COLUMNS, S } from "./layout";

const ringGeo = () => cached("ath-plan-ring", () => new TorusGeometry(1, 0.07, 4, 28).rotateX(Math.PI / 2));

/** Rectangle outline as four growing lines (k 0..1 draws them clockwise). */
function outline(hx: number, hz: number, k: number, w = 0.14): InstanceSpec[] {
  const y = S + 0.02;
  const segs: [number, number, number, number][] = [
    [-hx, -hz, hx, -hz],
    [hx, -hz, hx, hz],
    [hx, hz, -hx, hz],
    [-hx, hz, -hx, -hz],
  ];
  const out: InstanceSpec[] = [];
  segs.forEach(([ax, az, bx, bz], i) => {
    const f = Math.min(1, Math.max(0, k * 4 - i));
    if (f <= 0) return;
    const ex = ax + (bx - ax) * f;
    const ez = az + (bz - az) * f;
    out.push({ position: [(ax + ex) / 2, y, (az + ez) / 2], scale: [Math.max(w, Math.abs(ex - ax) + w), 0.03, Math.max(w, Math.abs(ez - az) + w)] });
  });
  return out;
}

const FIGURES = [
  { name: "Pericles", pos: [24.6, S, 3.6] as [number, number, number], rot: -1.85, pose: "point" as const, outfit: { tunic: PALETTE.linen, robe: true, sash: PALETTE.dyeBlue, skin: PALETTE.skinTones[2] } },
  { name: "Fidias", pos: [25.6, S, 0.6] as [number, number, number], rot: -2.4, pose: "stand" as const, outfit: { tunic: PALETTE.dyeOchre, robe: true, skin: PALETTE.skinTones[1] } },
  { name: "Ictino", pos: [22.4, S, 5.4] as [number, number, number], rot: -0.6, pose: "write" as const, outfit: { tunic: PALETTE.wool, robe: true, skin: PALETTE.skinTones[4] } },
  { name: "Calícrates", pos: [21.2, S, 2.8] as [number, number, number], rot: 1.2, pose: "stand" as const, outfit: { tunic: PALETTE.dyeRed, robe: true, sash: PALETTE.linen, skin: PALETTE.skinTones[0] } },
];

/**
 * Pericles beat: the four men on the cleared platform, the plan drawn on the stone (peristyle and cella outlines,
 * column rings) and translucent ghost columns rising.
 */
export function Plan({ time, high }: { time: number; high: boolean }) {
  const ghost = useMemo(() => new MeshBasicMaterial({ color: ACCENT.greece, transparent: true, opacity: 0.26, depthWrite: false, toneMapped: false }), []);
  useLayoutEffect(() => () => ghost.dispose(), [ghost]);
  const ink = matte(ACCENT.greece, { emissive: ACCENT.greece, emissiveIntensity: 0.9 });

  const lines = [...outline(AX, AZ, progress(time, 12.4, 14.4)), ...outline(CELLA.halfX, CELLA.halfZ, progress(time, 13.6, 15.2))];
  const order = COLUMNS.map((c) => Math.hypot(c.x - 24, c.z - 3));
  const rings: InstanceSpec[] = [];
  const ghosts: InstanceSpec[] = [];
  COLUMNS.forEach((c, i) => {
    const pop = ease.backOut(progress(time, 13 + order[i] * 0.04, 13.4 + order[i] * 0.04));
    if (pop > 0.01) rings.push({ position: [c.x, S + 0.03, c.z], scale: [c.r * pop, 1, c.r * pop] });
    const rise = ease.inOut(progress(time, 15.4 + order[i] * 0.03, 17.6 + order[i] * 0.03));
    if (rise > 0.01) ghosts.push({ position: [c.x, S, c.z], scale: [c.r * 2, COL.h * rise, c.r * 2] });
  });
  const labels = progress(time, 10.8, 11.6) * (1 - progress(time, 16.2, 16.8));

  return (
    <group>
      {lines.length > 0 && <Instances geometry={GEO.boxBase()} material={ink} items={lines} />}
      {rings.length > 0 && <Instances geometry={ringGeo()} material={ink} items={rings} />}
      {ghosts.length > 0 && <Instances geometry={GEO.cylinder()} material={ghost} items={ghosts} />}
      {FIGURES.map((f, i) => (
        <group key={f.name}>
          <Figure position={f.pos} rotationY={f.rot} pose={f.pose} t={time + i * 0.7} outfit={f.outfit} castShadow={high} />
          <Label3D position={[f.pos[0], f.pos[1] + 2.25, f.pos[2]]} size="sm" opacity={labels}>
            {f.name}
          </Label3D>
        </group>
      ))}
      <Label3D position={[0, S + 1.5, AZ + 1]} opacity={progress(time, 15.5, 16.3) * (1 - progress(time, 19.4, 19.9))}>
        Planta: 8 × 17 columnas
      </Label3D>
    </group>
  );
}
