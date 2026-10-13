/**
 * Signed `/api/photos/:id?exp=&sig=` URLs expire (~1h). Favorites persist them,
 * so we must refresh when `exp` has passed (or is missing on a photo path).
 */
export function isSignedPhotoUrlStale(
  url: string | null | undefined,
  nowSeconds = Math.floor(Date.now() / 1000),
  skewSeconds = 60
): boolean {
  if (url == null || url === "") return false;
  let parsed: URL;
  try {
    parsed = new URL(url, typeof window !== "undefined" ? window.location.origin : "http://localhost");
  } catch {
    return false;
  }
  if (!/\/api\/photos\//.test(parsed.pathname)) return false;
  const expRaw = parsed.searchParams.get("exp");
  if (expRaw == null || expRaw === "") return true;
  const exp = Number(expRaw);
  if (!Number.isFinite(exp)) return true;
  return exp <= nowSeconds + skewSeconds;
}

/** Hero thumb from accessibility payload (property photos first, then audit). */
export function heroPhotoUrlFromAccessibility(data: {
  property?: { photos?: Array<{ url?: string | null }> | null } | null;
  auditPhotos?: { photos?: Array<{ url?: string | null }> | null } | null;
}): string | null {
  const fromProperty = data.property?.photos?.[0]?.url;
  if (fromProperty) return fromProperty;
  const fromAudit = data.auditPhotos?.photos?.[0]?.url;
  return fromAudit ?? null;
}
