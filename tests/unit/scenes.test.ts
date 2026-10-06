import { beforeEach, describe, expect, it } from "vitest";
import { eras } from "@/data/index";
import { buildAtlasQuery, parseAtlasQuery } from "@/lib/url";
import { beatAt, beatIndexAt, formatClock, midpoint, validateBeats } from "@/scenes/beats";
import { getSceneByElementId, getSceneLocation, hasScene, scenes } from "@/scenes/registry";
import { MAX_CAPTION } from "@/scenes/types";
import { useAtlasStore } from "@/store/useAtlasStore";

const ERA = "primeros-humanos";
const BLOMBOS = "primeros-humanos--blombos";
const OMO = "primeros-humanos--omo-kibish";
const SCENE = "primeros-humanos--blombos--technology";
const NO_SCENE = "primeros-humanos--blombos--landmark";

const allElementIds = new Set(eras.flatMap((e) => e.locations.flatMap((l) => l.elements.map((el) => el.id))));

describe("scene registry", () => {
  it("has unique scene ids and element ids", () => {
    expect(new Set(scenes.map((s) => s.id)).size).toBe(scenes.length);
    expect(new Set(scenes.map((s) => s.elementId)).size).toBe(scenes.length);
  });

  describe.each(scenes.map((s) => [s.id, s] as const))("%s", (_id, scene) => {
    it("points at an element that exists in the data", () => {
      expect(allElementIds.has(scene.elementId)).toBe(true);
      expect(getSceneLocation(scene.elementId)?.location.elements.some((e) => e.id === scene.elementId)).toBe(true);
    });

    it("has ordered, contiguous, non-overlapping beats ending at duration", () => {
      const { beats } = scene;
      expect(beats.length).toBeGreaterThan(0);
      expect(beats[0].start).toBe(0);
      beats.forEach((b, i) => {
        expect(b.end).toBeGreaterThan(b.start);
        if (i > 0) expect(b.start).toBe(beats[i - 1].end);
      });
      expect(scene.duration).toBe(beats[beats.length - 1].end);
    });

    it("has captions ≤ 140 chars and unique beat ids", () => {
      for (const b of scene.beats) expect(b.caption.length).toBeLessThanOrEqual(MAX_CAPTION);
      expect(new Set(scene.beats.map((b) => b.id)).size).toBe(scene.beats.length);
    });

    it("passes validateBeats", () => {
      expect(validateBeats(scene)).toEqual([]);
    });
  });

  it("looks scenes up by element id", () => {
    expect(getSceneByElementId(SCENE)?.elementId).toBe(SCENE);
    expect(hasScene(SCENE)).toBe(true);
    expect(hasScene(NO_SCENE)).toBe(false);
    expect(hasScene(null)).toBe(false);
    expect(getSceneLocation(NO_SCENE)).toBeUndefined();
  });
});

describe("beat helpers", () => {
  const beats = [
    { id: "a", start: 0, end: 2, caption: "A", visual: "" },
    { id: "b", start: 2, end: 5, caption: "B", visual: "" },
    { id: "c", start: 5, end: 6, caption: "C", visual: "" },
  ];

  it("finds the beat at a time ([start, end), clamped)", () => {
    expect(beatIndexAt(beats, -1)).toBe(0);
    expect(beatIndexAt(beats, 0)).toBe(0);
    expect(beatIndexAt(beats, 1.99)).toBe(0);
    expect(beatIndexAt(beats, 2)).toBe(1);
    expect(beatAt(beats, 5.5).id).toBe("c");
    expect(beatAt(beats, 99).id).toBe("c");
  });

  it("midpoint and clock format", () => {
    expect(midpoint(beats[1])).toBe(3.5);
    expect(formatClock(10)).toBe("0:10");
    expect(formatClock(70.9)).toBe("1:10");
  });

  it("validateBeats reports gaps, overlaps, long captions, duplicates and duration", () => {
    expect(validateBeats({ id: "ok", duration: 6, beats })).toEqual([]);
    const bad = [
      { id: "a", start: 0.5, end: 2, caption: "x".repeat(MAX_CAPTION + 1), visual: "" },
      { id: "a", start: 1.5, end: 3, caption: "B", visual: "" },
    ];
    const problems = validateBeats({ id: "bad", duration: 4, beats: bad });
    expect(problems.join("\n")).toMatch(/first beat/);
    expect(problems.join("\n")).toMatch(/previous ends/);
    expect(problems.join("\n")).toMatch(/caption/);
    expect(problems.join("\n")).toMatch(/duplicate/);
    expect(problems.join("\n")).toMatch(/duration/);
  });
});

describe("url with scene", () => {
  it("builds scene after loc, only with a loc", () => {
    expect(buildAtlasQuery({ eraId: ERA, locationId: BLOMBOS, sceneId: SCENE })).toBe(
      `?era=${ERA}&loc=${BLOMBOS}&scene=${SCENE}`,
    );
    expect(buildAtlasQuery({ eraId: ERA, locationId: null, sceneId: SCENE })).toBe(`?era=${ERA}`);
  });

  it("round-trips a valid scene", () => {
    const q = { eraId: ERA, locationId: BLOMBOS, sceneId: SCENE };
    expect(parseAtlasQuery(buildAtlasQuery(q))).toEqual(q);
  });

  it("drops scene without loc, with another loc, or without a registered scene", () => {
    expect(parseAtlasQuery(`?era=${ERA}&scene=${SCENE}`).sceneId).toBeNull();
    expect(parseAtlasQuery(`?era=${ERA}&loc=${OMO}&scene=${SCENE}`)).toEqual({
      eraId: ERA,
      locationId: OMO,
      sceneId: null,
    });
    expect(parseAtlasQuery(`?era=${ERA}&loc=${BLOMBOS}&scene=${NO_SCENE}`).sceneId).toBeNull();
    expect(parseAtlasQuery(`?era=${ERA}&loc=${BLOMBOS}&scene=zzz`).sceneId).toBeNull();
  });
});

describe("store scene state", () => {
  const initial = useAtlasStore.getState();
  const get = () => useAtlasStore.getState();
  beforeEach(() => useAtlasStore.setState(initial, true));

  it("openScene selects the element's location and stores the origin", () => {
    const origin = { x: 1, y: 2, width: 3, height: 4 };
    get().openScene(SCENE, origin);
    expect(get().sceneElementId).toBe(SCENE);
    expect(get().selectedLocationId).toBe(BLOMBOS);
    expect(get().activeEraId).toBe(ERA);
    expect(get().sceneOrigin).toEqual(origin);
  });

  it("openScene ignores elements without scene", () => {
    get().selectLocation(BLOMBOS);
    get().openScene(NO_SCENE);
    get().openScene("zzz");
    expect(get().sceneElementId).toBeNull();
  });

  it("closeScene keeps the selection", () => {
    get().openScene(SCENE);
    get().closeScene();
    expect(get().sceneElementId).toBeNull();
    expect(get().selectedLocationId).toBe(BLOMBOS);
  });

  it("setEra, selecting another location and clearSelection close the scene", () => {
    get().openScene(SCENE);
    get().setEra(ERA);
    expect(get().sceneElementId).toBeNull();

    get().openScene(SCENE);
    get().selectLocation(BLOMBOS);
    expect(get().sceneElementId).toBe(SCENE);
    get().selectLocation(OMO);
    expect(get().sceneElementId).toBeNull();

    get().openScene(SCENE);
    get().clearSelection();
    expect(get().sceneElementId).toBeNull();
    expect(get().selectedLocationId).toBeNull();
  });
});
