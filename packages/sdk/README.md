# @wikitraveler/sdk

Embed WikiTraveler accessibility facts on agency / OTA websites as a **sidecar** — not a parallel booking site.

**Auth (RFC-0003):** partners use **issuer client credentials** on a BFF → short-lived `integrator_read` JWT. Do **not** embed traveler username/password in the browser.

## Install

```bash
npm install @wikitraveler/sdk
# or
pnpm add @wikitraveler/sdk
```

Publishing runs on `v*` tags when `NPM_PUBLISH=true` — see [docs/RELEASES.md](../../docs/RELEASES.md). Until then use the GitHub Release SDK assets.

## Pattern A — Partner BFF + widget (recommended)

```ts
// server (BFF) — secrets stay here
import { mintIntegratorReadToken } from "@wikitraveler/sdk";

const session = await mintIntegratorReadToken({
  issuerUrl: process.env.WT_ISSUER_URL!,
  clientId: process.env.WT_CLIENT_ID!,
  clientSecret: process.env.WT_CLIENT_SECRET!,
});
// return session.accessToken to the browser (short TTL)
```

```html
<div id="wt-widget"
     data-wt-widget
     data-property-id="osm:123"
     data-issuer-url="https://node-eu.wikitraveler.org"
     data-lat="51.44"
     data-lon="5.47"
     data-token="SHORT_LIVED_JWT"
     data-access-url="https://access.wikitraveler.org"></div>
<script src="…/wikitraveler.umd.js"></script>
<script>WikiTraveler.mountWidget("#wt-widget");</script>
```

## Pattern B — Server fetch with integrator JWT

```ts
import { WikiTraveler, mintIntegratorReadToken } from "@wikitraveler/sdk";

const { accessToken } = await mintIntegratorReadToken({
  issuerUrl: process.env.WT_ISSUER_URL!,
  clientId: process.env.WT_CLIENT_ID!,
  clientSecret: process.env.WT_CLIENT_SECRET!,
});

const wt = new WikiTraveler({
  issuerUrl: process.env.WT_ISSUER_URL!,
  token: accessToken,
});
const node = await wt.resolveDataNode({ lat: 51.44, lon: 5.47 });
const data = await wt.getAccessibility("osm:123", { nodeUrl: node.url });
// data.facts include trust tiers (OFFICIAL → CONFIRMED)
```

## Pattern C — ESM / bundlers (token already minted)

```ts
import { WikiTraveler, mountWidget } from "@wikitraveler/sdk";

const wt = new WikiTraveler({
  issuerUrl: "https://node-eu.wikitraveler.org",
  token: shortLivedJwt,
});
```

## Accessibility (widget checklist)

When shipping the drop-in widget:

- [ ] Visible heading (“Accessibility”) — widget provides one
- [ ] Trust tier labels visible per fact
- [ ] Honest empty / uncovered / auth / network states (no fake confidence)
- [ ] Deep-link to Access for detail / report (`data-access-url`)
- [ ] Focusable “Open in WikiTraveler Access” control
- [ ] Contrast: use `@wikitraveler/ui` tokens or site theme variables
- [ ] Locale via `data-wt-locale` / `locale` option

See [docs/ACCESSIBILITY.md](../../docs/ACCESSIBILITY.md).

## Operator setup

Credentials, issuer node, CORS for partner origins, and revoke: [docs/OPERATORS.md](../../docs/OPERATORS.md) · [docs/FEDERATED-AUTH.md](../../docs/FEDERATED-AUTH.md) · [RFC-0003](../../docs/rfcs/0003-agency-sdk-service-auth.md).

Demo (BFF + widget): `pnpm dev:agency-demo` with `WT_ISSUER_URL`, `WT_CLIENT_ID`, `WT_CLIENT_SECRET`.

## Development

```bash
pnpm --filter @wikitraveler/core build
pnpm --filter @wikitraveler/i18n build
pnpm --filter @wikitraveler/sdk build
```

The published package **bundles** `@wikitraveler/core` and `@wikitraveler/i18n`.
