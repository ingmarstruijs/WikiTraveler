import { describe, expect, it } from "vitest";
import {
  clampBottomOverlayPx,
  fallbackDiscoveryMapBottomOverlay,
  mapFitPaddingForBottomSheet,
  targetZoomForShowOnMap,
} from "./mapFocus";

describe("mapFitPaddingForBottomSheet", () => {
  it("offsets the pin upward by half the sheet (Leaflet paddingOffset)", () => {
    const padding = mapFitPaddingForBottomSheet(200, 16);
    expect(padding.paddingTopLeft).toEqual([0, 12]);
    expect(padding.paddingBottomRight).toEqual([0, 216]);
  });
});

describe("clampBottomOverlayPx", () => {
  it("keeps padding inside the map so fitBounds stays valid", () => {
    expect(clampBottomOverlayPx(400, 600)).toBe(330);
    expect(clampBottomOverlayPx(80, 600)).toBe(80);
  });
});

describe("fallbackDiscoveryMapBottomOverlay", () => {
  it("uses the mobile vs desktop max-height caps", () => {
    expect(fallbackDiscoveryMapBottomOverlay(800, false)).toBe(420);
    expect(fallbackDiscoveryMapBottomOverlay(800, true)).toBe(368);
  });
});

describe("targetZoomForShowOnMap", () => {
  it("does not zoom out and zooms in when the view is too wide", () => {
    expect(targetZoomForShowOnMap(16)).toBe(16);
    expect(targetZoomForShowOnMap(10)).toBe(14);
  });
});
