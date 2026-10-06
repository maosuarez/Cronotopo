"use client";

import { AnimatePresence, motion, useIsPresent } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useEffectEvent, useRef, useState, type ComponentType } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { CSS_EASE, PLAYER_MOTION } from "@/lib/motionTokens";
import { beatAt, beatIndexAt, midpoint } from "@/scenes/beats";
import { getSceneByElementId } from "@/scenes/registry";
import type { HistoricalScene, SceneProps, SceneQuality } from "@/scenes/types";
import { useAtlasStore, type SceneOrigin } from "@/store/useAtlasStore";
import { BeatScrubber } from "./BeatScrubber";
import { Captions } from "./Captions";
import { PlayerControls } from "./PlayerControls";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false, loading: () => null });

/** `?debug=1` test hook, present only while a player is open. */
export type SceneDebugHandle = {
  seek: (t: number) => void;
  play: () => void;
  pause: () => void;
  readonly time: number;
  readonly duration: number;
  readonly beats: HistoricalScene["beats"];
  /** Scene chunk loaded and its first frame rendered. */
  readonly ready: boolean;
};
type DebugWindow = Window & { __scene?: SceneDebugHandle };

/** Seconds a "previous" press restarts the current beat instead of going to the previous one. */
const RESTART_WINDOW = 0.75;

/** Low when the device is likely weak: ≤4 cores, touch-first or small screen. */
function defaultQuality(): SceneQuality {
  const fewCores = (navigator.hardwareConcurrency ?? 8) <= 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.innerWidth < 768;
  return fewCores || coarse || small ? "low" : "high";
}

const clipFrom = (o: SceneOrigin, vw: number, vh: number) =>
  `inset(${o.y}px ${Math.max(0, vw - o.x - o.width)}px ${Math.max(0, vh - o.y - o.height)}px ${o.x}px round ${PLAYER_MOTION.originRadius}px)`;
const CLIP_FULL = "inset(0px 0px 0px 0px round 0px)";

type ShellProps = { scene: HistoricalScene; origin: SceneOrigin | null };

function PlayerShell({ scene, origin }: ShellProps) {
  const present = useIsPresent();
  const reduced = useReducedMotion();
  const closeScene = useAtlasStore((s) => s.closeScene);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [viewport] = useState(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const [quality, setQuality] = useState<SceneQuality>(defaultQuality);
  const [Scene, setScene] = useState<ComponentType<SceneProps> | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const readyRef = useRef(false);
  const [captionsOn, setCaptionsOn] = useState(true);
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  /** Clock value, readable from rAF/listeners without re-subscribing. `time` mirrors it for rendering. */
  const timeRef = useRef(0);
  const { duration, beats } = scene;

  useEffect(() => {
    let alive = true;
    scene.load().then(
      (mod) => alive && setScene(() => mod.default),
      () => alive && setLoadFailed(true),
    );
    return () => {
      alive = false;
    };
  }, [scene]);

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  const seek = useCallback(
    (t: number) => {
      const clamped = Math.min(duration, Math.max(0, t));
      timeRef.current = clamped;
      setTime(clamped);
    },
    [duration],
  );

  // The single clock: advances only while playing, loaded and not closing. Stops paused at the end.
  const clockRunning = playing && ready && present;
  useEffect(() => {
    if (!clockRunning) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const next = Math.min(duration, timeRef.current + (now - last) / 1000);
      last = now;
      timeRef.current = next;
      setTime(next);
      if (next >= duration) {
        setPlaying(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clockRunning, duration]);

  const play = useCallback(() => {
    if (timeRef.current >= duration) seek(0);
    setPlaying(true);
  }, [duration, seek]);
  const pause = useCallback(() => setPlaying(false), []);
  const togglePlay = () => (playing ? pause() : play());

  const prevBeat = () => {
    const i = beatIndexAt(beats, timeRef.current);
    const restart = timeRef.current - beats[i].start > RESTART_WINDOW && !reduced;
    seek(restart ? beats[i].start : beats[Math.max(0, i - 1)].start);
  };
  const nextBeat = () => {
    const i = beatIndexAt(beats, timeRef.current);
    if (i < beats.length - 1) seek(beats[i + 1].start);
  };
  const onReady = useCallback(() => {
    readyRef.current = true;
    setReady(true);
  }, []);

  // Capture phase + stopPropagation: the InfoPanel (Esc) and the timeline never see player keys.
  const onKey = useEffectEvent((e: KeyboardEvent) => {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const isSpace = e.key === " ";
    if (e.type === "keyup") {
      // Cancels the native click of a focused button: Space always means play/pause here.
      if (isSpace) e.preventDefault();
      return;
    }
    if (e.key === "Escape") closeScene();
    else if (isSpace) {
      if (!e.repeat) togglePlay();
    } else if (e.key === "ArrowLeft") prevBeat();
    else if (e.key === "ArrowRight") nextBeat();
    else if (e.key === "c" || e.key === "C") setCaptionsOn((v) => !v);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
  useEffect(() => {
    if (!present) return;
    const listener = (e: KeyboardEvent) => onKey(e);
    window.addEventListener("keydown", listener, true);
    window.addEventListener("keyup", listener, true);
    return () => {
      window.removeEventListener("keydown", listener, true);
      window.removeEventListener("keyup", listener, true);
    };
  }, [present]);

  useEffect(() => {
    if (!present || new URLSearchParams(window.location.search).get("debug") !== "1") return;
    const w = window as DebugWindow;
    w.__scene = {
      seek,
      play,
      pause,
      get time() {
        return timeRef.current;
      },
      duration,
      beats,
      get ready() {
        return readyRef.current;
      },
    };
    return () => {
      delete w.__scene;
    };
  }, [present, seek, play, pause, duration, beats]);

  const beat = beatAt(beats, time);
  // Reduced motion: a slideshow of one key frame per beat (its midpoint), the clock still paces it.
  const sceneTime = reduced ? midpoint(beat) : time;
  const ended = !playing && time >= duration;

  const closed = reduced
    ? { opacity: 0 }
    : origin
      ? { opacity: 1, clipPath: clipFrom(origin, viewport.w, viewport.h) }
      : { opacity: 0, clipPath: CLIP_FULL };
  const opened = reduced ? { opacity: 1 } : { opacity: 1, clipPath: CLIP_FULL };

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="scene-title"
      tabIndex={-1}
      data-testid="scene-player"
      data-ready={String(ready)}
      inert={!present}
      initial={closed}
      animate={{
        ...opened,
        transition: reduced
          ? { duration: PLAYER_MOTION.reducedFade }
          : { duration: PLAYER_MOTION.open, ease: PLAYER_MOTION.openEase },
      }}
      exit={{
        ...closed,
        transition: reduced
          ? { duration: PLAYER_MOTION.reducedFade }
          : { duration: PLAYER_MOTION.close, ease: PLAYER_MOTION.closeEase },
      }}
      className="fixed inset-0 z-(--z-player) overflow-hidden bg-void outline-none"
    >
      <div className="absolute inset-0">
        {Scene && <SceneCanvas Scene={Scene} time={sceneTime} quality={quality} onReady={onReady} />}
      </div>
      {reduced && (
        <motion.div
          key={beat.id}
          aria-hidden
          initial={{ opacity: 1 }}
          animate={{ opacity: 0, transition: { duration: PLAYER_MOTION.slideFade } }}
          className="pointer-events-none absolute inset-0 bg-void"
        />
      )}
      {!ready && (
        <p
          role="status"
          className="absolute inset-0 grid place-items-center text-label tracking-label text-muted uppercase"
          style={{ animation: "fade-in 0.4s ease 0.15s both" }}
        >
          {loadFailed ? "No se pudo cargar la escena" : "Cargando escena…"}
        </p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          transition: reduced
            ? { duration: PLAYER_MOTION.reducedFade }
            : { duration: PLAYER_MOTION.chromeIn, delay: PLAYER_MOTION.chromeDelay, ease: CSS_EASE.settle },
        }}
        className="absolute inset-0"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_bottom,rgb(5_6_10/0.7),transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-[linear-gradient(to_top,rgb(5_6_10/0.85),transparent)]"
        />
        <header className="absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 lg:p-8">
          <div>
            <p className="text-label tracking-label text-accent uppercase tabular-nums">{scene.yearLabel}</p>
            <h2 id="scene-title" className="mt-1 font-serif text-[1.75rem] leading-[1.05] font-medium text-ink lg:text-panel">
              {scene.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeScene}
            aria-label="Cerrar escena"
            data-testid="scene-close"
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full border border-border text-ink transition-colors duration-200 hover:border-border-strong hover:bg-accent-soft"
          >
            <X aria-hidden size={20} strokeWidth={1.5} />
          </button>
        </header>

        <Captions beat={beat} visible={captionsOn && ready} />

        <div className="absolute inset-x-0 bottom-0 px-2 pb-[max(env(safe-area-inset-bottom),16px)] sm:px-6 lg:px-8 lg:pb-8">
          <div className="glass mx-auto max-w-4xl rounded-panel px-2 py-1 sm:px-3">
            <PlayerControls
              time={time}
              duration={duration}
              playing={playing}
              ended={ended}
              captionsOn={captionsOn}
              quality={quality}
              onTogglePlay={togglePlay}
              onPrevBeat={prevBeat}
              onNextBeat={nextBeat}
              onToggleCaptions={() => setCaptionsOn((v) => !v)}
              onToggleQuality={() => setQuality((q) => (q === "high" ? "low" : "high"))}
            >
              <BeatScrubber time={time} duration={duration} beats={beats} onSeek={seek} />
            </PlayerControls>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/**
 * Fullscreen scene player, driven by `sceneElementId` in the store. Owns the scene clock and passes
 * `time` to the scene component every frame. Closing returns focus to the card's "Ver escena" button.
 */
export function ScenePlayer() {
  const sceneElementId = useAtlasStore((s) => s.sceneElementId);
  const origin = useAtlasStore((s) => s.sceneOrigin);
  const scene = getSceneByElementId(sceneElementId);

  useEffect(
    () =>
      useAtlasStore.subscribe((state, prev) => {
        if (!prev.sceneElementId || state.sceneElementId) return;
        document
          .querySelector<HTMLElement>(`[data-testid="open-scene"][data-element-id="${prev.sceneElementId}"]`)
          ?.focus({ preventScroll: true });
      }),
    [],
  );

  return <AnimatePresence>{scene && <PlayerShell key={scene.id} scene={scene} origin={origin} />}</AnimatePresence>;
}
