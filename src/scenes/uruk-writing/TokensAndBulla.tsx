"use client";

import { useLayoutEffect, useMemo } from "react";
import { DoubleSide, MeshStandardMaterial } from "three";
import { ease, Label3D, lerp, matte, progress, window01, type Vec3 } from "../kit";
import { createClayMaterial } from "./clay";
import { URUK_GEO } from "./geometries";
import { BULLA_POS } from "./layout";

/**
 * Beat "tokens" (hypothesis): clay tokens hop into a hollow clay ball, the ball is closed and a cylinder seal
 * is rolled around it. All positions are relative to BULLA_POS on the mat.
 */
const R = 0.03;
const SEAL_R = 0.0075;
const CLAY = "#a27a55";

/** Token rest spots on the mat (x, z) and colour variety. */
const TOKENS: { rest: [number, number]; spin: number; color: string }[] = [
  { rest: [0.044, 0.02], spin: 0.3, color: "#b08660" },
  { rest: [0.058, -0.002], spin: 1.2, color: "#9c7350" },
  { rest: [0.07, 0.024], spin: 2.0, color: "#b8906a" },
  { rest: [0.052, 0.04], spin: 0.8, color: "#a57b57" },
  { rest: [0.078, 0.004], spin: 2.6, color: "#b08660" },
  { rest: [0.036, -0.016], spin: 1.7, color: "#9c7350" },
];

const T = {
  hopStart: 26.6,
  hopEach: 0.45,
  hopDur: 0.6,
  closeStart: 29.4,
  closeEnd: 30.6,
  rollStart: 31.0,
  rollEnd: 35.0,
};

/** Raised frieze left by the seal: borders, chevrons and drilled dots, only where the seal has passed. */
const BULLA_HEIGHT = /* glsl */ `
  uniform float uReveal;
  float clayHeight(vec3 p, out float shade) {
    shade = 0.0;
    float phi = atan(-p.z, p.x);
    if (phi < 0.0) phi += 6.2831853;
    float v = p.y;
    if (abs(v) > 0.0105 || phi > uReveal) return 0.0;
    // the rolled band is pressed slightly flat; its leading edge fades over a few degrees
    float edge = smoothstep(0.0, 0.08, uReveal - phi);
    float s = phi * ${R.toFixed(3)};
    float u = mod(s, 0.0118) - 0.0059;
    float d = abs(abs(v) - 0.0082) - 0.00055;
    d = min(d, abs(v - (0.0035 - abs(u) * 0.95)) - 0.0006);
    d = min(d, abs(v - (-0.0005 - abs(u) * 0.95)) - 0.0006);
    d = min(d, length(vec2(u, v + 0.0055)) - 0.0011);
    float raised = smoothstep(0.0003, -0.0002, d);
    shade = 0.35 * (1.0 - raised) * edge;
    return edge * (0.0007 * raised - 0.00035);
  }
`;

export function TokensAndBulla({ time }: { time: number }) {
  const shellMaterial = useMemo(() => new MeshStandardMaterial({ color: CLAY, roughness: 0.8, side: DoubleSide }), []);
  const uniforms = useMemo(() => ({ uReveal: { value: 0 } }), []);
  const sealedMaterial = useMemo(() => createClayMaterial({ key: "bulla", heightGLSL: BULLA_HEIGHT, uniforms, color: CLAY, roughness: 0.8 }), [uniforms]);
  useLayoutEffect(() => () => shellMaterial.dispose(), [shellMaterial]);
  useLayoutEffect(() => () => sealedMaterial.dispose(), [sealedMaterial]);

  const roll = ease.inOut(progress(time, T.rollStart, T.rollEnd)) * Math.PI * 2 * 0.94;
  useLayoutEffect(() => {
    uniforms.uReveal.value = roll;
  });

  const [bx, by, bz] = BULLA_POS;
  const sealed = time >= T.closeEnd;
  const tokenGeos = URUK_GEO.tokens();

  // Cap: rests upside down beside the bowl, then flips over in an arc and closes the ball.
  const close = ease.inOut(progress(time, T.closeStart, T.closeEnd));
  const capPos: Vec3 = [bx + lerp(-0.068, 0, close), by + R + Math.sin(Math.PI * close) * 0.032, bz];
  const sealIn = window01(time, T.rollStart - 0.5, T.rollStart, T.rollEnd + 0.3, T.rollEnd + 0.9);

  return (
    <group>
      {/* tokens: each hops in an arc from its rest spot into the bowl */}
      {!sealed &&
        TOKENS.map((tok, i) => {
          const k = progress(time, T.hopStart + i * T.hopEach, T.hopStart + i * T.hopEach + T.hopDur);
          const e = ease.inOut(k);
          const inside: [number, number] = [((i % 3) - 1) * 0.008, ((i % 2) - 0.5) * 0.01];
          const x = lerp(tok.rest[0], inside[0], e);
          const z = lerp(tok.rest[1], inside[1], e);
          const y = lerp(0, 0.005 + i * 0.0015, e) + Math.sin(Math.PI * k) * 0.045;
          return (
            <mesh
              key={i}
              geometry={tokenGeos[i]}
              material={matte(tok.color, { flat: false })}
              position={[bx + x, by + y, bz + z]}
              rotation={[Math.sin(Math.PI * k) * 2.2, tok.spin + k * 3, 0]}
              castShadow
              receiveShadow
            />
          );
        })}

      {sealed ? (
        <mesh geometry={URUK_GEO.bullaSealed()} material={sealedMaterial} position={[bx, by + R, bz]} rotation={[0, -roll, 0]} castShadow receiveShadow />
      ) : (
        <>
          <mesh geometry={URUK_GEO.bullaBowl()} material={shellMaterial} position={[bx, by + R, bz]} castShadow receiveShadow />
          <mesh geometry={URUK_GEO.bullaCap()} material={shellMaterial} position={capPos} rotation={[Math.PI * (1 - close), 0, 0]} castShadow receiveShadow />
        </>
      )}

      {/* cylinder seal: rolls around the ball, counter-rotating like a gear */}
      {sealIn > 0.001 && (
        <mesh
          geometry={URUK_GEO.seal()}
          material={matte("#5d5650", { flat: false })}
          position={[bx + R + SEAL_R + 0.0004, by + R + (1 - sealIn) * 0.04, bz]}
          rotation={[0, roll * (R / SEAL_R), 0]}
          castShadow
        />
      )}

      <Label3D position={[bx + 0.06, by + 0.05, bz + 0.02]} opacity={window01(time, 25.6, 26.3, 30.4, 31.0)} size="sm" hypothesis>
        Fichas de arcilla
      </Label3D>
      <Label3D position={[bx, by + 0.085, bz]} opacity={window01(time, 31.0, 31.6, 35.8, 36.6)} size="sm">
        Bulla sellada
      </Label3D>
    </group>
  );
}
