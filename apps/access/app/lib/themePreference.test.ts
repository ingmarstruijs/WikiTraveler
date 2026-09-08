import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";

vi.mock("./authStorage", () => ({
  readAuthToken: vi.fn(),
}));

vi.mock("./profileSyncEvents", () => ({
  emitPreferencesDirty: vi.fn(),
  emitFavoritesDirty: vi.fn(),
  emitProfileSynced: vi.fn(),
  PREFERENCES_DIRTY_EVENT: "wt-preferences-dirty",
  FAVORITES_DIRTY_EVENT: "wt-favorites-dirty",
  SYNCED_EVENT: "wt-profile-synced",
}));

import { DEFAULT_ACCESS_THEME, readAccessThemePreference, writeAccessThemePreference } from "./themePreference";
import { readAuthToken } from "./authStorage";
import { emitPreferencesDirty } from "./profileSyncEvents";

describe("readAccessThemePreference", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => {
        store.set(key, value);
      },
      removeItem: (key: string) => {
        store.delete(key);
      },
      clear: () => store.clear(),
    });
    vi.mocked(readAuthToken).mockReturnValue(null);
    vi.mocked(emitPreferencesDirty).mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns standard theme when signed out", () => {
    expect(readAccessThemePreference()).toBe(DEFAULT_ACCESS_THEME);
  });

  it("returns per-user theme when signed in", () => {
    vi.mocked(readAuthToken).mockReturnValue("token");
    localStorage.setItem("wt_username", "alice");
    localStorage.setItem(
      "wt_access_theme",
      JSON.stringify({ byUser: { alice: "dark" } })
    );
    expect(readAccessThemePreference()).toBe("dark");
  });

  it("does not mark prefs dirty when re-applying the default theme", () => {
    vi.mocked(readAuthToken).mockReturnValue("token");
    localStorage.setItem("wt_username", "alice");
    writeAccessThemePreference("light");
    expect(emitPreferencesDirty).not.toHaveBeenCalled();

    writeAccessThemePreference("dark");
    expect(emitPreferencesDirty).toHaveBeenCalledTimes(1);
    expect(readAccessThemePreference()).toBe("dark");
  });
});
