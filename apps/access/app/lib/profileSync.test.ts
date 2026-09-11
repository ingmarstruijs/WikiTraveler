import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./authStorage", () => ({
  AUTH_CHANGED_EVENT: "wt-auth-changed",
  readAuthToken: vi.fn(() => "tok"),
}));

vi.mock("./accessApi", () => ({
  getStoredNodeUrl: () => "http://localhost:3000",
  getAuthHeaders: () => ({ Authorization: "Bearer tok" }),
}));

import { writeA11yPreferences, readA11yPreferences } from "./a11yPreferences";
import { readSavedPlaces, writeSavedPlaces } from "./savedPlaces";
import { readAccessThemePreference } from "./themePreference";
import {
  scheduleFavoritesPush,
  schedulePreferencesPush,
  syncProfileFromServer,
} from "./profileSync";
import { writeUserScoped } from "./userScopedStorage";

const mem = new Map<string, string>();

function jsonResponse(data: unknown, ok = true): Response {
  return {
    ok,
    json: async () => data,
  } as Response;
}

describe("syncProfileFromServer", () => {
  beforeEach(() => {
    mem.clear();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (k: string) => mem.get(k) ?? null,
        setItem: (k: string, v: string) => {
          mem.set(k, v);
        },
        removeItem: (k: string) => {
          mem.delete(k);
        },
        clear: () => mem.clear(),
      },
      configurable: true,
    });
    localStorage.setItem("wt_username", "alice");
    localStorage.setItem("wt_node_url", "http://localhost:3000");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("hydrates local cache from server when server is newer", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: ["elevator_present"],
              theme: "dark",
              updatedAt: "2026-06-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({
            places: [
              {
                id: "p1",
                name: "Hotel",
                location: "EHV",
                nodeUrl: "http://localhost:3000",
                savedAt: "2026-06-01T00:00:00.000Z",
              },
            ],
            updatedAt: "2026-06-01T00:00:00.000Z",
          });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(readA11yPreferences()).toEqual(["elevator_present"]);
    expect(readSavedPlaces()).toHaveLength(1);
    expect(readSavedPlaces()[0]?.id).toBe("p1");
  });

  it("hydrates a11y prefs and theme when the local prefs stamp is still empty", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: ["elevator_present", "ramp_present"],
              theme: "dark",
              updatedAt: "2026-06-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({ places: [], updatedAt: "2026-01-01T00:00:00.000Z" });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(readA11yPreferences()).toEqual(["elevator_present", "ramp_present"]);
    expect(readAccessThemePreference()).toBe("dark");
  });

  it("does not resurrect older server prefs over a newer empty local stamp", async () => {
    writeUserScoped("wt_prefs_updated_at", "2026-09-08T12:00:00.000Z");

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: ["elevator_present", "ramp_present"],
              theme: "dark",
              updatedAt: "2026-06-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({ places: [], updatedAt: "2026-01-01T00:00:00.000Z" });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(readA11yPreferences()).toEqual([]);
  });

  it("pushes local favorites when server is empty even if updatedAt is non-zero", async () => {
    writeSavedPlaces(
      [
        {
          id: "local-2",
          name: "Local",
          location: "",
          nodeUrl: "http://localhost:3000",
          savedAt: "2026-01-01T00:00:00.000Z",
        },
      ],
      { skipSync: true }
    );

    const putBodies: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: [],
              theme: null,
              updatedAt: "2026-09-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites") && init?.method === "PUT") {
          putBodies.push(String(init.body));
          return jsonResponse({
            places: JSON.parse(String(init.body)).places,
            updatedAt: "2026-09-04T00:00:00.000Z",
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({ places: [], updatedAt: "2026-09-01T00:00:00.000Z" });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(putBodies.length).toBeGreaterThan(0);
    expect(putBodies[0]).toContain("local-2");
  });

  it("does not let a concurrent pull overwrite unsynced local favorites", async () => {
    writeSavedPlaces(
      [
        {
          id: "local-new",
          name: "Local new",
          location: "",
          nodeUrl: "http://localhost:3000",
          savedAt: "2026-09-08T00:00:00.000Z",
        },
      ],
      { skipSync: true }
    );
    scheduleFavoritesPush();

    const putBodies: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: [],
              theme: null,
              updatedAt: "2026-09-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites") && init?.method === "PUT") {
          putBodies.push(String(init.body));
          return jsonResponse({
            places: JSON.parse(String(init.body)).places,
            updatedAt: "2026-09-08T12:00:00.000Z",
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({
            places: [
              {
                id: "server-old",
                name: "Server",
                location: "",
                nodeUrl: "http://localhost:3000",
                savedAt: "2026-08-01T00:00:00.000Z",
              },
            ],
            updatedAt: "2026-09-01T00:00:00.000Z",
          });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(putBodies.some((body) => body.includes("local-new"))).toBe(true);
    expect(readSavedPlaces().map((p) => p.id)).toEqual(["local-new"]);
  });

  it("pushes cleared a11y preferences and does not resurrect older server prefs", async () => {
    writeA11yPreferences([], { skipSync: true });
    schedulePreferencesPush();

    const putBodies: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/api/auth/me")) {
          return jsonResponse({
            preferences: {
              a11yPreferences: ["step_free_entrance", "accessible_bathroom"],
              theme: null,
              updatedAt: "2026-09-01T00:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/preferences") && init?.method === "PUT") {
          putBodies.push(String(init.body));
          const body = JSON.parse(String(init.body)) as { a11yPreferences: string[] };
          return jsonResponse({
            preferences: {
              a11yPreferences: body.a11yPreferences,
              theme: null,
              updatedAt: "2026-09-11T18:00:00.000Z",
            },
          });
        }
        if (url.includes("/api/auth/favorites")) {
          return jsonResponse({ places: [], updatedAt: "2026-01-01T00:00:00.000Z" });
        }
        return jsonResponse({}, false);
      })
    );

    await syncProfileFromServer();
    expect(putBodies.length).toBeGreaterThan(0);
    expect(JSON.parse(putBodies[0]!).a11yPreferences).toEqual([]);
    expect(readA11yPreferences()).toEqual([]);
  });
});
