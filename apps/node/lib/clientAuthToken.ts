import { decodeAuthCookie } from "@/lib/authCookie";
import { clearNodeAuth, persistNodeAuth, refreshNodeAccessSession } from "@/lib/persistNodeAuth";

const STORAGE_KEY = "wt_node_token";

/** JWT from session storage or auth cookie (client-only). */
export function readNodeClientToken(): string | null {
  if (typeof window === "undefined") return null;

  let stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) {
    const m = document.cookie.match(/(?:^|;\s*)wt_token=([^;]+)/);
    if (m) {
      stored = decodeAuthCookie(m[1]);
      if (stored) sessionStorage.setItem(STORAGE_KEY, stored);
    }
  }
  return stored;
}

/**
 * Fetch with Bearer auth. On 401, refresh once via /api/auth/refresh then retry.
 */
export async function nodeAuthFetch(input: string, init?: RequestInit): Promise<Response> {
  const headers = new Headers(init?.headers);
  const token = readNodeClientToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  if (res.status !== 401) return res;

  const ok = await refreshNodeAccessSession();
  if (!ok) {
    clearNodeAuth();
    return res;
  }
  const retryHeaders = new Headers(init?.headers);
  const next = readNodeClientToken();
  if (next) retryHeaders.set("Authorization", `Bearer ${next}`);
  return fetch(input, { ...init, headers: retryHeaders });
}

export { persistNodeAuth, clearNodeAuth, refreshNodeAccessSession };
