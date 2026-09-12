import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock, requireRole, createIntegratorClient, listIntegratorClients } =
  vi.hoisted(() => ({
    prismaMock: {},
    requireRole: vi.fn(),
    createIntegratorClient: vi.fn(),
    listIntegratorClients: vi.fn(),
  }));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ requireRole }));
vi.mock("@/lib/integratorAuth", () => ({
  createIntegratorClient,
  listIntegratorClients,
}));

import { GET, POST } from "./route";

describe("/api/admin/integrators", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireRole.mockResolvedValue(null);
  });

  it("lists clients", async () => {
    listIntegratorClients.mockResolvedValue([
      { clientId: "wt_ic_1", name: "Acme", scopes: ["read:accessibility"], revokedAt: null },
    ]);
    const res = await GET(new NextRequest("http://localhost/api/admin/integrators"));
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({
      clients: [{ clientId: "wt_ic_1", name: "Acme" }],
    });
  });

  it("creates a client and returns secret once", async () => {
    createIntegratorClient.mockResolvedValue({
      id: "1",
      clientId: "wt_ic_new",
      clientSecret: "sekret",
      name: "Acme",
      scopes: ["read:accessibility", "read:resolve"],
      createdAt: new Date("2026-09-12T00:00:00Z"),
    });
    const res = await POST(
      new NextRequest("http://localhost/api/admin/integrators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Acme" }),
      })
    );
    expect(res.status).toBe(201);
    await expect(res.json()).resolves.toMatchObject({
      ok: true,
      client: { clientId: "wt_ic_new", name: "Acme" },
      clientSecret: "sekret",
    });
  });

  it("requires name", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/admin/integrators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })
    );
    expect(res.status).toBe(400);
    expect(createIntegratorClient).not.toHaveBeenCalled();
  });
});
