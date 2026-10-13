"use client";

import { useEffect, useRef } from "react";

function openSvgInNewTab(svg: SVGSVGElement) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (!clone.getAttribute("width") && clone.viewBox.baseVal) {
    const vb = clone.viewBox.baseVal;
    if (vb.width && vb.height) {
      clone.setAttribute("width", String(vb.width));
      clone.setAttribute("height", String(vb.height));
    }
  }
  const blob = new Blob(
    [`<?xml version="1.0" encoding="UTF-8"?>`, clone.outerHTML],
    { type: "image/svg+xml;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function StoryArticle({ html }: { html: string }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    let cancelled = false;

    void (async () => {
      const mermaid = (await import("mermaid")).default;
      if (cancelled) return;
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "antiscript",
        theme: "base",
        themeVariables: {
          fontFamily: "var(--wt-font)",
          primaryColor: "#dbeafe",
          primaryTextColor: "#0f172a",
          primaryBorderColor: "#1d4ed8",
          lineColor: "#64748b",
          secondaryColor: "#f8fafc",
          tertiaryColor: "#ffffff",
        },
      });
      const nodes = [...root.querySelectorAll<HTMLElement>("pre.mermaid")].filter(
        (node) => !node.querySelector("svg")
      );
      if (nodes.length === 0) return;
      await mermaid.run({ nodes });
      if (cancelled) return;

      for (const node of root.querySelectorAll<HTMLElement>("pre.mermaid")) {
        node.classList.add("wt-www-article__mermaid--clickable");
        node.setAttribute("role", "button");
        node.setAttribute("aria-label", "Open diagram in a new tab");
        const activate = () => {
          const svg = node.querySelector("svg");
          if (svg) openSvgInNewTab(svg);
        };
        node.onclick = activate;
        node.onkeydown = (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            activate();
          }
        };
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  return (
    <article
      ref={ref}
      className="wt-www-article"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
