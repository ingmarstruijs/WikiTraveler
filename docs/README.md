# WikiTraveler documentation

Single entry point for the project. Pick the path that matches your role — each guide links to deeper docs instead of duplicating them.

---

## Choose your path

| I want to… | Start here |
|------------|------------|
| **Understand the system** | [Architecture](./ARCHITECTURE.md) |
| **Run a node in production** | [Operators guide](./OPERATORS.md) → [Docker](./DOCKER.md) or [Vercel](./VERCEL.md) |
| **Upgrade an existing deployment** | [Upgrade runbook](./UPGRADE.md) |
| **Develop features locally** | [Development guide](./DEVELOPMENT.md) → [Local setup](./LOCAL.md) |
| **Join as a contributor** | [Community](./COMMUNITY.md) → [Contributing](../CONTRIBUTING.md) |
| **Ship or consume a release** | [Releases](./RELEASES.md) → [Changelog](../CHANGELOG.md) |
| **Test federation / gossip** | [Gossip lab](./GOSSIP-DEV.md) |
| **Meet accessibility requirements** | [Accessibility checklist](./ACCESSIBILITY.md) · [Conformance report](./CONFORMANCE.md) |
| **Read the origin story** | [Story](./story/README.md) · live: [www.wikitraveler.org/story](https://www.wikitraveler.org/story) |

---

## Documentation map

### For operators (deploy & run)

| Doc | Purpose |
|-----|---------|
| [OPERATORS.md](./OPERATORS.md) | Who runs what, deployment options, first-time production checklist |
| [OPERATOR-CHECKLIST.md](./OPERATOR-CHECKLIST.md) | Post-deploy verification (`pnpm doctor`, smoke tests) |
| [DOCKER.md](./DOCKER.md) | Self-hosted node (+ optional Access) with Docker Compose |
| [VERCEL.md](./VERCEL.md) | Serverless node + Access on Vercel |
| [UPGRADE.md](./UPGRADE.md) | Version upgrades, migrations, rollback, gossip compatibility |
| [RELEASES.md](./RELEASES.md) | Versioning, artifacts, tag checklist, federation policy |
| [COMPATIBILITY.md](./COMPATIBILITY.md) | N/N-1 mesh and protocol compatibility |
| [rfcs/](./rfcs/README.md) | RFC process; [RFC-0002](./rfcs/0002-global-hub-access.md) hub Access; [RFC-0003](./rfcs/0003-agency-sdk-service-auth.md) agency SDK |

### For developers (build & test)

| Doc | Purpose |
|-----|---------|
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Monorepo layout, scripts, PR workflow, quality gates |
| [LOCAL.md](./LOCAL.md) | Local Postgres, apps, OSM ingest, env vars |
| [GOSSIP-DEV.md](./GOSSIP-DEV.md) | Gossip lab and CI federation scripts |
| [FEDERATED-AUTH.md](./FEDERATED-AUTH.md) | Human JWT, integrator tokens, signed photo URLs, node signatures |
| [RFC-0002](./rfcs/0002-global-hub-access.md) | Global hub Access/Lens, trusted CORS, viewport map |
| [RFC-0003](./rfcs/0003-agency-sdk-service-auth.md) | Agency SDK service auth |
| [PUBLIC-PEERS.md](./PUBLIC-PEERS.md) | Voluntary bootstrap peer directory |
| [LENS.md](./LENS.md) | Chrome extension distribution (Release zip / Store) |
| [apps/README.md](../apps/README.md) | End-to-end flow walkthroughs (SDK, Access, Lens) |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System design, API surface, gossip, Access PWA, audit photos |
| [rfcs/](./rfcs/README.md) | RFC process for gossip / auth / schema changes |

### For the community

| Doc | Purpose |
|-----|---------|
| [COMMUNITY.md](./COMMUNITY.md) | Roles, mesh growth, becoming an auditor |
| [PUBLIC-PEERS.md](./PUBLIC-PEERS.md) | Opt-in public bootstrap peers |
| [../CONTRIBUTING.md](../CONTRIBUTING.md) | How to open issues and PRs |
| [../CODE_OF_CONDUCT.md](../CODE_OF_CONDUCT.md) | Expected behaviour |
| [../SECURITY.md](../SECURITY.md) | Reporting vulnerabilities |
| [../CHANGELOG.md](../CHANGELOG.md) | Release history |
| [packages/sdk/README.md](../packages/sdk/README.md) | Agency SDK install / embed |

### Compliance

| Doc | Purpose |
|-----|---------|
| [ACCESSIBILITY.md](./ACCESSIBILITY.md) | WCAG developer checklist |
| [PRIVACY.md](./PRIVACY.md) | Public privacy policy (`www` canonical; Node/Access copies) |
| [CONFORMANCE.md](./CONFORMANCE.md) | Formal accessibility conformance statement |

---

## Repository layout

```
wikitraveler/
├── apps/
│   ├── node/            # API + dashboard (deployment unit)
│   ├── access/          # Mobile PWA client
│   ├── www/             # Public site (www.wikitraveler.org)
│   ├── lens/            # Chrome extension
│   └── agency-demo/     # SDK integration demo
├── packages/
│   ├── core/            # Types, tier logic, gossip merge
│   ├── sdk/             # Agency browser SDK
│   ├── ui/              # Shared React components
│   ├── i18n/            # Locales
│   └── ai-agent/        # Vision + gap-fill
├── prisma/              # Shared schema + migrations
├── docker/              # Dockerfiles + compose stacks
├── scripts/             # CLI: node:ingest, gossip:*, seed
├── docs/                # You are here
└── versions.json        # Canonical version manifest
```

---

## Quick commands

| Goal | Command |
|------|---------|
| Local node | `pnpm dev` → http://localhost:3000 |
| WikiTraveler Access | `pnpm dev:access` → http://localhost:3001 |
| Public site | `pnpm dev:www` → http://localhost:3002 |
| Fresh local DB | `pnpm db:setup` |
| Apply migrations | `pnpm db:migrate` / `pnpm db:deploy` (production) |
| Build everything | `pnpm build` |
| Tests | `pnpm test` · `pnpm test:a11y` |
| Gossip lab | `pnpm dev:gossip-lab` → `pnpm gossip:discovery` |

Full script reference: [DEVELOPMENT.md](./DEVELOPMENT.md#scripts).

---

## External references

- Environment variables: [`.env.example`](../.env.example)
- Current versions: [`versions.json`](../versions.json)
- CI: [`.github/workflows/`](../.github/workflows/)
