import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@wikitraveler/ui/tokens.css";
import "@wikitraveler/ui/wikitraveler-ui.css";
import "./globals.css";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import { CANONICAL_SITE_URL } from "../lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(CANONICAL_SITE_URL),
  title: {
    default: "WikiTraveler",
    template: "%s · WikiTraveler",
  },
  description:
    "Open toolkit for federated accessibility facts about stays. Community data where people already book. Read the origin story; Access signup is off for this controlled test.",
  openGraph: {
    title: "WikiTraveler",
    description:
      "Open toolkit for federated accessibility facts about stays. Overlay on booking sites, gossip mesh, community audits.",
    url: CANONICAL_SITE_URL,
    siteName: "WikiTraveler",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main-content" className="wt-skip-link">
          Skip to main content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
