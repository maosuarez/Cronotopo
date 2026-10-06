"use client";

import dynamic from "next/dynamic";

const Experience = dynamic(() => import("./Experience"), { ssr: false, loading: () => null });

export function ExperienceLoader() {
  return <Experience />;
}
