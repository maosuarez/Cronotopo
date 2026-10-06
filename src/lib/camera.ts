import { Vector3 } from "three";
import { angleBetweenUnit, centroidDirection, latLonToVector3, slerpUnit, type LatLon } from "./geo";

export type CameraPose = { direction: Vector3; distance: number };

export function poseFromPosition(position: Vector3): CameraPose {
  return { direction: position.clone().normalize(), distance: position.length() };
}

export function positionFromPose(pose: CameraPose, target = new Vector3()): Vector3 {
  return target.copy(pose.direction).multiplyScalar(pose.distance);
}

/** Slerps direction, lerps distance, and pulls back by arcLift on long trips. */
export function interpolatePose(
  from: CameraPose,
  to: CameraPose,
  t: number,
  opts: { arcLift?: number } = {},
): CameraPose {
  const { arcLift = 0.6 } = opts;
  const angleFactor = angleBetweenUnit(from.direction, to.direction) / Math.PI;
  const lift = arcLift * Math.sin(Math.PI * t) * angleFactor;
  return {
    direction: slerpUnit(from.direction, to.direction, t),
    distance: from.distance + (to.distance - from.distance) * t + lift,
  };
}

export function flightDuration(
  from: CameraPose,
  to: CameraPose,
  { min = 1.6, max = 2.2 }: { min?: number; max?: number } = {},
): number {
  const angleFactor = angleBetweenUnit(from.direction, to.direction) / Math.PI;
  return min + (max - min) * angleFactor;
}

export function eraFramingPose(
  coords: LatLon[],
  {
    baseDistance = 1.45,
    spreadFactor = 2.4,
    minDistance = 1.6,
    maxDistance = 4,
  }: { baseDistance?: number; spreadFactor?: number; minDistance?: number; maxDistance?: number } = {},
): CameraPose {
  const direction = centroidDirection(coords);
  const spread = Math.max(
    0,
    ...coords.map((c) => angleBetweenUnit(direction, latLonToVector3(c.lat, c.lon, 1))),
  );
  const distance = Math.min(maxDistance, Math.max(minDistance, baseDistance + spread * spreadFactor));
  return { direction, distance };
}

export function locationFocusPose(coord: LatLon, { distance = 1.75 }: { distance?: number } = {}): CameraPose {
  return { direction: latLonToVector3(coord.lat, coord.lon, 1), distance };
}
