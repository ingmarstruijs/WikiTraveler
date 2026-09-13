import { marked } from "marked";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fenceLang(lang: string | undefined): string {
  return (lang ?? "").trim().split(/\s+/)[0] ?? "";
}

export function renderStoryHtml(markdown: string): string {
  const renderer = new marked.Renderer();
  const defaultCode = renderer.code.bind(renderer);
  renderer.code = (token) => {
    if (fenceLang(token.lang) === "mermaid") {
      return `<pre class="mermaid">${escapeHtml(token.text)}</pre>\n`;
    }
    return defaultCode(token);
  };
  return marked.parse(markdown, { gfm: true, async: false, renderer }) as string;
}
