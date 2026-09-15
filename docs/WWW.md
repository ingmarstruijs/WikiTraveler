# Public website (www.wikitraveler.org)

Marketing / project site: short pitch, [origin story](./story/README.md), and canonical [privacy policy](./PRIVACY.md).

**Canonical host:** `https://www.wikitraveler.org`  
**Apex:** `https://wikitraveler.org` redirects to `www`.

This is **not** Access and **not** the node. Travelers still use `https://access.wikitraveler.org`; facts still live on nodes.

App: [`apps/www`](../apps/www). Local: `pnpm dev:www` → http://localhost:3002

## Pages

| Path | Content |
|------|---------|
| `/` | Marketing homepage (hero, trust tiers, how it works, ecosystem) |
| `/story` | Renders [`docs/story/the-hotel-said-accessible-that-wasnt-enough.md`](./story/the-hotel-said-accessible-that-wasnt-enough.md) (screenshots and Mermaid open on click); captions live in [`publish-ready.md`](./story/publish-ready.md) |
| `/privacy` | Canonical privacy policy (Node and Access keep copies at `/privacy`) |

## Zone layout

Nameservers are Cloudflare (`clara.ns.cloudflare.com` / `lewis.ns.cloudflare.com`). Host Vercel apps with **DNS only (grey cloud)** so Vercel can issue certificates. Do not orange-cloud these hostnames.

| Hostname | Vercel project | Cloudflare record | Proxy |
|----------|----------------|-------------------|-------|
| `www.wikitraveler.org` | `wikitraveler-www` (this app) | `CNAME www` → Vercel target | DNS only |
| `wikitraveler.org` | same project, **redirect → www** | `CNAME @` → same Vercel target (flattening) | DNS only |
| `access.wikitraveler.org` | `wikitraveler-access` | `CNAME access` → that project’s Vercel target | DNS only |
| `node-eu.wikitraveler.org` | `wikitraveler-node` | `CNAME node-eu` → that project’s Vercel target | DNS only |

Leave `access` and `node-eu` as they are while adding www. There is no MX/TXT/CAA on the apex today; a Cloudflare CNAME on `@` is safe (flattening still allows adding MX later).

## Vercel project

Create a **third** project from the same GitHub repo (alongside `wikitraveler-node` and `wikitraveler-access`):

1. Open [vercel.com/new](https://vercel.com/new) → import **`ingmarstruijs/WikiTraveler`** (already connected for node + access). Do **not** reuse those projects.
2. **Project Name:** `wikitraveler-www`.
3. **Root Directory:** `apps/www` (Edit → select the folder). Keep **Include files outside the Root Directory** on (workspace `@wikitraveler/ui`).
4. Framework: Next.js. On the import screen, only override **Install** / **Build** if they are empty. Leave **Output Directory** as **Next.js default** (do not type `.next`). Skip the Environment Variables form.

| Setting | Value |
|---------|-------|
| **Install Command** | `cd ../.. && pnpm install --frozen-lockfile` |
| **Build Command** | `cd ../.. && pnpm run vercel-build:www` (builds `i18n` / `ui`, copies story + screenshots, then Next) |
| **Output Directory** | Next.js default |

Production branch is `main` by default. No env vars.

5. Click **Deploy**. Confirm the `*.vercel.app` URL serves `/`, `/story`, and `/privacy`.
6. After the first deploy, optional **Settings → Git → Ignored Build Step** (skips rebuilds when only node/access changed). Command runs from `apps/www`; exit `0` skips the build:

```bash
git diff --quiet HEAD^ HEAD -- . ../../packages/ui ../../packages/i18n ../../package.json ../../pnpm-lock.yaml ../../pnpm-workspace.yaml
```

7. After the first deploy, **Settings → Deployment Protection:** disable Vercel Authentication for Production.

## Custom domains (Vercel, then Cloudflare)

Do this **after** the first successful production deploy.

1. Vercel `wikitraveler-www` → **Domains**:
   - Add `www.wikitraveler.org` (primary).
   - Add `wikitraveler.org` → **Redirect to `www.wikitraveler.org`** (308).
2. Copy the CNAME target Vercel shows (often a unique `*.vercel-dns-017.com`, same pattern as `access` / `node-eu`; sometimes `cname.vercel-dns.com`).
3. Cloudflare → **wikitraveler.org** → **DNS → Records** → add (proxy **DNS only**, grey cloud):

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| CNAME | `www` | *(paste Vercel target)* | DNS only |
| CNAME | `@` | *(same target)* | DNS only |

4. Wait until both domains are **Valid** in Vercel (certificate issued). First attempt can take a few minutes; if it stays **Invalid**, confirm the cloud is grey and the target matches exactly.

## Cloudflare SSL / HTTPS (zone-wide)

These settings apply to the whole zone. Grey-cloud Vercel hosts terminate TLS on Vercel; **Full (strict)** still matters if any record is ever proxied, and it is the safe default.

**SSL/TLS → Overview**

| Setting | Value |
|---------|-------|
| SSL/TLS encryption mode | **Full (strict)** — never Flexible |

**SSL/TLS → Edge Certificates**

| Setting | Value |
|---------|-------|
| Always Use HTTPS | On |
| Minimum TLS Version | TLS 1.2 |
| TLS 1.3 | On |
| Automatic HTTPS Rewrites | On |
| HTTP Strict Transport Security (HSTS) | Off in Cloudflare (Vercel already sends HSTS) |
| Authenticated Origin Pulls | Off |

**Speed → Optimization** (only bites orange-cloud hostnames, but leave them off anyway)

| Setting | Value |
|---------|-------|
| Rocket Loader | Off (breaks Next.js hydration) |
| Auto Minify JS | Off |
| Mirage / Polish | Off |

Do **not**:

- Orange-cloud `www`, `@`, `access`, or `node-eu` (525/SSL errors; Vercel cannot complete HTTP-01).
- Add a Cloudflare Redirect Rule apex → www (Vercel already 308s; a second hop is worse).
- Point `www` at Access, the node, or a Cloudflare Pages placeholder.

## Verify

```bash
# DNS (expect CNAME → vercel-dns, not a Cloudflare proxy IP)
nslookup www.wikitraveler.org
nslookup wikitraveler.org

# Site
curl -sI https://www.wikitraveler.org | head
curl -sI https://wikitraveler.org | head   # 308 Location: https://www.wikitraveler.org/
```

| Check | Expected |
|-------|----------|
| `https://www.wikitraveler.org` | Homepage; `Server: Vercel` |
| `https://www.wikitraveler.org/story` | Origin story + diagram |
| `https://www.wikitraveler.org/privacy` | Canonical privacy policy |
| `https://wikitraveler.org` | 308/301 → `https://www.wikitraveler.org/` |
| `access` / `node-eu` | Unchanged after the DNS edit |

## Chrome Web Store

Privacy policy URL: **https://www.wikitraveler.org/privacy** ([LENS.md](./LENS.md)).
