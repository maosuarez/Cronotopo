"use client";

import { useMemo } from "react";
import type { SceneProps } from "../types";
import { Block, Column, Steps, Town } from "./Architecture";
import { useCameraPath, type CameraKey } from "./camera";
import { Crowd, crowdOnPath } from "./Crowd";
import { Arrow, Label3D } from "./Didactic";
import { Diorama } from "./Diorama";
import { CandleLight, Environment } from "./Environment";
import { Figure, type Pose } from "./Figure";
import { LIGHT, mixLight } from "./lighting";
import { progress, wave } from "./math";
import { PALETTE } from "./palette";
import { Particles, PARTICLES } from "./Particles";
import { makeHeightFn, Terrain } from "./Terrain";
import { Vegetation } from "./Vegetation";
import { Water } from "./Water";

/** Contact sheet of every kit primitive (`?debug=kit`). Loops over 24 s. */
const CAMERA: CameraKey[] = [
  { t: 0, pos: [0, 16, 34], look: [0, 1, 0] },
  { t: 8, pos: [22, 10, 22], look: [0, 1, 0] },
  { t: 16, pos: [-20, 12, 20], look: [0, 1, 0] },
  { t: 24, pos: [0, 16, 34], look: [0, 1, 0] },
];
const POSES: Pose[] = ["stand", "walk", "carry", "work", "push", "write", "kneel", "sit", "point", "pray"];

export default function KitPreview({ time, quality }: SceneProps) {
  const t = time % 24;
  useCameraPath(CAMERA, t);
  const height = useMemo(() => makeHeightFn({ amplitude: 0.6, frequency: 0.08, seed: 4, mask: (x, z) => Math.min(1, Math.hypot(x, z) / 18) }), []);
  const crowd = useMemo(() => crowdOnPath(2, 18, [[-12, 0, 10], [12, 0, 10], [12, 0, 14], [-12, 0, 14], [-12, 0, 10]], { speed: 1.2, spread: 0.6 }), []);
  const light = mixLight(LIGHT.golden, LIGHT.dusk, (Math.sin((t / 24) * Math.PI * 2) + 1) / 4);
  const high = quality === "high";
  return (
    <Diorama quality={quality}>
      <Environment light={light} shadows={high} shadowSize={30} />
      <Terrain size={120} segments={80} amplitude={0.6} frequency={0.08} seed={4} mask={(x, z) => Math.min(1, Math.hypot(x, z) / 18)} bands={[[-99, PALETTE.sandDark], [0, PALETTE.sand], [0.4, PALETTE.grassDry]]} />
      <Water time={time} width={60} depth={6} position={[0, 0.05, -14]} />
      <Label3D position={[0, 1.2, -14]}>Water</Label3D>

      {/* vegetation row */}
      {(["palm", "tree", "cypress", "bush", "reeds"] as const).map((k, i) => (
        <group key={k}>
          <Vegetation kind={k} points={[[-12 + i * 6, -8]]} height={height} castShadow={high} />
          <Label3D position={[-12 + i * 6, 5, -8]} size="sm">{k}</Label3D>
        </group>
      ))}

      {/* figures */}
      {POSES.map((pose, i) => (
        <group key={pose}>
          <Figure position={[-13.5 + i * 3, 0, -2]} pose={pose} t={time} outfit={{ tunic: [PALETTE.linen, PALETTE.dyeRed, PALETTE.dyeBlue, PALETTE.wool, PALETTE.dyeOchre][i % 5], skin: PALETTE.skinTones[i % 5], robe: i % 3 === 0, head: (["none", "cap", "wrap", "hat", "veil", "helmet"] as const)[i % 6] }} castShadow={high} />
          <Label3D position={[-13.5 + i * 3, 2.3, -2]} size="sm">{pose}</Label3D>
        </group>
      ))}

      {/* crowd */}
      <Crowd agents={crowd} time={time} castShadow={high} />
      <Label3D position={[0, 2.5, 12]}>Crowd</Label3D>

      {/* architecture */}
      <Block position={[14, 0, 2]} size={[3, 2.5, 3]} />
      <Steps position={[19, 0, 2]} width={6} depth={6} stepHeight={0.7} steps={5} inset={0.5} visibleSteps={1 + 4 * progress(t, 2, 10)} />
      <Column position={[14, 0, 7]} height={6} radius={0.5} drums={6} built={6 * progress(t, 4, 14)} entasis={0.5 + 0.5 * wave(t, 6)} />
      <Town area={{ x: 20, z: 9, w: 3, d: 3 }} count={10} growth={progress(t, 0, 12)} />
      <Label3D position={[17, 5, 4]}>Block · Steps · Column · Town</Label3D>

      {/* particles */}
      <Particles preset={PARTICLES.smoke} time={time} position={[-18, 0, 4]} density={high ? 1 : 0.5} prewarm />
      <Particles preset={PARTICLES.dust} time={time} position={[-15, 0, 6]} prewarm />
      <Particles preset={PARTICLES.sparks} time={time} position={[-12, 1, 6]} prewarm />
      <Particles preset={PARTICLES.steam} time={time} position={[-9, 1, 6]} prewarm />
      <Particles preset={PARTICLES.ash} time={time} position={[-14, 8, 4]} overrides={{ spread: [4, 1, 4], count: 200 }} prewarm />
      <Label3D position={[-14, 6, 6]}>smoke · dust · sparks · steam · ash</Label3D>

      {/* didactic */}
      <Arrow from={[6, 0.3, 6]} to={[10, 2.5, 6]} progress={progress(t, 1, 4)} />
      <Label3D position={[8, 3.2, 6]} hypothesis>Rampa</Label3D>
      <CandleLight position={[4, 1, 8]} time={time} />
    </Diorama>
  );
}
