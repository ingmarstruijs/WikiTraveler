# Federated authentication (cross-node)

## Agency / SDK integrator tokens (RFC-0003)

Agencies must **not** use traveler username/password for reads.

1. On the **issuer** (hub/home node): create an `IntegratorClient` via Admin `POST /api/admin/integrators` or `pnpm node:integrator create --name "…"`.
2. Partner BFF exchanges `clientId` + `clientSecret` at `POST /api/auth/integrator/token` → short-lived RS256 JWT (`role: integrator_read`, `aud: sdk`, ~15m).
3. Call data-node `GET /api/properties/:id/accessibility` and `GET /api/peers/resolve` with `Authorization: Bearer <token>`. Foreign nodes verify via `/.well-known/pubkey` like traveler JWTs.
4. Revoke: `POST /api/admin/integrators/:clientId/revoke` or `pnpm node:integrator revoke --client-id …`.

Writes (audits, favorites, admin) still require a human user JWT.

---

## Short answer

**Yes — with RS256 node keys.** A traveler or auditor registers / logs in on **hub Access → home node A**, receives a JWT that embeds `homeNodeUrl`, and can browse (and auditors can audit) **properties on peer node B** without re-registering on B. B verifies the token by fetching `A/.well-known/pubkey`.

Canonical hub: `https://access.wikitraveler.org`. Branded Access hubs work the same way if every data node allowlists their origin.

`USER` accounts can browse and submit community signals; only `AUDITOR` / `ADMIN` may run the audit wizard (role is carried in the JWT).

## Requirements

| Requirement | Why |
|-------------|-----|
| `NODE_PRIVATE_KEY` + `NODE_PUBLIC_KEY` on A | Issues RS256 JWTs (HS256 does **not** federate) |
| B can reach `A/.well-known/pubkey` | Remote `verifyToken` path |
| Property exists on B | Gossip/local ingest — JWT does not create properties |
| CORS allows the Access origin on B | Browser calls from hub Access to B — trusted origins via `CORS_ORIGINS` / `CLIENT_ORIGINS` / `ACCESS_PUBLIC_URL` ([RFC-0002](./rfcs/0002-global-hub-access.md) M1); do **not** auto-trust gossip `accessUrl` |
| Peer known / resolvable | Access uses `/api/peers/resolve` (and optional `?node=`) |

## Flow

```
Access ──login──► Node A  ──JWT (homeNodeUrl=A)──► stored in cookie
Access ──GPS resolve──► Node A /api/peers/resolve ──► peer B URL
Access ──GET/POST API──► Node B  (Authorization: Bearer JWT)
Node B ──GET──► A/.well-known/pubkey ──► verify RS256
```

## What is NOT shared

- User rows are **local** to the home node (B does not create a `User` for remote auditors).
- Audit attribution uses `auditorId` shaped like `username@homeNodeUrl`.
- Admin-only dashboards on B still require a local admin session on B.

## Operator checklist

1. Generate and set RS256 keys on every public node ([LOCAL.md](./LOCAL.md) / [DOCKER.md](./DOCKER.md)).
2. On every public **data** node, allow hub Access (and Lens) origins — e.g. `CLIENT_ORIGINS=https://access.wikitraveler.org,https://access-backup.example.org` and/or list them in `CORS_ORIGINS`. Do not leave `CORS_ORIGINS=*` in production. See [RFC-0002](./rfcs/0002-global-hub-access.md).
3. Seed `BOOTSTRAP_PEERS` (see [PUBLIC-PEERS.md](./PUBLIC-PEERS.md)) so resolve has peers.
4. Confirm gossip sync so properties exist on both sides ([GOSSIP-DEV.md](./GOSSIP-DEV.md)).

## Tests

- Lab: `pnpm gossip:discovery` (bootstrap discovery + pubkey reachability + sync).
- API: `verifyToken` remote branch in `apps/node/lib/auth.ts`.
