// nodeApi.js — Node HTTP via the extension service worker (avoids page CORS).
// Used by content scripts, popup, and options. Background has host_permissions.

/**
 * @param {string} url
 * @param {{ method?: string, headers?: Record<string, string>, body?: string | null, timeoutMs?: number }} [options]
 * @returns {Promise<{ ok: boolean, status: number, statusText: string, json: () => Promise<unknown>, text: () => Promise<string> }>}
 */
async function nodeFetch(url, options = {}) {
  const { method = "GET", headers = {}, body = null, timeoutMs = 8000 } = options;

  const response = await chrome.runtime.sendMessage({
    type: "NODE_FETCH",
    url,
    method,
    headers,
    body,
    timeoutMs,
  });

  if (chrome.runtime.lastError) {
    throw new Error(chrome.runtime.lastError.message ?? "Extension messaging failed");
  }
  if (!response || response.error) {
    throw new Error(response?.error ?? "Node fetch failed");
  }

  return {
    ok: response.ok === true,
    status: response.status ?? 0,
    statusText: response.statusText ?? "",
    async json() {
      if (Object.prototype.hasOwnProperty.call(response, "json")) {
        return response.json;
      }
      return JSON.parse(response.body ?? "null");
    },
    async text() {
      return response.body ?? "";
    },
  };
}

/**
 * Exchange opaque refresh for a new access JWT. Returns true if storage was updated.
 * @param {string} homeNodeUrl
 */
async function refreshLensAccessSession(homeNodeUrl) {
  const items = await new Promise((resolve) =>
    chrome.storage.sync.get({ wtRefresh: null, wtUsername: "", nodeUrl: homeNodeUrl }, resolve)
  );
  if (!items.wtRefresh) return false;
  try {
    const res = await nodeFetch(`${String(homeNodeUrl).replace(/\/$/, "")}/api/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: items.wtRefresh }),
      timeoutMs: 8000,
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (!data?.token) return false;
    await new Promise((resolve) =>
      chrome.storage.sync.set(
        {
          wtToken: data.token,
          wtRefresh: data.refreshToken ?? items.wtRefresh,
          wtUsername: data.username ?? items.wtUsername,
        },
        resolve
      )
    );
    return true;
  } catch {
    return false;
  }
}

/**
 * nodeFetch with Bearer from storage; on 401 refresh once against home node then retry.
 * @param {string} homeNodeUrl
 * @param {string} url
 * @param {{ method?: string, headers?: Record<string, string>, body?: string | null, timeoutMs?: number }} [options]
 */
async function authNodeFetch(homeNodeUrl, url, options = {}) {
  const items = await new Promise((resolve) =>
    chrome.storage.sync.get({ wtToken: null }, resolve)
  );
  const headers = { ...(options.headers || {}) };
  if (items.wtToken) headers.Authorization = `Bearer ${items.wtToken}`;
  const res = await nodeFetch(url, { ...options, headers });
  if (res.status !== 401) return res;

  const ok = await refreshLensAccessSession(homeNodeUrl);
  if (!ok) {
    await new Promise((resolve) =>
      chrome.storage.sync.remove(["wtToken", "wtRefresh", "wtUsername"], resolve)
    );
    return res;
  }
  const next = await new Promise((resolve) =>
    chrome.storage.sync.get({ wtToken: null }, resolve)
  );
  const retryHeaders = { ...(options.headers || {}) };
  if (next.wtToken) retryHeaders.Authorization = `Bearer ${next.wtToken}`;
  return nodeFetch(url, { ...options, headers: retryHeaders });
}

/**
 * Request optional host access so the service worker can reach production nodes
 * and mesh peers (user gesture required — call from Save / Sign in).
 * @param {string} nodeUrl
 * @returns {Promise<boolean>}
 */
async function ensureNodeHostAccess(nodeUrl) {
  if (!chrome.permissions?.request) return true;

  let parsed;
  try {
    parsed = new URL(nodeUrl);
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

  const host = parsed.hostname;
  if (host === "localhost" || host === "127.0.0.1") return true;

  // Mesh resolve may return any HTTPS peer — ask once for HTTPS (and HTTP if home is HTTP).
  const origins = ["https://*/*"];
  if (parsed.protocol === "http:") origins.push("http://*/*");

  try {
    const already = await chrome.permissions.contains({ origins });
    if (already) return true;
    return await chrome.permissions.request({ origins });
  } catch {
    const single = `${parsed.origin}/*`;
    try {
      const has = await chrome.permissions.contains({ origins: [single] });
      if (has) return true;
      return await chrome.permissions.request({ origins: [single] });
    } catch {
      return false;
    }
  }
}
