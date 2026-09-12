# RFC-0003: Agency SDK — service auth, public reads, hub resolve

**Status:** Accepted — **M0–M5 shipping** (`rfc/accepted`; tracking [#89](https://github.com/ingmarstruijs/WikiTraveler/issues/89))  
**Area:** Agency SDK / node API auth / trusted client reads / peer resolve  
**Related:** [RFC-0002](./0002-global-hub-access.md) · [packages/sdk](../../packages/sdk/README.md) · [ARCHITECTURE.md](../ARCHITECTURE.md) · [FEDERATED-AUTH.md](../FEDERATED-AUTH.md) · [SECURITY.md](../../SECURITY.md) · [ROADMAP.md](../ROADMAP.md)

## Summary

Today `@wikitraveler/sdk` talks to a node with an optional **user JWT** (`POST /api/auth/login` → `Authorization: Bearer …`). Even read paths such as `GET /api/properties/:id/accessibility` go through `requireAuth`. That is the wrong shape for agencies and OTAs: partners should not embed a traveler/auditor username, and browser widgets must not hold long-lived human passwords.

This RFC proposes making the SDK a first-class **sidecar client** for product teams:

1. **Service credentials on a hub/issuer** → short-lived `integrator_read` JWTs that **data nodes verify cross-node** (same pattern as traveler home JWTs) — not human login, not one API key per country.
2. **Authenticated reads** for accessibility facts and resolve — writes stay user/auditor JWT; optional public GET remains opt-in.
3. **Hub-style resolve** in the SDK (same mental model as Access/Lens): find the data node, fail honestly when uncovered.
4. **Widget as a shippable product surface** (trust tiers, empty/coverage states, a11y, deep-link to Access).
5. **DX** that matches reality (auth model, errors, agency-demo happy path).

No implementation lands in this PR — design only.

## Motivation

WikiTraveler’s product bet is a **sidecar**: community facts beside Booking / agency / brand flows. The SDK is how product teams put those facts *in their own UI*.

Current friction:

| Today | Why it fails partners |
|-------|------------------------|
| Username + password → JWT | Agencies ask “which user do we log in as?” |
| README shows `getAccessibility` without a token | Docs disagree with `requireAuth` on the route |
| Single hard-coded `nodeUrl` | Doesn’t match hub Access / mesh resolve |
| Widget is thin | Hard to ship without reinventing trust UX |

Cold-start of *audit data* is a separate product risk (community). This RFC unblocks *integration* so that when facts exist, agencies can show them without cosplaying as a traveler account.

## Goals

1. Integrators authenticate as **applications**, not people.
2. Read accessibility facts (and related resolve/health) without a human session.
3. Browser embeds never need a long-lived password; secrets stay server-side where possible.
4. SDK can resolve **which data node** owns a property / place — federation invisible to the traveler, explicit to the integrator.
5. Empty / uncovered regions are honest in the widget and API.
6. Operator story stays compatible with RFC-0002 trusted origins (`CLIENT_ORIGINS` / `CORS_ORIGINS`).

## Non-goals (this RFC)

- Replacing auditor/traveler JWT for Access, Lens popup login, or field audits
- Open unauthenticated write / audit submission
- Building a full OAuth2 authorization-server product in v1
- Multi-node map fan-out (still RFC-0002 M6 / follow-on)
- Forcing every agency to use the drop-in widget (raw client remains valid)

---

## Proposed design

### A. Auth model (split read vs write)

| Caller | Auth | Used for |
|--------|------|----------|
| Traveler / auditor (Access, Lens, SDK `submitAudit`) | User JWT (`POST /api/auth/login`) | Identity, favorites, audits, signals |
| Agency server / trusted backend | **Issuer credentials** → short-lived `integrator_read` JWT | Resolve + read facts on any accepting data node; mint browser tokens |
| Browser widget on partner site | Short-lived **read token** minted by partner backend *or* allowlisted origin + rate limit for selected public GETs | `getAccessibility`, resolve, health |
| Anonymous internet | Optional **public GET** subset only if operators opt in + strict rate limits | Marketing demos; not the default for production nodes |

**v1 recommendation (agencies are multi-country by default):**  

- Agencies register once at a **hub / home-style issuer** (canonical EU node or dedicated integrator registry on that node) — not once per country.
- Issuer stores **client credentials** (API key or client id+secret, hashed at rest, scopes e.g. `read:accessibility`, `read:resolve`).
- Partner BFF exchanges credentials → **short-lived RS256 JWT** (`role: integrator_read`, `aud: sdk`, issuer = hub node URL, TTL minutes).
- **Data nodes accept that JWT the same way they already accept foreign traveler JWTs** — fetch issuer public key, verify signature, allow agreed GET routes only (no audit write).
- SDK flow: resolve place → data-node URL → `Authorization: Bearer <integrator_read JWT>` on that node.
- Keep user JWT for traveler/auditor writes.

**Optional fallback (single-region / lab):** a data node may also mint local-only API keys for partners that only ever hit that node. Not the agency happy path.

**Deprecated for SDK docs:** treating `POST /api/auth/token` (passphrase) or a shared “agency user” password as the integration path.

### B. API surface changes (node)

**Reads allowed with `integrator_read` JWT (and optionally public GET):**

- `GET /api/properties/:id/accessibility`
- `GET /api/health` (already public-ish — keep)
- Resolve helpers already used by Access/Lens (`GET /api/peers/resolve`, property lookup by external id if/when exposed)

**Writes stay `requireAuth` + role checks:**

- `POST .../accessibility` (audits)
- favorites, preferences, admin, signals create, etc.

**CORS:** unchanged principle from RFC-0002 — reflect trusted `Origin` only. Partner marketing domains join `CLIENT_ORIGINS` / `CORS_ORIGINS` like Access/Lens.

### C. SDK client

```ts
// Partner BFF — credentials never in the browser
const session = await mintIntegratorReadToken({
  issuerUrl: process.env.WT_ISSUER_URL!, // hub / home node
  apiKey: process.env.WT_API_KEY!,
});

// Browser or server — one token works after resolve on any accepting data node
const wt = new WikiTraveler({
  issuerUrl: process.env.WT_ISSUER_URL!,
  token: session.accessToken,
});
const node = await wt.resolveDataNode({ lat, lon });
const facts = await wt.getAccessibility(propertyId, { nodeUrl: node.url });
```

Add:

- `mintIntegratorReadToken` / document partner BFF pattern
- `resolveDataNode({ lat, lon } | { propertyId } | { externalId })`
- Typed errors: `401`, `403`, `404`, `422 uncovered`, rate-limit
- Fix README so auth is never optional for production reads unless public GET is explicitly enabled

### D. Hub resolve (align with RFC-0002)

SDK follows the same story as Access/Lens:

- Bootstrap / configured **issuer (hub/home)** for peer directory + credential mint
- Resolve geographic or property ownership → **data node**
- Fetch facts from data node with the **same** short-lived `integrator_read` JWT (cross-node verify via issuer pubkey)

This is deliberately **not** “one API key per country.” Multi-country agencies are the default customer; v1 must match that. Per-node local keys remain a lab/single-region escape hatch only.

**Rejected as primary v1:** requiring agencies to hold and rotate N keys for N regional nodes.

### E. Widget product bar

Minimum before calling the widget “agency-ready”:

- Visible trust tier labels/colors (same language as Access)
- Explicit empty / not-covered / error states
- Deep-link to hub Access for detail / report
- Accessible mount (heading, focus, contrast) per [ACCESSIBILITY.md](../ACCESSIBILITY.md)
- Locale via existing i18n packages

### F. DX / demo

- `apps/agency-demo`: issuer credentials in env, BFF mints `integrator_read` JWT, then browser widget against resolved data nodes
- README: three patterns — BFF+widget, server fetch with integrator JWT, ESM
- Operator docs: which node is the **issuer**, how data nodes trust it, revoke, CORS for partner origins

---

## Milestones (proposed)

| Milestone | Deliverable |
|-----------|-------------|
| **M0** | Accept RFC; tracking issue — **done** ([#89](https://github.com/ingmarstruijs/WikiTraveler/issues/89)) |
| **M1** | Integrator client credentials on **issuer** node (hash-at-rest, scopes, mint/revoke Admin/CLI) — **done** |
| **M2** | Issuer: exchange credentials → short-lived `integrator_read` RS256 JWT; data nodes verify foreign integrator JWTs on agreed GETs (reuse pubkey fetch path); rate limits — **done** |
| **M3** | SDK resolve + read with one token; README + agency-demo BFF happy path; drop “login as user” — **shipping** |
| **M4** | Widget coverage/trust UX + a11y checklist; optional public GET flag for demo nodes — **shipping** |
| **M5** | Operator docs: which node is issuer, CORS for partner origins, revoke story — **shipping** |
| **M6** | Follow-ons: external-id batch lookup, photo URL auth hardening, multi-issuer / branded hubs |

## Highest-impact risks

| # | Risk | Mitigation |
|---|------|------------|
| **S1** | Leaked API key → bulk scrape of facts/photos | Hash keys; scopes; rate limits; revoke; no keys in frontend |
| **S2** | “Public GET” becomes default → abuse | Opt-in per node; tight defaults; CDN/WAF notes in ops docs |
| **S3** | Partner ships username/password in JS anyway | Docs + demo BFF; lint/warn in SDK if password config appears |
| **S4** | Service auth bypasses auditor trust storytelling | Reads still expose **tiers**; writes unchanged |
| **S5** | Compromised issuer → read access across many data nodes | Short TTL; revoke client credentials; rate limits per client on issuer + data nodes; audit logs; optional allowlist of issuer URLs on data nodes |
| **S6** | CORS mistakes when adding partner origins | Stay on RFC-0002 allowlist model; never `*` |
| **S7** | Data-node operators refuse foreign integrator JWTs | Document trust: same mechanism as traveler home JWTs; opt-out flag if a sovereign node wants local-only reads |

## Alternatives considered

| Alternative | Why not (for now) |
|-------------|-------------------|
| Shared “agency” user account | Still a human credential; rotation/audit nightmare |
| **API key per regional data node as primary** | Agencies are multi-country by default — N keys / N rotations fails immediately |
| mTLS between agency and node | High ops cost for early partners |
| Fully public mesh reads, no keys | Abuse + no operator control |
| OAuth2 Authorization Code for every agency staff user | Wrong problem; we need app-to-app read |
| Home-node reverse-proxy of all agency reads | Same timeout/photo issues rejected in RFC-0002; prefer direct data-node fetch with cross-node JWT |

## Open questions

1. Credential minting UX on issuer: Node Admin only, CLI, or both?
2. Should photo URLs on accessibility payloads require the same auth as JSON (hotlink risk)?
3. External-id lookup (`booking:…`) as first-class resolve input for OTAs — ship with M3/M4 or later?
4. Must every public data node accept the canonical issuer, or can operators disable foreign `integrator_read`?
5. One canonical issuer for v1 (`node-eu` / project hub) vs multiple branded issuers from day one?

## Success criteria

- An agency can show trust-tiered facts for hotels in **multiple countries** with **one** issuer credential + short-lived tokens.
- No per-country API key required for the happy path.
- A browser widget runs with a **short-lived** token only.
- README and `agency-demo` match production auth.
- Operators can revoke a partner credential without rotating human passwords or `JWT_SECRET`.

## References

- Current SDK client: `packages/sdk/src/client.ts` (`token` → Bearer; comments still mention `/api/auth/login` and deprecated `/api/auth/token`)
- Accessibility GET auth: `apps/node/app/api/properties/[id]/accessibility/route.ts` (`requireAuth` on GET)
- Login: `apps/node/app/api/auth/login/route.ts` (username/password → RS256/HS256 JWT)
