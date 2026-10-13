import { describe, expect, it } from "vitest";
import { rewriteStoryMedia, resolveStoryPath } from "./loadStory";
import { renderStoryHtml } from "./renderStory";

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

describe("renderStoryHtml", () => {
  it("emits mermaid fences as pre.mermaid with escaped labels", () => {
    const html = renderStoryHtml("```mermaid\nflowchart LR\n  A[\"X<br/>Y\"] --> B\n```\n");
    expect(html).toContain('class="mermaid"');
    expect(html).toContain("&lt;br/&gt;");
    expect(html).not.toContain('class="language-mermaid"');
  });

  it("wraps images in zoom links", () => {
    const html = renderStoryHtml("![Lens](/screenshots/lens.png)\n");
    expect(html).toContain('class="wt-www-article__media-link"');
    expect(html).toContain('href="/screenshots/lens.png"');
    expect(html).toContain('src="/screenshots/lens.png"');
    expect(html).toContain('target="_blank"');
  });

  it("opens external markdown links in a new tab", () => {
    const html = renderStoryHtml("[WtW](https://wheeltheworld.com/)\n");
    expect(html).toContain('href="https://wheeltheworld.com/"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it("keeps same-site and relative links in this tab", () => {
    const relative = renderStoryHtml("[Privacy](/privacy)\n");
    expect(relative).toContain('href="/privacy"');
    expect(relative).not.toContain('target="_blank"');

    const sameSite = renderStoryHtml("[Home](https://www.wikitraveler.org/)\n");
    expect(sameSite).toContain('href="https://www.wikitraveler.org/"');
    expect(sameSite).not.toContain('target="_blank"');
  });
});
