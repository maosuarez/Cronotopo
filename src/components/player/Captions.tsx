"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CSS_EASE, PLAYER_MOTION } from "@/lib/motionTokens";
import type { SceneBeat } from "@/scenes/types";

/** Lower-third caption of the current beat, cross-fading when the beat changes. */
export function Captions({ beat, visible }: { beat: SceneBeat; visible: boolean }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none absolute inset-x-0 bottom-[132px] flex justify-center px-6 sm:bottom-[120px]"
    >
      <AnimatePresence mode="wait" initial={false}>
        {visible && (
          <motion.p
            key={beat.id}
            data-testid="scene-caption"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: PLAYER_MOTION.captionIn, ease: CSS_EASE.settle } }}
            exit={{ opacity: 0, transition: { duration: PLAYER_MOTION.captionOut, ease: CSS_EASE.exit } }}
            className="max-w-[44rem] rounded-panel bg-void/60 px-4 py-2 text-center font-serif text-[1.25rem] leading-snug text-ink backdrop-blur-sm sm:text-[1.5rem]"
          >
            {beat.hypothesis && (
              <span className="mr-2 inline-block -translate-y-0.5 rounded-hair border border-accent-line px-1.5 py-0.5 align-middle font-sans text-label tracking-label text-accent uppercase">
                Hipótesis
              </span>
            )}
            {beat.caption}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
