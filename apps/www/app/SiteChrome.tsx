import Link from "next/link";
import { LogoMark } from "@wikitraveler/ui";
import { LINKS } from "../lib/site";

const nav: { href: string; label: string; external?: boolean }[] = [
  { href: "/story", label: "Story" },
  { href: LINKS.access, label: "Access", external: true },
  { href: LINKS.github, label: "GitHub", external: true },
  { href: "/privacy", label: "Privacy" },
];

export function SiteHeader() {
  return (
    <header className="wt-www-header">
      <div className="wt-www-header__inner">
        <Link href="/" className="wt-www-brand" aria-label="WikiTraveler home">
          <LogoMark size={28} />
          <span>WikiTraveler</span>
        </Link>
        <nav aria-label="Primary">
          {nav.map((item) =>
            item.external ? (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href}>
                {item.label}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="wt-www-footer">
      <div className="wt-www-footer__inner">
        <p>Open-source, federated accessibility intelligence for travel.</p>
        <ul>
          <li>
            <Link href="/story">Origin story</Link>
          </li>
          <li>
            <a href={LINKS.access}>Access</a>
          </li>
          <li>
            <a href={LINKS.node}>EU node</a>
          </li>
          <li>
            <a href={LINKS.lensRelease}>Lens</a>
          </li>
          <li>
            <a href={LINKS.docs}>Docs</a>
          </li>
          <li>
            <a href={LINKS.github}>GitHub</a>
          </li>
          <li>
            <a href={LINKS.contributing}>Contribute</a>
          </li>
          <li>
            <a href={LINKS.accessibility}>Accessibility</a>
          </li>
          <li>
            <Link href="/privacy">Privacy</Link>
          </li>
        </ul>
      </div>
    </footer>
  );
}
