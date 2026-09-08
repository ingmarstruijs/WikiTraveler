import type { PropertySummary } from "@wikitraveler/ui";
import type { MapPin } from "./accessApi";

const MAP_BROWSE_KEY = "wt_access_map_browse";

export type MapBrowseSession = {
  pins: MapPin[];
  selectedPin: MapPin | null;
  areaDirty: boolean;
  searched: boolean;
  nearMe: boolean;
  nearCoords: { lat: number; lon: number } | null;
  nearResults: PropertySummary[] | null;
  mapDataNodeUrl?: string;
};

const EMPTY: MapBrowseSession = {
  pins: [],
  selectedPin: null,
  areaDirty: false,
  searched: false,
  nearMe: false,
  nearCoords: null,
  nearResults: null,
};

function isPin(value: unknown): value is MapPin {
  if (!value || typeof value !== "object") return false;
  const p = value as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.lat === "number" &&
    typeof p.lon === "number"
  );
}

function parseSession(raw: string): MapBrowseSession {
  const parsed = JSON.parse(raw) as Partial<MapBrowseSession>;
  const pins = Array.isArray(parsed.pins) ? parsed.pins.filter(isPin) : [];
  const selectedPin = isPin(parsed.selectedPin) ? parsed.selectedPin : null;
  const nearCoords =
    parsed.nearCoords &&
    typeof parsed.nearCoords === "object" &&
    Number.isFinite(parsed.nearCoords.lat) &&
    Number.isFinite(parsed.nearCoords.lon)
      ? { lat: parsed.nearCoords.lat, lon: parsed.nearCoords.lon }
      : null;
  return {
    pins,
    selectedPin,
    areaDirty: parsed.areaDirty === true,
    searched: parsed.searched === true,
    nearMe: parsed.nearMe === true,
    nearCoords,
    nearResults: Array.isArray(parsed.nearResults) ? parsed.nearResults : null,
    mapDataNodeUrl: typeof parsed.mapDataNodeUrl === "string" ? parsed.mapDataNodeUrl : undefined,
  };
}

export function readMapBrowseSession(): MapBrowseSession {
  if (typeof window === "undefined") return { ...EMPTY };
  try {
    const raw = sessionStorage.getItem(MAP_BROWSE_KEY);
    if (!raw) return { ...EMPTY };
    return parseSession(raw);
  } catch {
    return { ...EMPTY };
  }
}

export function writeMapBrowseSession(state: MapBrowseSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(MAP_BROWSE_KEY, JSON.stringify(state));
}

export function patchMapBrowseSession(patch: Partial<MapBrowseSession>): void {
  writeMapBrowseSession({ ...readMapBrowseSession(), ...patch });
}
