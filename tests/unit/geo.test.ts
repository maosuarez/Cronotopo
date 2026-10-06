import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import {
  centroidDirection,
  facingOpacity,
  greatCirclePoints,
  isFacingCamera,
  latLonToVector3,
  vector3ToLatLon,
} from "@/lib/geo";

const close = (v: Vector3, x: number, y: number, z: number) => {
  expect(v.x).toBeCloseTo(x, 6);
  expect(v.y).toBeCloseTo(y, 6);
  expect(v.z).toBeCloseTo(z, 6);
};

describe("latLonToVector3", () => {
  it("maps (0,0) to +X", () => close(latLonToVector3(0, 0), 1, 0, 0));
  it("maps lon 90 to -Z and lon -90 to +Z", () => {
    close(latLonToVector3(0, 90), 0, 0, -1);
    close(latLonToVector3(0, -90), 0, 0, 1);
  });
  it("maps poles", () => {
    close(latLonToVector3(90, 33), 0, 1, 0);
    close(latLonToVector3(-90, -120), 0, -1, 0);
  });
  it("antimeridian is the same point", () => {
    const a = latLonToVector3(20, 180);
    const b = latLonToVector3(20, -180);
    close(a, b.x, b.y, b.z);
  });
  it("round-trips through vector3ToLatLon", () => {
    const { lat, lon } = vector3ToLatLon(latLonToVector3(41.9, 12.5));
    expect(lat).toBeCloseTo(41.9, 6);
    expect(lon).toBeCloseTo(12.5, 6);
    expect(vector3ToLatLon(latLonToVector3(-33, -70)).lon).toBeCloseTo(-70, 6);
  });
});

describe("greatCirclePoints", () => {
  const a = { lat: 40, lon: -3 };
  const b = { lat: -33, lon: 151 };
  it("stays on the sphere with altitude 0 and matches endpoints", () => {
    const pts = greatCirclePoints(a, b, 32, 1.5);
    pts.forEach((p) => expect(Math.abs(p.length() - 1.5)).toBeLessThan(1e-6));
    const start = latLonToVector3(a.lat, a.lon, 1.5);
    const end = latLonToVector3(b.lat, b.lon, 1.5);
    expect(pts[0].distanceTo(start)).toBeLessThan(1e-6);
    expect(pts[pts.length - 1].distanceTo(end)).toBeLessThan(1e-6);
  });
  it("lifts the midpoint by altitude", () => {
    const pts = greatCirclePoints(a, b, 64, 1, 0.3);
    expect(pts[32].length()).toBeCloseTo(1.3, 6);
  });
  it("handles identical and antipodal points without NaN", () => {
    for (const pts of [greatCirclePoints(a, a), greatCirclePoints({ lat: 0, lon: 0 }, { lat: 0, lon: 180 })]) {
      pts.forEach((p) => expect(Number.isFinite(p.length())).toBe(true));
    }
  });
});

describe("facing", () => {
  const camera = new Vector3(3, 0, 0);
  it("front is positive, back is negative", () => {
    expect(isFacingCamera(new Vector3(1, 0, 0), camera)).toBeGreaterThan(0.99);
    expect(isFacingCamera(new Vector3(-1, 0, 0), camera)).toBeLessThan(-0.99);
  });
  it("opacity fades smoothly within [0,1]", () => {
    expect(facingOpacity(1)).toBe(1);
    expect(facingOpacity(-1)).toBe(0);
    const mid = facingOpacity(0.05);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });
});

describe("centroidDirection", () => {
  it("returns a unit vector between points", () => {
    const c = centroidDirection([{ lat: 0, lon: -10 }, { lat: 0, lon: 10 }]);
    close(c, 1, 0, 0);
  });
  it("falls back to first point when degenerate", () => {
    const c = centroidDirection([{ lat: 0, lon: 0 }, { lat: 0, lon: 180 }]);
    close(c, 1, 0, 0);
  });
});
