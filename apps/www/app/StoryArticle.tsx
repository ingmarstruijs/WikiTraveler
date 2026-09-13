"use client";

import { useEffect, useRef } from "react";

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
