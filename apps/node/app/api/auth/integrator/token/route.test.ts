import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { verifyIntegratorCredentials, signToken } = vi.hoisted(() => ({
  verifyIntegratorCredentials: vi.fn(),
  signToken: vi.fn().mockReturnValue("signed.jwt.token"),
}));

vi.mock("@/lib/integratorAuth", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/integratorAuth")>();
  return {
    ...actual,
    verifyIntegratorCredentials,
  };
});
vi.mock("@/lib/auth", () => ({ signToken }));

import { POST } from "./route";

describe("POST /api/auth/integrator/token", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    signToken.mockReturnValue("signed.jwt.token");
  });

  it("mints a token for valid credentials", async () => {
    verifyIntegratorCredentials.mockResolvedValue({
      clientId: "wt_ic_1",
      name: "Acme",
      scopes: ["read:accessibility", "read:resolve"],
    });
    const res = await POST(
      new NextRequest("http://localhost/api/auth/integrator/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: "wt_ic_1", clientSecret: "sekret" }),
      })
    );
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toMatchObject({
      accessToken: "signed.jwt.token",
      tokenType: "Bearer",
      expiresIn: 900,
    });
    expect(signToken).toHaveBeenCalledWith(
      expect.objectContaining({
        sub: "wt_ic_1",
        role: "integrator_read",
        aud: "sdk",
      }),
      "15m"
    );
  });

  it("rejects bad credentials", async () => {
    verifyIntegratorCredentials.mockResolvedValue(null);
    const res = await POST(
      new NextRequest("http://localhost/api/auth/integrator/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId: "wt_ic_1", clientSecret: "nope" }),
      })
    );
    expect(res.status).toBe(401);
  });
});
