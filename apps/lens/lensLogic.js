/**
 * Pure Lens helpers — shared by popup (ES module) and unit tests.
 * No DOM / chrome.* APIs.
 */

export const DEFAULT_NODE_URL = "https://node-eu.wikitraveler.org";
export const ACCESS_HUB_URL = "https://access.wikitraveler.org";
export const ONBOARDING_KEY = "lensOnboardingDone";

/** Coverage categories — same field→step map as Access (`auditStepForField`). */
export const CATEGORY_EXPECTED = [
  { id: "mobility", labelKey: "ui.auditStepMobility", steps: ["entrance", "mobility"], expected: 11 },
  { id: "room", labelKey: "ui.auditStepRoom", steps: ["room"], expected: 7 },
  { id: "bathroom", labelKey: "ui.auditStepBathroom", steps: ["bathroom"], expected: 3 },
  { id: "communication", labelKey: "ui.auditStepCommunication", steps: ["communication"], expected: 5 },
];

export const FIELD_STEP = {
  step_free_entrance: "entrance",
  automatic_door: "entrance",
  ramp_present: "entrance",
  door_width_cm: "entrance",
  path_to_entrance: "entrance",
  elevator_present: "mobility",
  elevator_width_cm: "mobility",
  corridor_min_width_cm: "mobility",
  parking_accessible: "mobility",
  pool_lift: "mobility",
  room_types_available: "room",
  accessible_room_description: "room",
  step_free_room: "room",
  clear_space_beside_bed: "room",
  bed_height_cm: "room",
  turning_circle_cm: "room",
  accessible_bathroom: "bathroom",
  roll_in_shower: "bathroom",
  grab_bars_bathroom: "bathroom",
  hearing_loop: "communication",
  braille_signage: "communication",
  tactile_paving: "communication",
  visual_alarms: "communication",
  service_animal_policy: "communication",
};

export const FEATURE_HIGHLIGHTS = [
  "step_free_entrance",
  "accessible_bathroom",
  "elevator_present",
  "parking_accessible",
];

/** Wait this long after the last keystroke before querying the node. */
export const SEARCH_DEBOUNCE_MS = 500;
export const SEARCH_MIN_CHARS = 2;

export function truthyFactValue(value) {
  const v = String(value ?? "").trim().toLowerCase();
  if (!v || v === "no" || v === "n/a" || v === "false" || v === "0") return false;
  return true;
}

export function computeCategoryBars(facts) {
  const byStep = {};
  for (const f of facts ?? []) {
    const step = FIELD_STEP[f.fieldName];
    if (!step) continue;
    byStep[step] = (byStep[step] ?? 0) + 1;
  }
  return CATEGORY_EXPECTED.map((cat) => {
    const count = cat.steps.reduce((sum, s) => sum + (byStep[s] ?? 0), 0);
    const pct = Math.min(100, Math.round((count / cat.expected) * 100));
    return { id: cat.id, labelKey: cat.labelKey, pct, count };
  });
}

/** Overall score = expected-field-weighted coverage across categories (0–100), or null. */
export function overallAccessibilityScore(bars) {
  let weighted = 0;
  let expected = 0;
  for (let i = 0; i < CATEGORY_EXPECTED.length; i++) {
    const bar = bars[i];
    if (!bar) continue;
    weighted += bar.pct * CATEGORY_EXPECTED[i].expected;
    expected += CATEGORY_EXPECTED[i].expected;
  }
  if (expected <= 0) return null;
  if (bars.every((b) => b.pct === 0)) return null;
  return Math.round(weighted / expected);
}

export function scoreFromFacts(facts) {
  const bars = computeCategoryBars(facts);
  return { bars, score: overallAccessibilityScore(bars) };
}

export function propertyViewUrl(nodeUrl, propertyId) {
  return `${ACCESS_HUB_URL}/properties/${encodeURIComponent(propertyId)}?node=${encodeURIComponent(nodeUrl)}`;
}

/** Opens Access property detail with the report sheet ready. */
export function propertyReportUrl(nodeUrl, propertyId) {
  return `${propertyViewUrl(nodeUrl, propertyId)}&report=1`;
}

export function isAllowedNodeUrl(raw) {
  try {
    const u = new URL(raw);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/** Common lodging / article tokens stripped when comparing hotel names. */
const HOTEL_NAME_NOISE = new Set([
  "hotel",
  "hotels",
  "hostel",
  "hostels",
  "motel",
  "motels",
  "apartment",
  "apartments",
  "appartment",
  "appartments",
  "apt",
  "villa",
  "villas",
  "resort",
  "resorts",
  "inn",
  "lodge",
  "lodges",
  "guesthouse",
  "boutique",
  "suites",
  "suite",
  "the",
  "a",
  "an",
  "le",
  "la",
  "les",
  "el",
  "los",
  "las",
  "der",
  "die",
  "das",
  "het",
  "de",
  "het",
]);

/**
 * Normalize a hotel/property name for fuzzy matching
 * (e.g. "Hotel the Match" → "match", "The Match" → "match").
 */
export function normalizeHotelName(name) {
  let tokens = String(name ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  while (tokens.length > 1 && HOTEL_NAME_NOISE.has(tokens[0])) {
    tokens = tokens.slice(1);
  }
  while (tokens.length > 1 && HOTEL_NAME_NOISE.has(tokens[tokens.length - 1])) {
    tokens = tokens.slice(0, -1);
  }
  return tokens.join(" ").trim();
}

export function hotelNamesLooselyEqual(a, b) {
  const na = normalizeHotelName(a);
  const nb = normalizeHotelName(b);
  if (!na || !nb) return false;
  if (na === nb) return true;

  const aTok = na.split(/\s+/);
  const bTok = nb.split(/\s+/);
  const [shortTok, longTok] = aTok.length <= bTok.length ? [aTok, bTok] : [bTok, aTok];
  if (shortTok.join(" ").length < 4) return false;

  // Contiguous token subsequence — avoids "match" ⊆ "matchroom"
  for (let i = 0; i <= longTok.length - shortTok.length; i++) {
    if (shortTok.every((t, j) => longTok[i + j] === t)) return true;
  }
  return false;
}

/** Query variants from longest/most specific to shortest. */
export function buildHotelSearchQueries(name) {
  const raw = String(name ?? "").trim().replace(/\s+/g, " ");
  if (!raw) return [];

  const queries = [];
  const push = (q) => {
    const t = String(q ?? "").trim().replace(/\s+/g, " ");
    if (t.length >= 2 && !queries.some((x) => x.toLowerCase() === t.toLowerCase())) {
      queries.push(t);
    }
  };

  push(raw);
  const normalized = normalizeHotelName(raw);
  if (normalized) push(normalized);

  const words = raw.split(/\s+/).filter(Boolean);
  for (let len = words.length; len >= 1; len--) {
    push(words.slice(0, len).join(" "));
    push(words.slice(-len).join(" "));
  }

  const normWords = normalized.split(/\s+/).filter(Boolean);
  for (let len = normWords.length; len >= 1; len--) {
    push(normWords.slice(0, len).join(" "));
    push(normWords.slice(-len).join(" "));
  }

  return queries;
}

/**
 * Pick the best property from API search hits for a page/listing name.
 * @returns {object | null}
 */
export function pickBestPropertyMatch(queryName, results) {
  const list = Array.isArray(results) ? results : [];
  if (list.length === 0) return null;

  const lower = String(queryName ?? "").trim().toLowerCase();
  const exact = list.find((p) => String(p.name ?? "").toLowerCase() === lower);
  if (exact) return exact;

  const loose = list.filter((p) => hotelNamesLooselyEqual(queryName, p.name));
  if (loose.length === 1) return loose[0];
  if (loose.length > 1) {
    // Prefer exact normalized equality over containment
    const strict = loose.filter(
      (p) => normalizeHotelName(queryName) === normalizeHotelName(p.name)
    );
    if (strict.length === 1) return strict[0];
  }

  const prefixMatches = list.filter((p) => {
    const n = String(p.name ?? "").toLowerCase();
    return n.length >= 4 && (lower.startsWith(n) || n.startsWith(lower));
  });
  if (prefixMatches.length === 1) return prefixMatches[0];

  if (list.length === 1 && hotelNamesLooselyEqual(queryName, list[0].name)) {
    return list[0];
  }

  return null;
}

/** Strip OTA suffixes from a browser tab title to guess the hotel name. */
export function extractHotelNameFromTitle(title) {
  return String(title ?? "")
    .replace(/\s*[|\u2013\u2014]\s*(Booking\.com|Expedia|Hotels\.com|Agoda).*$/i, "")
    .replace(/,\s*[A-Z][^,]+.*$/, "")
    .trim();
}

/** Display grouping — mirrors Access `SECTION_RULES` / `splitRoomSectionFacts`. */
const FACT_SECTION_RULES = [
  {
    id: "entrance",
    labelKey: "ui.propertySectionEntrance",
    fields: [
      "step_free_entrance",
      "automatic_door",
      "ramp_present",
      "door_width_cm",
      "path_to_entrance",
    ],
  },
  {
    id: "mobility",
    labelKey: "ui.propertySectionCirculation",
    fields: [
      "elevator_present",
      "elevator_width_cm",
      "corridor_min_width_cm",
      "parking_accessible",
      "pool_lift",
      "elevator_floor_count",
    ],
  },
  {
    id: "room",
    labelKey: "ui.propertySectionRoom",
    fields: [
      "room_types_available",
      "accessible_room_description",
      "step_free_room",
      "clear_space_beside_bed",
      "bed_height_cm",
      "turning_circle_cm",
      "accessible_room_count",
    ],
    prefixes: ["room-type:"],
  },
  {
    id: "bathroom",
    labelKey: "ui.propertySectionBathroom",
    fields: ["accessible_bathroom", "roll_in_shower", "grab_bars_bathroom"],
  },
  {
    id: "communication",
    labelKey: "ui.propertySectionSensory",
    fields: [
      "hearing_loop",
      "braille_signage",
      "tactile_paving",
      "visual_alarms",
      "service_animal_policy",
    ],
  },
];

const ROOM_FACT_ORDER = [
  "step_free_room",
  "clear_space_beside_bed",
  "bed_height_cm",
  "turning_circle_cm",
  "accessible_room_description",
  "roll_in_shower",
  "grab_bars_bathroom",
];

function factStorageKey(fact) {
  return `${fact.scopeKey ?? "property"}:${fact.fieldName}`;
}

export function groupFactsBySection(facts) {
  const assigned = new Set();
  const sections = [];
  const list = facts ?? [];
  for (const rule of FACT_SECTION_RULES) {
    const sectionFacts = list.filter((f) => {
      const key = factStorageKey(f);
      if (assigned.has(key)) return false;
      const match =
        rule.fields.includes(f.fieldName) ||
        (rule.prefixes ?? []).some((p) => String(f.scopeKey ?? "").startsWith(p));
      if (!match) return false;
      assigned.add(key);
      return true;
    });
    if (sectionFacts.length > 0) {
      sections.push({ id: rule.id, labelKey: rule.labelKey, facts: sectionFacts });
    }
  }
  const other = list.filter((f) => !assigned.has(factStorageKey(f)));
  if (other.length > 0) {
    sections.push({ id: "other", labelKey: "ui.propertySectionOther", facts: other });
  }
  return sections;
}

export function splitRoomSectionFacts(facts) {
  const overview = [];
  const byType = new Map();
  for (const fact of facts ?? []) {
    const scope = fact.scopeKey ?? "property";
    if (scope.startsWith("room-type:")) {
      const typeId = scope.slice("room-type:".length);
      const grouped = byType.get(typeId) ?? [];
      grouped.push(fact);
      byType.set(typeId, grouped);
    } else {
      overview.push(fact);
    }
  }

  const orderFact = overview.find((f) => f.fieldName === "room_types_available");
  const preferred = String(orderFact?.value ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const groups = [];
  const seen = new Set();
  const sortFacts = (list) =>
    [...list].sort((a, b) => {
      const ai = ROOM_FACT_ORDER.indexOf(a.fieldName);
      const bi = ROOM_FACT_ORDER.indexOf(b.fieldName);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });

  for (const typeId of preferred) {
    const grouped = byType.get(typeId);
    if (!grouped) continue;
    groups.push({ typeId, facts: sortFacts(grouped) });
    seen.add(typeId);
  }
  for (const [typeId, grouped] of byType) {
    if (seen.has(typeId)) continue;
    groups.push({ typeId, facts: sortFacts(grouped) });
  }
  return { overview, groups };
}

/** Same highlight icons as Access `AccessibilityIconRow`. */
export const A11Y_ICON_FIELDS = [
  {
    field: "step_free_entrance",
    tone: "entrance",
    labelKey: "ui.a11yPref_step_free_entrance",
    paths: "M4 20h16M8 20V10l4-4 4 4v10M12 14v6",
  },
  {
    field: "accessible_bathroom",
    tone: "mobility",
    labelKey: "ui.a11yPref_accessible_bathroom",
    paths: "M12 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-4 6h8l-1.5 9h-5L8 11zm-2 3h2m10 0h2",
  },
  {
    field: "elevator_present",
    tone: "mobility",
    labelKey: "ui.a11yPref_elevator_present",
    paths: "M5 3h14v18H5zM9 8l3-3 3 3M9 16l3 3 3-3",
  },
  {
    field: "parking_accessible",
    tone: "parking",
    labelKey: "ui.a11yPref_parking_accessible",
    paths: "M8 4h6a4 4 0 0 1 0 8H8zm0 0v16",
  },
  {
    field: "braille_signage",
    tone: "sensory",
    labelKey: "ui.a11yPref_braille_signage",
    paths: "M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01",
  },
  {
    field: "hearing_loop",
    tone: "hearing",
    labelKey: "ui.a11yPref_hearing_loop",
    paths: "M6 10a6 6 0 0 1 12 0M9 11a3 3 0 0 1 6 0v2a2 2 0 0 1-2 2h-1",
  },
  {
    field: "visual_alarms",
    tone: "hearing",
    labelKey: "ui.a11yPref_visual_alarms",
    paths:
      "M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3l-1.4-1.4M19.1 19.1l-1.4-1.4M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8z",
  },
  {
    field: "ramp_present",
    tone: "entrance",
    labelKey: "ui.a11yPref_ramp_present",
    paths: "M4 18h16L8 6H4z",
  },
];

export function presentA11yIcons(facts, max = 5) {
  const byName = new Map();
  for (const f of facts ?? []) byName.set(f.fieldName, f.value);
  const present = A11Y_ICON_FIELDS.filter((icon) => truthyFactValue(byName.get(icon.field)));
  return {
    shown: present.slice(0, max),
    more: Math.max(0, present.length - Math.min(max, present.length)),
  };
}

export function featurePresence(facts, fieldNames = FEATURE_HIGHLIGHTS) {
  const byName = new Map((facts ?? []).map((f) => [f.fieldName, f]));
  return fieldNames.map((fieldName) => {
    const fact = byName.get(fieldName);
    return {
      fieldName,
      present: Boolean(fact && truthyFactValue(fact.value)),
    };
  });
}
