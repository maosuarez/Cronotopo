"use client";

import gsap from "gsap";
import { useLayoutEffect, useMemo } from "react";

/**
 * A paused GSAP timeline driven by `seek(time)`. The factory receives a plain state object to tween and must only
 * add tweens (no callbacks with side effects). Returns the state after seeking to `time` — read it during render.
 *
 *   const s = useSeekedTimeline(time, () => ({ lift: 0 }), (tl, s) => tl.to(s, { lift: 1, duration: 2 }, 3));
 */
export function useSeekedTimeline<S extends object>(
  time: number,
  initial: () => S,
  build: (tl: gsap.core.Timeline, state: S) => void,
): S {
  // Built once per mount; deterministic because the timeline is never played, only seeked.
  const built = useMemo(() => {
    const state = initial();
    const tl = gsap.timeline({ paused: true });
    build(tl, state);
    return { tl, state };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  built.tl.seek(time, false);
  useLayoutEffect(() => () => void built.tl.kill(), [built]);
  return built.state;
}
