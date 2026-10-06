/**
 * Scene-owned materials. They all share one clipping plane (the cutaway "knife") so the south part of the diorama
 * can be removed for the section shots; when unused the plane is parked far away (no shader recompiles).
 * Created per mount and disposed by the scene (see `useSceneMaterials`).
 */
import { AdditiveBlending, Color, DoubleSide, MeshBasicMaterial, MeshStandardMaterial, Plane, Vector3, type WebGLProgramParametersWithUniforms } from "three";
import { LEVEL } from "./world";

export const NOISE_GLSL = /* glsl */ `
  float pvHash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  vec2 pvHash2(vec2 p) { return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453); }
  float pvNoise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(pvHash(i), pvHash(i + vec2(1.0, 0.0)), u.x), mix(pvHash(i + vec2(0.0, 1.0)), pvHash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float pvFbm(vec2 p) {
    float s = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { s += a * pvNoise(p); p = p * 2.03 + 17.1; a *= 0.5; }
    return s;
  }
`;

type Uniforms = Record<string, { value: unknown }>;

/** Adds `vPvWorld` (world position) and `vPvNormal` (world normal) varyings to a standard material. */
function withWorld(shader: WebGLProgramParametersWithUniforms, uniforms: Uniforms, fragHead: string, fragBody: string, vertHead = "", vertBody = "") {
  Object.assign(shader.uniforms, uniforms);
  shader.vertexShader = shader.vertexShader
    .replace("#include <common>", `#include <common>\nvarying vec3 vPvWorld;\nvarying vec3 vPvNormal;\n${vertHead}`)
    .replace(
      "#include <project_vertex>",
      `${vertBody}
      {
        vec4 pvW = vec4(transformed, 1.0);
        vec3 pvN = objectNormal;
        #ifdef USE_INSTANCING
          pvW = instanceMatrix * pvW;
          pvN = mat3(instanceMatrix) * pvN;
        #endif
        pvW = modelMatrix * pvW;
        vPvWorld = pvW.xyz;
        vPvNormal = normalize(mat3(modelMatrix) * pvN);
      }
      #include <project_vertex>`,
    );
  shader.fragmentShader = shader.fragmentShader
    .replace("#include <common>", `#include <common>\nvarying vec3 vPvWorld;\nvarying vec3 vPvNormal;\n${NOISE_GLSL}\n${fragHead}`)
    .replace("#include <color_fragment>", `#include <color_fragment>\n${fragBody}`);
}

export type SceneMaterials = ReturnType<typeof createSceneMaterials>;

export function createSceneMaterials() {
  const cut = new Plane(new Vector3(0, 0, -1), 1e6);
  const clippingPlanes = [cut];
  const std = (opts: ConstructorParameters<typeof MeshStandardMaterial>[0] = {}) =>
    new MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true, clippingPlanes, ...opts });

  /** Countryside & volcano: vertex colours, greyed by ash, regrowing later. */
  /** Deposit surface colour, shared by the deposit boxes and the flooded countryside. */
  const topUniforms = { uTopA: { value: new Color("#d9d1bf") }, uTopB: { value: new Color("#8a837a") }, uTopMix: { value: 0 } };
  const landUniforms = {
    ...topUniforms,
    uAsh: { value: 0 },
    uAshColor: { value: new Color("#8f887e") },
    uLevel: { value: -100 },
    // no lifting inside this rect (x0, x1, z0, z1): the deposit boxes own the city area
    uNoLift: { value: [-103, 103, -88, 88] },
  };
  const landVertHead = "uniform float uLevel; uniform vec4 uNoLift; varying float vLifted;";
  // The deposit floods the low ground: vertices below the current level are raised to it (not over the sea).
  const landVertBody = /* glsl */ `
    vLifted = 0.0;
    {
      vec4 lw = modelMatrix * vec4(transformed, 1.0);
      bool inBox = lw.x > uNoLift.x && lw.x < uNoLift.y && lw.z > uNoLift.z && lw.z < uNoLift.w;
      float coastV = lw.x + 0.55 * lw.z + 260.0;
      if (!inBox && coastV > 12.0 && lw.y < uLevel) { transformed.y += uLevel - lw.y; vLifted = 1.0; }
    }
  `;
  const landFrag = /* glsl */ `
    float ashN = pvFbm(vPvWorld.xz * 0.05);
    vec3 ashCol = uAshColor * (0.82 + 0.36 * ashN);
    float slope = 1.0 - clamp(vPvNormal.y, 0.0, 1.0);
    diffuseColor.rgb = mix(diffuseColor.rgb, ashCol, uAsh * (1.0 - 0.35 * slope));
    vec3 depTop = mix(uTopA, uTopB, uTopMix) * (0.86 + 0.28 * pvFbm(vPvWorld.xz * 0.6));
    diffuseColor.rgb = mix(diffuseColor.rgb, depTop, smoothstep(0.98, 1.0, vLifted));
  `;
  const makeLand = () => {
    const m = std({ vertexColors: true });
    m.onBeforeCompile = (s) =>
      withWorld(s, landUniforms, "uniform float uAsh; uniform vec3 uAshColor; uniform vec3 uTopA; uniform vec3 uTopB; uniform float uTopMix; varying float vLifted;", landFrag, landVertHead, landVertBody);
    return m;
  };
  const land = makeLand();
  const volcano = makeLand();

  /** Basalt paving: polygonal stones from a Voronoi pattern in world space. */
  const road = std({ color: "#6a645d" });
  road.onBeforeCompile = (s) =>
    withWorld(
      s,
      {},
      "",
      /* glsl */ `
      vec2 rp = vPvWorld.xz * 1.15;
      vec2 ip = floor(rp); vec2 fp = fract(rp);
      float d1 = 8.0; float d2 = 8.0; vec2 cell = vec2(0.0);
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 r = g + pvHash2(ip + g) * 0.85 - fp;
        float d = dot(r, r);
        if (d < d1) { d2 = d1; d1 = d; cell = ip + g; } else if (d < d2) { d2 = d; }
      }
      float edge = sqrt(d2) - sqrt(d1);
      float joint = 1.0 - smoothstep(0.03, 0.11, edge);
      diffuseColor.rgb *= (0.78 + 0.34 * pvHash(cell)) * (1.0 - 0.55 * joint);
    `,
    );

  /** Volcanic deposit: horizontal tops take the surface colour, cut faces show the strata by height. */
  const strataUniforms = {
    ...topUniforms,
    uPumice: { value: LEVEL.pumice },
    uFlow: { value: LEVEL.flow },
  };
  const strata = std({ color: "#ffffff" });
  strata.onBeforeCompile = (s) =>
    withWorld(
      s,
      strataUniforms,
      "uniform vec3 uTopA; uniform vec3 uTopB; uniform float uTopMix; uniform float uPumice; uniform float uFlow;",
      /* glsl */ `
      float y = vPvWorld.y;
      float grain = pvNoise(vPvWorld.xz * 6.0 + y * 9.0);
      float along = vPvWorld.x + vPvWorld.z;
      float wav = 0.08 * sin(along * 0.35) + 0.05 * sin(along * 1.1);
      vec3 c;
      if (y < -5.5 + wav) c = vec3(0.30, 0.28, 0.27);
      else if (y < 0.0) c = mix(vec3(0.36, 0.24, 0.15), vec3(0.47, 0.33, 0.21), smoothstep(-5.5, 0.0, y));
      else if (y < uPumice + wav) {
        c = vec3(0.86, 0.82, 0.74) * (0.9 + 0.12 * step(0.5, fract(y * 3.1 + grain * 0.3)));
        c *= 0.92 + 0.16 * pvHash(floor(vPvWorld.xz * 9.0 + y * 13.0));
      } else if (y < uFlow + wav) {
        float lines = smoothstep(0.06, 0.0, abs(fract((y - uPumice) / (uFlow - uPumice) * 4.0) - 0.5) - 0.44);
        c = mix(vec3(0.53, 0.50, 0.46), vec3(0.42, 0.39, 0.36), smoothstep(uPumice, uFlow, y));
        c = mix(c, vec3(0.25, 0.23, 0.21), lines * 0.8);
      } else c = mix(vec3(0.35, 0.26, 0.18), vec3(0.24, 0.18, 0.12), smoothstep(uFlow, uFlow + 1.0, y));
      c *= 0.94 + 0.12 * grain;
      vec3 top = mix(uTopA, uTopB, uTopMix) * (0.86 + 0.28 * pvFbm(vPvWorld.xz * 0.6));
      diffuseColor.rgb = vPvNormal.y > 0.6 ? top : c;
    `,
    );

  return {
    cut,
    land,
    landUniforms,
    volcano,
    road,
    strata,
    strataUniforms,
    /** White, tinted per instance. */
    plaster: std(),
    stone: std(),
    roof: std({ side: DoubleSide }),
    lava: std({ color: "#5c5753" }),
    sea: new MeshStandardMaterial({ color: "#3d7c8a", roughness: 0.32, metalness: 0.05, clippingPlanes }),
    oven: new MeshBasicMaterial({ color: "#ffb15a", toneMapped: false, clippingPlanes }),
    glow: new MeshBasicMaterial({ color: "#ff8a3a", toneMapped: false, transparent: true, opacity: 0.55, depthWrite: false, blending: AdditiveBlending }),
    dispose() {
      for (const m of [this.land, this.volcano, this.road, this.strata, this.plaster, this.stone, this.roof, this.lava, this.sea, this.oven, this.glow]) m.dispose();
    },
  };
}
