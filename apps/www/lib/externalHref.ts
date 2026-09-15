/** Same-site hosts for www — stay in this tab. Everything else with http(s) opens in a new tab. */
const SAME_SITE_HOSTS = new Set(["www.wikitraveler.org", "wikitraveler.org", "localhost", "127.0.0.1"]);

export function isExternalHref(href: string | null | undefined): boolean {
  if (!href) return false;
  const trimmed = href.trim();
  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:") ||
    trimmed.startsWith("./") ||
    trimmed.startsWith("../")
  ) {
    return false;
  }
  if (!/^https?:\/\//i.test(trimmed)) return false;
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    return !SAME_SITE_HOSTS.has(host);
  } catch {
    return true;
  }
}

/** Attributes for an external `<a>` (new tab + noopener). */
export function externalLinkAttrs(href: string | null | undefined): {
  target?: "_blank";
  rel?: string;
} {
  if (!isExternalHref(href)) return {};
  return { target: "_blank", rel: "noopener noreferrer" };
}
