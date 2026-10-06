"use client";

import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { beatAt, formatClock } from "@/scenes/beats";
import type { SceneBeat } from "@/scenes/types";

type Props = {
  time: number;
  duration: number;
  beats: readonly SceneBeat[];
  onSeek: (t: number) => void;
};

/**
 * Timeline slider with a tick per beat start. Click/drag seeks; Home/End jump to the ends.
 * ←/→ (beat jumps) are handled by the player for the whole overlay.
 */
export function BeatScrubber({ time, duration, beats, onSeek }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);

  const seekFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    onSeek(((clientX - rect.left) / rect.width) * duration);
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e.clientX);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFromPointer(e.clientX);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Home") onSeek(0);
    else if (e.key === "End") onSeek(duration);
    else return;
    e.preventDefault();
  };

  const progress = duration > 0 ? (time / duration) * 100 : 0;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label="Posición de la escena"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={Math.round(time * 10) / 10}
      aria-valuetext={`${formatClock(time)} · ${beatAt(beats, time).caption}`}
      data-testid="scene-scrubber"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onKeyDown={onKeyDown}
      className="group relative h-11 flex-1 cursor-pointer touch-none rounded-hair"
    >
      <div className="absolute inset-x-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-border-strong">
        <div className="h-full rounded-full bg-accent" style={{ width: `${progress}%` }} />
      </div>
      {beats.slice(1).map((beat) => (
        <span
          key={beat.id}
          aria-hidden
          className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ink-dim"
          style={{ left: `${(beat.start / duration) * 100}%` }}
        />
      ))}
      <span
        aria-hidden
        className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow transition-transform duration-150 group-hover:scale-125"
        style={{ left: `${progress}%` }}
      />
    </div>
  );
}
