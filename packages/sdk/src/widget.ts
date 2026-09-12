import { WikiTraveler, WikiTravelerError } from "./client";
import type { AccessibilityResponse } from "./client";
import { Tier } from "@wikitraveler/core";
import { formatFactValue, getFieldLabel, getTierLabel, DEFAULT_LOCALE, type Locale } from "@wikitraveler/i18n";

export interface WidgetOptions {
  /** CSS selector OR HTMLElement to mount the widget into. */
  target: string | HTMLElement;
  /** Property ID to display. */
  propertyId: string;
  /** WikiTraveler data-node URL (after resolve, or single-region). */
  nodeUrl: string;
  /** Short-lived integrator_read JWT (or human JWT). Prefer BFF mint — RFC-0003. */
  token?: string;
  /** UI locale (default: en). Also read from data-wt-locale on the target element. */
  locale?: Locale;
  /** Hub Access URL for deep-link (default from client / https://access.wikitraveler.org). */
  accessUrl?: string;
  /** Optional lat/lon — when set, resolve data node via issuerUrl first. */
  lat?: number;
  lon?: number;
  /** Issuer / hub URL used with lat/lon resolve. */
  issuerUrl?: string;
}

const WIDGET_STYLE_ID = "wt-widget-styles";

const WIDGET_CSS = `
.wt-widget{font-family:var(--wt-font,sans-serif);color:var(--wt-text,#0f172a);font-size:13px;line-height:1.45;min-width:0}
.wt-widget-heading{font-size:14px;font-weight:700;margin:0 0 8px;color:var(--wt-text,#0f172a)}
.wt-widget-facts{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;max-height:min(480px,60vh);overflow-y:auto;overscroll-behavior:contain}
.wt-widget-fact{display:flex;flex-direction:column;gap:4px;padding:10px 12px;background:var(--wt-bg-secondary,#f1f5f9);border:1px solid var(--wt-border,#e2e8f0);border-radius:var(--wt-radius-sm,8px)}
.wt-widget-fact-label{font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:var(--wt-text-muted,#64748b)}
.wt-widget-fact-body{display:flex;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;gap:6px 10px}
.wt-widget-fact-value{color:var(--wt-text,#0f172a);word-break:break-word;flex:1 1 120px;min-width:0}
.wt-widget-fact .wt-tier-badge{display:inline-block;border-radius:999px;padding:2px 8px;font-size:10px;font-weight:600;flex-shrink:0;white-space:nowrap}
.wt-tier-official{background:var(--wt-tier-official-bg,#e2e8f0);color:var(--wt-tier-official-text,#475569)}
.wt-tier-ai_guess{background:var(--wt-tier-ai-bg,#fef3c7);color:var(--wt-tier-ai-text,#92400e)}
.wt-tier-verified{background:var(--wt-tier-verified-bg,#d1fae5);color:var(--wt-tier-verified-text,#065f46)}
.wt-tier-confirmed{background:var(--wt-tier-confirmed-bg,#dbeafe);color:var(--wt-tier-confirmed-text,#1e40af)}
.wt-widget-empty,.wt-widget-coverage{color:var(--wt-text-muted,#64748b);margin:0 0 8px}
.wt-widget-attribution{font-size:11px;color:var(--wt-text-muted,#64748b);margin:10px 0 0}
.wt-widget-attribution a{color:var(--wt-primary,#1d4ed8);text-decoration:none}
.wt-widget-loading,.wt-widget-error{margin:0;font-size:13px}
.wt-widget-error{color:var(--wt-danger,#dc2626)}
.wt-widget-actions{margin:10px 0 0;display:flex;flex-wrap:wrap;gap:8px}
.wt-widget-actions a{font-size:12px;font-weight:600;color:var(--wt-primary,#1d4ed8);text-decoration:underline}
.wt-widget-photos{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 0;padding:0;list-style:none}
.wt-widget-photo{width:72px;height:72px;object-fit:cover;border-radius:8px;border:1px solid var(--wt-border,#e2e8f0);cursor:pointer}
.wt-widget-photo-caption{font-size:10px;color:var(--wt-text-muted,#64748b);margin-top:2px;max-width:72px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
`;

const TIER_CLASS: Record<Tier, string> = {
  OFFICIAL: "wt-tier-official",
  AI_GUESS: "wt-tier-ai_guess",
  VERIFIED: "wt-tier-verified",
  CONFIRMED: "wt-tier-confirmed",
};

function ensureWidgetStyles(): void {
  if (typeof document === "undefined" || document.getElementById(WIDGET_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = WIDGET_STYLE_ID;
  style.textContent = WIDGET_CSS;
  document.head.appendChild(style);
}

function badge(tier: Tier, locale: Locale): string {
  const label = getTierLabel(tier, locale);
  const cls = TIER_CLASS[tier] ?? "";
  return `<span class="wt-tier-badge ${cls}" aria-label="Trust tier: ${label}">${label}</span>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function accessDetailHref(accessUrl: string, propertyId: string, nodeUrl: string): string {
  const u = new URL(accessUrl.includes("://") ? accessUrl : `https://${accessUrl}`);
  // Hub Access property deep-link pattern used across the monorepo
  u.pathname = `/property/${encodeURIComponent(propertyId)}`;
  u.searchParams.set("node", nodeUrl);
  return u.toString();
}

function shell(
  body: string,
  opts: { accessHref?: string; heading?: string }
): string {
  const actions = opts.accessHref
    ? `<p class="wt-widget-actions"><a href="${escapeHtml(opts.accessHref)}" target="_blank" rel="noopener">Open in WikiTraveler Access</a></p>`
    : "";
  const heading = opts.heading
    ? `<h3 class="wt-widget-heading">${escapeHtml(opts.heading)}</h3>`
    : "";
  return `
    <div class="wt-widget" role="region" aria-label="WikiTraveler accessibility data">
      ${heading}
      ${body}
      ${actions}
      <p class="wt-widget-attribution">
        Powered by <a href="https://github.com/ingmarstruijs/WikiTraveler">WikiTraveler</a>
      </p>
    </div>`;
}

function renderFacts(
  data: AccessibilityResponse,
  locale: Locale,
  accessUrl: string
): string {
  const accessHref = accessDetailHref(accessUrl, data.propertyId, data.nodeUrl);

  if (data.facts.length === 0 && !data.auditPhotos?.photos.length) {
    return shell(
      `<p class="wt-widget-empty">No accessibility facts on file yet for this property. Trust tiers appear when audits land.</p>`,
      { accessHref, heading: "Accessibility" }
    );
  }

  const items = data.facts
    .map((f) => {
      const label = f.label || getFieldLabel(f.fieldName, locale);
      const display = formatFactValue(f.fieldName, String(f.value), { locale });
      const value = escapeHtml(display.displayValue);
      return `<li class="wt-widget-fact">
        <span class="wt-widget-fact-label">${escapeHtml(label)}</span>
        <span class="wt-widget-fact-body">
          <span class="wt-widget-fact-value">${value}</span>
          ${badge(f.tier, locale)}
        </span>
      </li>`;
    })
    .join("");

  const photos = data.auditPhotos?.photos ?? [];
  const photoGallery = photos.length
    ? `<ul class="wt-widget-photos" aria-label="Audit photos">${photos
        .map(
          (p) =>
            `<li><a href="${escapeHtml(p.url)}" target="_blank" rel="noopener"><img class="wt-widget-photo" src="${escapeHtml(p.url)}" alt="${escapeHtml(p.caption ?? "Audit photo")}" loading="lazy" /></a>${p.caption ? `<div class="wt-widget-photo-caption">${escapeHtml(p.caption)}</div>` : ""}</li>`
        )
        .join("")}</ul>`
    : "";

  return shell(
    `${items ? `<ul class="wt-widget-facts">${items}</ul>` : ""}${photoGallery}`,
    { accessHref, heading: "Accessibility" }
  );
}

function renderError(err: unknown, accessUrl: string, propertyId: string, nodeUrl: string): string {
  const accessHref = propertyId && nodeUrl ? accessDetailHref(accessUrl, propertyId, nodeUrl) : accessUrl;
  if (err instanceof WikiTravelerError) {
    if (err.code === "UNCOVERED" || err.status === 422) {
      return shell(
        `<p class="wt-widget-coverage">This area isn’t covered by a WikiTraveler data node yet. Facts will appear when a regional node and audits exist.</p>`,
        { accessHref, heading: "Coverage" }
      );
    }
    if (err.status === 401 || err.status === 403) {
      return shell(
        `<p class="wt-widget-error">Could not authorize this read. Agencies need a short-lived integrator token from their BFF (not a traveler password).</p>`,
        { accessHref, heading: "Accessibility" }
      );
    }
    if (err.status === 404) {
      return shell(
        `<p class="wt-widget-coverage">Property not found on this node.</p>`,
        { accessHref, heading: "Accessibility" }
      );
    }
  }
  return shell(
    `<p class="wt-widget-error">Could not load accessibility data. Is the node reachable?</p>`,
    { accessHref, heading: "Accessibility" }
  );
}

/**
 * Mount a pre-styled accessibility widget into a DOM element.
 */
export async function mountWidget(
  optionsOrSelector: WidgetOptions | string | HTMLElement
): Promise<void> {
  ensureWidgetStyles();

  let el: HTMLElement | null = null;
  let propertyId: string | undefined;
  let nodeUrl: string | undefined;
  let token: string | undefined;
  let locale: Locale = DEFAULT_LOCALE;
  let accessUrl: string | undefined;
  let issuerUrl: string | undefined;
  let lat: number | undefined;
  let lon: number | undefined;

  if (typeof optionsOrSelector === "string") {
    el = document.querySelector<HTMLElement>(optionsOrSelector);
  } else if (optionsOrSelector instanceof HTMLElement) {
    el = optionsOrSelector;
  } else {
    el =
      typeof optionsOrSelector.target === "string"
        ? document.querySelector<HTMLElement>(optionsOrSelector.target)
        : optionsOrSelector.target;
    propertyId = optionsOrSelector.propertyId;
    nodeUrl = optionsOrSelector.nodeUrl;
    token = optionsOrSelector.token;
    locale = optionsOrSelector.locale ?? DEFAULT_LOCALE;
    accessUrl = optionsOrSelector.accessUrl;
    issuerUrl = optionsOrSelector.issuerUrl;
    lat = optionsOrSelector.lat;
    lon = optionsOrSelector.lon;
  }

  if (!el) {
    console.warn("WikiTraveler.mountWidget: target element not found");
    return;
  }

  propertyId ??= el.dataset.propertyId ?? "";
  nodeUrl ??= el.dataset.nodeUrl ?? "";
  token ??= el.dataset.token;
  locale = (el.dataset.wtLocale as Locale | undefined) ?? locale;
  accessUrl ??= el.dataset.accessUrl;
  issuerUrl ??= el.dataset.issuerUrl;
  if (el.dataset.lat != null) lat = Number(el.dataset.lat);
  if (el.dataset.lon != null) lon = Number(el.dataset.lon);

  if (!propertyId || (!nodeUrl && !issuerUrl)) {
    el.setAttribute("role", "alert");
    el.innerHTML = `<p class="wt-widget-error">WikiTraveler: missing data-property-id or data-node-url / data-issuer-url</p>`;
    return;
  }

  el.setAttribute("role", "status");
  el.setAttribute("aria-live", "polite");
  el.setAttribute("aria-busy", "true");
  el.innerHTML = `<p class="wt-widget-loading wt-text-muted">Loading accessibility data…</p>`;

  const client = new WikiTraveler({
    nodeUrl: nodeUrl || undefined,
    issuerUrl: issuerUrl || undefined,
    token,
    locale,
    accessUrl,
  });
  const resolvedAccess = client.accessUrl;

  try {
    let dataNode = nodeUrl || client.defaultNodeUrl || "";
    if (lat != null && lon != null && !Number.isNaN(lat) && !Number.isNaN(lon)) {
      const resolved = await client.resolveDataNode({ lat, lon });
      dataNode = resolved.url;
    }
    const data = await client.getAccessibility(propertyId, { nodeUrl: dataNode });
    el.removeAttribute("aria-busy");
    el.removeAttribute("role");
    el.removeAttribute("aria-live");
    el.innerHTML = renderFacts(data, locale, resolvedAccess);
  } catch (err) {
    el.removeAttribute("aria-busy");
    el.setAttribute("role", "alert");
    el.innerHTML = renderError(err, resolvedAccess, propertyId, nodeUrl || client.defaultNodeUrl || "");
    console.error("WikiTraveler widget error:", err);
  }
}

/** Auto-mount all [data-wt-widget] elements on DOMContentLoaded. */
export function autoMount(): void {
  const init = () => {
    document.querySelectorAll<HTMLElement>("[data-wt-widget]").forEach((el) => {
      mountWidget(el);
    });
  };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}
