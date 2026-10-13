import { beforeEach, describe, expect, it, vi } from "vitest";

const mem = new Map<string, string>();
const session = new Map<string, string>();
let cookieJar = "";

vi.stubGlobal("localStorage", {
  getItem: (k: string) => mem.get(k) ?? null,
  setItem: (k: string, v: string) => {
    mem.set(k, v);
  },
  removeItem: (k: string) => {
    mem.delete(k);
  },
});

vi.stubGlobal("sessionStorage", {
  getItem: (k: string) => session.get(k) ?? null,
  setItem: (k: string, v: string) => {
    session.set(k, v);
  },
  removeItem: (k: string) => {
    session.delete(k);
  },
});

vi.stubGlobal("document", {
  get cookie() {
    return cookieJar;
  },
  set cookie(v: string) {
    const name = v.split("=")[0];
    const parts = cookieJar.split("; ").filter((p) => p && !p.startsWith(`${name}=`));
    if (!v.includes("max-age=0")) parts.push(v.split(";")[0]!);
    cookieJar = parts.join("; ");
  },
});

vi.stubGlobal("window", {
  dispatchEvent: () => true,
});

vi.mock("./accessApi", () => ({
  ENV_NODE_URL: "http://localhost:3000",
}));

vi.mock("./themePreference", () => ({
  resetAccessThemeForLogin: vi.fn(),
}));

vi.mock("./safeHttpUrl", () => ({
  normalizeNodeBaseUrl: (u: string) => u.replace(/\/$/, ""),
}));

import { persistAuth, refreshAccessSession } from "./authStorage";

describe("refreshAccessSession", () => {
  beforeEach(() => {
    mem.clear();
    session.clear();
    cookieJar = "";
  });

  it("single-flights concurrent refreshes", async () => {
    persistAuth("old-access", "alice", "http://localhost:3000", "rt-1");
    let calls = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        calls += 1;
        await new Promise((r) => setTimeout(r, 30));
        return {
          ok: true,
          json: async () => ({
            token: "new-access",
            refreshToken: "rt-2",
            username: "alice",
          }),
        };
      })
    );

    const [a, b] = await Promise.all([
      refreshAccessSession("http://localhost:3000"),
      refreshAccessSession("http://localhost:3000"),
    ]);
    expect(a).toBe(true);
    expect(b).toBe(true);
    expect(calls).toBe(1);
    expect(session.get("wt_auth_token")).toBe("new-access");
  });
});
