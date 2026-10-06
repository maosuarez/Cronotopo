import type { Vec3 } from "./math";

/** Polyline helpers for walkers, carts, boats and camera dollies. */
export function pathLength(path: readonly Vec3[]): number {
  let L = 0;
  for (let i = 1; i < path.length; i++) L += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]);
  return L;
}

/** Point and heading (radians around Y) at distance `d` along the path; `loop` wraps around. */
export function pointOnPath(path: readonly Vec3[], d: number, loop = false): { p: Vec3; heading: number } {
  const L = pathLength(path);
  let dist = loop ? ((d % L) + L) % L : Math.min(Math.max(d, 0), L);
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1];
    const b = path[i];
    const seg = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
    if (dist <= seg || i === path.length - 1) {
      const k = seg > 0 ? Math.min(1, dist / seg) : 0;
      return {
        p: [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k],
        heading: Math.atan2(b[0] - a[0], b[2] - a[2]),
      };
    }
    dist -= seg;
  }
  return { p: path[path.length - 1], heading: 0 };
}
