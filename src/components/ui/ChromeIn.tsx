"use client";

import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, UI_MOTION } from "@/lib/motionTokens";
import { useAtlasStore } from "@/store/useAtlasStore";

type Props = {
  /** Position in the intro stagger (0 = header). */
  order: number;
  className?: string;
  /** Temporarily tucked away (e.g. bottom sheet open on mobile). */
  tucked?: boolean;
  children: ReactNode;
};

/** Wraps a chrome block: hidden until the scene is ready, then enters per UI_MOTION. */
export function ChromeIn({ order, className, tucked = false, children }: Props) {
  const ready = useAtlasStore((s) => s.sceneReady);
  const reduced = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const shown = ready && !tucked;

  const hiddenState = reduced ? { opacity: 0 } : { opacity: 0, y: tucked ? 16 : 12 };
  const visibleState = reduced ? { opacity: 1 } : { opacity: 1, y: 0 };

  let transition;
  if (reduced) transition = { duration: UI_MOTION.reducedFade };
  else if (tucked) transition = { duration: UI_MOTION.panelOut, ease: CSS_EASE.exit };
  else if (entered) transition = { duration: UI_MOTION.headerIn, ease: CSS_EASE.settle };
  else if (ready)
    transition = {
      duration: UI_MOTION.chromeIn,
      delay: UI_MOTION.chromeInDelay + order * UI_MOTION.chromeStagger,
      ease: CSS_EASE.settle,
    };

  return (
    <motion.div
      className={className}
      initial={hiddenState}
      animate={shown ? visibleState : hiddenState}
      transition={transition}
      onAnimationComplete={() => shown && setEntered(true)}
      inert={!shown || tucked}
    >
      {children}
    </motion.div>
  );
}
