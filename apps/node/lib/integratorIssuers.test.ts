import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/nodeInfo", () => ({
  NODE_ID: "test-node",
  NODE_URL: "https://node-eu.example.com",
}));

import {
  getIntegratorIssuerAllowlist,
  isIntegratorIssuerAllowed,
  normalizeIssuerUrl,
} from "./integratorIssuers";

describe("integratorIssuers", () => {
  const prev = process.env.INTEGRATOR_ISSUERS;

  afterEach(() => {
    if (prev === undefined) delete process.env.INTEGRATOR_ISSUERS;
    else process.env.INTEGRATOR_ISSUERS = prev;
  });

  it("normalizes issuer URLs to origin", () => {
    expect(normalizeIssuerUrl("https://hub.example/path/")).toBe("https://hub.example");
  });

  it("returns null allowlist when unset", () => {
    delete process.env.INTEGRATOR_ISSUERS;
    expect(getIntegratorIssuerAllowlist()).toBeNull();
    expect(isIntegratorIssuerAllowed("https://any.example")).toBe(true);
  });

  it("allows local NODE_URL even when allowlist is set", () => {
    process.env.INTEGRATOR_ISSUERS = "https://other.example";
    expect(isIntegratorIssuerAllowed("https://node-eu.example.com")).toBe(true);
    expect(isIntegratorIssuerAllowed(undefined)).toBe(true);
  });

  it("allows only listed foreign issuers when set", () => {
    process.env.INTEGRATOR_ISSUERS = "https://hub.example/,https://backup.example";
    expect(isIntegratorIssuerAllowed("https://hub.example")).toBe(true);
    expect(isIntegratorIssuerAllowed("https://evil.example")).toBe(false);
  });
});
