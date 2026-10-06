"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, INTRO, UI_MOTION } from "@/lib/choreography";
import { useAtlasStore } from "@/store/useAtlasStore";

const LoaderProgress = dynamic(() => import("./LoaderProgress"), { ssr: false, loading: () => null });

function Graticule({ spin }: { spin: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="-100 -100 200 200"
      className="absolute top-1/2 left-1/2 size-[480px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-35"
      style={spin ? { animation: `graticule-spin ${UI_MOTION.loaderSpin}s linear infinite` } : undefined}
      fill="none"
      stroke="var(--color-faint)"
      strokeWidth={0.5}
    >
      <circle r="96" />
      {[-64, -32, 0, 32, 64].map((y) => {
        const half = Math.sqrt(96 * 96 - y * y);
        return <line key={`p${y}`} x1={-half} x2={half} y1={y} y2={y} />;
      })}
      {[24, 48, 72].map((rx) => (
        <ellipse key={`m${rx}`} rx={rx} ry="96" />
      ))}
      <line y1="-96" y2="96" />
    </svg>
  );
}

function Screen({ progress, onProgress }: { progress: number; onProgress: (v: number) => void }) {
  const isPresent = useIsPresent();
  const reduced = useReducedMotion();

  return (
    <motion.div
      role="status"
      aria-live="polite"
      aria-label="Cargando Atlas Histórico"
      aria-hidden={!isPresent || undefined}
      inert={!isPresent}
      exit={{
        opacity: 0,
        transition: reduced
          ? { duration: UI_MOTION.reducedFade }
          : { duration: INTRO.loaderFadeOut, ease: CSS_EASE.travel },
      }}
      className="fixed inset-0 z-(--z-loader) flex items-center justify-center overflow-hidden bg-void"
    >
      <Graticule spin={!reduced} />
      <motion.div
        exit={reduced ? undefined : { y: -8 }}
        transition={{ duration: INTRO.loaderFadeOut, ease: CSS_EASE.travel }}
        className="relative flex flex-col items-center px-6 text-center"
      >
        <h1 className="font-serif text-era font-normal text-ink sm:text-display">Atlas Histórico</h1>
        <p className="text-label mt-4 tracking-label text-muted uppercase">Veinte eras · un solo mundo</p>
        <div className="mt-8 flex items-center gap-4">
          <div
            role="progressbar"
            aria-label="Progreso de carga"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
            className="h-px w-40 bg-border-strong"
          >
            <div className="h-full origin-left bg-accent" style={{ transform: `scaleX(${progress / 100})` }} />
          </div>
          <span className="text-label w-9 text-left text-muted tabular-nums">{progress} %</span>
        </div>
      </motion.div>
      <LoaderProgress onProgress={onProgress} />
    </motion.div>
  );
}

/** Covers the page (server-rendered, so there is no blank flash) until the scene reports ready. */
export function LoadingScreen() {
  const ready = useAtlasStore((s) => s.sceneReady);
  const [progress, setProgress] = useState(0);

  return (
    <AnimatePresence>{!ready && <Screen key="loader" progress={progress} onProgress={(v) => setProgress((p) => Math.max(p, v))} />}</AnimatePresence>
  );
}
