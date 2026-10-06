"use client";

import { useEffect, useState } from "react";
import { eras, getEra, getLocation } from "@/data/index";
import { formatYearRange } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";

/** Single polite live region: era changes and panel opening. */
export function Announcer() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    return useAtlasStore.subscribe((state, prev) => {
      if (state.displayedEraId !== prev.displayedEraId) {
        const era = getEra(state.displayedEraId);
        if (era) {
          const range = formatYearRange(era.startYear, era.endYear, era.rangeLabel);
          setMessage(`Era ${era.order} de ${eras.length}: ${era.name}, ${range}. 3 ubicaciones.`);
        }
      } else if (state.selectedLocationId && state.selectedLocationId !== prev.selectedLocationId) {
        const found = getLocation(state.selectedLocationId);
        if (found) setMessage(`Panel abierto: ${found.location.name}`);
      }
    });
  }, []);

  return (
    <p className="sr-only" role="status" aria-live="polite">
      {message}
    </p>
  );
}
