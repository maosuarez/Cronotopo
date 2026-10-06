"use client";

import { getEra } from "@/data/index";
import { Marker } from "./Marker";
import { useSceneState } from "./sceneState";

export function LocationMarkers() {
  const era = getEra(useSceneState((s) => s.displayedEraId));
  if (!era) return null;
  return (
    <>
      {era.locations.map((location, i) => (
        <Marker key={location.id} location={location} index={i} />
      ))}
    </>
  );
}
