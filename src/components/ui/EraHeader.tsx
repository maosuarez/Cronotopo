"use client";

import { AnimatePresence, motion } from "framer-motion";
import { eras, getEra } from "@/data/index";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, UI_MOTION } from "@/lib/choreography";
import { formatYearRange } from "@/lib/years";
import { useAtlasStore } from "@/store/useAtlasStore";
import { ChromeIn } from "./ChromeIn";
import { macroPeriodLabels } from "./categoryMeta";
import { pad2 } from "./format";

export function EraHeader() {
  const eraId = useAtlasStore((s) => s.displayedEraId);
  const hasSelection = useAtlasStore((s) => s.selectedLocationId !== null);
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const era = getEra(eraId);
  if (!era) return null;

  const compact = hasSelection && !isDesktop;
  const range = formatYearRange(era.startYear, era.endYear, era.rangeLabel);

  const enter = reduced
    ? { initial: { opacity: 0 }, animate: { opacity: 1 } }
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 } };
  const exit = reduced ? { opacity: 0 } : { opacity: 0, y: -8 };
  const transition = reduced
    ? { duration: UI_MOTION.reducedFade }
    : { duration: UI_MOTION.headerIn, delay: UI_MOTION.headerInDelay, ease: CSS_EASE.settle };

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-(--z-chrome) h-[220px] bg-[linear-gradient(#05060a99,transparent)]"
      />
      <ChromeIn
        order={0}
        className="pointer-events-none fixed top-[max(1rem,env(safe-area-inset-top))] left-(--edge) z-(--z-chrome) w-[calc(100vw-2*var(--edge))] max-w-[440px] lg:top-8"
      >
        <section aria-labelledby="era-title" className="relative">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={`${era.id}-${compact}`}
              initial={enter.initial}
              animate={{ ...enter.animate, transition }}
              exit={{
                ...exit,
                transition: {
                  duration: reduced ? UI_MOTION.reducedFade : UI_MOTION.headerOut,
                  ease: CSS_EASE.exit,
                },
              }}
            >
              {compact ? (
                <h1 id="era-title" className="text-meta text-ink/80">
                  Era {pad2(era.order)} · {era.name}
                </h1>
              ) : (
                <>
                  <p className="text-label flex items-center gap-3 tracking-label uppercase tabular-nums">
                    <span className="text-accent">
                      Era {pad2(era.order)} / {eras.length}
                    </span>
                    <span aria-hidden className="h-px w-8 bg-border-strong" />
                    <span className="text-muted tracking-wide">{macroPeriodLabels[era.macroPeriod]}</span>
                  </p>
                  <h1
                    id="era-title"
                    className="mt-3 font-serif text-era font-medium text-balance text-ink sm:text-[2.5rem] sm:leading-[1.05] lg:text-display lg:leading-none"
                  >
                    {era.name}
                  </h1>
                  <p className="mt-2 font-serif text-[17px] text-ink-dim italic sm:text-[22px]">{range}</p>
                  <p className="mt-4 hidden max-w-[360px] text-body text-muted line-clamp-2 sm:block short:hidden">
                    {era.summary}
                  </p>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </ChromeIn>
    </>
  );
}
