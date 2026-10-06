import { Vector3 } from "three";

export const GLOBE_RADIUS = 1;

const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;
const EPSILON = 1e-9;

export type LatLon = { lat: number; lon: number };

/**
 * Matches a standard equirectangular texture on THREE.SphereGeometry
 * (u = 0 at lon -180). Therefore (lat 0, lon 0) maps to world +X (1, 0, 0),
 * lon +90 maps to -Z, lon -90 maps to +Z, north pole to +Y.
 */
export function latLonToVector3(lat: number, lon: number, radius = GLOBE_RADIUS, target = new Vector3()): Vector3 {
  const phi = (90 - lat) * DEG2RAD;
  const theta = (lon + 180) * DEG2RAD;
  return target.set(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

export function vector3ToLatLon(v: Vector3): LatLon {
  const n = v.clone().normalize();
  const lat = Math.asin(Math.max(-1, Math.min(1, n.y))) * RAD2DEG;
  let lon = Math.atan2(n.z, -n.x) * RAD2DEG - 180;
  if (lon < -180) lon += 360;
  return { lat, lon };
}

/** A unit vector perpendicular to the given one (stable choice). */
export function anyPerpendicular(v: Vector3): Vector3 {
  const helper = Math.abs(v.x) < 0.9 ? new Vector3(1, 0, 0) : new Vector3(0, 1, 0);
  return new Vector3().crossVectors(v, helper).normalize();
}

export function angleBetweenUnit(a: Vector3, b: Vector3): number {
  return Math.acos(Math.max(-1, Math.min(1, a.dot(b))));
}

/** Spherical interpolation between unit vectors; safe for identical and antipodal inputs. */
export function slerpUnit(a: Vector3, b: Vector3, t: number): Vector3 {
  const angle = angleBetweenUnit(a, b);
  if (angle < EPSILON) return a.clone();
  const axis = new Vector3().crossVectors(a, b);
  if (axis.length() < EPSILON) axis.copy(anyPerpendicular(a));
  else axis.normalize();
  return a.clone().applyAxisAngle(axis, angle * t).normalize();
}

export function greatCirclePoints(
  a: LatLon,
  b: LatLon,
  segments = 64,
  radius = GLOBE_RADIUS,
  altitude = 0,
): Vector3[] {
  const from = latLonToVector3(a.lat, a.lon, 1);
  const to = latLonToVector3(b.lat, b.lon, 1);
  const points: Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const r = radius + altitude * Math.sin(Math.PI * t);
    points.push(slerpUnit(from, to, t).multiplyScalar(r));
  }
  return points;
}

/** Positive = point is on the hemisphere visible from the camera, negative = hidden side. */
const scratchNormal = new Vector3();
const scratchToCamera = new Vector3();
export function isFacingCamera(point: Vector3, cameraPosition: Vector3): number {
  scratchNormal.copy(point).normalize();
  scratchToCamera.copy(cameraPosition).sub(point).normalize();
  return scratchNormal.dot(scratchToCamera);
}

/** Smooth 0..1 opacity: 1 when dot >= fadeStart, 0 when dot <= fadeEnd. */
export function facingOpacity(dot: number, fadeStart = 0.15, fadeEnd = -0.05): number {
  const t = Math.max(0, Math.min(1, (dot - fadeEnd) / (fadeStart - fadeEnd)));
  return t * t * (3 - 2 * t);
}

export function centroidDirection(points: LatLon[]): Vector3 {
  if (points.length === 0) throw new RangeError("centroidDirection requires at least one point");
  const sum = new Vector3();
  for (const p of points) sum.add(latLonToVector3(p.lat, p.lon, 1));
  if (sum.length() < 1e-6) return latLonToVector3(points[0].lat, points[0].lon, 1);
  return sum.normalize();
}
