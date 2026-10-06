"use client";

import { Quaternion, Vector3 } from "three";
import { Label3D, matte, smoothstep, window01 } from "../kit";
import { ClayTablet } from "./ClayTablet";
import { TABLET_SIZE, tabletTop, URUK_GEO } from "./geometries";
import { TABLET_A_POS } from "./layout";
import { stylusTip, tabletAStrokes } from "./writing";

/** The reed is held by the scribe behind the table: it leans back and up from its tip. */
const STYLUS_TILT = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(0.28, 0.82, -0.5).normalize());

/**
 * Beat "first-tablet": the stylus presses numerals and draws the barley sign into wet clay. The tablet stays on
 * the mat for the rest of the scene and dries during the time-lapse that follows.
 */
export function FirstTablet({ time, shadows }: { time: number; shadows: boolean }) {
  const [x, y, z] = TABLET_A_POS;
  const tip = stylusTip(time);
  const surface = y + TABLET_SIZE.h / 2 + tabletTop(tip[0], tip[2]);
  const showStylus = time > 36.8 && time < 49.5;
  const wetness = 1 - 0.75 * smoothstep(48, 53, time);

  return (
    <group>
      <ClayTablet position={TABLET_A_POS} strokes={tabletAStrokes(time)} wetness={wetness} castShadow={shadows} />
      {showStylus && (
        <mesh
          geometry={URUK_GEO.stylus()}
          material={matte("#b59a62", { flat: false })}
          position={[x + tip[0], surface + tip[1], z + tip[2]]}
          quaternion={STYLUS_TILT}
          castShadow
        />
      )}
      <Label3D position={[x - 0.026, y + 0.034, z - 0.012]} opacity={window01(time, 39.4, 40.0, 48.0, 48.6)} size="sm">
        Marcas numéricas
      </Label3D>
      <Label3D position={[x + 0.02, y + 0.034, z - 0.012]} opacity={window01(time, 44.6, 45.2, 48.0, 48.6)} size="sm">
        Cebada
      </Label3D>
      <Label3D position={[x, y + 0.016, z + 0.05]} opacity={window01(time, 42.4, 43.2, 48.0, 48.6)} size="md">
        Protocuneiforme
      </Label3D>
    </group>
  );
}
