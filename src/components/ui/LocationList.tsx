"use client";

import { AnimatePresence, motion } from "framer-motion";
import { getEra } from "@/data/index";
import type { HistoricalLocation } from "@/domain/types";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, UI_MOTION } from "@/lib/choreography";
import { formatYear } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";
import { ChromeIn } from "./ChromeIn";
import { formatCoordinates, pad2 } from "./format";

function accessibleName(l: HistoricalLocation): string {
  const modern = l.modernName && l.modernName !== l.name ? `, actualmente ${l.modernName}` : "";
  return `${l.name}${modern}, ${l.country}, ${formatYear(l.year)}`;
}

function LocationRow({ location, index }: { location: HistoricalLocation; index: number }) {
  const selectedId = useAtlasStore((s) => s.selectedLocationId);
  const hovered = useAtlasStore((s) => s.hoveredLocationId === location.id);
  const pending = useAtlasStore((s) => s.displayedEraId !== s.activeEraId);
  const selectLocation = useAtlasStore((s) => s.selectLocation);
  const setHovered = useAtlasStore((s) => s.setHovered);
  const reduced = useReducedMotion();

  const selected = selectedId === location.id;
  const dimmed = selectedId !== null && !selected;

  return (
    <motion.li
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: UI_MOTION.reducedFade }
          : {
              duration: UI_MOTION.headerIn,
              delay: UI_MOTION.headerInDelay + UI_MOTION.rowsDelay + index * UI_MOTION.cardStagger,
              ease: CSS_EASE.settle,
            },
      }}
      exit={{
        opacity: 0,
        y: reduced ? 0 : -8,
        transition: { duration: reduced ? UI_MOTION.reducedFade : UI_MOTION.headerOut, ease: CSS_EASE.exit },
      }}
      className="min-w-0"
    >
      <button
        type="button"
        aria-label={accessibleName(location)}
        aria-current={selected ? "true" : undefined}
        aria-disabled={pending || undefined}
        data-hovered={hovered || undefined}
        data-selected={selected || undefined}
        data-location-id={location.id}
        onClick={() => !pending && selectLocation(location.id)}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(location.id)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setHovered(null)}
        onFocus={() => setHovered(location.id)}
        onBlur={() => setHovered(null)}
        className={[
          "group grid h-14 w-full cursor-pointer grid-cols-1 content-center rounded-hair border-border bg-surface-solid/70 px-2 text-left transition-[background-color,border-color,opacity] duration-200 ease-settle",
          "border lg:h-[76px] lg:grid-cols-[28px_1fr_auto] lg:items-center lg:gap-x-2 lg:border-0 lg:border-l lg:bg-transparent lg:px-0",
          "hover:bg-accent-soft data-[hovered]:border-accent data-[hovered]:bg-accent-soft data-[selected]:border-accent data-[selected]:bg-accent-soft",
          "lg:data-[hovered]:border-l-2 lg:data-[selected]:border-l-2 lg:data-[hovered]:border-accent",
          dimmed ? "opacity-55" : "",
          pending ? "cursor-wait" : "",
        ].join(" ")}
      >
        <span aria-hidden className="text-label hidden pl-3 text-muted tabular-nums lg:block">
          {pad2(index + 1)}
        </span>
        <span className="min-w-0">
          <span className="block truncate font-serif text-base leading-tight font-medium text-ink lg:text-[20px]">
            {location.name}
          </span>
          <span className="mt-0.5 hidden truncate text-[12px] text-muted lg:block">
            {location.modernName} · {location.country}
          </span>
          <span className="mt-0.5 hidden text-micro text-muted tabular-nums lg:block">
            {formatCoordinates(location.coordinates)}
          </span>
          <span className="text-label mt-0.5 block text-ink-dim tabular-nums lg:hidden">
            {formatYear(location.year)}
          </span>
        </span>
        <span className="text-label hidden pr-2 text-ink-dim tabular-nums lg:block">{formatYear(location.year)}</span>
      </button>
    </motion.li>
  );
}

export function LocationList() {
  const eraId = useAtlasStore((s) => s.displayedEraId);
  const hasSelection = useAtlasStore((s) => s.selectedLocationId !== null);
  const isDesktop = useIsDesktop();
  const era = getEra(eraId);
  if (!era) return null;

  return (
    <ChromeIn
      order={2}
      tucked={hasSelection && !isDesktop}
      className="pointer-events-none fixed right-(--edge) bottom-[calc(var(--timeline-total)+12px)] left-(--edge) z-(--z-chrome) lg:right-auto lg:bottom-[calc(var(--timeline-total)+24px)] lg:w-[296px]"
    >
      <nav aria-label="Ubicaciones de la era" data-testid="location-list" className="pointer-events-auto">
        <ul className="grid grid-cols-3 gap-2 lg:grid-cols-1 lg:gap-1">
          <AnimatePresence initial={false} mode="popLayout">
            {era.locations.map((location, i) => (
              <LocationRow key={location.id} location={location} index={i} />
            ))}
          </AnimatePresence>
        </ul>
      </nav>
    </ChromeIn>
  );
}
