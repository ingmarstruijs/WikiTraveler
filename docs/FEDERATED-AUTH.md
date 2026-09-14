# Authentication

How WikiTraveler authenticates **people**, **partner apps**, **photos**, and **nodes**. Trusted browser origins (`CORS_ORIGINS` / `CLIENT_ORIGINS`) are a separate allowlist — [OPERATORS.md](./OPERATORS.md) · [RFC-0002](./rfcs/0002-global-hub-access.md).

## Callers

| Caller | Credential | Used for |
|--------|------------|----------|
| Traveler / auditor (Access, Lens) | Human JWT from `POST /api/auth/login` (`Authorization: Bearer`) | Identity, favorites, signals, audits |
| Agency / SDK | Issuer `clientId` + `clientSecret` → short-lived `integrator_read` JWT | Resolve + read accessibility facts |
| `<img>` / photo fetch | Signed `GET /api/photos/:id?exp=&sig=` (or the same read JWT) | Audit photo bytes |
| Peer node | HTTP signatures (`X-Node-Id`, `X-Node-Timestamp`, `X-Node-Signature`) | Gossip snapshot, ingest, inbox |
| Cron | `Authorization: Bearer <CRON_SECRET>` | `/api/cron/*` |

Writes (audits, favorites, admin, claims) always need a **human** JWT. Integrator tokens are read-only.

---

## Access and Lens (human JWT)

Travelers and auditors register and log in on a **home node**. The JWT is RS256 when `NODE_PRIVATE_KEY` / `NODE_PUBLIC_KEY` are set (HS256 is local-only and does not federate). The payload includes `role` (`USER` | `AUDITOR` | `ADMIN`) and `homeNodeUrl`.

A data node verifies a foreign JWT by fetching `homeNodeUrl/.well-known/pubkey`. The traveler does not re-register on every regional node.

```
Access / Lens ──login──► home node A  ──JWT (homeNodeUrl=A)──► client storage
Client ──resolve──► A /api/peers/resolve ──► data node B
Client ──API──► B  (Authorization: Bearer JWT)
B ──GET──► A/.well-known/pubkey ──► verify RS256
```

| Role | Browse, favorites, signals | Audit wizard |
|------|----------------------------|--------------|
| `USER` | Yes | No |
| `AUDITOR` | Yes | Yes |
| `ADMIN` | Yes | Yes (+ Node Admin on **that** node) |

Canonical hub Access: `https://access.wikitraveler.org`. Branded Access works the same if every data node allowlists that origin.

**Not shared across nodes:** user rows stay on the home node. Audit attribution is `username@homeNodeUrl`. Admin dashboards on B require a local admin session on B.

### Operator setup

1. RS256 keys on every public node ([LOCAL.md](./LOCAL.md) · [DOCKER.md](./DOCKER.md)).
2. On every public **data** node, allow hub Access and Lens origins in `CLIENT_ORIGINS` / `CORS_ORIGINS`. Do not use `*` in production. Do not auto-trust gossiped `accessUrl` values.
3. Seed `BOOTSTRAP_PEERS` ([PUBLIC-PEERS.md](./PUBLIC-PEERS.md)) so resolve has peers.
4. Gossip so properties exist on the data node ([GOSSIP-DEV.md](./GOSSIP-DEV.md)).

---

## Agency SDK (integrator tokens)

Agencies authenticate as **applications**, not people. Do not embed a traveler username/password in partner JavaScript.

1. On the **issuer** (hub/home node): create an `IntegratorClient` via Admin `POST /api/admin/integrators` or `pnpm node:integrator create --name "…"`. Store the plaintext secret once.
2. Partner BFF exchanges `clientId` + `clientSecret` at `POST /api/auth/integrator/token` → RS256 JWT (`role: integrator_read`, `aud: sdk`, about 15 minutes).
3. Call data-node `GET /api/properties/:id/accessibility` and `GET /api/peers/resolve` with `Authorization: Bearer <token>`. Foreign nodes verify the issuer public key the same way as traveler JWTs.
4. Revoke: `POST /api/admin/integrators/:clientId/revoke` or `pnpm node:integrator revoke --client-id …`. Existing JWTs expire; no need to rotate human passwords or `JWT_SECRET`.

Allow partner **browser** origins on each data node (`CLIENT_ORIGINS` / `CORS_ORIGINS`).

**Optional public GET:** Admin `publicAccessibilityReads` (`PATCH /api/admin/settings`) allows anonymous GET on accessibility + peers resolve. Default **off**. For marketing demos with rate limits — not production agency traffic.

More: [OPERATORS.md](./OPERATORS.md) · [packages/sdk/README.md](../packages/sdk/README.md) · [RFC-0003](./rfcs/0003-agency-sdk-service-auth.md).

---

## Audit photo URLs

Accessibility JSON does **not** include object-storage URLs or data-URIs. Each photo `url` is a short-lived node link:

`GET /api/photos/:id?exp=&sig=` (HMAC, 1 hour)

- Use as `<img src>` — no `Authorization` header (the query is the capability).
- A valid user or `integrator_read` JWT also authorizes `GET /api/photos/:id` without the query.
- Refetch accessibility JSON if a photo 403s after expiry.
- `publicAccessibilityReads` still mints signed URLs; unauthenticated `/api/photos/:id` without `exp`/`sig` is 401.
- Gossip `photoRefs` still carry stored refs (node-to-node). Object buckets that remain world-readable can still be fetched if the object key is known — prefer private buckets.

---

## Node-to-node (gossip)

Peer pull/push uses RSA-SHA256 over `nodeId.timestampMs` in `X-Node-Signature`, plus `X-Node-Id` and `X-Node-Timestamp` (replay window: 5 minutes). Cron routes on a single node use `CRON_SECRET`, not peer signatures.

Details: [ARCHITECTURE.md](./ARCHITECTURE.md) · [GOSSIP-DEV.md](./GOSSIP-DEV.md).
