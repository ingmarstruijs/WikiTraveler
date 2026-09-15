export type RateLimitProfile = "auth" | "audit" | "signal" | "read";

const AUTH_ROUTE = /^\/api\/auth\/(login|register|refresh|integrator\/token)$/;
const AUDIT_ROUTE = /^\/api\/properties\/[^/]+\/accessibility$/;
const RESOLVE_ROUTE = /^\/api\/peers\/resolve$/;
const SIGNAL_ROUTE = /^\/api\/properties\/[^/]+\/signals$/;

/** Returns which rate-limit bucket applies, or null when the route is not limited. */
export function getRateLimitProfile(
  pathname: string,
  method: string
): RateLimitProfile | null {
  const m = method.toUpperCase();
  if (m === "POST") {
    if (AUTH_ROUTE.test(pathname)) return "auth";
    if (AUDIT_ROUTE.test(pathname)) return "audit";
    if (SIGNAL_ROUTE.test(pathname)) return "signal";
    return null;
  }
  if (m === "GET") {
    if (AUDIT_ROUTE.test(pathname) || RESOLVE_ROUTE.test(pathname)) return "read";
    return null;
  }
  return null;
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "anonymous"
  );
}

/**
 * Rate-limit dimension for GET read routes. Uses unverified JWT decode only as a
 * bucketing hint (not auth): integrator sub when role is integrator_read, else IP.
 */
export function getReadRateLimitKey(headers: Headers): string {
  const ip = getClientIp(headers);
  const auth = headers.get("authorization") ?? "";
  if (!auth.startsWith("Bearer ")) return ip;
  const token = auth.slice(7).trim();
  if (!token || token.split(".").length !== 3) return ip;
  try {
    const payloadB64 = token.split(".")[1];
    const json = Buffer.from(payloadB64, "base64url").toString("utf8");
    const payload = JSON.parse(json) as { role?: string; sub?: string };
    const role = (payload.role ?? "").toUpperCase();
    const sub = typeof payload.sub === "string" ? payload.sub.trim() : "";
    if (role === "INTEGRATOR_READ" && sub) return `integrator:${sub}`;
  } catch {
    // fall through to IP
  }
  return ip;
}
