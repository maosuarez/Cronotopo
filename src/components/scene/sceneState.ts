import { create } from "zustand";
import type { CameraDriver } from "@/lib/choreography";
import { useAtlasStore } from "@/store/useAtlasStore";

/**
 * Scene-local state shared between scene components (not the UI).
 * - displayedEraId: the era whose markers/arcs are on screen. Follows the atlas store's
 *   activeEraId only when the director calls `swapEra`, so old data stays until it has animated out.
 * - textureLoaded: Earth texture (or its fallback) mounted. ready: additionally the first frame rendered.
 */
export const useSceneState = create<{
  displayedEraId: string;
  textureLoaded: boolean;
  ready: boolean;
  setDisplayedEraId: (id: string) => void;
  setTextureLoaded: (loaded: boolean) => void;
  setReady: (ready: boolean) => void;
}>()((set) => ({
  displayedEraId: useAtlasStore.getState().activeEraId,
  textureLoaded: false,
  ready: false,
  setDisplayedEraId: (displayedEraId) => set({ displayedEraId }),
  setTextureLoaded: (textureLoaded) => set({ textureLoaded }),
  setReady: (ready) => set({ ready }),
}));

/** Registry for the camera driver: CameraRig registers it, SceneDirector reads it. */
export const cameraDriverRef: { current: CameraDriver | null } = { current: null };
