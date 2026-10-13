import { ENV_NODE_URL } from "./accessApi";
import { normalizeNodeBaseUrl } from "./safeHttpUrl";
import { resetAccessThemeForLogin } from "./themePreference";

const AUTH_COOKIE = "wt_token";
const REFRESH_COOKIE = "wt_refresh";
const NODE_URL_COOKIE = "wt_node_url";
const AUTH_SESSION_KEY = "wt_auth_token";
const REFRESH_SESSION_KEY = "wt_refresh_token";
const NODE_URL_KEY = "wt_node_url";
const USERNAME_KEY = "wt_username";
/** Access JWT cookie lifetime (matches TRAVELER_ACCESS_TOKEN_TTL ≈ 1h). */
const ACCESS_MAX_AGE_SEC = 60 * 60;
/** Opaque refresh cookie lifetime (30 days). */
const REFRESH_MAX_AGE_SEC = 30 * 24 * 60 * 60;

/** Fired after login / logout so per-user local state can reload. */
export const AUTH_CHANGED_EVENT = "wt-auth-changed";

function emitAuthChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(AUTH_CHANGED_EVENT));
}

/** Mirror configured node URL into a cookie so SSR audit pages hit the right node. */
export function persistNodeUrlCookie(nodeUrl: string) {
  const safe = normalizeNodeBaseUrl(nodeUrl);
  if (!safe) return;
  document.cookie = `${NODE_URL_COOKIE}=${encodeURIComponent(safe)}; path=/; max-age=${REFRESH_MAX_AGE_SEC}; SameSite=Lax`;
}

export function readNodeUrlCookie(raw?: string | null): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export type AppRole = "USER" | "AUDITOR" | "ADMIN";

/** @deprecated use AppRole */
export type AccessLegacyRole = AppRole;

export function normalizeRole(role?: string | null): AppRole {
  const upper = (role ?? "USER").toUpperCase();
  if (upper === "AUDITOR" || upper === "ADMIN") return upper;
  return "USER";
}

/** All authenticated roles may use WikiTraveler Access. */
export function canAccessApp(role?: string | null): boolean {
  const normalized = normalizeRole(role);
  return normalized === "USER" || normalized === "AUDITOR" || normalized === "ADMIN";
}

/** JWT may contain `=`; always URL-encode when writing document.cookie. */
export function persistAuth(
  token: string,
  username: string,
  nodeUrl: string,
  refreshToken?: string | null
) {
  const safeNodeUrl = normalizeNodeBaseUrl(nodeUrl) ?? ENV_NODE_URL;
  document.cookie = `${AUTH_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${ACCESS_MAX_AGE_SEC}; SameSite=Lax`;
  persistNodeUrlCookie(safeNodeUrl);
  sessionStorage.setItem(AUTH_SESSION_KEY, token);
  localStorage.setItem(NODE_URL_KEY, safeNodeUrl);
  localStorage.setItem(USERNAME_KEY, username);
  if (refreshToken) {
    document.cookie = `${REFRESH_COOKIE}=${encodeURIComponent(refreshToken)}; path=/; max-age=${REFRESH_MAX_AGE_SEC}; SameSite=Lax`;
    localStorage.setItem(REFRESH_SESSION_KEY, refreshToken);
  }
  emitAuthChanged();
}

export function clearAuth() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${REFRESH_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  document.cookie = `${NODE_URL_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(USERNAME_KEY);
  localStorage.removeItem(REFRESH_SESSION_KEY);
  emitAuthChanged();
  resetAccessThemeForLogin();
}

export function readAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromSession = sessionStorage.getItem(AUTH_SESSION_KEY);
  if (fromSession) return fromSession;
  const m = document.cookie.match(/(?:^|;\s*)wt_token=([^;]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export function readRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromStorage = localStorage.getItem(REFRESH_SESSION_KEY);
  if (fromStorage) return fromStorage;
  const m = document.cookie.match(/(?:^|;\s*)wt_refresh=([^;]+)/);
  if (!m) return null;
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

export function readUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USERNAME_KEY);
}

/**
 * Exchange refresh token for a new access JWT. Returns true if tokens were updated.
 * Concurrent callers share one in-flight rotate (opaque refresh is single-use).
 */
let refreshInFlight: Promise<boolean> | null = null;

export async function refreshAccessSession(nodeUrl: string): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;

  refreshInFlight = (async () => {
    const refreshToken = readRefreshToken();
    if (!refreshToken) return false;
    try {
      const base = nodeUrl.replace(/\/$/, "");
      const res = await fetch(`${base}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) return false;
      const data = (await res.json()) as {
        token?: string;
        refreshToken?: string;
        username?: string;
      };
      if (!data.token) return false;
      const username = data.username ?? readUsername() ?? "";
      persistAuth(data.token, username, nodeUrl, data.refreshToken ?? refreshToken);
      return true;
    } catch {
      return false;
    }
  })().finally(() => {
    refreshInFlight = null;
  });

  return refreshInFlight;
}

export { decodeAuthCookie, looksLikeJwt } from "../../lib/authCookie";
