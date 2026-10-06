import { MeshStandardMaterial, type IUniform } from "three";

/**
 * Clay relief material: a MeshStandardMaterial whose surface is carved by a procedural height field.
 *
 * The caller supplies GLSL for `float clayHeight(vec3 p, out float shade)` in OBJECT space (metres):
 * negative heights are grooves, positive are raised clay; `shade` (0..1) darkens the albedo (grooves catch
 * less light and hold moisture). The normal is bent with the height gradient (finite differences along the
 * surface tangents), so impressions read as real relief under raking light without displacing vertices.
 * Works for any shape (flat tablet, spherical bulla) because the tangent frame is built from the normal.
 */
export type ClayOptions = {
  /** Unique per height function: shares one compiled program between materials of the same kind. */
  key: string;
  heightGLSL: string;
  uniforms: Record<string, IUniform>;
  color: string;
  roughness: number;
};

const vertexHead = /* glsl */ `
  varying vec3 vClayPos;
  varying vec3 vClayNormal;
  varying vec3 vClayNM0;
  varying vec3 vClayNM1;
  varying vec3 vClayNM2;
`;

const vertexBody = /* glsl */ `
  vClayPos = transformed;
  vClayNormal = objectNormal;
  vClayNM0 = normalMatrix[0];
  vClayNM1 = normalMatrix[1];
  vClayNM2 = normalMatrix[2];
`;

const fragmentHead = /* glsl */ `
  varying vec3 vClayPos;
  varying vec3 vClayNormal;
  varying vec3 vClayNM0;
  varying vec3 vClayNM1;
  varying vec3 vClayNM2;
`;

// Evaluated right after the albedo is known: computes the bent object-space normal for later and darkens grooves.
const fragmentRelief = /* glsl */ `
  vec3 clayN = normalize(vClayNormal);
  {
    vec3 axis = abs(clayN.y) < 0.9 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 t1 = normalize(cross(axis, clayN));
    vec3 t2 = cross(clayN, t1);
    const float e = 0.00015;
    float shade;
    float shadeTmp;
    float h0 = clayHeight(vClayPos, shade);
    float h1 = clayHeight(vClayPos + t1 * e, shadeTmp);
    float h2 = clayHeight(vClayPos + t2 * e, shadeTmp);
    clayN = normalize(clayN - ((h1 - h0) / e) * t1 - ((h2 - h0) / e) * t2);
    diffuseColor.rgb *= 1.0 - 0.5 * clamp(shade, 0.0, 1.0);
  }
`;

export function createClayMaterial({ key, heightGLSL, uniforms, color, roughness }: ClayOptions): MeshStandardMaterial {
  const material = new MeshStandardMaterial({ color, roughness, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms);
    shader.vertexShader = vertexHead + shader.vertexShader.replace("#include <begin_vertex>", `#include <begin_vertex>\n${vertexBody}`);
    shader.fragmentShader =
      fragmentHead +
      heightGLSL +
      shader.fragmentShader
        .replace("#include <color_fragment>", `#include <color_fragment>\n${fragmentRelief}`)
        .replace(
          "#include <normal_fragment_maps>",
          "#include <normal_fragment_maps>\n  normal = normalize(mat3(vClayNM0, vClayNM1, vClayNM2) * clayN);",
        );
  };
  material.customProgramCacheKey = () => `uruk-clay-${key}`;
  return material;
}

/** Shared GLSL: signed distance to a tapered capsule (Inigo Quilez, "uneven capsule"), 2D. */
export const SD_TAPERED_CAPSULE = /* glsl */ `
  float clayCross(vec2 a, vec2 b) { return a.x * b.y - a.y * b.x; }
  float sdTaperedCapsule(vec2 p, vec2 pa, vec2 pb, float ra, float rb) {
    p -= pa;
    pb -= pa;
    float h = dot(pb, pb);
    float b = ra - rb;
    // Degenerate cases: a dot (same end points) or one end circle swallowing the other.
    if (h < 1e-12 || b * b >= h) return min(length(p) - ra, length(p - pb) - rb);
    vec2 q = vec2(dot(p, vec2(pb.y, -pb.x)), dot(p, pb)) / h;
    q.x = abs(q.x);
    vec2 c = vec2(sqrt(h - b * b), b);
    float k = clayCross(c, q);
    float m = dot(c, q);
    float n = dot(q, q);
    if (k < 0.0) return sqrt(h * n) - ra;
    if (k > c.x) return sqrt(h * (n + 1.0 - 2.0 * q.y)) - rb;
    return m - ra;
  }
`;
