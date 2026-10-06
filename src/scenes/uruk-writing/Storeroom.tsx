"use client";

import { useLayoutEffect, useMemo } from "react";
import { DataTexture, MeshStandardMaterial, RepeatWrapping, SRGBColorSpace } from "three";
import { Block, createRng, Figure, GEO, Instances, matte, PALETTE, progress, type InstanceSpec } from "../kit";
import { URUK_GEO, TABLET_SIZE } from "./geometries";
import { MAT, SCRIBE_POS, SHELVES, STOREROOM, TABLE } from "./layout";

/**
 * The storeroom where accounts are kept: mud-brick room in the Eanna courtyard with a cutaway front wall,
 * the scribe's table with a reed mat, sacks of barley and the archive shelves that fill up with tablets.
 */

/** Woven reed mat, drawn into a small DataTexture at runtime (over/under checker of rounded strands). */
function useReedMatMaterial() {
  const material = useMemo(() => {
    const size = 256;
    const cell = 16;
    const data = new Uint8Array(size * size * 4);
    const base = [181, 152, 98];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const horizontal = (Math.floor(x / cell) + Math.floor(y / cell)) % 2 === 0;
        const across = horizontal ? (y % cell) / cell : (x % cell) / cell;
        const along = horizontal ? x : y;
        const round = Math.sin(Math.PI * across); // strand profile: dark seams between strands
        const fibre = 0.92 + 0.08 * Math.sin(along * 1.7 + (horizontal ? y : x) * 0.3);
        const k = (0.72 + 0.28 * round) * fibre * (horizontal ? 1 : 0.93);
        const i = (y * size + x) * 4;
        data[i] = base[0] * k;
        data[i + 1] = base[1] * k;
        data[i + 2] = base[2] * k;
        data[i + 3] = 255;
      }
    }
    const texture = new DataTexture(data, size, size);
    texture.wrapS = texture.wrapT = RepeatWrapping;
    texture.repeat.set(9, 4);
    texture.anisotropy = 4;
    texture.colorSpace = SRGBColorSpace;
    texture.needsUpdate = true;
    return new MeshStandardMaterial({ map: texture, roughness: 0.95 });
  }, []);
  useLayoutEffect(
    () => () => {
      material.map?.dispose();
      material.dispose();
    },
    [material],
  );
  return material;
}

/** Every tablet slot on the shelves, in filling order (bottom shelf first, left to right, stacks growing). */
function useArchiveSlots(rows: number): InstanceSpec[] {
  return useMemo(() => {
    const rng = createRng(77);
    const tones = ["#c9a77f", "#b8936b", "#d2b48c", "#a98460", "#c4a07a"];
    const out: InstanceSpec[] = [];
    for (const level of SHELVES.levels) {
      for (let x = SHELVES.x0 + 0.08; x < SHELVES.x1 - 0.06; x += 0.17) {
        for (let r = 0; r < rows; r++) {
          const stack = rng.int(1, 4);
          const z = SHELVES.z + 0.12 + r * 0.2;
          for (let k = 0; k < stack; k++) {
            const s = rng.range(1.35, 1.7);
            out.push({
              position: [x + rng.range(-0.01, 0.01), level + 0.025 + (k + 0.5) * TABLET_SIZE.h * s, z + rng.range(-0.01, 0.01)],
              rotation: [0, rng.range(-0.12, 0.12), 0],
              scale: s,
              color: rng.pick(tones),
            });
          }
        }
      }
    }
    return out;
  }, [rows]);
}

function Shelves({ time, quality }: { time: number; quality: "low" | "high" }) {
  const slots = useArchiveSlots(quality === "high" ? 2 : 1);
  // the archive grows during the time-lapse and is full when the camera pulls back
  const shown = Math.round(slots.length * progress(time, 51, 63.5));
  const tablets = useMemo(() => slots.slice(0, shown), [slots, shown]);
  const width = SHELVES.x1 - SHELVES.x0;
  const cx = (SHELVES.x0 + SHELVES.x1) / 2;
  const zc = SHELVES.z + SHELVES.depth / 2;
  return (
    <group>
      {SHELVES.levels.map((y) => (
        <Block key={y} position={[cx, y, zc]} size={[width, 0.05, SHELVES.depth]} color={PALETTE.wood} />
      ))}
      {[SHELVES.x0, cx, SHELVES.x1].map((x) => (
        <Block key={x} position={[x, 0, zc]} size={[0.08, SHELVES.levels[SHELVES.levels.length - 1] + 0.05, SHELVES.depth]} color={PALETTE.woodDark} />
      ))}
      {tablets.length > 0 && <Instances geometry={URUK_GEO.tablet()} material={matte()} items={tablets} castShadow receiveShadow />}
    </group>
  );
}

/** Sacks of barley stacked against the back wall (the goods the accounts are about). */
function StoredSacks() {
  const items = useMemo(() => {
    const rng = createRng(5);
    const out: InstanceSpec[] = [];
    for (let layer = 0; layer < 2; layer++) {
      for (let i = 0; i < 5 - layer; i++) {
        out.push({
          position: [STOREROOM.x0 + 0.45 + i * 0.5 + layer * 0.25, layer * 0.46, STOREROOM.z0 + 0.4 + rng.range(-0.05, 0.05)],
          rotation: [0, rng.range(0, Math.PI), 0],
          scale: [1, 0.8, 1],
          color: rng.pick([PALETTE.linen, PALETTE.wool, "#d9c9a3"]),
        });
      }
    }
    return out;
  }, []);
  return <Instances geometry={URUK_GEO.sack()} material={matte()} items={items} castShadow receiveShadow />;
}

export function Storeroom({ time, quality, frontWall }: { time: number; quality: "low" | "high"; frontWall: number }) {
  const { x0, x1, z0, z1, wall: W, height: H, door } = STOREROOM;
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const outerX = x1 - x0 + 2 * W;
  const matMaterial = useReedMatMaterial();
  const high = quality === "high";
  const color = PALETTE.mudbrick;
  // the cut section never disappears completely: a low sill keeps the room's footprint readable
  const frontHeight = Math.max(0.28, H * frontWall);

  return (
    <group>
      {/* shell */}
      <Block position={[cx, -0.03, cz]} size={[x1 - x0, 0.06, z1 - z0]} color="#b7976f" castShadow={false} />
      <Block position={[cx, 0, z0 - W / 2]} size={[outerX, H, W]} color={color} />
      <Block position={[x1 + W / 2, 0, cz]} size={[W, H, z1 - z0 + 2 * W]} color={color} />
      <Block position={[x0 - W / 2, 0, (z0 - W + door.z0) / 2]} size={[W, H, door.z0 - (z0 - W)]} color={color} />
      <Block position={[x0 - W / 2, 0, (door.z1 + z1 + W) / 2]} size={[W, H, z1 + W - door.z1]} color={color} />
      <Block position={[x0 - W / 2, door.height, (door.z0 + door.z1) / 2]} size={[W, H - door.height, door.z1 - door.z0]} color={color} />
      <Block position={[cx, 0, z1 + W / 2]} size={[outerX, frontHeight, W]} color={PALETTE.mudbrickDark} />
      <Block position={[cx, H, cz]} size={[outerX + 0.6, 0.32, z1 - z0 + 2 * W + 0.8]} color={PALETTE.mudbrickDark} />

      {/* the scribe's table, reed mat and stool */}
      <Block position={TABLE.center} size={TABLE.size} color={PALETTE.mudbrickDark} />
      <mesh geometry={GEO.boxBase()} material={matMaterial} position={[MAT.center[0], TABLE.size[1], MAT.center[2]]} scale={[MAT.width, MAT.thickness, MAT.depth]} receiveShadow />
      <Block position={[SCRIBE_POS[0], 0, SCRIBE_POS[2] - 0.05]} size={[0.45, 0.45, 0.4]} color={PALETTE.woodDark} />
      <Figure position={SCRIBE_POS} pose="sit" outfit={{ tunic: PALETTE.linen, robe: true, skin: PALETTE.skinTones[1] }} castShadow={high} />

      <Shelves time={time} quality={quality} />
      <StoredSacks />
      {/* soft bounce light inside the room so the interior reads even when the roof shades it */}
      <pointLight position={[cx + 1, H - 0.6, cz]} color="#ffd9a8" intensity={14} distance={10} decay={2} />
    </group>
  );
}
