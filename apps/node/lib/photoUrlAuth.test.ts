import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  authenticatedPhotoUrl,
  legacyPhotoId,
  parseLegacyPhotoId,
  signPhotoAccess,
  verifyPhotoAccess,
} from "./photoUrlAuth";

describe("photo URL auth tokens", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "photo-test-secret";
    delete process.env.NODE_PRIVATE_KEY;
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-14T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("accepts a freshly signed token", () => {
    const { exp, sig } = signPhotoAccess("photo-1");
    expect(verifyPhotoAccess("photo-1", String(exp), sig)).toBe(true);
  });

  it("rejects a token for a different photo id", () => {
    const { exp, sig } = signPhotoAccess("photo-1");
    expect(verifyPhotoAccess("photo-2", String(exp), sig)).toBe(false);
  });

  it("rejects a tampered signature", () => {
    const { exp, sig } = signPhotoAccess("photo-1");
    expect(verifyPhotoAccess("photo-1", String(exp), `${sig}x`)).toBe(false);
  });

  it("rejects an expired token", () => {
    const { exp, sig } = signPhotoAccess("photo-1", 60);
    vi.setSystemTime(new Date("2026-09-14T12:02:00Z"));
    expect(verifyPhotoAccess("photo-1", String(exp), sig)).toBe(false);
  });

  it("rejects missing exp or sig", () => {
    expect(verifyPhotoAccess("photo-1", null, "sig")).toBe(false);
    expect(verifyPhotoAccess("photo-1", "1", null)).toBe(false);
  });

  it("builds a node-relative proxy URL", () => {
    const url = authenticatedPhotoUrl("abc", "https://node.example/");
    const parsed = new URL(url);
    expect(parsed.origin).toBe("https://node.example");
    expect(parsed.pathname).toBe("/api/photos/abc");
    expect(verifyPhotoAccess("abc", parsed.searchParams.get("exp"), parsed.searchParams.get("sig"))).toBe(
      true
    );
  });

  it("round-trips legacy photo ids", () => {
    const id = legacyPhotoId("clxyz123", 2);
    expect(id).toBe("legacy-clxyz123-2");
    expect(parseLegacyPhotoId(id)).toEqual({ submissionId: "clxyz123", index: 2 });
    expect(parseLegacyPhotoId("not-legacy")).toBeNull();
  });
});
