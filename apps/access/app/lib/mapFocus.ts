const TOP_PAD = 12;
const SHEET_GAP = 16;

/** Layout height of the discovery pin sheet, including CSS `bottom` inset. */
export function measureDiscoveryMapBottomOverlay(mapEl: HTMLElement | null): number {
  if (!mapEl) return 0;
  const root = mapEl.closest(".fk-discovery-map") ?? mapEl.parentElement;
  const sheet = root?.querySelector(".fk-map-preview");
  if (!(sheet instanceof HTMLElement)) return 0;
  const bottom = Number.parseFloat(getComputedStyle(sheet).bottom) || 0;
  return Math.round(sheet.offsetHeight + bottom);
}

/** CSS max-height of `.fk-map-preview` when the sheet is not measurable yet. */
export function fallbackDiscoveryMapBottomOverlay(mapHeight: number, desktopSplit: boolean): number {
  const ratio = desktopSplit ? 0.46 : 0.58;
  const cap = desktopSplit ? 360 : 420;
  const inset = desktopSplit ? 8 : 0;
  return Math.min(cap, Math.round(mapHeight * ratio)) + inset;
}

export function clampBottomOverlayPx(overlayPx: number, mapHeight: number): number {
  if (mapHeight <= 0) return Math.max(0, overlayPx);
  return Math.min(Math.max(0, overlayPx), Math.floor(mapHeight * 0.55));
}

/** Leaflet padding so a pin sits in the visual centre of the map above a bottom sheet. */
export function mapFitPaddingForBottomSheet(
  overlayPx: number,
  extraGap = SHEET_GAP
): {
  paddingTopLeft: [number, number];
  paddingBottomRight: [number, number];
} {
  return {
    paddingTopLeft: [0, TOP_PAD],
    paddingBottomRight: [0, Math.max(0, overlayPx) + extraGap],
  };
}

export function targetZoomForShowOnMap(currentZoom: number): number {
  return Math.max(currentZoom, 14);
}
