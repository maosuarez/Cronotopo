import { Color } from "three";
import { lerp, lerp3, type Vec3 } from "./math";

/** Light + sky + fog for one time of day. Scenes may blend two presets over time with `mixLight`. */
export type LightPreset = {
  skyTop: string;
  skyHorizon: string;
  skyGround: string;
  /** Direction TO the sun (normalised by consumers). */
  sunDir: Vec3;
  sunColor: string;
  sunIntensity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  fogColor: string;
  fogNear: number;
  fogFar: number;
  /** Disc/glow strength of the sun in the sky dome (0 = hidden, e.g. overcast or interior). */
  sunGlow: number;
};

export const LIGHT = {
  /** Mesopotamian morning haze. */
  haze: {
    skyTop: "#7fa7c9", skyHorizon: "#e9d8b8", skyGround: "#b89a72",
    sunDir: [0.6, 0.45, 0.4], sunColor: "#ffe2b0", sunIntensity: 2.6,
    hemiSky: "#cfdcea", hemiGround: "#9c7a52", hemiIntensity: 0.9,
    fogColor: "#e3d2b2", fogNear: 40, fogFar: 160, sunGlow: 0.6,
  },
  /** Zenith sun (Giza). */
  noon: {
    skyTop: "#3f7fc4", skyHorizon: "#cfe0ec", skyGround: "#c9a874",
    sunDir: [0.25, 1, 0.2], sunColor: "#fff3dc", sunIntensity: 3.2,
    hemiSky: "#d6e6f5", hemiGround: "#c8a472", hemiIntensity: 1.0,
    fogColor: "#e6e1cf", fogNear: 60, fogFar: 240, sunGlow: 0.5,
  },
  /** Late afternoon gold (Athens). */
  golden: {
    skyTop: "#5f7fb0", skyHorizon: "#f3c98d", skyGround: "#9c7d5c",
    sunDir: [-0.8, 0.35, 0.3], sunColor: "#ffcf8a", sunIntensity: 2.8,
    hemiSky: "#e9d6bd", hemiGround: "#80664c", hemiIntensity: 0.75,
    fogColor: "#f0cfa0", fogNear: 50, fogFar: 200, sunGlow: 0.9,
  },
  /** Sunset / dusk. */
  dusk: {
    skyTop: "#2f3f6e", skyHorizon: "#e88a5a", skyGround: "#5a4636",
    sunDir: [-0.9, 0.12, 0.25], sunColor: "#ff9a5c", sunIntensity: 2.0,
    hemiSky: "#a8a0c8", hemiGround: "#5a4232", hemiIntensity: 0.6,
    fogColor: "#c98a6a", fogNear: 40, fogFar: 170, sunGlow: 1.0,
  },
  /** Soot-grey industrial sky (Manchester). */
  soot: {
    skyTop: "#6c6d70", skyHorizon: "#a49d92", skyGround: "#4a4440",
    sunDir: [0.3, 0.6, 0.5], sunColor: "#e6dccb", sunIntensity: 1.4,
    hemiSky: "#b3aea6", hemiGround: "#4b4540", hemiIntensity: 1.0,
    fogColor: "#8d877f", fogNear: 20, fogFar: 120, sunGlow: 0.1,
  },
  /** Workshop at night lit by candles (Mainz). Pair with `<CandleLight>` points. */
  candle: {
    skyTop: "#14110e", skyHorizon: "#2a2018", skyGround: "#1a140f",
    sunDir: [0.2, 0.8, 0.4], sunColor: "#ffb36b", sunIntensity: 0.35,
    hemiSky: "#5a4632", hemiGround: "#1f1810", hemiIntensity: 0.35,
    fogColor: "#1e1812", fogNear: 12, fogFar: 45, sunGlow: 0,
  },
  /** Ash-darkened day (Pompeii during the eruption). */
  ash: {
    skyTop: "#2c2522", skyHorizon: "#5e4a3e", skyGround: "#2a2420",
    sunDir: [0.4, 0.5, 0.2], sunColor: "#c9875a", sunIntensity: 0.7,
    hemiSky: "#6d5a4e", hemiGround: "#2a221d", hemiIntensity: 0.55,
    fogColor: "#4d4038", fogNear: 10, fogFar: 90, sunGlow: 0.15,
  },
} satisfies Record<string, LightPreset>;

const tmpA = new Color();
const tmpB = new Color();
const mixHex = (a: string, b: string, t: number) => `#${tmpA.set(a).lerp(tmpB.set(b), t).getHexString()}`;

/** Interpolates two presets (t = 0 → a, 1 → b). */
export function mixLight(a: LightPreset, b: LightPreset, t: number): LightPreset {
  if (t <= 0) return a;
  if (t >= 1) return b;
  return {
    skyTop: mixHex(a.skyTop, b.skyTop, t),
    skyHorizon: mixHex(a.skyHorizon, b.skyHorizon, t),
    skyGround: mixHex(a.skyGround, b.skyGround, t),
    sunDir: lerp3(a.sunDir, b.sunDir, t),
    sunColor: mixHex(a.sunColor, b.sunColor, t),
    sunIntensity: lerp(a.sunIntensity, b.sunIntensity, t),
    hemiSky: mixHex(a.hemiSky, b.hemiSky, t),
    hemiGround: mixHex(a.hemiGround, b.hemiGround, t),
    hemiIntensity: lerp(a.hemiIntensity, b.hemiIntensity, t),
    fogColor: mixHex(a.fogColor, b.fogColor, t),
    fogNear: lerp(a.fogNear, b.fogNear, t),
    fogFar: lerp(a.fogFar, b.fogFar, t),
    sunGlow: lerp(a.sunGlow, b.sunGlow, t),
  };
}
