import { describe, expect, it } from "vitest";
import { externalLinkAttrs, isExternalHref } from "./externalHref";

describe("isExternalHref", () => {
  it("treats relative and same-site as internal", () => {
    expect(isExternalHref("/privacy")).toBe(false);
    expect(isExternalHref("#features")).toBe(false);
    expect(isExternalHref("https://www.wikitraveler.org/story")).toBe(false);
    expect(isExternalHref("https://wikitraveler.org/")).toBe(false);
  });

  it("treats other https hosts as external", () => {
    expect(isExternalHref("https://github.com/ingmarstruijs/WikiTraveler")).toBe(true);
    expect(isExternalHref("https://access.wikitraveler.org")).toBe(true);
  });
});

describe("externalLinkAttrs", () => {
  it("adds target blank for external only", () => {
    expect(externalLinkAttrs("/story")).toEqual({});
    expect(externalLinkAttrs("https://github.com/x")).toEqual({
      target: "_blank",
      rel: "noopener noreferrer",
    });
  });
});
