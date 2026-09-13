import { describe, expect, it } from "vitest";
import { rewriteStoryMedia, resolveStoryPath } from "./loadStory";

describe("rewriteStoryMedia", () => {
  it("points relative screenshot paths at /screenshots", () => {
    const input =
      '<img src="../assets/screenshots/lens.png" alt="Lens" />';
    expect(rewriteStoryMedia(input)).toBe('<img src="/screenshots/lens.png" alt="Lens" />');
  });
});

describe("resolveStoryPath", () => {
  it("finds the origin story from the repo root or apps/www", () => {
    expect(resolveStoryPath()).toMatch(/the-hotel-said-accessible-that-wasnt-enough\.md$|content[\\/]story\.md$/);
  });
});
