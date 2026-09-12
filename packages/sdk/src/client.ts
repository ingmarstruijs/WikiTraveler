import { Tier, TIER_COLOR } from "@wikitraveler/core";
import { getFieldLabel, getTierLabel, DEFAULT_LOCALE, type Locale } from "@wikitraveler/i18n";

export { Tier, TIER_COLOR } from "@wikitraveler/core";
export { getFieldLabel, getTierLabel, DEFAULT_LOCALE } from "@wikitraveler/i18n";
export type { Locale } from "@wikitraveler/i18n";
export type {
  AccessibilityFact,
  Property,
  NodeInfo,
  AuditPayload,
} from "@wikitraveler/core";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface WikiTravelerConfig {
  /**
   * Fixed data-node URL (single-region / lab).
   * For multi-country agencies prefer `issuerUrl` + `resolveDataNode` then pass `nodeUrl` per call.
   */
  nodeUrl?: string;
  /** Hub / issuer that mints integrator tokens and answers `/api/peers/resolve`. */
  issuerUrl?: string;
  /**
   * Short-lived `integrator_read` JWT (or human JWT for traveler flows).
   * Mint via {@link mintIntegratorReadToken} on a partner BFF — never put client secrets in the browser.
   */
  token?: string;
  /** Optional fetch timeout in milliseconds (default: 8000). */
  timeoutMs?: number;
  /** UI locale for field labels (default: en). */
  locale?: Locale;
  /** Hub Access base URL for widget deep-links (default: https://access.wikitraveler.org). */
  accessUrl?: string;
  /**
   * @deprecated Do not pass username/password. Use issuer credentials → integrator JWT (RFC-0003).
   */
  username?: string;
  /** @deprecated See username. */
  password?: string;
}

export interface ResolveDataNodeInput {
  lat?: number;
  lon?: number;
  propertyId?: string;
}

export interface ResolveDataNodeResult {
  nodeId: string;
  url: string;
  region?: string | null;
  bbox?: string | null;
  matched?: string;
}

export interface AuditPhotoInfo {
  id: string;
  url: string;
  caption?: string | null;
  fieldName?: string | null;
  scopeKey?: string | null;
  width?: number | null;
  height?: number | null;
}

export interface AccessibilityResponse {
  propertyId: string;
  nodeUrl: string;
  facts: Array<{
    fieldName: string;
    scopeKey?: string;
    value: string;
    tier: Tier;
    label: string;
    color: string;
    submittedBy: string | null;
    timestamp: string;
  }>;
  auditPhotos?: {
    submissionId: string;
    capturedAt: string;
    photos: AuditPhotoInfo[];
    photoOriginNode?: string | null;
  } | null;
}

export class WikiTravelerError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly url?: string;

  constructor(message: string, opts: { status: number; code?: string; url?: string }) {
    super(message);
    this.name = "WikiTravelerError";
    this.status = opts.status;
    this.code = opts.code;
    this.url = opts.url;
  }
}

const DEFAULT_ACCESS_URL = "https://access.wikitraveler.org";

function stripSlash(url: string): string {
  return url.replace(/\/$/, "");
}

function warnLegacyHumanCredentials(config: WikiTravelerConfig): void {
  if (config.username != null || config.password != null) {
    console.warn(
      "[WikiTraveler SDK] username/password config is deprecated. Use mintIntegratorReadToken on your BFF (RFC-0003)."
    );
  }
}

/**
 * Partner BFF only — exchange issuer client credentials for a short-lived integrator_read JWT.
 * Never call this from browser code with a long-lived secret.
 */
export async function mintIntegratorReadToken(opts: {
  issuerUrl: string;
  clientId: string;
  clientSecret: string;
  timeoutMs?: number;
}): Promise<{ accessToken: string; expiresIn: number; tokenType: string }> {
  const issuerUrl = stripSlash(opts.issuerUrl);
  const url = `${issuerUrl}/api/auth/integrator/token`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 8000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientId: opts.clientId,
        clientSecret: opts.clientSecret,
      }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      accessToken?: string;
      expiresIn?: number;
      tokenType?: string;
      message?: string;
    };
    if (!res.ok || !data.accessToken) {
      throw new WikiTravelerError(data.message ?? `Mint failed (${res.status})`, {
        status: res.status,
        code: "MINT_FAILED",
        url,
      });
    }
    return {
      accessToken: data.accessToken,
      expiresIn: data.expiresIn ?? 900,
      tokenType: data.tokenType ?? "Bearer",
    };
  } finally {
    clearTimeout(timer);
  }
}

// ---------------------------------------------------------------------------
// Client
// ---------------------------------------------------------------------------

export class WikiTraveler {
  private readonly nodeUrl: string | undefined;
  private readonly issuerUrl: string | undefined;
  private readonly timeoutMs: number;
  private readonly token: string | undefined;
  private readonly locale: Locale;
  readonly accessUrl: string;

  constructor(config: WikiTravelerConfig) {
    warnLegacyHumanCredentials(config);
    this.nodeUrl = config.nodeUrl ? stripSlash(config.nodeUrl) : undefined;
    this.issuerUrl = config.issuerUrl ? stripSlash(config.issuerUrl) : undefined;
    this.timeoutMs = config.timeoutMs ?? 8000;
    this.token = config.token;
    this.locale = config.locale ?? DEFAULT_LOCALE;
    this.accessUrl = stripSlash(config.accessUrl ?? DEFAULT_ACCESS_URL);

    if (!this.nodeUrl && !this.issuerUrl) {
      throw new WikiTravelerError("Provide nodeUrl and/or issuerUrl", {
        status: 0,
        code: "CONFIG",
      });
    }
  }

  /** Default data-node URL when not resolved per call. */
  get defaultNodeUrl(): string | undefined {
    return this.nodeUrl ?? this.issuerUrl;
  }

  private async fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const headers: Record<string, string> = {
      ...(init?.headers as Record<string, string> | undefined),
    };
    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }
    try {
      return await fetch(url, { ...init, headers, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }
  }

  private throwForStatus(res: Response, url: string, body?: { message?: string; code?: string }): never {
    const status = res.status;
    let code = body?.code;
    if (!code) {
      if (status === 401) code = "UNAUTHORIZED";
      else if (status === 403) code = "FORBIDDEN";
      else if (status === 404) code = "NOT_FOUND";
      else if (status === 422) code = "UNCOVERED";
      else code = "HTTP_ERROR";
    }
    throw new WikiTravelerError(body?.message ?? `WikiTraveler: node returned ${status}`, {
      status,
      code,
      url,
    });
  }

  /**
   * Resolve which data node owns a place (same mental model as Access/Lens).
   * Calls the issuer (or configured node) `/api/peers/resolve`.
   */
  async resolveDataNode(input: ResolveDataNodeInput): Promise<ResolveDataNodeResult> {
    const base = this.issuerUrl ?? this.nodeUrl;
    if (!base) {
      throw new WikiTravelerError("issuerUrl or nodeUrl required for resolve", {
        status: 0,
        code: "CONFIG",
      });
    }

    const params = new URLSearchParams();
    if (input.lat != null && input.lon != null) {
      params.set("lat", String(input.lat));
      params.set("lon", String(input.lon));
    } else {
      throw new WikiTravelerError("resolveDataNode requires lat and lon", {
        status: 0,
        code: "CONFIG",
      });
    }

    const url = `${base}/api/peers/resolve?${params}`;
    const res = await this.fetchWithTimeout(url);
    const data = (await res.json().catch(() => ({}))) as ResolveDataNodeResult & {
      message?: string;
      code?: string;
    };
    if (!res.ok) this.throwForStatus(res, url, data);
    if (!data.url) {
      throw new WikiTravelerError("Resolve returned no node URL", {
        status: 422,
        code: "UNCOVERED",
        url,
      });
    }
    return {
      nodeId: data.nodeId,
      url: stripSlash(data.url),
      region: data.region,
      bbox: data.bbox,
      matched: data.matched,
    };
  }

  /**
   * Fetch accessibility facts for a property.
   * Pass `nodeUrl` after resolve for multi-country; otherwise uses configured nodeUrl/issuerUrl.
   */
  async getAccessibility(
    propertyId: string,
    opts?: { nodeUrl?: string }
  ): Promise<AccessibilityResponse> {
    const nodeUrl = stripSlash(opts?.nodeUrl ?? this.defaultNodeUrl ?? "");
    if (!nodeUrl) {
      throw new WikiTravelerError("nodeUrl required — set config.nodeUrl or pass opts.nodeUrl after resolve", {
        status: 0,
        code: "CONFIG",
      });
    }
    const url = `${nodeUrl}/api/properties/${encodeURIComponent(propertyId)}/accessibility`;
    const res = await this.fetchWithTimeout(url);
    const data = (await res.json().catch(() => ({}))) as {
      facts?: Array<{
        fieldName: string;
        scopeKey?: string;
        value: string;
        tier: Tier;
        submittedBy: string | null;
        timestamp: string;
      }>;
      auditPhotos?: AccessibilityResponse["auditPhotos"];
      message?: string;
      code?: string;
    };
    if (!res.ok) this.throwForStatus(res, url, data);
    return {
      propertyId,
      nodeUrl,
      facts: (data.facts ?? []).map((f) => ({
        ...f,
        label: getFieldLabel(f.fieldName, this.locale),
        color: TIER_COLOR[f.tier] ?? "#9ca3af",
      })),
      auditPhotos: data.auditPhotos ?? null,
    };
  }

  /**
   * Submit a community audit — requires a **human** auditor JWT, not integrator_read.
   */
  async submitAudit(
    propertyId: string,
    payload: {
      facts: Array<{ fieldName: string; value: string; scopeKey?: string }>;
      photoUrls?: string[];
      photos?: Array<{
        dataUri: string;
        caption?: string;
        fieldName?: string;
        scopeKey?: string;
        width?: number;
        height?: number;
      }>;
      locale?: string;
    },
    token: string
  ): Promise<{ ok: boolean; message: string }> {
    const nodeUrl = this.defaultNodeUrl;
    if (!nodeUrl) {
      return { ok: false, message: "nodeUrl required" };
    }
    const url = `${nodeUrl}/api/properties/${encodeURIComponent(propertyId)}/accessibility`;
    const res = await this.fetchWithTimeout(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { message: string };
    return { ok: res.ok, message: data.message ?? (res.ok ? "Submitted" : "Error") };
  }

  /** Check if the node is reachable and return its identity. */
  async getHealth(nodeUrl?: string): Promise<{ ok: boolean; nodeId?: string; version?: string }> {
    const base = nodeUrl ? stripSlash(nodeUrl) : this.defaultNodeUrl;
    if (!base) return { ok: false };
    try {
      const res = await this.fetchWithTimeout(`${base}/api/health`);
      if (!res.ok) return { ok: false };
      const data = (await res.json()) as { nodeId: string; version: string };
      return { ok: true, nodeId: data.nodeId, version: data.version };
    } catch {
      return { ok: false };
    }
  }
}
