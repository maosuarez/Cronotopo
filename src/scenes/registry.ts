/**
 * Scene registry: maps a HistoricalElement id to its animated scene.
 *
 * Adding a scene = create `src/scenes/<name>/{beats.ts,meta.ts,index.tsx}` and append its `meta.scene` here.
 * Metadata (title, beats, duration) is static and light — `beats.ts` must not import React/three —
 * while the component is code-split through `load` and only fetched when the player opens.
 */
import { getLocation } from "@/data/index";
import type { HistoricalEra, HistoricalLocation } from "@/domain/types";
import { PLACEHOLDER_DURATION, placeholderBeats } from "./placeholder/beats";
import { scene as athensParthenon } from "./athens-parthenon/meta";
import { scene as gizaPyramid } from "./giza-pyramid/meta";
import { scene as mainzPress } from "./mainz-press/meta";
import { scene as manchesterSteam } from "./manchester-steam/meta";
import { scene as pompeiiVesuvius } from "./pompeii-vesuvius/meta";
import type { HistoricalScene } from "./types";
import { scene as urukWriting } from "./uruk-writing/meta";

export const scenes: readonly HistoricalScene[] = [
  {
    id: "placeholder",
    elementId: "primeros-humanos--blombos--technology",
    title: "Escena de prueba: taller de ocre",
    yearLabel: "c. 100.000 años AP",
    duration: PLACEHOLDER_DURATION,
    beats: placeholderBeats,
    load: () => import("./placeholder"),
  },
  urukWriting,
  gizaPyramid,
  athensParthenon,
  pompeiiVesuvius,
  mainzPress,
  manchesterSteam,
];

const byElementId = new Map(scenes.map((scene) => [scene.elementId, scene]));

export function getSceneByElementId(elementId: string | null | undefined): HistoricalScene | undefined {
  return elementId ? byElementId.get(elementId) : undefined;
}

export function hasScene(elementId: string | null | undefined): boolean {
  return getSceneByElementId(elementId) !== undefined;
}

/**
 * Era and location that own a scene's element, or undefined if the id has no scene or its element
 * is not in the data. Element ids are `${locationId}--${category}`.
 */
export function getSceneLocation(
  elementId: string | null | undefined,
): { era: HistoricalEra; location: HistoricalLocation } | undefined {
  if (!elementId || !hasScene(elementId)) return undefined;
  const found = getLocation(elementId.slice(0, elementId.lastIndexOf("--")));
  if (!found || !found.location.elements.some((e) => e.id === elementId)) return undefined;
  return found;
}
