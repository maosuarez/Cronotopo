import { MeshDepthMaterial, MeshStandardMaterial, RGBADepthPacking, Vector2, type Material, type WebGLProgramParametersWithUniforms } from "three";
import { COL, S, STYLO } from "./layout";

/**
 * "Optical refinements" materials: every temple mesh is drawn through a vertex shader that bends world space
 * (curvature of the stylobate, rising towards the centre) and, for column drums, swells the shaft (entasis).
 * The same transform runs in the shadow depth pass so shadows follow the deformation.
 */
export type RefinementUniforms = {
  uBend: { value: Vector2 };
  uEntasis: { value: number };
};

export function createRefinementUniforms(): RefinementUniforms {
  return { uBend: { value: new Vector2(0, 0) }, uEntasis: { value: 0 } };
}

const header = /* glsl */ `
  uniform vec2 uBend;
  uniform float uEntasis;
`;

const projectVertex = /* glsl */ `
  vec4 mvPosition = vec4( transformed, 1.0 );
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif
  vec4 tw = modelMatrix * mvPosition;
  #ifdef TEMPLE_ENTASIS
    #ifdef USE_INSTANCING
      vec3 colAxis = ( modelMatrix * instanceMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
    #else
      vec3 colAxis = ( modelMatrix * vec4( 0.0, 0.0, 0.0, 1.0 ) ).xyz;
    #endif
    float cu = clamp( ( tw.y - ${S.toFixed(3)} ) / ${COL.shaft.toFixed(3)}, 0.0, 1.0 );
    float prof = 1.0 - ${COL.taper.toFixed(3)} * cu + uEntasis * sin( 3.14159265 * cu );
    tw.xz = colAxis.xz + ( tw.xz - colAxis.xz ) * prof;
  #endif
  vec2 bq = clamp( tw.xz / vec2( ${STYLO.halfX.toFixed(3)}, ${STYLO.halfZ.toFixed(3)} ), -1.0, 1.0 );
  float lift = smoothstep( 0.0, ${S.toFixed(3)}, tw.y );
  tw.y += lift * ( uBend.x * ( 1.0 - bq.x * bq.x ) + uBend.y * ( 1.0 - bq.y * bq.y ) );
  mvPosition = viewMatrix * tw;
  gl_Position = projectionMatrix * mvPosition;
`;

function patch(material: Material, uniforms: RefinementUniforms, entasis: boolean) {
  if (entasis) material.defines = { ...material.defines, TEMPLE_ENTASIS: "" };
  material.onBeforeCompile = (shader: WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uBend = uniforms.uBend;
    shader.uniforms.uEntasis = uniforms.uEntasis;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", `#include <common>\n${header}`)
      .replace("#include <project_vertex>", projectVertex)
      .replace("#include <worldpos_vertex>", "vec4 worldPosition = tw;");
  };
}

export type RefinedMaterial = { material: MeshStandardMaterial; depth: MeshDepthMaterial };

/** Matte flat-shaded material + matching shadow depth material, both deformed by the refinements. */
export function createRefinedMaterial(
  uniforms: RefinementUniforms,
  color: string,
  opts: { entasis?: boolean; flat?: boolean; roughness?: number } = {},
): RefinedMaterial {
  const material = new MeshStandardMaterial({ color, roughness: opts.roughness ?? 0.9, metalness: 0, flatShading: opts.flat ?? true });
  const depth = new MeshDepthMaterial({ depthPacking: RGBADepthPacking });
  patch(material, uniforms, opts.entasis ?? false);
  patch(depth, uniforms, opts.entasis ?? false);
  return { material, depth };
}

export function disposeRefined(set: Record<string, RefinedMaterial>) {
  Object.values(set).forEach(({ material, depth }) => {
    material.dispose();
    depth.dispose();
  });
}
