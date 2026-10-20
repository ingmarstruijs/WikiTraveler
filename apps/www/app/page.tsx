import Image from "next/image";
import Link from "next/link";
import { LINKS } from "../lib/site";
import { TrustTable } from "./story/TrustTable";

export default function HomePage() {
  return (
    <main id="main-content" className="wt-www-home">
      <section className="wt-www-home-hero">
        <div className="wt-www-shell wt-www-home-hero__grid">
          <div className="wt-www-home-hero__copy">
            <p className="wt-www-home-brand">WikiTraveler</p>
            <h1>The hotel said “accessible.” That wasn’t enough.</h1>
            <p className="wt-www-home-lead">
              An open toolkit for federated accessibility facts about stays. It overlays community
              data where people already book. Started as a side project; the mesh kept growing.
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
          <figure className="wt-www-home-hero__media">
            <Image
              src="/screenshots/access-property-the-match.png"
              alt="WikiTraveler Access property detail, demo accessibility scores for The Match"
              width={1662}
              height={1033}
              priority
              sizes="(max-width: 900px) 92vw, 560px"
            />
            <figcaption>
              Access detail. Scores and facts in screenshots are sample data.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="wt-www-section" aria-labelledby="home-what">
        <div className="wt-www-shell wt-www-home-duo">
          <div>
            <h2 id="home-what">What it is (today)</h2>
            <p className="wt-www-home-lead">
              Same software on every node. Clients only ask; they never become the source of
              record.
            </p>
            <ul className="wt-www-home-toolkit">
              <li>
                <strong>Nodes</strong>: regional truth, gossip, identity
              </li>
              <li>
                <strong>Access</strong>: traveler / auditor app (
                <a href={LINKS.access} target="_blank" rel="noopener noreferrer">
                  hub
                </a>
                ; registration off)
              </li>
              <li>
                <strong>Lens</strong>:{" "}
                <a href={LINKS.lensRelease} target="_blank" rel="noopener noreferrer">
                  Chrome extension
                </a>{" "}
                on Booking / Expedia
              </li>
              <li>
                <strong>SDK</strong>:{" "}
                <a href={LINKS.sdk} target="_blank" rel="noopener noreferrer">
                  @wikitraveler/sdk
                </a>{" "}
                for agencies
              </li>
            </ul>
          </div>
          <div className="wt-www-article" aria-labelledby="home-trust">
            <h2 id="home-trust">Trust tiers</h2>
            <p className="wt-www-home-lead">
              Higher tiers win on merge. AI estimates guide auditors; they don’t become ground
              truth.
            </p>
            <TrustTable />
          </div>
        </div>
      </section>

      <section className="wt-www-section wt-www-section--tint" aria-labelledby="home-overview">
        <div className="wt-www-shell wt-www-home-overview">
          <h2 id="home-overview">System overview</h2>
          <p className="wt-www-home-lead">
            Clients never hold the truth. Regional nodes do, and they gossip.
          </p>
          <figure className="wt-www-home-figure wt-www-home-figure--wide">
            <a
              className="wt-www-home-media-link"
              href="/screenshots/mesh-overview.jpg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/screenshots/mesh-overview.jpg"
                alt="WikiTraveler mesh: OpenStreetMap and field audits feed gossiping nodes; Access and Lens consume the mesh; Lens overlays Booking / Expedia"
                width={1200}
                height={675}
                sizes="(max-width: 900px) 92vw, 1100px"
              />
            </a>
            <figcaption>Sources feed the mesh. The mesh is the truth. Clients only ask.</figcaption>
          </figure>
        </div>
      </section>

      <section className="wt-www-section" aria-labelledby="home-sidecar">
        <div className="wt-www-shell wt-www-home-sidecar">
          <div>
            <h2 id="home-sidecar">On the booking page</h2>
            <p className="wt-www-home-lead">
              WikiTraveler is not another place to book. Lens puts community facts on Booking and
              Expedia while you decide.
            </p>
            <p className="wt-www-note">
              The origin story covers Maurice, the mesh, and why federation stays mostly invisible.
            </p>
            <div className="wt-www-actions">
              <Link className="wt-www-btn wt-www-btn--primary" href="/story">
                Read the story <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <figure className="wt-www-home-figure">
            <Image
              src="/screenshots/lens-on-booking.png"
              alt="WikiTraveler Lens overlay on a Booking.com listing, demo data, not real property facts"
              width={1440}
              height={900}
              sizes="(max-width: 900px) 92vw, 480px"
            />
            <figcaption>
              Lens on a booking page. Demo data for illustration, not real property facts.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="wt-www-section" aria-labelledby="home-open">
        <div className="wt-www-shell wt-www-home-narrow">
          <h2 id="home-open">Open and reusable</h2>
          <p className="wt-www-home-lead">
            MIT code. CC-BY mesh data. Registration stays off while this is a controlled test. Fork
            what helps, integrate the SDK, or tell us where the architecture is wrong.
          </p>
          <ul className="wt-www-home-links">
            <li>
              <Link href="/story">Origin story</Link>
              <span>Why this exists</span>
            </li>
            <li>
              <a href={LINKS.github} target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <span>Source, issues, reuse</span>
            </li>
            <li>
              <a href={LINKS.lensRelease} target="_blank" rel="noopener noreferrer">
                Lens
              </a>
              <span>Chrome Web Store</span>
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
            <li>
              <a href={LINKS.access} target="_blank" rel="noopener noreferrer">
                Access
              </a>
              <span>Traveler app · signup off</span>
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
