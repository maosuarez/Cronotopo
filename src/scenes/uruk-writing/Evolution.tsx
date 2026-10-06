"use client";

import { Arrow, ease, Label3D, progress, smoothstep, window01 } from "../kit";
import { ClayTablet } from "./ClayTablet";
import { TABLET_A_POS, TABLET_B_POS, TABLET_C_POS, TOP } from "./layout";
import { BARLEY_STAGES, barleyStrokes, mixBarley, type BarleyParams } from "./signs";

/**
 * Beat "evolution": a time-lapse in which later tablets appear next to the first one. On each, the barley sign
 * is first pressed in its previous form and then morphs into the next stage, so the change reads as a process.
 * No dates are attached to the stages on purpose.
 */
type Stage = {
  position: typeof TABLET_B_POS;
  from: BarleyParams;
  to: BarleyParams;
  appear: number;
};

const LATER_TABLETS: Stage[] = [
  { position: TABLET_B_POS, from: BARLEY_STAGES.pictograph, to: BARLEY_STAGES.rotated, appear: 49.2 },
  { position: TABLET_C_POS, from: BARLEY_STAGES.rotated, to: BARLEY_STAGES.wedges, appear: 52.4 },
];

/** Seconds after `appear`: grow in, press the old form, morph to the new one. */
const GROW = 0.7;
const PRESS = [0.7, 1.3] as const;
const MORPH = [1.5, 3.2] as const;

function laterTabletState(stage: Stage, t: number) {
  const local = t - stage.appear;
  const scale = ease.backOut(progress(local, 0, GROW));
  const press = ease.out(progress(local, PRESS[0], PRESS[1]));
  const morph = ease.inOut(progress(local, MORPH[0], MORPH[1]));
  const params = { ...mixBarley(stage.from, stage.to, morph), press };
  return { scale, strokes: barleyStrokes(params, [0, 0], 1.15) };
}

export function Evolution({ time, shadows }: { time: number; shadows: boolean }) {
  const fadeOut = 1 - smoothstep(60, 60.8, time);
  const labelY = TOP + 0.055;
  const labelZ = TABLET_A_POS[2] - 0.01;
  const arrowZ = TABLET_A_POS[2] + 0.044;

  return (
    <group>
      {LATER_TABLETS.map((stage, i) => {
        const { scale, strokes } = laterTabletState(stage, time);
        return <ClayTablet key={i} position={stage.position} strokes={strokes} wetness={0.35 - 0.15 * i} large scale={scale} castShadow={shadows} />;
      })}

      <Arrow
        from={[TABLET_A_POS[0] - 0.02, TOP + 0.002, arrowZ]}
        to={[TABLET_C_POS[0] + 0.04, TOP + 0.002, arrowZ]}
        progress={ease.inOut(progress(time, 49.4, 55.6)) * fadeOut}
        thickness={0.0011}
      />
      <Label3D position={[(TABLET_A_POS[0] + TABLET_C_POS[0]) / 2, TOP + 0.002, arrowZ + 0.022]} opacity={window01(time, 50.0, 50.8, 60.0, 60.6)} size="sm">
        Siglos →
      </Label3D>
      <Label3D position={[TABLET_A_POS[0], labelY, labelZ]} opacity={window01(time, 49.0, 49.8, 60.0, 60.6)} size="sm" tone="dark">
        Pictograma
      </Label3D>
      <Label3D position={[TABLET_B_POS[0], labelY, labelZ]} opacity={window01(time, 51.6, 52.4, 60.0, 60.6)} size="sm" tone="dark">
        Girado y simplificado
      </Label3D>
      <Label3D position={[TABLET_C_POS[0], labelY, labelZ]} opacity={window01(time, 54.6, 55.4, 60.0, 60.6)} size="sm" tone="dark">
        Cuñas: cuneiforme
      </Label3D>
    </group>
  );
}
