/** Client-side Node Admin auth cookie / session helpers (H6 short access + refresh). */

const ACCESS_MAX_AGE_SEC = 60 * 60;
const REFRESH_MAX_AGE_SEC = 30 * 24 * 60 * 60;
const STORAGE_KEY = "wt_node_token";
const REFRESH_KEY = "wt_node_refresh";

export function persistNodeAuth(token: string, refreshToken?: string | null) {
  document.cookie = `wt_token=${encodeURIComponent(token)}; path=/; max-age=${ACCESS_MAX_AGE_SEC}; SameSite=Lax`;
  sessionStorage.setItem(STORAGE_KEY, token);
  if (refreshToken) {
    document.cookie = `wt_refresh=${encodeURIComponent(refreshToken)}; path=/; max-age=${REFRESH_MAX_AGE_SEC}; SameSite=Lax`;
    sessionStorage.setItem(REFRESH_KEY, refreshToken);
  }
}

export function clearNodeAuth() {
  document.cookie = "wt_token=; path=/; max-age=0; SameSite=Lax";
  document.cookie = "wt_refresh=; path=/; max-age=0; SameSite=Lax";
  sessionStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function readNodeRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromSession = sessionStorage.getItem(REFRESH_KEY);
  if (fromSession) return fromSession;
  const m = document.cookie.match(/(?:^|;\s*)wt_refresh=([^;]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

/** Refresh access JWT via home-node /api/auth/refresh. */
export async function refreshNodeAccessSession(): Promise<boolean> {
  const refreshToken = readNodeRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { token?: string; refreshToken?: string };
    if (!data.token) return false;
    persistNodeAuth(data.token, data.refreshToken ?? refreshToken);
    return true;
  } catch {
    return false;
  }
}
