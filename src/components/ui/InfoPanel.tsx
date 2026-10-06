"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getLocation } from "@/data/index";
import type { HistoricalLocation } from "@/domain/types";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, UI_MOTION } from "@/lib/choreography";
import { formatYear } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";
import { ElementCard } from "./ElementCard";
import { formatCoordinates, spokenCoordinates } from "./format";

type ContentProps = {
  location: HistoricalLocation;
  index: number;
  /** True while the panel itself is entering: cards wait for the panel. */
  entering: boolean;
  onClose: () => void;
};

function PanelContent({ location, index, entering, onClose }: ContentProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  const cardsBase = reduced ? 0 : (entering ? UI_MOTION.panelInDelay : 0) + UI_MOTION.cardsDelay;

  return (
    <motion.div
      initial={false}
      exit={{ opacity: 0, transition: { duration: UI_MOTION.contentOut, ease: CSS_EASE.exit } }}
      className="flex min-h-0 flex-1 flex-col"
    >
      <header className="shrink-0 border-b border-border p-4 lg:p-6">
        <div className="flex items-start justify-between gap-4">
          <p className="text-label tracking-label text-accent uppercase tabular-nums">
            Ubicación {index + 1} / 3
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="-mt-2 -mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-border text-ink transition-colors duration-200 hover:border-border-strong hover:bg-accent-soft"
          >
            <X aria-hidden size={20} strokeWidth={1.5} />
          </button>
        </div>
        <h2
          id="loc-title"
          ref={headingRef}
          tabIndex={-1}
          className="-mt-3 font-serif outline-none text-[1.75rem] leading-[1.05] font-medium text-ink lg:text-panel"
        >
          {location.name}
        </h2>
        <p className="mt-1 text-body text-ink-dim">
          {location.modernName} · {location.country}
        </p>
        <p className="text-label mt-2 text-muted tabular-nums">
          {formatYear(location.year)} ·{" "}
          <span aria-label={spokenCoordinates(location.coordinates)}>{formatCoordinates(location.coordinates)}</span>
        </p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 lg:px-6">
        <p className="py-4 text-body text-ink-dim">{location.summary}</p>
        {location.elements.map((element, i) => (
          <ElementCard key={element.id} element={element} index={i} baseDelay={cardsBase} />
        ))}
      </div>
    </motion.div>
  );
}

type ShellProps = { location: HistoricalLocation; index: number };

function PanelShell({ location, index }: ShellProps) {
  const clearSelection = useAtlasStore((s) => s.clearSelection);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  // Captured at first render: child effects (heading focus) run before this component's effects.
  const [trigger] = useState<Element | null>(() => document.activeElement);
  const [entering, setEntering] = useState(true);

  // Remember what had focus (the location row, or body) so we can give it back; also Esc.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") clearSelection();
    };
    window.addEventListener("keydown", onKey);
    const settle = window.setTimeout(
      () => setEntering(false),
      (UI_MOTION.panelInDelay + UI_MOTION.panelIn + UI_MOTION.contentOut) * 1000,
    );
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(settle);
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [clearSelection, trigger]);

  const hidden = reduced ? { opacity: 0 } : isDesktop ? { opacity: 0, x: 32 } : { y: "100%" };
  const exit = reduced ? { opacity: 0 } : isDesktop ? { opacity: 0, x: 24 } : { y: "100%" };

  return (
    <motion.aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="loc-title"
      data-testid="info-panel"
      initial={hidden}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
        transition: reduced
          ? { duration: UI_MOTION.reducedFade }
          : { duration: UI_MOTION.panelIn, delay: UI_MOTION.panelInDelay, ease: CSS_EASE.settle },
      }}
      exit={{
        ...exit,
        transition: {
          duration: reduced ? UI_MOTION.reducedFade : UI_MOTION.panelOut,
          ease: CSS_EASE.exit,
        },
      }}
      className="glass fixed inset-x-0 bottom-0 z-(--z-panel) flex h-[54dvh] max-h-[54dvh] flex-col overflow-hidden rounded-t-sheet pb-[env(safe-area-inset-bottom)] lg:inset-x-auto lg:top-6 lg:right-6 lg:bottom-[calc(var(--timeline-total)+20px)] lg:h-auto lg:max-h-none lg:w-[400px] lg:rounded-panel lg:pb-0 xl:w-(--panel-w)"
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,var(--accent),transparent)]"
      />
      <span aria-hidden className="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-border-strong lg:hidden" />
      <AnimatePresence mode="wait" initial={false}>
        <PanelContent
          key={location.id}
          location={location}
          index={index}
          entering={entering}
          onClose={clearSelection}
        />
      </AnimatePresence>
    </motion.aside>
  );
}

export function InfoPanel() {
  const found = useAtlasStore((s) => getLocation(s.selectedLocationId));
  const index = found ? found.era.locations.findIndex((l) => l.id === found.location.id) : 0;

  return (
    <AnimatePresence>
      {found && <PanelShell key="panel" location={found.location} index={index} />}
    </AnimatePresence>
  );
}
