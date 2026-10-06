import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import {
  eraFramingPose,
  flightDuration,
  interpolatePose,
  locationFocusPose,
  poseFromPosition,
  positionFromPose,
  type CameraPose,
} from "@/lib/camera";

const a: CameraPose = { direction: new Vector3(1, 0, 0), distance: 2.8 };
const b: CameraPose = { direction: new Vector3(-1, 0, 0), distance: 2.8 };

describe("poses", () => {
  it("round-trips position", () => {
    const p = new Vector3(1, 2, 3);
    expect(positionFromPose(poseFromPosition(p)).distanceTo(p)).toBeLessThan(1e-9);
  });
});

describe("interpolatePose", () => {
  it("returns endpoints at t=0 and t=1", () => {
    const s = interpolatePose(a, b, 0);
    const e = interpolatePose(a, b, 1);
    expect(s.direction.distanceTo(a.direction)).toBeLessThan(1e-9);
    expect(s.distance).toBeCloseTo(a.distance, 9);
    expect(e.direction.distanceTo(b.direction)).toBeLessThan(1e-9);
    expect(e.distance).toBeCloseTo(b.distance, 9);
  });
  it("never enters the globe on an antipodal trip", () => {
    for (let i = 0; i <= 100; i++) {
      const p = interpolatePose(a, b, i / 100);
      expect(p.direction.length()).toBeCloseTo(1, 9);
      expect(positionFromPose(p).length()).toBeGreaterThan(1.05);
    }
  });
  it("is stable for identical directions", () => {
    const p = interpolatePose(a, a, 0.5);
    expect(p.direction.distanceTo(a.direction)).toBeLessThan(1e-9);
    expect(p.distance).toBeCloseTo(2.8, 9);
  });
  it("arcLift increases mid-flight distance for long trips only", () => {
    const flat = interpolatePose(a, b, 0.5, { arcLift: 0 }).distance;
    const lifted = interpolatePose(a, b, 0.5, { arcLift: 1 }).distance;
    expect(lifted).toBeGreaterThan(flat);
    const near: CameraPose = { direction: new Vector3(1, 0.01, 0).normalize(), distance: 2.8 };
    expect(interpolatePose(a, near, 0.5, { arcLift: 1 }).distance - 2.8).toBeLessThan(0.01);
  });
});

describe("flightDuration", () => {
  it("scales within [min, max]", () => {
    expect(flightDuration(a, a)).toBeCloseTo(1.6, 9);
    expect(flightDuration(a, b)).toBeCloseTo(2.2, 9);
  });
});

describe("framing", () => {
  it("eraFramingPose clamps distance and grows with spread", () => {
    const tight = eraFramingPose([{ lat: 0, lon: 0 }, { lat: 1, lon: 1 }, { lat: 2, lon: 0 }]);
    const wide = eraFramingPose([{ lat: 0, lon: -80 }, { lat: 0, lon: 80 }, { lat: 40, lon: 0 }]);
    expect(wide.distance).toBeGreaterThan(tight.distance);
    expect(tight.distance).toBeGreaterThanOrEqual(1.6);
    expect(wide.distance).toBeLessThanOrEqual(4);
  });
  it("locationFocusPose uses default distance", () => {
    const p = locationFocusPose({ lat: 0, lon: 0 });
    expect(p.distance).toBe(1.75);
    expect(p.direction.distanceTo(new Vector3(1, 0, 0))).toBeLessThan(1e-9);
  });
});
