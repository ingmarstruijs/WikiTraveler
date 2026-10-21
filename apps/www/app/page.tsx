import Link from "next/link";
import { LightboxFigure } from "./LightboxFigure";
import { LINKS } from "../lib/site";

const PARTS = [
  {
    title: "Nodes",
    body: "Same software on every operator. Regional truth, gossip between peers, and where people register.",
    href: LINKS.node,
    cta: "Open node-eu.wikitraveler.org",
  },
  {
    title: "Access",
    body: "Traveler and auditor web app: search, map, property detail, and field audits. Hub signup is off for this controlled test.",
    href: LINKS.access,
    cta: "Open access.wikitraveler.org",
  },
  {
    title: "Lens",
    body: "Chrome extension that overlays community facts on Booking and Expedia while you decide.",
    href: LINKS.lensRelease,
    cta: "Open Chrome Web Store",
  },
  {
    title: "SDK",
    body: "Agency package to embed or fetch the same mesh data in other travel products.",
    href: LINKS.sdk,
    cta: "Open npm · @wikitraveler/sdk",
  },
] as const;

export default function HomePage() {
  return (
    <main id="main-content" className="wt-www-home">
      <section className="wt-www-home-hero">
        <div className="wt-www-shell wt-www-home-hero__grid">
          <div className="wt-www-home-hero__copy">
            <h1 className="wt-www-home-brand">WikiTraveler</h1>
            <p className="wt-www-home-lead">
              An open toolkit for federated accessibility facts about stays. Community data where
              people already book. Started as a side project; got out of hand in a useful way.
            </p>
            <div className="wt-www-actions">
              <Link className="wt-www-btn wt-www-btn--primary" href="/story">
                Read the story <span aria-hidden="true">→</span>
              </Link>
              <a
                className="wt-www-btn wt-www-btn--ghost"
                href={LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon />
                GitHub
              </a>
            </div>
            <p className="wt-www-note">
              Access signup is off for this controlled test. Start from the story or GitHub.
            </p>
          </div>
          <LightboxFigure
            className="wt-www-home-hero__media"
            src="/screenshots/access-property-the-match.png"
            alt="WikiTraveler Access property detail, demo accessibility scores for The Match"
            caption="Access detail. Scores and facts in screenshots are sample data."
            width={1662}
            height={1033}
            priority
            sizes="(max-width: 900px) 92vw, 560px"
          />
        </div>
      </section>

      <section className="wt-www-section" aria-labelledby="home-what" id="what-it-is">
        <div className="wt-www-shell">
          <h2 id="home-what" className="wt-www-home-section-title">
            What it is
          </h2>
          <p className="wt-www-home-lead wt-www-home-lead--wide">
            Clients never hold the truth. Regional nodes do, and they gossip. Access, Lens, and the
            SDK only ask the mesh.
          </p>
          <ul className="wt-www-eco-grid wt-www-home-parts">
            {PARTS.map((part) => (
              <li key={part.title}>
                <a
                  className="wt-www-card wt-www-card--eco wt-www-home-part"
                  href={part.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3>{part.title}</h3>
                  <p>{part.body}</p>
                  <span className="wt-www-home-part__cta">
                    {part.cta} <span aria-hidden="true">↗</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wt-www-section wt-www-section--tint" aria-labelledby="home-overview">
        <div className="wt-www-shell wt-www-home-overview">
          <h2 id="home-overview" className="wt-www-home-section-title">
            System overview
          </h2>
          <p className="wt-www-home-lead">
            Sources feed the mesh. Coverage is geographic; identity is not.
          </p>
          <div className="wt-www-home-overview__grid">
            <LightboxFigure
              compact
              src="/screenshots/mesh-overview.jpg"
              alt="WikiTraveler mesh: OpenStreetMap and field audits feed gossiping nodes; Access and Lens consume the mesh"
              caption="Napkin view: sources, nodes, clients."
              width={1200}
              height={675}
              sizes="(max-width: 900px) 92vw, 480px"
            />
            <LightboxFigure
              compact
              src="/screenshots/mesh-coverage-geo.png"
              alt="World map: traveler signed in on an EU node; peer coverage elsewhere; search routes to the peer that covers that place"
              caption="Coverage is geographic. Peers cover other regions."
              width={1671}
              height={941}
              sizes="(max-width: 900px) 92vw, 480px"
            />
          </div>
        </div>
      </section>

      <section className="wt-www-section" aria-labelledby="home-sidecar">
        <div className="wt-www-shell wt-www-home-sidecar">
          <div>
            <h2 id="home-sidecar" className="wt-www-home-section-title">
              On the booking page
            </h2>
            <p className="wt-www-home-lead">
              WikiTraveler is not another place to book. Lens puts community facts on Booking and
              Expedia while you decide.
            </p>
            <div className="wt-www-actions">
              <Link className="wt-www-btn wt-www-btn--primary" href="/story">
                Read the story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <LightboxFigure
            src="/screenshots/lens-on-booking.png"
            alt="WikiTraveler Lens overlay on a Booking.com listing, demo data, not real property facts"
            caption="Lens on a booking page. Demo data for illustration, not real property facts."
            width={1440}
            height={900}
            sizes="(max-width: 900px) 92vw, 480px"
          />
        </div>
      </section>

      <section className="wt-www-section wt-www-section--tint" aria-labelledby="home-toolkit">
        <div className="wt-www-shell wt-www-home-toolkit">
          <div className="wt-www-home-toolkit__copy">
            <h2 id="home-toolkit" className="wt-www-home-section-title">
              Open toolkit
            </h2>
            <p className="wt-www-home-lead">
              MIT code. CC-BY mesh data. Ambitious, and still early. Fork what helps, integrate the
              SDK, or tell us where the architecture is wrong. Registration stays off while this is
              a controlled test; reach out if you want hands-on Access or Lens.
            </p>
          </div>
          <ul className="wt-www-home-links">
            <li>
              <Link href="/story">Origin story</Link>
              <span>Why this exists</span>
            </li>
            <li>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <span>Source and reuse</span>
            </li>
            <li>
              <a href={LINKS.issues} target="_blank" rel="noopener noreferrer">
                Contact
              </a>
              <span>Issues and questions</span>
            </li>
            <li>
              <a href={LINKS.contributing} target="_blank" rel="noopener noreferrer">
                Contributing
              </a>
              <span>How to help</span>
            </li>
            <li>
              <a href={LINKS.sdk} target="_blank" rel="noopener noreferrer">
                SDK
              </a>
              <span>@wikitraveler/sdk on npm</span>
            </li>
            <li>
              <a href={LINKS.docs} target="_blank" rel="noopener noreferrer">
                Docs
              </a>
              <span>Architecture hub</span>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
    </svg>
  );
}
