import { describe, expect, it } from "vitest";
import { heroPhotoUrlFromAccessibility, isSignedPhotoUrlStale } from "./signedPhotoUrl";

describe("isSignedPhotoUrlStale", () => {
  const now = 1_700_000_000;

  it("ignores non-photo URLs", () => {
    expect(isSignedPhotoUrlStale("https://cdn.example/img.jpg", now)).toBe(false);
    expect(isSignedPhotoUrlStale(null, now)).toBe(false);
  });

  it("treats photo URLs without exp as stale", () => {
    expect(
      isSignedPhotoUrlStale("https://node.example/api/photos/abc", now)
    ).toBe(true);
  });

  it("detects expired exp", () => {
    expect(
      isSignedPhotoUrlStale(
        `https://node.example/api/photos/abc?exp=${now - 10}&sig=x`,
        now
      )
    ).toBe(true);
  });

  it("keeps fresh URLs", () => {
    expect(
      isSignedPhotoUrlStale(
        `https://node.example/api/photos/abc?exp=${now + 3600}&sig=x`,
        now
      )
    ).toBe(false);
  });

  it("skews near expiry", () => {
    expect(
      isSignedPhotoUrlStale(
        `https://node.example/api/photos/abc?exp=${now + 30}&sig=x`,
        now,
        60
      )
    ).toBe(true);
  });
});

describe("heroPhotoUrlFromAccessibility", () => {
  it("prefers property photos", () => {
    expect(
      heroPhotoUrlFromAccessibility({
        property: { photos: [{ url: "a" }] },
        auditPhotos: { photos: [{ url: "b" }] },
      })
    ).toBe("a");
  });
});
