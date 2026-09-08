import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  ACCESS_IN_APP_BACK_KEY,
  ACCESS_RETURN_KEY,
  buildAccessReturnUrl,
  filtersFromSearchParams,
  nextHistoryIdx,
  parseAccessTab,
  parseDiscoveryView,
  saveAccessReturn,
  shouldRestoreDiscoveryViaBack,
} from "./navigationReturn";

const mem = new Map<string, string>();

describe("navigationReturn", () => {
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

  it("parses valid tabs and defaults unknown values to search", () => {
    expect(parseAccessTab("saved")).toBe("saved");
    expect(parseAccessTab("profile")).toBe("profile");
    expect(parseAccessTab("contribute")).toBe("contribute");
    expect(parseAccessTab("invalid")).toBe("search");
    expect(parseAccessTab(null)).toBe("search");
  });

  it("maps legacy tab ids onto the redesign IA", () => {
    expect(parseAccessTab("nearby")).toBe("search");
    expect(parseAccessTab("settings")).toBe("profile");
    expect(parseAccessTab("contribute")).toBe("contribute");
  });

  it("parses discovery view mode", () => {
    expect(parseDiscoveryView("map")).toBe("map");
    expect(parseDiscoveryView("list")).toBe("list");
    expect(parseDiscoveryView("both")).toBeNull();
  });

  it("builds filters from URL search params including empty location", () => {
    const params = new URLSearchParams("features=step_free,elevator&audited=1&room=1");
    expect(filtersFromSearchParams(params)).toEqual({
      features: ["step_free", "elevator"],
      audited: true,
      hasAccessibleRoom: true,
      location: "",
    });
  });

  it("builds a return URL that restores discovery state", () => {
    const url = buildAccessReturnUrl({
      tab: "search",
      q: "hotel",
      view: "list",
      filters: {
        features: ["elevator"],
        audited: true,
        hasAccessibleRoom: null,
      },
    });
    expect(url).toBe("/?q=hotel&view=list&audited=1&features=elevator");
  });

  it("includes tab=saved in the return URL", () => {
    expect(buildAccessReturnUrl({ tab: "saved" })).toBe("/?tab=saved");
  });

  it("marks in-app back when saving a return URL", () => {
    saveAccessReturn({ tab: "search" });
    expect(mem.get(ACCESS_RETURN_KEY)).toBe("/");
    expect(mem.get(ACCESS_IN_APP_BACK_KEY)).toBe("1");
  });

  it("reads Next.js history idx from history.state", () => {
    expect(nextHistoryIdx({ idx: 2 })).toBe(2);
    expect(nextHistoryIdx({ idx: 0 })).toBe(0);
    expect(nextHistoryIdx({})).toBeNull();
    expect(nextHistoryIdx(null)).toBeNull();
  });

  it("uses history.back for in-app navigations, not a remount of /", () => {
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: true, historyIdx: 1 })).toBe(true);
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: false, historyIdx: 3 })).toBe(true);
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: true, historyIdx: 0 })).toBe(true);
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: true, historyIdx: null })).toBe(true);
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: false, historyIdx: 0 })).toBe(false);
    expect(shouldRestoreDiscoveryViaBack({ inAppReturn: false, historyIdx: null })).toBe(false);
  });
});
