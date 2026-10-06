import { AdditiveBlending, DoubleSide, FrontSide, MeshBasicMaterial, MeshStandardMaterial, type Material, type Texture } from "three";

/**
 * Scene-local materials that the kit `matte()` can't express (metal sheen, textures, additive glow).
 * Created lazily, shared by every component of the scene and freed by `disposeMainzMaterials()` on unmount.
 */
const cache = new Map<string, Material>();

function get<T extends Material>(key: string, make: () => T): T {
  let m = cache.get(key);
  if (!m) {
    m = make();
    cache.set(key, m);
  }
  return m as T;
}

/** Cast type metal (lead–tin–antimony): light grey with a soft sheen. */
export const leadMat = () => get("lead", () => new MeshStandardMaterial({ color: "#a3a7ad", metalness: 0.35, roughness: 0.38 }));
export const ironMat = () => get("iron", () => new MeshStandardMaterial({ color: "#45474c", metalness: 0.4, roughness: 0.5 }));
export const paperMat = () => get("paper", () => new MeshStandardMaterial({ color: "#efe4c8", roughness: 0.95, side: DoubleSide }));
/** Additive glow (instance colours tint it; black = invisible). */
export const glowMat = (map?: Texture) =>
  get(`glow|${map?.uuid ?? ""}`, () => new MeshBasicMaterial({ map: map ?? null, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false }));
export const emissiveMat = (color: string) => get(`emit|${color}`, () => new MeshBasicMaterial({ color, toneMapped: false }));
/** Textured material (one per texture). */
export const texturedMat = (map: Texture, opts: { roughness?: number; metalness?: number; double?: boolean } = {}) =>
  get(
    `tex|${map.uuid}|${opts.roughness ?? 0.9}|${opts.metalness ?? 0}|${opts.double ?? false}`,
    () => new MeshStandardMaterial({ map, roughness: opts.roughness ?? 0.9, metalness: opts.metalness ?? 0, side: opts.double ? DoubleSide : FrontSide }),
  );

export function disposeMainzMaterials() {
  cache.forEach((m) => m.dispose());
  cache.clear();
}
