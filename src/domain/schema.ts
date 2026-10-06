import { z } from "zod";
import { ELEMENT_CATEGORIES, MACRO_PERIODS, type HistoricalEra } from "./types";

export const EXPECTED_ERA_COUNT = 20;
export const LOCATIONS_PER_ERA = 3;
export const ELEMENTS_PER_LOCATION = ELEMENT_CATEGORIES.length;
export const MAX_ELEMENT_SUMMARY = 280;

const decimals = (n: number): number => {
  const s = String(n);
  if (s.includes("e")) return Infinity;
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
};

export const yearSchema = z
  .number()
  .int("El año debe ser entero")
  .refine((y) => y !== 0, { message: "El año 0 no existe" });

const coordinateSchema = (min: number, max: number, label: string) =>
  z
    .number()
    .min(min, `${label} fuera de rango [${min}, ${max}]`)
    .max(max, `${label} fuera de rango [${min}, ${max}]`)
    .refine((n) => decimals(n) >= 2 && decimals(n) <= 4, {
      message: `${label} debe tener entre 2 y 4 decimales (sin ceros finales)`,
    });

const idSchema = z.string().regex(/^[a-z0-9]+(?:-{1,2}[a-z0-9]+)*$/, "id debe ser kebab-case en minúsculas");
const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "accentColor debe ser hex #rrggbb");

export const elementSchema = z.object({
  id: idSchema,
  category: z.enum(ELEMENT_CATEGORIES),
  name: z.string().min(1),
  yearLabel: z.string().min(1),
  year: yearSchema.optional(),
  summary: z.string().min(1).max(MAX_ELEMENT_SUMMARY, `summary supera ${MAX_ELEMENT_SUMMARY} caracteres`),
  sourceUrl: z.string().startsWith("https://", "sourceUrl debe empezar por https://"),
  confidence: z.enum(["high", "medium", "low"]),
  modelRef: z.string().optional(),
});

export const locationSchema = z
  .object({
    id: idSchema,
    name: z.string().min(1),
    modernName: z.string().min(1),
    country: z.string().min(1),
    coordinates: z.object({
      lat: coordinateSchema(-90, 90, "lat"),
      lon: coordinateSchema(-180, 180, "lon"),
    }),
    year: yearSchema,
    summary: z.string().min(1),
    elements: z.array(elementSchema).length(ELEMENTS_PER_LOCATION, `debe tener exactamente ${ELEMENTS_PER_LOCATION} elementos`),
  })
  .superRefine((loc, ctx) => {
    const seen = new Set(loc.elements.map((e) => e.category));
    for (const category of ELEMENT_CATEGORIES) {
      if (!seen.has(category)) {
        ctx.addIssue({ code: "custom", path: ["elements"], message: `falta un elemento de categoría "${category}"` });
      }
    }
  });

export const eraSchema = z
  .object({
    id: idSchema,
    order: z.number().int().min(1).max(EXPECTED_ERA_COUNT),
    name: z.string().min(1),
    macroPeriod: z.enum(MACRO_PERIODS),
    startYear: yearSchema,
    endYear: yearSchema,
    rangeLabel: z.string().optional(),
    summary: z.string().min(1),
    accentColor: hexColorSchema,
    locations: z.tuple([locationSchema, locationSchema, locationSchema]),
  })
  .superRefine((era, ctx) => {
    if (era.startYear >= era.endYear) {
      ctx.addIssue({ code: "custom", path: ["startYear"], message: "startYear debe ser menor que endYear" });
    }
    era.locations.forEach((loc, i) => {
      if (loc.year < era.startYear || loc.year > era.endYear) {
        ctx.addIssue({
          code: "custom",
          path: ["locations", i, "year"],
          message: `location.year ${loc.year} fuera del rango de la era [${era.startYear}, ${era.endYear}]`,
        });
      }
      if (!loc.id.startsWith(`${era.id}--`)) {
        ctx.addIssue({ code: "custom", path: ["locations", i, "id"], message: `el id debe empezar por "${era.id}--"` });
      }
    });
  });

export const atlasSchema = z.array(eraSchema).superRefine((eras, ctx) => {
  if (eras.length !== EXPECTED_ERA_COUNT) {
    ctx.addIssue({ code: "custom", message: `se esperaban ${EXPECTED_ERA_COUNT} eras y hay ${eras.length}` });
  }
  const orders = eras.map((e) => e.order).sort((a, b) => a - b);
  orders.forEach((o, i) => {
    if (o !== i + 1) ctx.addIssue({ code: "custom", message: `order debe ser 1..${eras.length} sin huecos (encontrado ${o} en posición ${i + 1})` });
  });
  const ids = new Map<string, string>();
  const claim = (id: string, where: string) => {
    const prev = ids.get(id);
    if (prev) ctx.addIssue({ code: "custom", message: `id duplicado "${id}" (${prev} y ${where})` });
    else ids.set(id, where);
  };
  for (const era of eras) {
    claim(era.id, `era ${era.order}`);
    for (const loc of era.locations) {
      claim(loc.id, `ubicación de era ${era.order}`);
      for (const el of loc.elements) claim(el.id, `elemento de ${loc.id}`);
    }
  }
});

export type ValidationResult =
  | { ok: true; eras: HistoricalEra[]; stats: { eras: number; locations: number; elements: number } }
  | { ok: false; errors: string[] };

/** Validates the full atlas and returns human-readable errors. */
export function validateAtlas(input: unknown): ValidationResult {
  const result = atlasSchema.safeParse(input);
  if (!result.success) {
    const raw = Array.isArray(input) ? (input as { id?: unknown }[]) : [];
    const errors = result.error.issues.map((issue) => {
      const [first, ...rest] = issue.path;
      const eraId = typeof first === "number" ? raw[first]?.id : undefined;
      const where = typeof first === "number" ? `era[${first}]${eraId ? ` (${String(eraId)})` : ""}` : "atlas";
      const path = rest.length ? `.${rest.join(".")}` : "";
      return `${where}${path}: ${issue.message}`;
    });
    return { ok: false, errors };
  }
  const eras = result.data as HistoricalEra[];
  const locations = eras.reduce((n, e) => n + e.locations.length, 0);
  const elements = eras.reduce((n, e) => n + e.locations.reduce((m, l) => m + l.elements.length, 0), 0);
  return { ok: true, eras, stats: { eras: eras.length, locations, elements } };
}
