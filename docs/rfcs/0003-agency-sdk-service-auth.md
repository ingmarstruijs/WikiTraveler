# RFC-0003: Agency SDK — service auth, public reads, hub resolve

**Status:** Proposed (`rfc/proposed`)  
**Area:** Agency SDK / node API auth / trusted client reads / peer resolve  
**Related:** [RFC-0002](./0002-global-hub-access.md) · [packages/sdk](../../packages/sdk/README.md) · [ARCHITECTURE.md](../ARCHITECTURE.md) · [FEDERATED-AUTH.md](../FEDERATED-AUTH.md) · [SECURITY.md](../../SECURITY.md) · [ROADMAP.md](../ROADMAP.md)

## Summary

Today `@wikitraveler/sdk` talks to a node with an optional **user JWT** (`POST /api/auth/login` → `Authorization: Bearer …`). Even read paths such as `GET /api/properties/:id/accessibility` go through `requireAuth`. That is the wrong shape for agencies and OTAs: partners should not embed a traveler/auditor username, and browser widgets must not hold long-lived human passwords.

This RFC proposes making the SDK a first-class **sidecar client** for product teams:

1. **Service credentials** for integrators (scoped API keys or equivalent) — not human login.
2. **Public (or service-auth) reads** for accessibility facts and resolve — writes stay user/auditor JWT.
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
| Agency server / trusted backend | **Service credential** (API key or client id+secret → short-lived token) | Server-side fetches, minting browser tokens |
| Browser widget on partner site | Short-lived **read token** minted by partner backend *or* allowlisted origin + rate limit for selected public GETs | `getAccessibility`, resolve, health |
| Anonymous internet | Optional **public GET** subset only if operators opt in + strict rate limits | Marketing demos; not the default for production nodes |

**v1 recommendation:**  

- Introduce **node-issued API keys** (hashed at rest, prefix visible once, scopes e.g. `read:accessibility`, `read:resolve`).  
- Partner backend calls node with `Authorization: Bearer wt_…` or `X-WikiTraveler-Key`.  
- For browser SDK: partner backend exchanges key → **short-lived RS256 JWT** (`role: integrator_read`, `aud: sdk`, TTL minutes) so the key never ships to the page.  
- Keep user JWT for writes.

**Deprecated for SDK docs:** treating `POST /api/auth/token` (passphrase) or a shared “agency user” password as the integration path.

### B. API surface changes (node)

**Reads to open under service auth (and optionally public GET):**

- `GET /api/properties/:id/accessibility`
- `GET /api/health` (already public-ish — keep)
- Resolve helpers already used by Access/Lens (`GET /api/peers/resolve`, property lookup by external id if/when exposed)

**Writes stay `requireAuth` + role checks:**

- `POST .../accessibility` (audits)
- favorites, preferences, admin, signals create, etc.

**CORS:** unchanged principle from RFC-0002 — reflect trusted `Origin` only. Partner marketing domains join `CLIENT_ORIGINS` / `CORS_ORIGINS` like Access/Lens.

### C. SDK client

```ts
// Server (Node/edge) — key never in the browser
const wt = new WikiTraveler({
  nodeUrl: process.env.WT_NODE_URL!,
  apiKey: process.env.WT_API_KEY!,
});

// Browser — short-lived token from partner BFF
const wt = new WikiTraveler({
  hubOrNodeUrl: "https://node-eu.wikitraveler.org", // or hub resolve base
  token: readTokenFromPageBootstrap,
});
```

Add:

- `createReadToken()` / document partner BFF pattern (may live as small server helper, not only browser SDK)
- `resolveDataNode({ lat, lon } | { propertyId } | { externalId })`
- Typed errors: `401`, `403`, `404`, `422 uncovered`, rate-limit
- Fix README so auth is never optional for production reads unless public GET is explicitly enabled

### D. Hub resolve (align with RFC-0002)

SDK follows the same story as Access/Lens:

- Bootstrap / configured **home or hub entry** for peer directory
- Resolve geographic or property ownership → **data node**
- Fetch facts from data node with service/read token accepted by that node (trust story TBD: key issued per node vs mesh-wide integrator trust)

**v1 pragmatic path:** API keys are **per data node** (operator issues key on the node agencies will call). Resolve returns the node URL; partner holds keys per region *or* only integrates one region first.

**v2 follow-on:** hub-mediated read tokens that data nodes accept (closer to traveler JWT cross-node verify) — requires clearer mesh trust for integrator principals.

### E. Widget product bar

Minimum before calling the widget “agency-ready”:

- Visible trust tier labels/colors (same language as Access)
- Explicit empty / not-covered / error states
- Deep-link to hub Access for detail / report
- Accessible mount (heading, focus, contrast) per [ACCESSIBILITY.md](../ACCESSIBILITY.md)
- Locale via existing i18n packages

### F. DX / demo

- `apps/agency-demo`: env-based API key, BFF mint token, then browser widget
- README: three patterns — server fetch, BFF+widget, ESM
- Operator docs: how to mint/revoke keys, scopes, CORS for partner origins

---

## Milestones (proposed)

| Milestone | Deliverable |
|-----------|-------------|
| **M0** | Accept RFC; tracking issue; no protocol bump required for key table alone |
| **M1** | Prisma `ApiKey` (or equivalent) + admin/CLI mint/revoke; hash-at-rest; scopes |
| **M2** | Node accepts service auth on agreed GET routes; user JWT still works; rate limits |
| **M3** | Short-lived read token exchange endpoint for BFFs |
| **M4** | SDK + README + agency-demo wired to M1–M3; remove “login as user” as happy path |
| **M5** | Widget coverage/trust UX + a11y checklist; optional public GET flag for demo nodes |
| **M6** | Cross-node integrator tokens / hub-minted reads (only if M1–M5 prove demand) |

## Highest-impact risks

| # | Risk | Mitigation |
|---|------|------------|
| **S1** | Leaked API key → bulk scrape of facts/photos | Hash keys; scopes; rate limits; revoke; no keys in frontend |
| **S2** | “Public GET” becomes default → abuse | Opt-in per node; tight defaults; CDN/WAF notes in ops docs |
| **S3** | Partner ships username/password in JS anyway | Docs + demo BFF; lint/warn in SDK if password config appears |
| **S4** | Service auth bypasses auditor trust storytelling | Reads still expose **tiers**; writes unchanged |
| **S5** | Per-node keys painful for multi-region agencies | Document; M6 hub tokens only after need is real |
| **S6** | CORS mistakes when adding partner origins | Stay on RFC-0002 allowlist model; never `*` |

## Alternatives considered

| Alternative | Why not (for now) |
|-------------|-------------------|
| Shared “agency” user account | Still a human credential; rotation/audit nightmare |
| mTLS between agency and node | High ops cost for early partners |
| Fully public mesh reads, no keys | Abuse + no operator control |
| OAuth2 Authorization Code for every agency staff user | Wrong problem; we need app-to-app read |
| Home-node reverse-proxy of all agency reads | Same timeout/photo issues rejected in RFC-0002 |

## Open questions

1. Key minting UX: Node Admin only, CLI, or both?
2. Should photo URLs on accessibility payloads require the same service auth as JSON (hotlink risk)?
3. External-id lookup (`booking:…`) as first-class resolve input for OTAs — ship with M4 or later?
4. Does gossip need to advertise “integrator read” capability, or is docs + env enough for v1?

## Success criteria

- An agency can show trust-tiered facts on a listing page **without** creating a traveler user.
- A browser widget runs with a **short-lived** token only.
- README and `agency-demo` match production auth.
- Operators can revoke a partner key without rotating `JWT_SECRET` or deleting humans.

## References

- Current SDK client: `packages/sdk/src/client.ts` (`token` → Bearer; comments still mention `/api/auth/login` and deprecated `/api/auth/token`)
- Accessibility GET auth: `apps/node/app/api/properties/[id]/accessibility/route.ts` (`requireAuth` on GET)
- Login: `apps/node/app/api/auth/login/route.ts` (username/password → RS256/HS256 JWT)
