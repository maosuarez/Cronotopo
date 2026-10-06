"use client";

import { useEffect, useState, type ComponentType } from "react";
import type { SceneProps, SceneQuality } from "@/scenes/types";

type Loaded = { Canvas: ComponentType<{ Scene: ComponentType<SceneProps>; time: number; quality: SceneQuality; onReady: () => void }>; Scene: ComponentType<SceneProps> };

/**
 * Internal page `?debug=kit`: renders the scene-kit contact sheet fullscreen.
 * `&t=<s>` freezes time (deterministic screenshots), `&q=low` forces low quality.
 */
/** Captured at module load: URL normalisation (useUrlSync) rewrites the query before effects run. */
const initialSearch = typeof window === "undefined" ? "" : window.location.search;

export function KitDebug() {
  const [params, setParams] = useState<{ t: number | null; q: SceneQuality } | null>(null);
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const sp = new URLSearchParams(initialSearch);
    if (sp.get("debug") !== "kit") return;
    const t = sp.get("t");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-off read of the URL on the client
    setParams({ t: t === null ? null : Number(t), q: sp.get("q") === "low" ? "low" : "high" });
    void Promise.all([import("./SceneCanvas"), import("@/scenes/kit/KitPreview")]).then(([c, s]) => setLoaded({ Canvas: c.default, Scene: s.default }));
  }, []);

  useEffect(() => {
    if (!params || params.t !== null) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      setTime((performance.now() - t0) / 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [params]);

  if (!params || !loaded) return null;
  const { Canvas, Scene } = loaded;
  return (
    <div data-testid="kit-debug" className="fixed inset-0 z-[200] bg-void">
      <Canvas
        Scene={Scene}
        time={params.t ?? time}
        quality={params.q}
        onReady={() => document.documentElement.setAttribute("data-kit-ready", "true")}
      />
    </div>
  );
}
