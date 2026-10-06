import { create } from "zustand";
import { firstEra, getEra, getLocation } from "@/data/index";
import { getSceneLocation } from "@/scenes/registry";

/** Viewport rect (px) of the card that opened the player; the overlay expands from it. */
export type SceneOrigin = { x: number; y: number; width: number; height: number };

export type AtlasState = {
  activeEraId: string;
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
  isTransitioning: boolean;
  /** Era whose markers/arcs/content are on screen; follows activeEraId when the era-change timeline swaps. */
  displayedEraId: string;
  /** Earth texture loaded and first frame rendered. */
  sceneReady: boolean;
  /** Element whose scene player is open (`null` = closed). Always an element of `selectedLocationId`. */
  sceneElementId: string | null;
  sceneOrigin: SceneOrigin | null;
  /** Changing era always clears the selection. Unknown ids are ignored. */
  setEra: (eraId: string) => void;
  /** Selecting a location of another era also switches to that era. Unknown ids are ignored. */
  selectLocation: (locationId: string) => void;
  clearSelection: () => void;
  /**
   * Opens the player for an element with a registered scene. If its location is not the selected one,
   * that location (and era) is selected in the same update, so the invariant above always holds.
   * Ids without a scene are ignored.
   */
  openScene: (elementId: string, origin?: SceneOrigin | null) => void;
  closeScene: () => void;
  setHovered: (locationId: string | null) => void;
  setTransitioning: (value: boolean) => void;
  setDisplayedEra: (eraId: string) => void;
  setSceneReady: (value: boolean) => void;
};

export const useAtlasStore = create<AtlasState>()((set, get) => ({
  activeEraId: firstEra.id,
  selectedLocationId: null,
  hoveredLocationId: null,
  isTransitioning: false,
  displayedEraId: firstEra.id,
  sceneReady: false,
  sceneElementId: null,
  sceneOrigin: null,
  setEra: (eraId) => {
    if (!getEra(eraId)) return;
    if (get().activeEraId === eraId && get().selectedLocationId === null) return;
    set({ activeEraId: eraId, selectedLocationId: null, hoveredLocationId: null, sceneElementId: null });
  },
  selectLocation: (locationId) => {
    const found = getLocation(locationId);
    if (!found) return;
    if (locationId === get().selectedLocationId) return;
    set({ activeEraId: found.era.id, selectedLocationId: locationId, sceneElementId: null });
  },
  clearSelection: () => {
    if (get().selectedLocationId !== null) set({ selectedLocationId: null, sceneElementId: null });
  },
  openScene: (elementId, origin = null) => {
    const found = getSceneLocation(elementId);
    if (!found || get().sceneElementId === elementId) return;
    set({
      activeEraId: found.era.id,
      selectedLocationId: found.location.id,
      sceneElementId: elementId,
      sceneOrigin: origin,
    });
  },
  closeScene: () => {
    if (get().sceneElementId !== null) set({ sceneElementId: null });
  },
  setHovered: (locationId) => {
    if (get().hoveredLocationId !== locationId) set({ hoveredLocationId: locationId });
  },
  setTransitioning: (value) => {
    if (get().isTransitioning !== value) set({ isTransitioning: value });
  },
  setDisplayedEra: (eraId) => {
    if (get().displayedEraId !== eraId) set({ displayedEraId: eraId });
  },
  setSceneReady: (value) => {
    if (get().sceneReady !== value) set({ sceneReady: value });
  },
}));
