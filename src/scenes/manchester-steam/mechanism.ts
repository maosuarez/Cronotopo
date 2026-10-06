/**
 * Kinematics of the Watt rotative beam engine, as pure functions of scene time.
 * Engine lies in the XY plane (z = 0) of the engine-house set; floor at y = 0.
 *
 *   piston rod ↔ beam (pivot) ↔ connecting rod ↔ planet gear orbiting the sun gear ↔ flywheel shaft.
 * The planet gear is fixed to the rod, so with equal gears the sun (and flywheel) turns twice per orbit.
 */
export const ENGINE = {
  pivot: [0, 11] as const,
  /** Half-length of the beam. */
  arm: 4.5,
  shaft: [4.5, 3.6] as const,
  rSun: 0.55,
  rPlanet: 0.55,
  /** Connecting rod length: beam horizontal when the planet is level with the shaft. */
  rod: 7.4,
  /** Piston-rod length from beam end to piston. */
  pistonRod: 5,
  cylinderX: -4.5,
  cylinderBottom: 3.4,
  cylinderTop: 7.6,
  flywheelR: 3.1,
  governor: [8.4, 4.6] as const,
};

/** Orbit speed of the planet gear (rad/s) over time: matches the spinning wheel at the cut, steady, then speeding up for the governor. */
const OMEGA_KEYS: [number, number][] = [
  [0, 1.3],
  [14.5, 1.5],
  [24, 1.5],
  [28.5, 3.4],
  [44, 3.4],
];

/** Speed (rad/s) at `t`, piecewise linear. */
export function omegaAt(t: number): number {
  if (t <= OMEGA_KEYS[0][0]) return OMEGA_KEYS[0][1];
  for (let i = 1; i < OMEGA_KEYS.length; i++) {
    const [t1, w1] = OMEGA_KEYS[i];
    const [t0, w0] = OMEGA_KEYS[i - 1];
    if (t <= t1) return w0 + ((w1 - w0) * (t - t0)) / (t1 - t0);
  }
  return OMEGA_KEYS[OMEGA_KEYS.length - 1][1];
}

/** Orbit angle of the planet gear: exact integral of `omegaAt` (trapezoids), so it is seekable. */
export function orbitAngle(t: number): number {
  let theta = 0;
  for (let i = 1; i < OMEGA_KEYS.length; i++) {
    const [t0, w0] = OMEGA_KEYS[i - 1];
    const [t1] = OMEGA_KEYS[i];
    if (t <= t0) break;
    const end = Math.min(t, t1);
    theta += (w0 + omegaAt(end)) * 0.5 * (end - t0);
  }
  const [tl, wl] = OMEGA_KEYS[OMEGA_KEYS.length - 1];
  if (t > tl) theta += wl * (t - tl);
  // Start at the bottom of the orbit so the first move is visible.
  return theta - Math.PI / 2;
}

export type EnginePose = {
  theta: number;
  /** Beam angle (rad), positive = rod end up. */
  beam: number;
  planet: [number, number];
  /** Beam end above the connecting rod. */
  rodEnd: [number, number];
  /** Beam end above the piston rod. */
  pistonEnd: [number, number];
  pistonY: number;
  /** Flywheel / sun-gear rotation (rad). */
  flywheel: number;
  /** +1 piston moving up, -1 down. */
  stroke: number;
  /** 0..1 normalised engine speed. */
  speed: number;
};

function solveBeam(theta: number): { beam: number; planet: [number, number]; rodEnd: [number, number] } {
  const { pivot, arm, shaft, rSun, rPlanet, rod } = ENGINE;
  const r = rSun + rPlanet;
  const px = shaft[0] + r * Math.cos(theta);
  const py = shaft[1] + r * Math.sin(theta);
  // Intersection of circle(pivot, arm) and circle(planet, rod); take the right-hand solution.
  const dx = px - pivot[0];
  const dy = py - pivot[1];
  const d = Math.hypot(dx, dy);
  const a = (arm * arm - rod * rod + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, arm * arm - a * a));
  const bx = pivot[0] + (a * dx) / d;
  const by = pivot[1] + (a * dy) / d;
  const ex1 = bx + (h * -dy) / d;
  const ey1 = by + (h * dx) / d;
  const ex2 = bx - (h * -dy) / d;
  const ey2 = by - (h * dx) / d;
  const [ex, ey] = ex1 > ex2 ? [ex1, ey1] : [ex2, ey2];
  return { beam: Math.atan2(ey - pivot[1], ex - pivot[0]), planet: [px, py], rodEnd: [ex, ey] };
}

export function enginePose(t: number): EnginePose {
  const theta = orbitAngle(t);
  const { beam, planet, rodEnd } = solveBeam(theta);
  const { pivot, arm, pistonRod } = ENGINE;
  const pistonEnd: [number, number] = [pivot[0] - arm * Math.cos(beam), pivot[1] - arm * Math.sin(beam)];
  const next = solveBeam(orbitAngle(t + 0.02)).beam;
  return {
    theta,
    beam,
    planet,
    rodEnd,
    pistonEnd,
    pistonY: pistonEnd[1] - pistonRod,
    flywheel: 2 * theta,
    // Piston end goes up when the beam angle decreases.
    stroke: next < beam ? 1 : -1,
    speed: omegaAt(t) / 3.4,
  };
}
