import { create } from "zustand";
import type { CameraDriver } from "@/lib/choreography";

/** Scene-internal state. Anything the UI needs lives in useAtlasStore. */
export const useSceneState = create<{
  textureLoaded: boolean;
  setTextureLoaded: (loaded: boolean) => void;
}>()((set) => ({
  textureLoaded: false,
  setTextureLoaded: (textureLoaded) => set({ textureLoaded }),
}));

/** Registry for the camera driver: CameraRig registers it, SceneDirector reads it. */
export const cameraDriverRef: { current: CameraDriver | null } = { current: null };
