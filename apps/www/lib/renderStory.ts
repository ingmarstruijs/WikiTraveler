import { marked } from "marked";
import { isExternalHref } from "./externalHref";

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(text: string): string {
  return escapeHtml(text).replace(/"/g, "&quot;");
}

function fenceLang(lang: string | undefined): string {
  return (lang ?? "").trim().split(/\s+/)[0] ?? "";
}

/** Collapse <!-- gallery:start -->…<!-- gallery:end --> into a horizontal row. */
export function wrapStoryGalleries(html: string): string {
  return html.replace(
    /<!--\s*gallery:start\s*-->([\s\S]*?)<!--\s*gallery:end\s*-->/gi,
    (_match, inner: string) => {
      const links = [...inner.matchAll(/<a class="wt-www-article__media-link"[\s\S]*?<\/a>/g)].map(
        (m) => m[0]
      );
      if (links.length === 0) return inner;
      return `<div class="wt-www-article__gallery">${links.join("")}</div>\n`;
    }
  );
}

export function renderStoryHtml(markdown: string): string {
  const renderer = new marked.Renderer();
  const defaultCode = renderer.code.bind(renderer);
  const defaultLink = renderer.link.bind(renderer);

  renderer.code = (token) => {
    if (fenceLang(token.lang) === "mermaid") {
      return `<pre class="mermaid" tabindex="0" title="Click to open diagram">${escapeHtml(token.text)}</pre>\n`;
    }
    return defaultCode(token);
  };

  renderer.link = (token) => {
    const html = defaultLink(token);
    if (!isExternalHref(token.href)) return html;
    // Inject target/rel after the opening <a …>
    return html.replace(/^<a\s/i, '<a target="_blank" rel="noopener noreferrer" ');
  };

  renderer.image = ({ href, title, text }) => {
    const src = href ?? "";
    const alt = text ?? "";
    const titleAttr = title ? ` title="${escapeAttr(title)}"` : "";
    return (
      `<a class="wt-www-article__media-link" href="${escapeAttr(src)}" target="_blank" rel="noopener noreferrer">` +
      `<img src="${escapeAttr(src)}" alt="${escapeAttr(alt)}"${titleAttr} loading="lazy" />` +
      `</a>`
    );
  };

  const html = marked.parse(markdown, { gfm: true, async: false, renderer }) as string;
  return wrapStoryGalleries(html);
}
