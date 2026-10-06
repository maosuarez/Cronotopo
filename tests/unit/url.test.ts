import { describe, expect, it } from "vitest";
import { getEra } from "@/data/index";
import { buildAtlasQuery, parseAtlasQuery } from "@/lib/url";

const ERA = "primeros-humanos";
const BLOMBOS = "primeros-humanos--blombos";

describe("url helpers", () => {
  it("builds the canonical query", () => {
    expect(buildAtlasQuery({ eraId: ERA, locationId: null, sceneId: null })).toBe(`?era=${ERA}`);
    expect(buildAtlasQuery({ eraId: ERA, locationId: BLOMBOS, sceneId: null })).toBe(`?era=${ERA}&loc=${BLOMBOS}`);
  });

  it("round-trips parse/build", () => {
    for (const q of [
      { eraId: ERA, locationId: null, sceneId: null },
      { eraId: ERA, locationId: BLOMBOS, sceneId: null },
    ]) {
      expect(parseAtlasQuery(buildAtlasQuery(q))).toEqual(q);
    }
  });

  it("falls back to the first era without selection when invalid or missing", () => {
    const fallback = { eraId: ERA, locationId: null, sceneId: null };
    expect(parseAtlasQuery("")).toEqual(fallback);
    expect(parseAtlasQuery("?era=nope&loc=zzz")).toEqual(fallback);
    expect(parseAtlasQuery("?era=nope")).toEqual(fallback);
  });

  it("keeps a valid era when loc is invalid", () => {
    expect(parseAtlasQuery(`?era=${ERA}&loc=zzz`)).toEqual({ eraId: ERA, locationId: null, sceneId: null });
  });

  it.skipIf(!getEra("roma"))("loc wins over a mismatched era", () => {
    expect(parseAtlasQuery(`?era=roma&loc=${BLOMBOS}`)).toEqual({ eraId: ERA, locationId: BLOMBOS, sceneId: null });
  });
});
