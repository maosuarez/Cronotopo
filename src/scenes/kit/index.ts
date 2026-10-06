/**
 * Scene kit: shared primitives for every historical scene. Everything is deterministic (pure function of `time`).
 *  - prng / noise / math / path: seeded randomness, value noise, easing, keyframe tracks, polylines
 *  - timeline: paused GSAP timeline driven by seek(time)
 *  - camera: documentary camera paths (keyframes → pose)
 *  - lighting + Environment: time-of-day presets (haze, noon, golden, dusk, soot, candle, ash), sky dome, fog, sun
 *  - Diorama: tone mapping, shadows, post-processing per quality
 *  - Terrain, Water, Vegetation (+scatter), Architecture (Block, Steps, Town, Column)
 *  - Figure (posed faceless people), Crowd (instanced walkers), Particles (smoke, ash, dust, sparks, steam, eruption)
 *  - Didactic: Label3D (DOM label, project fonts), Arrow
 *  - palette / geometry: shared colours, cached low-poly geometries and matte materials
 */
export * from "./prng";
export * from "./noise";
export * from "./math";
export * from "./path";
export * from "./timeline";
export * from "./camera";
export * from "./lighting";
export * from "./palette";
export * from "./geometry";
export { Environment, CandleLight } from "./Environment";
export { Diorama } from "./Diorama";
export { Terrain, makeHeightFn, type HeightFn, type TerrainOptions } from "./Terrain";
export { Water } from "./Water";
export { Instances, type InstanceSpec } from "./Instanced";
export { Vegetation, scatter, type PlantKind, type ScatterArea } from "./Vegetation";
export { Figure, type Pose, type Outfit, type Headwear } from "./Figure";
export { Crowd, crowdOnPath, type CrowdAgent } from "./Crowd";
export { Particles, PARTICLES, type ParticlePreset } from "./Particles";
export { Label3D, Arrow } from "./Didactic";
export { Block, Steps, Town, Column } from "./Architecture";
