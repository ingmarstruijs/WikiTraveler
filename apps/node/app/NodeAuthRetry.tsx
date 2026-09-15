"use client";

import { useEffect } from "react";
import { clearNodeAuth, readNodeRefreshToken, refreshNodeAccessSession } from "@/lib/persistNodeAuth";
import { readNodeClientToken } from "@/lib/clientAuthToken";

/**
 * Intercept same-origin /api fetches that send Bearer auth: on 401, refresh once and retry.
 */
export function NodeAuthRetry({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const original = window.fetch.bind(window);
    let refreshing: Promise<boolean> | null = null;

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.href
            : input.url;
      const isApi = url.startsWith("/api/") || url.includes("/api/");
      const isRefresh = url.includes("/api/auth/refresh") || url.includes("/api/auth/login");

      const headers = new Headers(init?.headers);
      const hasBearer =
        headers.has("Authorization") ||
        (typeof init?.headers === "object" &&
          init.headers != null &&
          "Authorization" in (init.headers as Record<string, string>));

      const res = await original(input, init);
      if (!isApi || isRefresh || res.status !== 401 || !hasBearer) {
        return res;
      }
      if (!readNodeRefreshToken()) {
        return res;
      }

      if (!refreshing) {
        refreshing = refreshNodeAccessSession().finally(() => {
          refreshing = null;
        });
      }
      const ok = await refreshing;
      if (!ok) {
        clearNodeAuth();
        return res;
      }

      const retryHeaders = new Headers(init?.headers);
      const next = readNodeClientToken();
      if (next) retryHeaders.set("Authorization", `Bearer ${next}`);
      return original(input, { ...init, headers: retryHeaders });
    };

    return () => {
      window.fetch = original;
    };
  }, []);

  return <>{children}</>;
}
