"use client";

import { Captions as CaptionsIcon, Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { ReactNode } from "react";
import { formatClock } from "@/scenes/beats";
import type { SceneQuality } from "@/scenes/types";

type Props = {
  time: number;
  duration: number;
  playing: boolean;
  ended: boolean;
  captionsOn: boolean;
  quality: SceneQuality;
  onTogglePlay: () => void;
  onPrevBeat: () => void;
  onNextBeat: () => void;
  onToggleCaptions: () => void;
  onToggleQuality: () => void;
  /** The scrubber slot. */
  children: ReactNode;
};

const iconButton =
  "grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-ink transition-colors duration-200 hover:bg-accent-soft";

export function PlayerControls(props: Props) {
  const { time, duration, playing, ended, captionsOn, quality } = props;
  return (
    <div data-testid="player-controls" className="flex items-center gap-1 sm:gap-2">
      <button type="button" onClick={props.onPrevBeat} aria-label="Momento anterior" className={iconButton}>
        <SkipBack aria-hidden size={18} strokeWidth={1.5} />
      </button>
      {ended ? (
        <button
          type="button"
          onClick={props.onTogglePlay}
          data-testid="scene-replay"
          className="flex h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-accent-line px-4 text-meta text-accent transition-colors duration-200 hover:bg-accent-soft"
        >
          <RotateCcw aria-hidden size={16} strokeWidth={1.5} />
          Repetir
        </button>
      ) : (
        <button
          type="button"
          onClick={props.onTogglePlay}
          aria-label={playing ? "Pausar" : "Reproducir"}
          data-testid="scene-play"
          className={`${iconButton} border border-border-strong`}
        >
          {playing ? (
            <Pause aria-hidden size={18} strokeWidth={1.5} />
          ) : (
            <Play aria-hidden size={18} strokeWidth={1.5} />
          )}
        </button>
      )}
      <button type="button" onClick={props.onNextBeat} aria-label="Momento siguiente" className={iconButton}>
        <SkipForward aria-hidden size={18} strokeWidth={1.5} />
      </button>
      <span className="ml-1 w-[5.5rem] shrink-0 text-center text-meta text-ink-dim tabular-nums">
        {formatClock(time)} / {formatClock(duration)}
      </span>
      {props.children}
      <button
        type="button"
        onClick={props.onToggleCaptions}
        aria-pressed={captionsOn}
        aria-label="Subtítulos"
        title="Subtítulos (C)"
        className={`${iconButton} ${captionsOn ? "text-accent" : "text-muted"}`}
      >
        <CaptionsIcon aria-hidden size={18} strokeWidth={1.5} />
      </button>
      <button
        type="button"
        onClick={props.onToggleQuality}
        aria-label={`Calidad: ${quality === "high" ? "alta" : "baja"}`}
        className="h-11 shrink-0 cursor-pointer rounded-full px-3 text-label tracking-label text-ink-dim uppercase transition-colors duration-200 hover:bg-accent-soft"
      >
        {quality === "high" ? "Alta" : "Baja"}
      </button>
    </div>
  );
}
