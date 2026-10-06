/** Negative = BCE. Year 0 does not exist. */
export type Year = number;

export const ELEMENT_CATEGORIES = ["landmark", "person", "technology", "culture", "event"] as const;
export type ElementCategory = (typeof ELEMENT_CATEGORIES)[number];

export const MACRO_PERIODS = ["prehistory", "antiquity", "middle-ages", "early-modern", "contemporary"] as const;
export type MacroPeriod = (typeof MACRO_PERIODS)[number];

/** Future zoom levels. Only `world` is implemented in the MVP. */
export type ZoomLevel = "world" | "region" | "city" | "site" | "object";

export type Confidence = "high" | "medium" | "low";

export type Coordinates = { lat: number; lon: number };

export type HistoricalElement = {
  id: string;
  category: ElementCategory;
  name: string;
  /** Human label: "c. 2560 a.C.", "117 d.C.", "s. XV". */
  yearLabel: string;
  year?: Year;
  /** ≤ 280 characters. */
  summary: string;
  /** https URL (Wikipedia es/en or academic source). */
  sourceUrl: string;
  confidence: Confidence;
  /** Future: path to a .glb model under /public/models. */
  modelRef?: string;
};

export type HistoricalLocation = {
  /** `${eraId}--${slug}` */
  id: string;
  /** Historical name. */
  name: string;
  modernName: string;
  /** Present-day country. */
  country: string;
  coordinates: Coordinates;
  /** Representative year of the scene. */
  year: Year;
  /** 2–3 sentences. */
  summary: string;
  /** Exactly 5, one per category. */
  elements: HistoricalElement[];
};

export type HistoricalEra = {
  id: string;
  /** 1..20 */
  order: number;
  name: string;
  macroPeriod: MacroPeriod;
  startYear: Year;
  endYear: Year;
  /** Optional override for the displayed range (e.g. "1900 – presente"). */
  rangeLabel?: string;
  summary: string;
  /** Hex color with AA contrast on a dark background. */
  accentColor: string;
  locations: [HistoricalLocation, HistoricalLocation, HistoricalLocation];
};
