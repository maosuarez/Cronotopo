/** Pure beat helpers shared by the registry, the player and the tests. No React/three imports. */
import { MAX_CAPTION, type HistoricalScene, type SceneBeat } from "./types";

/** Index of the beat on screen at `t` (beats are [start, end)); clamps outside [0, duration]. */
export function beatIndexAt(beats: readonly SceneBeat[], t: number): number {
  for (let i = beats.length - 1; i > 0; i--) {
    if (t >= beats[i].start) return i;
  }
  return 0;
}

export function beatAt(beats: readonly SceneBeat[], t: number): SceneBeat {
  return beats[beatIndexAt(beats, t)];
}

/** Time of the beat's key frame (reduced-motion slideshow). */
export function midpoint(beat: SceneBeat): number {
  return (beat.start + beat.end) / 2;
}

/** `m:ss` (e.g. 70 → "1:10"). */
export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Storyboard invariants. Returns human-readable problems; empty array = valid. */
export function validateBeats(scene: Pick<HistoricalScene, "id" | "duration" | "beats">): string[] {
  const problems: string[] = [];
  const { beats } = scene;
  if (beats.length === 0) return [`${scene.id}: no beats`];
  if (beats[0].start !== 0) problems.push(`${scene.id}: first beat starts at ${beats[0].start}, expected 0`);
  const ids = new Set<string>();
  beats.forEach((beat, i) => {
    if (!(beat.end > beat.start)) problems.push(`${scene.id}/${beat.id}: end ${beat.end} ≤ start ${beat.start}`);
    if (i > 0 && beats[i - 1].end !== beat.start) {
      problems.push(`${scene.id}/${beat.id}: starts at ${beat.start}, previous ends at ${beats[i - 1].end}`);
    }
    if (beat.caption.length > MAX_CAPTION) {
      problems.push(`${scene.id}/${beat.id}: caption ${beat.caption.length} > ${MAX_CAPTION} chars`);
    }
    if (ids.has(beat.id)) problems.push(`${scene.id}: duplicate beat id ${beat.id}`);
    ids.add(beat.id);
  });
  const last = beats[beats.length - 1];
  if (scene.duration !== last.end) problems.push(`${scene.id}: duration ${scene.duration} ≠ last end ${last.end}`);
  return problems;
}
