"use client";

import { motion } from "framer-motion";
import { ExternalLink, Play } from "lucide-react";
import { useRef } from "react";
import type { Confidence, HistoricalElement } from "@/domain/types";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, UI_MOTION } from "@/lib/motionTokens";
import { formatClock } from "@/scenes/beats";
import { getSceneByElementId } from "@/scenes/registry";
import { useAtlasStore } from "@/store/useAtlasStore";
import { categoryMeta } from "./categoryMeta";

const confidenceMeta: Record<Exclude<Confidence, "high">, { label: string; filled: number; note: string }> = {
  medium: {
    label: "Confianza media",
    filled: 2,
    note: "Los datos de este elemento son parcialmente discutidos.",
  },
  low: {
    label: "Confianza baja",
    filled: 1,
    note: "Los datos de este elemento son inciertos o muy discutidos.",
  },
};

function ConfidenceMark({ confidence }: { confidence: Exclude<Confidence, "high"> }) {
  const { label, filled, note } = confidenceMeta[confidence];
  return (
    <span className="text-label flex items-center gap-2 text-muted">
      <span aria-hidden className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`size-1.5 rounded-full ${i < filled ? "bg-ink-dim" : "border border-muted"}`}
          />
        ))}
      </span>
      {label}
      <span className="sr-only">{note}</span>
    </span>
  );
}

type Props = {
  element: HistoricalElement;
  index: number;
  /** Seconds before the first card enters (panel entry offset included by the caller). */
  baseDelay: number;
};

export function ElementCard({ element, index, baseDelay }: Props) {
  const reduced = useReducedMotion();
  const { label, Icon } = categoryMeta[element.category];
  const titleId = `el-${element.id}`;
  const scene = getSceneByElementId(element.id);
  const openScene = useAtlasStore((s) => s.openScene);
  const cardRef = useRef<HTMLElement>(null);

  const onOpenScene = () => {
    const rect = cardRef.current?.getBoundingClientRect();
    openScene(element.id, rect ? { x: rect.x, y: rect.y, width: rect.width, height: rect.height } : null);
  };

  return (
    <motion.article
      ref={cardRef}
      data-testid="element-card"
      aria-labelledby={titleId}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: reduced
          ? { duration: UI_MOTION.reducedFade }
          : {
              duration: UI_MOTION.cardIn,
              delay: baseDelay + index * UI_MOTION.cardStagger,
              ease: CSS_EASE.settle,
            },
      }}
      className="border-t border-border py-5 first:border-t-0 first:pt-3"
    >
      <div className="flex items-center gap-2">
        <span className="grid size-7 shrink-0 place-items-center rounded-full border border-accent-line text-accent">
          <Icon aria-hidden size={16} strokeWidth={1.5} />
        </span>
        <span className="text-label tracking-label text-muted uppercase">{label}</span>
        <span className="ml-auto text-[12px] whitespace-nowrap text-ink-dim tabular-nums">{element.yearLabel}</span>
      </div>
      <h3 id={titleId} className="mt-3 font-serif text-card font-medium text-ink">
        {element.name}
      </h3>
      <p className="mt-2 text-body text-ink-dim">{element.summary}</p>
      {scene && (
        <button
          type="button"
          onClick={onOpenScene}
          data-testid="open-scene"
          data-element-id={element.id}
          className="mt-3 -ml-1 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border border-accent-line px-4 text-meta text-accent transition-colors duration-200 hover:bg-accent-soft"
        >
          <Play aria-hidden size={14} strokeWidth={1.75} className="fill-current" />
          Ver escena · {formatClock(scene.duration)}
        </button>
      )}
      <div className="mt-3 flex items-center justify-between gap-3">
        <a
          href={element.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Fuente: ${element.name} (se abre en una pestaña nueva)`}
          className="group -my-3 inline-flex items-center gap-1.5 py-3 text-meta text-ink-dim underline decoration-accent-line decoration-1 underline-offset-4 transition-colors duration-200 hover:text-ink hover:decoration-accent"
        >
          Fuente
          <ExternalLink aria-hidden size={12} strokeWidth={1.5} />
        </a>
        {element.confidence !== "high" && <ConfidenceMark confidence={element.confidence} />}
      </div>
    </motion.article>
  );
}
