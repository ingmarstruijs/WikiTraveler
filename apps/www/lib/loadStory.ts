import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const STORY_FILENAME = "the-hotel-said-accessible-that-wasnt-enough.md";

export function rewriteStoryMedia(markdown: string): string {
  return markdown.replaceAll("../assets/screenshots/", "/screenshots/");
}

export function resolveStoryPath(cwd = process.cwd()): string | null {
  const candidates = [
    path.join(cwd, "content", "story.md"),
    path.join(cwd, "docs", "story", STORY_FILENAME),
    path.join(cwd, "..", "..", "docs", "story", STORY_FILENAME),
    path.join(cwd, "..", "docs", "story", STORY_FILENAME),
  ];
  return candidates.find((file) => existsSync(file)) ?? null;
}

export function loadStoryMarkdown(cwd = process.cwd()): string {
  const file = path.join(cwd, "content", "story.md");
  if (!existsSync(file)) {
    throw new Error("Story markdown missing — run apps/www copy-assets first (content/story.md).");
  }
  return rewriteStoryMedia(readFileSync(file, "utf8"));
}
