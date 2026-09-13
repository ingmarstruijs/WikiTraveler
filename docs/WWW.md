# Public website (www.wikitraveler.org)

Marketing / project site: short pitch, [origin story](./story/README.md), and canonical [privacy policy](./PRIVACY.md).

**Canonical host:** `https://www.wikitraveler.org`  
**Apex:** `https://wikitraveler.org` redirects to `www`.

This is **not** Access and **not** the node. Travelers still use `https://access.wikitraveler.org`; facts still live on nodes.

App: [`apps/www`](../apps/www). Local: `pnpm dev:www` → http://localhost:3002

## Pages

| Path | Content |
|------|---------|
| `/` | Pitch + links |
| `/story` | Renders [`docs/story/the-hotel-said-accessible-that-wasnt-enough.md`](./story/the-hotel-said-accessible-that-wasnt-enough.md) |
| `/privacy` | Canonical privacy policy (Node and Access keep copies at `/privacy`) |

## Vercel project

Create a **third** project from the same GitHub repo (alongside `wikitraveler-node` and `wikitraveler-access`):

| Setting | Value |
|---------|-------|
| **Root Directory** | `apps/www` |
| **Framework** | Next.js |
| Install / build | From [`apps/www/vercel.json`](../apps/www/vercel.json) (`pnpm run vercel-build:www`) |
| **Deployment Protection** | Off for Production |

No database or env vars required.

## Cloudflare DNS

Domain is on Cloudflare. Use **DNS only (grey cloud)** so Vercel can issue certificates.

1. In the Vercel www project → **Domains**:
   - Add `www.wikitraveler.org` (primary).
   - Add `wikitraveler.org` and set **redirect to `www.wikitraveler.org`**.
2. In Cloudflare DNS:
   - `CNAME` **`www`** → `cname.vercel-dns.com` (or the target Vercel shows).
   - Apex **`@`**: CNAME flattening to the same `cname.vercel-dns.com` target (Cloudflare allows CNAME on `@`).
3. Wait until both domains are **Valid** in Vercel. Confirm:
   - `https://www.wikitraveler.org` serves the site.
   - `https://wikitraveler.org` 308/301 → `https://www.wikitraveler.org`.

Do not proxy through Cloudflare orange-cloud unless you have a specific reason; it often breaks Vercel TLS.

## Chrome Web Store

Privacy policy URL: **https://www.wikitraveler.org/privacy** ([LENS.md](./LENS.md)).
