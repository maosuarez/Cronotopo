"use client";

import { useProgress } from "@react-three/drei";
import { useEffect } from "react";

/** Lazy-loaded so drei stays out of the first bundle. The parent keeps the value monotonic. */
export default function LoaderProgress({ onProgress }: { onProgress: (value: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    onProgress(Math.round(progress));
  }, [progress, onProgress]);
  return null;
}
