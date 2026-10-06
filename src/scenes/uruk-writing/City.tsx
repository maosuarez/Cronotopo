"use client";

import { useMemo } from "react";
import {
  Block,
  GEO,
  Instances,
  Label3D,
  matte,
  PALETTE,
  Particles,
  PARTICLES,
  smoothstep,
  Steps,
  Town,
  type InstanceSpec,
  type ParticlePreset,
} from "../kit";
import { CITY, EANNA, KULLABA, RIVER } from "./layout";

/**
 * Uruk as a diorama: a dense mat of mud-brick houses around two sacred districts — the walled Eanna precinct
 * (east) and the Kullaba terrace with the whitewashed White Temple (west) — labelled separately.
 */

const GROUND = () => 0;
const WHITEWASH = "#f1ece0";
const PLASTER = "#d6b98f";

/** Keeps houses out of the sacred districts and off the street that leads to the Eanna gate. */
function excludeFromTown(x: number, z: number): boolean {
  const [ex, , ez] = EANNA.center;
  const [kx, , kz] = KULLABA.center;
  if (Math.abs(x - ex) < EANNA.halfX + 4 && Math.abs(z - ez) < EANNA.halfZ + 4) return true;
  if (Math.abs(x - kx) < KULLABA.terraceWidth / 2 + 4 && Math.abs(z - kz) < KULLABA.terraceDepth / 2 + 8) return true;
  if (Math.abs(x - ex) < 7 && z > ez) return true;
  return false;
}

/** Buttresses and recesses ("niches") along a wall face: the signature of Uruk temple architecture. */
function pilasters(x0: number, z0: number, x1: number, z1: number, y: number, height: number, outward: [number, number], spacing = 2.2): InstanceSpec[] {
  const len = Math.hypot(x1 - x0, z1 - z0);
  const n = Math.floor(len / spacing);
  const alongX = Math.abs(x1 - x0) > Math.abs(z1 - z0);
  return Array.from({ length: n }, (_, i) => {
    const k = (i + 0.5) / n;
    return {
      position: [x0 + (x1 - x0) * k + outward[0] * 0.15, y, z0 + (z1 - z0) * k + outward[1] * 0.15] as [number, number, number],
      scale: (alongX ? [0.7, height, 0.35] : [0.35, height, 0.7]) as [number, number, number],
    };
  });
}

function EannaPrecinct({ quality }: { quality: "low" | "high" }) {
  const [cx, , cz] = EANNA.center;
  const { halfX, halfZ, wallHeight: H, wallThickness: T, gateWidth } = EANNA;
  const walls = useMemo<InstanceSpec[]>(() => {
    const gateL = cx - gateWidth / 2;
    const gateR = cx + gateWidth / 2;
    const west = cx - halfX;
    const east = cx + halfX;
    return [
      { position: [cx, 0, cz - halfZ], scale: [halfX * 2 + T, H, T] },
      { position: [west, 0, cz], scale: [T, H, halfZ * 2] },
      { position: [east, 0, cz], scale: [T, H, halfZ * 2] },
      { position: [(west + gateL) / 2, 0, cz + halfZ], scale: [gateL - west, H, T] },
      { position: [(gateR + east) / 2, 0, cz + halfZ], scale: [east - gateR, H, T] },
      // gate towers
      { position: [gateL - 1, 0, cz + halfZ], scale: [2.2, H + 1.1, 2.4] },
      { position: [gateR + 1, 0, cz + halfZ], scale: [2.2, H + 1.1, 2.4] },
    ];
  }, [cx, cz, halfX, halfZ, H, T, gateWidth]);
  const buttresses = useMemo(() => {
    if (quality === "low") return [];
    const s = cz + halfZ + T / 2;
    const n = cz - halfZ - T / 2;
    const w = cx - halfX - T / 2;
    const e = cx + halfX + T / 2;
    return [
      ...pilasters(w, s, cx - gateWidth / 2 - 2.2, s, 0, H, [0, 1]),
      ...pilasters(cx + gateWidth / 2 + 2.2, s, e, s, 0, H, [0, 1]),
      ...pilasters(w, n, e, n, 0, H, [0, -1]),
      ...pilasters(w, n, w, s, 0, H, [-1, 0]),
      ...pilasters(e, n, e, s, 0, H, [1, 0]),
      // main temple façades
      ...pilasters(cx - 12, cz - 3, cx + 12, cz - 3, 1, 5.5, [0, 1], 1.6),
      ...pilasters(cx - 12, cz - 13, cx - 12, cz - 3, 1, 5.5, [-1, 0], 1.6),
      ...pilasters(cx + 12, cz - 13, cx + 12, cz - 3, 1, 5.5, [1, 0], 1.6),
    ];
  }, [quality, cx, cz, halfX, halfZ, T, H, gateWidth]);

  return (
    <group>
      {/* beaten-earth courtyard */}
      <Block position={[cx, -0.04, cz]} size={[halfX * 2, 0.08, halfZ * 2]} color="#cfb48c" castShadow={false} />
      <Instances geometry={GEO.boxBase()} material={matte(PALETTE.mudbrick)} items={walls} castShadow receiveShadow />
      <Instances geometry={GEO.boxBase()} material={matte(PALETTE.mudbrickDark)} items={buttresses} castShadow receiveShadow />
      {/* main temple: tripartite hall on a low platform, door niche facing the courtyard */}
      <Block position={[cx, 0, cz - 8]} size={[27, 1, 12.5]} color={PALETTE.mudbrickDark} />
      <Block position={[cx, 1, cz - 8]} size={[24, 5.5, 10]} color={PLASTER} />
      <Block position={[cx, 1, cz - 2.9]} size={[2.2, 3.4, 0.3]} color="#5b4331" castShadow={false} />
      <Block position={[cx, 6.5, cz - 8]} size={[24.6, 0.45, 10.6]} color={PALETTE.mudbrickDark} />
      {/* a smaller hall on the west side of the courtyard */}
      <Block position={[cx - 14, 0, cz + 5]} size={[8, 4, 7]} color={PALETTE.mudbrick} />
      <Block position={[cx - 14, 4, cz + 5]} size={[8.4, 0.35, 7.4]} color={PALETTE.mudbrickDark} />
    </group>
  );
}

function KullabaTerrace() {
  const [x, , z] = KULLABA.center;
  const top = KULLABA.terraceHeight;
  const rampRun = 15;
  const rampLen = Math.hypot(rampRun, top);
  const rampAngle = Math.atan2(top, rampRun);
  const whitePilasters = useMemo(
    () => [
      ...pilasters(x - 7.5, z + 5, x + 7.5, z + 5, top, 4.6, [0, 1], 1.5),
      ...pilasters(x - 7.5, z - 5, x - 7.5, z + 5, top, 4.6, [-1, 0], 1.5),
      ...pilasters(x + 7.5, z - 5, x + 7.5, z + 5, top, 4.6, [1, 0], 1.5),
    ],
    [x, z, top],
  );
  return (
    <group>
      <Steps position={[x, 0, z]} width={KULLABA.terraceWidth} depth={KULLABA.terraceDepth} stepHeight={top / 3} steps={3} inset={1.6} color="#b8915f" />
      {/* stairway up the south face */}
      <mesh
        geometry={GEO.box()}
        material={matte(PALETTE.mudbrickDark)}
        position={[x, top / 2, z + KULLABA.terraceDepth / 2 - 4.8 + rampRun / 2]}
        rotation={[rampAngle, 0, 0]}
        scale={[3, 0.8, rampLen]}
        castShadow
        receiveShadow
      />
      {/* the White Temple: whitewashed, buttressed walls */}
      <Block position={[x, top, z]} size={[15, 4.6, 10]} color={WHITEWASH} />
      <Instances geometry={GEO.boxBase()} material={matte(WHITEWASH)} items={whitePilasters} castShadow receiveShadow />
      <Block position={[x, top + 4.6, z]} size={[15.4, 0.35, 10.4]} color="#e4dccb" />
    </group>
  );
}

const HEARTH_SMOKE: ParticlePreset = { ...PARTICLES.smoke, count: 40, size: [1.4, 6], opacity: 0.2, velocity: [0, 1.1, 0], colorStart: "#8a7f72", colorEnd: "#d8cfc0" };
const HEARTHS: [number, number, number][] = [
  [-14, 3, 30],
  [48, 3, 34],
  [-52, 3, -28],
  [6, 3, -40],
];

export function City({ time, quality, labels }: { time: number; quality: "low" | "high"; labels: number }) {
  const high = quality === "high";
  // hearth smoke only matters in the wide shots
  const smoke = 1 - smoothstep(11, 13, time) + smoothstep(66, 69, time);
  return (
    <group>
      <Town
        seed={7}
        count={high ? 360 : 180}
        area={{ x: 0, z: 0, w: CITY.halfX, d: CITY.halfZ }}
        exclude={excludeFromTown}
        height={GROUND}
        minSize={[3, 2.2, 3]}
        maxSize={[7, 4.2, 7]}
        colors={[PALETTE.mudbrick, PALETTE.mudbrickDark, PALETTE.sandDark, "#c7a578"]}
      />
      <EannaPrecinct quality={quality} />
      <KullabaTerrace />
      {HEARTHS.map((p, i) => (
        <Particles key={i} preset={HEARTH_SMOKE} time={time} position={p} seed={20 + i} intensity={smoke} density={high ? 1 : 0.5} prewarm />
      ))}

      <Label3D position={[0, 2, RIVER.z]} opacity={labels} size="md">
        Éufrates
      </Label3D>
      <Label3D position={[EANNA.center[0], 12, EANNA.center[2] - 6]} opacity={labels} size="md">
        Recinto del Eanna
      </Label3D>
      <Label3D position={[KULLABA.center[0], KULLABA.terraceHeight + 10, KULLABA.center[2]]} opacity={labels} size="md">
        Templo Blanco · Kullaba
      </Label3D>
    </group>
  );
}
