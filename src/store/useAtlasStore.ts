import { create } from "zustand";
import { firstEra, getEra, getLocation } from "@/data/index";

export type AtlasState = {
  activeEraId: string;
  selectedLocationId: string | null;
  hoveredLocationId: string | null;
  isTransitioning: boolean;
  /** Era whose markers/arcs/content are on screen; follows activeEraId when the era-change timeline swaps. */
  displayedEraId: string;
  /** Earth texture loaded and first frame rendered. */
  sceneReady: boolean;
  /** Changing era always clears the selection. Unknown ids are ignored. */
  setEra: (eraId: string) => void;
  /** Selecting a location of another era also switches to that era. Unknown ids are ignored. */
  selectLocation: (locationId: string) => void;
  clearSelection: () => void;
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
  setEra: (eraId) => {
    if (!getEra(eraId)) return;
    if (get().activeEraId === eraId && get().selectedLocationId === null) return;
    set({ activeEraId: eraId, selectedLocationId: null, hoveredLocationId: null });
  },
  selectLocation: (locationId) => {
    const found = getLocation(locationId);
    if (!found) return;
    set({ activeEraId: found.era.id, selectedLocationId: locationId });
  },
  clearSelection: () => {
    if (get().selectedLocationId !== null) set({ selectedLocationId: null });
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
