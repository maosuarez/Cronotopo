import type { ComponentType } from "react";

/** One storyboard beat. `caption` must describe what is on screen during [start, end). */
export type SceneBeat = {
  id: string;
  /** Seconds. */
  start: number;
  end: number;
  /** ≤ 140 chars, Spanish, what the viewer sees. */
  caption: string;
  /** Dev-only: what must be visible (acceptance criterion during polish). */
  visual: string;
  /** Shows the "Hipótesis" tag next to the caption. */
  hypothesis?: boolean;
};

export type SceneQuality = "low" | "high";

export type SceneProps = {
  /** Seconds since the start of the scene. Single source of truth: the frame is a pure function of it. */
  time: number;
  quality: SceneQuality;
};

export type SceneModule = { default: ComponentType<SceneProps> };

export type HistoricalScene = {
  id: string;
  /** Id of the HistoricalElement (info-panel card) that opens this scene. */
  elementId: string;
  title: string;
  yearLabel: string;
  /** Equals the `end` of the last beat. */
  duration: number;
  beats: SceneBeat[];
  /** Dynamic import → separate chunk per scene. */
  load: () => Promise<SceneModule>;
};

export const MAX_CAPTION = 140;
