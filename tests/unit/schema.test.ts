import { describe, expect, it } from "vitest";
import era from "@/data/eras/01-primeros-humanos";
import { eraSchema, yearSchema } from "@/domain/schema";
type MutableEra = { endYear: number; locations: { year: number; coordinates: { lat: number }; elements: { category: string; summary: string; sourceUrl: string }[] }[] };


const mutated = (mutate: (e: MutableEra) => void) => {
  const copy = structuredClone(era) as MutableEra;
  mutate(copy);
  return eraSchema.safeParse(copy);
};

describe("yearSchema", () => {
  it("rejects 0", () => expect(yearSchema.safeParse(0).success).toBe(false));
  it("accepts negative and positive", () => {
    expect(yearSchema.safeParse(-500).success).toBe(true);
    expect(yearSchema.safeParse(117).success).toBe(true);
  });
});

describe("eraSchema", () => {
  it("accepts the real first era", () => {
    const result = eraSchema.safeParse(era);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  });
  it("rejects a location with 4 elements", () => {
    expect(mutated((e) => e.locations[0].elements.push(structuredClone(e.locations[0].elements[0]))).success).toBe(false);
  });
  it("rejects duplicated/missing category", () => {
    expect(mutated((e) => { e.locations[0].elements[1].category = e.locations[0].elements[0].category; }).success).toBe(false);
  });
  it("rejects location.year outside era range", () => {
    expect(mutated((e) => { e.locations[0].year = e.endYear + 1; }).success).toBe(false);
  });
  it("rejects lat with 1 or 5 decimals", () => {
    expect(mutated((e) => { e.locations[0].coordinates.lat = 4.8; }).success).toBe(false);
    expect(mutated((e) => { e.locations[0].coordinates.lat = 4.80041; }).success).toBe(false);
  });
  it("rejects summary > 280 chars", () => {
    expect(mutated((e) => { e.locations[0].elements[0].summary = "x".repeat(281); }).success).toBe(false);
  });
  it("rejects http:// sourceUrl", () => {
    expect(mutated((e) => { e.locations[0].elements[0].sourceUrl = "http://example.com"; }).success).toBe(false);
  });
});
