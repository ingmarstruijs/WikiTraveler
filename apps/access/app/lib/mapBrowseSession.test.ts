import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  patchMapBrowseSession,
  readMapBrowseSession,
  writeMapBrowseSession,
} from "./mapBrowseSession";

const mem = new Map<string, string>();

describe("mapBrowseSession", () => {
  beforeEach(() => {
    mem.clear();
    Object.defineProperty(globalThis, "sessionStorage", {
      value: {
        getItem: (k: string) => mem.get(k) ?? null,
        setItem: (k: string, v: string) => {
          mem.set(k, v);
        },
        removeItem: (k: string) => {
          mem.delete(k);
        },
      },
      configurable: true,
    });
    Object.defineProperty(globalThis, "window", { value: globalThis, configurable: true });
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
  });

  it("round-trips pins and the selected preview", () => {
    writeMapBrowseSession({
      pins: [{ id: "p1", name: "Hotel", location: "EHV", lat: 51.4, lon: 5.4 }],
      selectedPin: { id: "p1", name: "Hotel", location: "EHV", lat: 51.4, lon: 5.4 },
      areaDirty: false,
      searched: true,
      nearMe: false,
      nearCoords: null,
      nearResults: null,
    });
    const next = readMapBrowseSession();
    expect(next.searched).toBe(true);
    expect(next.pins).toHaveLength(1);
    expect(next.selectedPin?.id).toBe("p1");
  });

  it("patches without dropping existing pins", () => {
    writeMapBrowseSession({
      pins: [{ id: "p1", name: "Hotel", location: "EHV", lat: 51.4, lon: 5.4 }],
      selectedPin: null,
      areaDirty: true,
      searched: true,
      nearMe: false,
      nearCoords: null,
      nearResults: null,
    });
    patchMapBrowseSession({ areaDirty: false, selectedPin: { id: "p1", name: "Hotel", location: "EHV", lat: 51.4, lon: 5.4 } });
    const next = readMapBrowseSession();
    expect(next.areaDirty).toBe(false);
    expect(next.pins[0]?.id).toBe("p1");
    expect(next.selectedPin?.id).toBe("p1");
  });
});
