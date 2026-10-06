import { beforeEach, describe, expect, it } from "vitest";
import { getEra } from "@/data/index";
import { useAtlasStore } from "@/store/useAtlasStore";

const ERA = "primeros-humanos";
const OMO = "primeros-humanos--omo-kibish";
const BLOMBOS = "primeros-humanos--blombos";
const initial = useAtlasStore.getState();
const get = () => useAtlasStore.getState();

beforeEach(() => useAtlasStore.setState(initial, true));

describe("atlas store", () => {
  it("starts on the first era without selection", () => {
    expect(get().activeEraId).toBe(ERA);
    expect(get().displayedEraId).toBe(ERA);
    expect(get().selectedLocationId).toBeNull();
  });

  it("setEra clears selection and hover", () => {
    get().selectLocation(OMO);
    get().setHovered(BLOMBOS);
    get().setEra(ERA);
    expect(get().selectedLocationId).toBeNull();
    expect(get().hoveredLocationId).toBeNull();
    expect(get().activeEraId).toBe(ERA);
  });

  it("setEra with unknown id is ignored", () => {
    get().selectLocation(OMO);
    get().setEra("nope");
    expect(get().activeEraId).toBe(ERA);
    expect(get().selectedLocationId).toBe(OMO);
  });

  it("selectLocation sets the selection", () => {
    get().selectLocation(BLOMBOS);
    expect(get().selectedLocationId).toBe(BLOMBOS);
  });

  it.skipIf(!getEra("roma"))("selectLocation of another era switches era", () => {
    const loc = getEra("roma")!.locations[0].id;
    get().selectLocation(loc);
    expect(get().activeEraId).toBe("roma");
    expect(get().selectedLocationId).toBe(loc);
  });

  it("selectLocation with unknown id is ignored", () => {
    get().selectLocation("zzz");
    expect(get().selectedLocationId).toBeNull();
  });

  it("clearSelection clears the selection", () => {
    get().selectLocation(OMO);
    get().clearSelection();
    expect(get().selectedLocationId).toBeNull();
    expect(get().activeEraId).toBe(ERA);
  });

  it("setDisplayedEra updates only the displayed era", () => {
    get().setDisplayedEra("other");
    expect(get().displayedEraId).toBe("other");
    expect(get().activeEraId).toBe(ERA);
  });
});
