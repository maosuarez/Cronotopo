"use client";

import { getEra } from "@/data/index";
import { Marker } from "./Marker";
import { useAtlasStore } from "@/store/useAtlasStore";

export function LocationMarkers() {
  const era = getEra(useAtlasStore((s) => s.displayedEraId));
  if (!era) return null;
  return (
    <>
      {era.locations.map((location, i) => (
        <Marker key={location.id} location={location} index={i} />
      ))}
    </>
  );
}
