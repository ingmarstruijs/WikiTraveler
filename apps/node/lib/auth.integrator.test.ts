import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = "test-jwt-secret-for-integrator";

vi.hoisted(() => {
  process.env.JWT_SECRET = "test-jwt-secret-for-integrator";
  delete process.env.NODE_PRIVATE_KEY;
  delete process.env.NODE_PUBLIC_KEY;
});

vi.mock("@/lib/nodeInfo", () => ({
  NODE_ID: "test-node",
  NODE_URL: "http://localhost:3000",
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    nodePeer: { findFirst: vi.fn(), update: vi.fn() },
  },
}));

vi.mock("@/lib/peerUrl", () => ({
  fetchPeerJson: vi.fn(),
  PEER_FETCH_PATHS: { pubkey: "/.well-known/pubkey" },
}));

vi.mock("@/lib/gossipLabUrls", () => ({
  labPubkeyFetchCandidates: (url: string) => [url],
}));

import { requireAuth, requireReadAccess, requireRole, signToken } from "./auth";

function bearerReq(token: string) {
  return new NextRequest("http://localhost/api/test", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

describe("requireReadAccess / integrator_read (RFC-0003)", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = JWT_SECRET;
  });

  it("allows traveler USER JWT", async () => {
    const token = signToken({ sub: "alice", role: "USER" });
    expect(await requireReadAccess(bearerReq(token))).toBeNull();
  });

  it("allows integrator_read with matching scope", async () => {
    const token = signToken({
      sub: "wt_ic_abc",
      role: "integrator_read",
      aud: "sdk",
      scopes: ["read:accessibility", "read:resolve"],
    }, "15m");
    expect(await requireReadAccess(bearerReq(token), "read:accessibility")).toBeNull();
    expect(await requireReadAccess(bearerReq(token), "read:resolve")).toBeNull();
  });

  it("rejects integrator_read missing required scope", async () => {
    const token = signToken({
      sub: "wt_ic_abc",
      role: "integrator_read",
      aud: "sdk",
      scopes: ["read:resolve"],
    }, "15m");
    const res = await requireReadAccess(bearerReq(token), "read:accessibility");
    expect(res).toBeInstanceOf(NextResponse);
    expect(res!.status).toBe(403);
  });

  it("rejects integrator_read for requireAuth / requireRole", async () => {
    const token = signToken({
      sub: "wt_ic_abc",
      role: "integrator_read",
      aud: "sdk",
      scopes: ["read:accessibility"],
    }, "15m");
    const auth = await requireAuth(bearerReq(token));
    expect(auth!.status).toBe(403);
    const admin = await requireRole(bearerReq(token), "ADMIN");
    expect(admin!.status).toBe(403);
  });

  it("rejects wrong aud on integrator tokens", async () => {
    const token = jwt.sign(
      {
        sub: "wt_ic_abc",
        role: "integrator_read",
        aud: "other",
        scopes: ["read:accessibility"],
        homeNodeUrl: "http://localhost:3000",
      },
      JWT_SECRET,
      { expiresIn: "15m" }
    );
    const res = await requireReadAccess(bearerReq(token), "read:accessibility");
    expect(res!.status).toBe(403);
  });
});
