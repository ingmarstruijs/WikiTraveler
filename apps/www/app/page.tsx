import Link from "next/link";
import { LINKS } from "../lib/site";

export default function HomePage() {
  return (
    <main id="main-content" className="wt-www-main">
      <section className="wt-www-hero">
        <h1>Verified stay accessibility, as a commons.</h1>
        <p className="wt-www-lead">
          Open-source, federated accessibility intelligence for travel. Facts from the field —
          community-owned, free to use, no central gatekeeper.
        </p>
      </section>

      <section className="wt-www-copy">
        <p>
          Booking sites are excellent at inventory and price. They are much worse at whether a stay
          is actually accessible. WikiTraveler treats that as structured truth over time: audits,
          photos, and trust tiers on a mesh of independently operated nodes.
        </p>
        <p>
          Travelers use one Access app and Lens in the browser. Regional nodes hold the facts and
          gossip with peers. The origin story — Maurice, sidecar UX, and why this became a mesh —
          is on the story page.
        </p>
      </section>

      <p className="wt-www-actions">
        <Link className="wt-www-btn wt-www-btn--primary" href="/story">
          Read the story
        </Link>
        <a className="wt-www-btn wt-www-btn--ghost" href={LINKS.access}>
          Open Access
        </a>
        <a className="wt-www-btn wt-www-btn--ghost" href={LINKS.github}>
          GitHub
        </a>
      </p>
      <p className="wt-www-note">
        Access signup is off while this is a controlled test. Start from GitHub if you want to
        help build, audit, or operate a node.
      </p>

      <h2 style={{ fontSize: 18, margin: "36px 0 12px" }}>Links</h2>
      <ul className="wt-www-links">
        <li>
          <a href={LINKS.access}>WikiTraveler Access</a> — traveler and auditor app
        </li>
        <li>
          <a href={LINKS.node}>EU node</a> — project hub API and operator dashboard
        </li>
        <li>
          <a href={LINKS.lensRelease}>Lens</a> — Chrome extension (GitHub Release zip until the
          Store listing is live)
        </li>
        <li>
          <a href={LINKS.docs}>Documentation</a>
        </li>
        <li>
          <a href={LINKS.contributing}>Contributing</a>
        </li>
        <li>
          <a href={LINKS.changelog}>Changelog</a>
        </li>
        <li>
          <a href={LINKS.accessibility}>Accessibility statement</a>
        </li>
        <li>
          <Link href="/privacy">Privacy policy</Link> — canonical URL for the Chrome Web Store
        </li>
      </ul>
    </main>
  );
}
