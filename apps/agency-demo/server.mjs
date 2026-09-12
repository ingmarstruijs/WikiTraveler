/**
 * Agency demo static server + BFF mint proxy (RFC-0003 M3).
 *
 * Env:
 *   WT_ISSUER_URL   — hub/issuer node (default http://localhost:3000)
 *   WT_CLIENT_ID    — IntegratorClient id
 *   WT_CLIENT_SECRET
 *   WT_ACCESS_URL   — Access deep-link base (default https://access.wikitraveler.org)
 *   PORT            — default 4000
 *
 * Usage: pnpm dev:agency-demo
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "../..");
const PORT = Number(process.env.PORT || 4000);
const ISSUER = (process.env.WT_ISSUER_URL || "http://localhost:3000").replace(/\/$/, "");
const ACCESS_URL = (process.env.WT_ACCESS_URL || "https://access.wikitraveler.org").replace(/\/$/, "");
const CLIENT_ID = process.env.WT_CLIENT_ID || "";
const CLIENT_SECRET = process.env.WT_CLIENT_SECRET || "";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".map": "application/json",
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

async function mintToken() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    const err = new Error(
      "Set WT_CLIENT_ID and WT_CLIENT_SECRET (create via pnpm node:integrator create --name \"Agency demo\")"
    );
    err.status = 503;
    throw err;
  }
  const res = await fetch(`${ISSUER}/api/auth/integrator/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || `Mint failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

function serveStatic(reqPath, res) {
  let rel = decodeURIComponent(reqPath.split("?")[0]);
  if (rel === "/" || rel === "/apps/agency-demo" || rel === "/apps/agency-demo/") {
    rel = "/apps/agency-demo/index.html";
  }
  const filePath = path.join(ROOT, rel.replace(/^\//, ""));
  if (!filePath.startsWith(ROOT) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    send(res, 404, "Not found");
    return;
  }
  const ext = path.extname(filePath);
  const type = MIME[ext] || "application/octet-stream";
  send(res, 200, fs.readFileSync(filePath), { "Content-Type": type });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${PORT}`);

  if (req.method === "GET" && url.pathname === "/bff/config") {
    send(
      res,
      200,
      JSON.stringify({
        issuerUrl: ISSUER,
        accessUrl: ACCESS_URL,
        hasCredentials: Boolean(CLIENT_ID && CLIENT_SECRET),
      }),
      { "Content-Type": "application/json" }
    );
    return;
  }

  if (req.method === "POST" && url.pathname === "/bff/token") {
    try {
      const data = await mintToken();
      send(res, 200, JSON.stringify(data), { "Content-Type": "application/json" });
    } catch (e) {
      send(
        res,
        e.status || 500,
        JSON.stringify({ message: e.message || "Mint failed" }),
        { "Content-Type": "application/json" }
      );
    }
    return;
  }

  if (req.method === "POST" && url.pathname === "/bff/search") {
    try {
      await readBody(req); // ignore body; use query
      const q = url.searchParams.get("q") || "";
      const session = await mintToken();
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      // Search still requires a human JWT on many nodes — try issuer with integrator token;
      // if 403, return a clear message. Prefer property-id load in the UI.
      const searchRes = await fetch(`${ISSUER}/api/properties?${params}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const payload = await searchRes.json().catch(() => ({}));
      if (!searchRes.ok) {
        send(
          res,
          searchRes.status,
          JSON.stringify({
            message:
              payload.message ||
              "Property search needs a traveler/auditor JWT on this node. Use property ID + lat/lon instead.",
            properties: [],
          }),
          { "Content-Type": "application/json" }
        );
        return;
      }
      send(res, 200, JSON.stringify(payload), { "Content-Type": "application/json" });
    } catch (e) {
      send(
        res,
        e.status || 500,
        JSON.stringify({ message: e.message || "Search failed", properties: [] }),
        { "Content-Type": "application/json" }
      );
    }
    return;
  }

  if (req.method === "GET" || req.method === "HEAD") {
    serveStatic(url.pathname, res);
    return;
  }

  send(res, 405, "Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Agency demo + BFF on http://localhost:${PORT}/apps/agency-demo/`);
  console.log(`  issuer: ${ISSUER}`);
  console.log(`  credentials: ${CLIENT_ID && CLIENT_SECRET ? "set" : "MISSING — set WT_CLIENT_ID / WT_CLIENT_SECRET"}`);
});
