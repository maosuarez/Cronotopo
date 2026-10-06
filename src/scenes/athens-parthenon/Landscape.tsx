"use client";

import { useLayoutEffect, useMemo } from "react";
import { BufferAttribute, Color, CylinderGeometry, IcosahedronGeometry, type BufferGeometry } from "three";
import { cached, Column, fbm2, Instances, makeHeightFn, matte, PALETTE, Terrain, Town, Vegetation, type InstanceSpec, type Vec3 } from "../kit";
import { merge } from "../kit";
import { boxAt } from "./geometry";

/** Acropolis rock: elongated east–west, the Parthenon on its southern half. */
export const ROCK = { cx: -10, cz: -12, rx: 125, rz: 58, depth: 45 };
export const PLAIN_Y = -ROCK.depth;

/** Radial noise of the cliff (same function for the cap rim and the walls so they meet). */
const cliffNoise = (a: number, h: number) => 1 + 0.08 * (fbm2(Math.cos(a) * 2.2 + 5, Math.sin(a) * 2.2 + h * 1.6, 11) - 0.5) * 2;

/** True when (x, z) on the plain is under/near the rock. */
export const nearRock = (x: number, z: number, margin = 1.25) => ((x - ROCK.cx) / (ROCK.rx * margin)) ** 2 + ((z - ROCK.cz) / (ROCK.rz * margin)) ** 2 < 1;

function rockGeometry(): BufferGeometry {
  const g = new CylinderGeometry(1, 1, 1, 64, 6, false);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const h = y + 0.5; // 0 bottom → 1 top
    const r = Math.hypot(x, z);
    const a = Math.atan2(z, x);
    const flare = 1 + 0.2 * (1 - h) ** 1.4;
    const n = cliffNoise(a, h);
    p.setXYZ(i, ROCK.cx + Math.cos(a) * r * ROCK.rx * flare * n, -ROCK.depth * (1 - h), ROCK.cz + Math.sin(a) * r * ROCK.rz * flare * n);
  }
  const flat = g.toNonIndexed();
  g.dispose();
  const q = flat.attributes.position;
  const colors = new Float32Array(q.count * 3);
  const c = new Color();
  for (let i = 0; i < q.count; i += 3) {
    const y = (q.getY(i) + q.getY(i + 1) + q.getY(i + 2)) / 3;
    const x = (q.getX(i) + q.getX(i + 1) + q.getX(i + 2)) / 3;
    if (y > -0.01) c.set("#c9b48e");
    else {
      const streak = fbm2(x * 0.08, y * 0.25, 4);
      c.set("#a8906c").lerp(new Color("#d0bb94"), streak * 0.8).lerp(new Color("#8a7458"), y < -38 ? 0.4 : 0);
    }
    for (let k = 0; k < 3; k++) colors.set([c.r, c.g, c.b], (i + k) * 3);
  }
  flat.setAttribute("color", new BufferAttribute(colors, 3));
  flat.computeVertexNormals();
  return flat;
}

/** Ramp of the procession up the west slope (polyline in world space). */
export const RAMP: Vec3[] = [
  [-232, PLAIN_Y, 46],
  [-200, -36, 50],
  [-172, -25, 32],
  [-152, -13, 16],
  [-141, -5, 6],
  [-128, 0, 1],
];

function rampGeometry(): BufferGeometry {
  const parts: BufferGeometry[] = [];
  for (let i = 1; i < RAMP.length; i++) {
    const [ax, ay, az] = RAMP[i - 1];
    const [bx, by, bz] = RAMP[i];
    const len = Math.hypot(bx - ax, bz - az);
    const slope = Math.atan2(by - ay, len);
    const heading = Math.atan2(bx - ax, bz - az);
    parts.push(
      boxAt(0, -1.6, 0, 7, 1.6, Math.hypot(len, by - ay) + 3)
        .rotateX(-slope)
        .rotateY(heading)
        .translate((ax + bx) / 2, (ay + by) / 2, (az + bz) / 2),
    );
  }
  return merge(parts);
}

/** Distant ridges (Hymettus, Parnes) and the Lycabettus hill. */
const MOUNTAINS: { p: Vec3; s: Vec3 }[] = [
  { p: [780, -80, -120], s: [220, 210, 520] },
  { p: [420, -80, -720], s: [460, 190, 200] },
  { p: [-260, -80, -800], s: [520, 230, 200] },
  { p: [-800, -80, -260], s: [200, 150, 420] },
  { p: [380, PLAIN_Y - 10, -430], s: [55, 190, 55] },
];

/** Propylaea: monumental gateway at the west end of the rock (Doric front of six columns). */
function Propylaea({ high }: { high: boolean }) {
  const x = -114;
  return (
    <group>
      <mesh geometry={PROPYLAEA()} material={matte(PALETTE.marble)} castShadow={high} receiveShadow />
      {[-9, -5.4, -1.8, 1.8, 5.4, 9].map((z) => (
        <Column key={z} position={[x - 9.5, 1.2, z]} height={8.6} radius={0.78} drums={5} />
      ))}
    </group>
  );
}

const PROPYLAEA = () =>
  cached("ath-propylaea", () => {
    const x = -114;
    return merge([
      boxAt(x, 0, 0, 24, 1.2, 26),
      boxAt(x + 3, 1.2, 7, 14, 9.8, 8),
      boxAt(x + 3, 1.2, -7, 14, 9.8, 8),
      boxAt(x + 3, 8.2, 0, 14, 2.8, 6),
      boxAt(x - 4, 9.8, 0, 13, 1.4, 22),
      boxAt(x - 4, 0, 19, 12, 7, 10),
      boxAt(x - 4, 0, -19, 12, 7, 10),
      new IcosahedronGeometry(1, 0).scale(10, 2.2, 11).translate(x, 11.4, 0),
    ]);
  });
const MOUNTAIN = () => cached("ath-mountain", () => new IcosahedronGeometry(1, 1));
const OLD_TEMPLE = () => cached("ath-old-temple", () => merge([boxAt(-22, 0, -42, 44, 0.8, 21), boxAt(-22, 0.8, -42, 34, 0.35, 12)]));

/** Rock, plain with the city of Athens, olive groves, mountains, Propylaea and the procession ramp. */
export function Landscape({ high, showRamp }: { high: boolean; showRamp: boolean }) {
  const rock = useMemo(() => rockGeometry(), []);
  const ramp = useMemo(() => rampGeometry(), []);
  useLayoutEffect(
    () => () => {
      rock.dispose();
      ramp.dispose();
    },
    [rock, ramp],
  );
  const plain = useMemo(() => makeHeightFn({ amplitude: 3, frequency: 0.012, seed: 21 }), []);
  const exclude = useMemo(() => (x: number, z: number) => nearRock(x, z, 1.32) || (x < -150 && x > -250 && z > 20 && z < 70), []);
  const mountains = useMemo<InstanceSpec[]>(() => MOUNTAINS.map((m) => ({ position: m.p, scale: m.s, color: "#9c8b70" })), []);
  return (
    <group>
      <mesh geometry={rock} receiveShadow castShadow={high}>
        <meshStandardMaterial vertexColors flatShading roughness={1} metalness={0} />
      </mesh>
      <group position={[0, PLAIN_Y, 0]}>
        <Terrain size={1700} segments={high ? 110 : 70} amplitude={3} frequency={0.012} seed={21} bands={[[-99, PALETTE.grassDry], [0.6, "#b9a46e"], [2, PALETTE.sandDark]]} receiveShadow={false} />
        <Town
          seed={5}
          count={high ? 340 : 170}
          area={{ x: 0, z: 30, w: 330, d: 230 }}
          exclude={exclude}
          height={plain}
          colors={[PALETTE.limestone, PALETTE.limestoneShade, "#e2d3b4", PALETTE.mudbrick]}
          minSize={[5, 3, 5]}
          maxSize={[11, 6, 10]}
        />
        <Vegetation kind="tree" count={high ? 160 : 80} area={{ x: 0, z: 0, w: 380, d: 300 }} exclude={exclude} height={plain} seed={9} size={3.2} />
        <Vegetation kind="cypress" count={high ? 50 : 24} area={{ x: 0, z: 0, w: 300, d: 260 }} exclude={exclude} height={plain} seed={13} size={3.5} />
      </group>
      <Instances geometry={MOUNTAIN()} material={matte()} items={mountains} />
      <Propylaea high={high} />
      {/* foundations of the old temple of Athena, burnt in 480 a.C., north of the Parthenon */}
      <mesh geometry={OLD_TEMPLE()} material={matte("#a89478")} receiveShadow />
      {showRamp && <mesh geometry={ramp} material={matte("#bba585")} receiveShadow />}
    </group>
  );
}
