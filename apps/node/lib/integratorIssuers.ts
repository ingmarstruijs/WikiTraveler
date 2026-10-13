/**
 * Optional allowlist of issuer base URLs for foreign `integrator_read` JWTs (RFC-0003 S5).
 * Unset / empty = accept any issuer whose pubkey verifies (same as traveler foreign JWTs).
 */
import { NODE_URL } from "@/lib/nodeInfo";
import { splitOriginList } from "@/lib/corsOrigins";

export function normalizeIssuerUrl(raw: string): string | null {
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.origin;
  } catch {
    return null;
  }
}

/** Parsed allowlist, or null when env is unset (accept any verified issuer). */
export function getIntegratorIssuerAllowlist(
  env: NodeJS.ProcessEnv = process.env
): Set<string> | null {
  const raw = env.INTEGRATOR_ISSUERS;
  if (raw == null || !raw.trim()) return null;
  const set = new Set<string>();
  for (const part of splitOriginList(raw)) {
    const n = normalizeIssuerUrl(part);
    if (n) set.add(n);
  }
  // Empty after parse still means "configured but empty" → deny foreign issuers
  return set;
}

/**
 * Whether an integrator JWT's homeNodeUrl may be accepted on this data node.
 * Local issuer (NODE_URL / missing) is always allowed.
 */
export function isIntegratorIssuerAllowed(
  homeNodeUrl: string | undefined | null,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const allowlist = getIntegratorIssuerAllowlist(env);
  if (allowlist === null) return true;

  const local = normalizeIssuerUrl(NODE_URL);
  const issuer = homeNodeUrl?.trim()
    ? normalizeIssuerUrl(homeNodeUrl)
    : local;
  if (!issuer) return false;
  if (local && issuer === local) return true;
  return allowlist.has(issuer);
}
