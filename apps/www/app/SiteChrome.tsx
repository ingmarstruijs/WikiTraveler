"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoMark } from "@wikitraveler/ui";
import { LINKS } from "../lib/site";

const nav: { href: string; label: string; external?: boolean }[] = [
  { href: "/", label: "Home" },
  { href: LINKS.access, label: "Access", external: true },
  { href: "/#features", label: "Features" },
  { href: "/#ecosystem", label: "Ecosystem" },
  { href: "/story", label: "About" },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {nav.map((item) => {
        const active = !item.external && (item.href === "/" ? pathname === "/" : pathname === item.href);
        const className = active ? "is-active" : undefined;
        if (item.external) {
          return (
            <a
              key={item.label}
              href={item.href}
              className={className}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onNavigate}
            >
              {item.label}
              <ExternalIcon />
              <span className="wt-sr-only"> (opens in a new tab)</span>
            </a>
          );
        }
        if (item.href.includes("#")) {
          return (
            <a key={item.label} href={item.href} className={className} onClick={onNavigate}>
              {item.label}
            </a>
          );
        }
        return (
          <Link key={item.label} href={item.href} className={className} onClick={onNavigate}>
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="wt-www-header">
      <div className="wt-www-shell wt-www-header__inner">
        <Link href="/" className="wt-www-brand" aria-label="WikiTraveler home" onClick={close}>
          <LogoMark size={28} />
          <span>WikiTraveler</span>
        </Link>
        <nav className="wt-www-nav wt-www-nav--desktop" aria-label="Primary">
          <NavLinks />
        </nav>
        <a
          className="wt-www-btn wt-www-btn--github"
          href={LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHubIcon />
          GitHub
          <ExternalIcon />
          <span className="wt-sr-only"> (opens in a new tab)</span>
        </a>
        <button
          type="button"
          className="wt-www-menu-btn"
          aria-expanded={open}
          aria-controls="www-mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="www-mobile-nav" className="wt-www-nav wt-www-nav--mobile" aria-label="Primary">
          <NavLinks onNavigate={close} />
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="wt-www-footer">
      <div className="wt-www-shell wt-www-footer__inner">
        <div className="wt-www-footer__top">
          <Link href="/" className="wt-www-brand" aria-label="WikiTraveler home">
            <LogoMark size={24} />
            <span>WikiTraveler</span>
          </Link>
          <nav aria-label="Footer">
            <NavLinks />
          </nav>
          <a
            className="wt-www-icon-link"
            href={LINKS.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub (opens in a new tab)"
          >
            <GitHubIcon />
          </a>
        </div>
        <div className="wt-www-footer__bottom">
          <p>© 2026 WikiTraveler. Open source. Federated. Accessible.</p>
          <ul>
            <li>
              <Link href="/privacy">Privacy</Link>
            </li>
            <li>
              <a
                href={LINKS.accessibility}
                target="_blank"
                rel="noopener noreferrer"
              >
                Accessibility
              </a>
            </li>
            <li>
              <a href={LINKS.issues} target="_blank" rel="noopener noreferrer">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

function ExternalIcon() {
  return (
    <svg
      className="wt-www-external"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14 5h5v5" />
      <path d="M13 11l6-6" />
      <path d="M19 13v6a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
    </svg>
  );
}
