"use client";

import { Diorama, Environment, smoothstep, useCameraPath } from "../kit";
import type { SceneProps } from "../types";
import { City } from "./City";
import { Evolution } from "./Evolution";
import { FirstTablet } from "./FirstTablet";
import { Landscape } from "./Landscape";
import { CAMERA, frontWallAt, lightAt, shadowFocusAt } from "./shots";
import { Storeroom } from "./Storeroom";
import { SunRig } from "./SunRig";
import { TempleEconomy } from "./TempleEconomy";
import { TokensAndBulla } from "./TokensAndBulla";

/**
 * "Nace la escritura" — Uruk, c. 3400–3000 a.C.
 *
 * One diorama, one continuous camera move (shots.ts). Set pieces are always mounted (they are cheap and this
 * keeps every frame a pure function of `time`); the camera decides what is seen. Labels of the wide shot fade
 * as the camera descends. Beats: plain → temple economy → tokens (hypothesis) → first tablet → evolution →
 * archive.
 */
export default function UrukWritingScene({ time, quality }: SceneProps) {
  useCameraPath(CAMERA, time);
  const high = quality === "high";
  const light = lightAt(time);
  const { focus, size } = shadowFocusAt(time);
  const wideLabels = smoothstep(1.2, 2.6, time) * (1 - smoothstep(9.5, 11.5, time));

  return (
    <Diorama quality={quality} bloom={0.3}>
      {/* sky, fog and fill come from the kit; the shadow-casting sun is our tracking rig */}
      <Environment light={{ ...light, sunIntensity: 0 }} />
      <SunRig light={light} focus={focus} size={size} shadows={high} />

      <Landscape time={time} quality={quality} />
      <City time={time} quality={quality} labels={wideLabels} />
      <TempleEconomy time={time} quality={quality} />
      <Storeroom time={time} quality={quality} frontWall={frontWallAt(time)} />

      <TokensAndBulla time={time} />
      <FirstTablet time={time} shadows={high} />
      <Evolution time={time} shadows={high} />
    </Diorama>
  );
}
