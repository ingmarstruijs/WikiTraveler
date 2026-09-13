import Image from "next/image";
import Link from "next/link";
import { LINKS } from "../lib/site";

export default function HomePage() {
  return (
    <main id="main-content" className="wt-www-home">
      <section className="wt-www-section wt-www-hero">
        <div className="wt-www-shell wt-www-split">
          <div className="wt-www-hero__copy">
            <p className="wt-www-kicker">Open · Federated · Accessible</p>
            <h1>
              Travel with
              <br />
              confidence.
            </h1>
            <p className="wt-www-lead">
              WikiTraveler provides trustworthy accessibility information for destinations around
              the world. Verified by people, powered by a global network.
            </p>
            <div className="wt-www-actions">
              <a className="wt-www-btn wt-www-btn--primary" href={LINKS.access}>
                Explore Access <span aria-hidden="true">→</span>
              </a>
              <a className="wt-www-btn wt-www-btn--ghost" href={LINKS.github}>
                <GitHubIcon />
                View on GitHub
              </a>
            </div>
            <p className="wt-www-note">
              Access signup is off while this is a controlled test. Start from GitHub if you want
              to help build, audit, or operate a node.
            </p>
          </div>
          <AccessShot priority />
        </div>
      </section>

      <section id="features" className="wt-www-section wt-www-section--tint">
        <div className="wt-www-shell wt-www-split wt-www-split--start">
          <div>
            <p className="wt-www-kicker">Trusted data</p>
            <h2>Accessibility data you can trust.</h2>
            <p className="wt-www-lead">
              Every location is rated with a trust tier, so you know exactly how reliable the
              information is.
            </p>
          </div>
          <ul className="wt-www-tier-grid">
            {TIERS.map((tier) => (
              <li key={tier.id} className={`wt-www-card wt-www-card--tier ${tier.className}`}>
                <span className="wt-www-card__icon" aria-hidden="true">
                  {tier.icon}
                </span>
                <h3>{tier.title}</h3>
                <p>{tier.body}</p>
                <span className="wt-www-tier-badge">{tier.badge}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wt-www-section">
        <div className="wt-www-shell wt-www-split wt-www-split--start">
          <div>
            <p className="wt-www-kicker">How it works</p>
            <h2>From field to federation.</h2>
            <p className="wt-www-lead">
              WikiTraveler turns individual insights into a global network of trusted accessibility
              data.
            </p>
          </div>
          <ol className="wt-www-steps">
            {STEPS.map((step, i) => (
              <li key={step.title} className="wt-www-step">
                <span className="wt-www-step__icon" aria-hidden="true">
                  {step.icon}
                </span>
                <h3>
                  {i + 1}. {step.title}
                </h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="ecosystem" className="wt-www-section wt-www-section--tint">
        <div className="wt-www-shell">
          <div className="wt-www-split wt-www-split--start">
            <div>
              <p className="wt-www-kicker">The ecosystem</p>
              <h2>One platform. Many ways to use it.</h2>
              <p className="wt-www-lead">
                WikiTraveler brings together a powerful suite of tools — for travelers, auditors,
                developers and more.
              </p>
            </div>
            <ul className="wt-www-eco-grid">
              {ECOSYSTEM.map((item) => (
                <li key={item.title}>
                  <a className="wt-www-card wt-www-card--eco" href={item.href}>
                    <span className="wt-www-card__icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="wt-www-section">
        <div className="wt-www-shell wt-www-split">
          <div>
            <p className="wt-www-kicker">Real data. Real places.</p>
            <h2>Explore the world, accessibly.</h2>
            <p className="wt-www-lead">
              Search, discover and contribute accessibility information for cities and destinations
              worldwide. With WikiTraveler Access, you get a clear overview of what’s accessible —
              and what’s not.
            </p>
            <div className="wt-www-actions">
              <a className="wt-www-btn wt-www-btn--primary" href={LINKS.access}>
                Try Access now <span aria-hidden="true">→</span>
              </a>
              <Link className="wt-www-btn wt-www-btn--ghost" href="/story">
                Read the story
              </Link>
            </div>
          </div>
          <AccessShot />
        </div>
      </section>

      <section className="wt-www-band">
        <div className="wt-www-shell wt-www-band__inner">
          <div className="wt-www-band__copy">
            <GlobeIcon />
            <div>
              <h2>Help build a more accessible world.</h2>
              <p>
                Join our community of travelers, auditors and developers and make accessibility data
                more open, accurate and global.
              </p>
            </div>
          </div>
          <a className="wt-www-btn wt-www-btn--on-dark" href={LINKS.contributing}>
            Get started <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}

function AccessShot({ priority = false }: { priority?: boolean }) {
  return (
    <div className="wt-www-shot">
      <Image
        src="/screenshots/access-desktop.jpg"
        alt="WikiTraveler Access: Eindhoven coverage map, stay list, and The Match preview"
        width={1024}
        height={732}
        priority={priority}
        sizes="(max-width: 900px) 92vw, 560px"
      />
    </div>
  );
}

const TIERS = [
  {
    id: "OFFICIAL",
    className: "is-official",
    title: "Official",
    badge: "Official",
    body: "OpenStreetMap and other public directories. A useful baseline — trusted, but often thin and sometimes outdated.",
    icon: <BuildingIcon />,
  },
  {
    id: "AI_GUESS",
    className: "is-ai",
    title: "AI Estimate",
    badge: "AI estimate",
    body: "Machine-read from photos and listings. Helpful as a hint, not a substitute for being on site.",
    icon: <SparkIcon />,
  },
  {
    id: "VERIFIED",
    className: "is-verified",
    title: "Verified",
    badge: "Verified",
    body: "One on-site auditor recorded the fact. High confidence, with a date you can see.",
    icon: <CheckIcon />,
  },
  {
    id: "CONFIRMED",
    className: "is-confirmed",
    title: "Confirmed",
    badge: "Confirmed",
    body: "At least three independent auditors agree. Highest confidence — the most reliable signal.",
    icon: <ShieldIcon />,
  },
];

const STEPS = [
  {
    title: "Discover",
    body: "Travelers and auditors collect data on location.",
    icon: <CameraIcon />,
  },
  {
    title: "Verify",
    body: "Data is validated, enriched and given a trust tier.",
    icon: <DatabaseIcon />,
  },
  {
    title: "Share",
    body: "Shared across independent nodes, no central gatekeeper.",
    icon: <ShareIcon />,
  },
];

const ECOSYSTEM = [
  {
    title: "Access",
    href: LINKS.access,
    body: "Explore and contribute to accessibility data on the map.",
    icon: <MapIcon />,
  },
  {
    title: "Node",
    href: LINKS.node,
    body: "Run your own node and join the federation.",
    icon: <ServerIcon />,
  },
  {
    title: "Lens",
    href: LINKS.lensRelease,
    body: "Browser extension for quick insights.",
    icon: <PuzzleIcon />,
  },
  {
    title: "SDK",
    href: LINKS.sdk,
    body: "Build your own integrations.",
    icon: <CodeIcon />,
  },
];

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.6.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3z" />
    </svg>
  );
}

function iconProps() {
  return {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

function BuildingIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M3 21h18M7 21V10h10v11M10 21v-4h4v4M9 7V4h6v3M4 10h16" />
      <path d="M9 13h.01M12 13h.01M15 13h.01M9 16h.01M12 16h.01M15 16h.01" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l1.2 4.8L18 9l-4.8 1.2L12 15l-1.2-4.8L6 9l4.8-1.2L12 3zM18 14l.6 2.4L21 17l-2.4.6L18 20l-.6-2.4L15 17l2.4-.6L18 14z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9.5" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M12 3l8 3v6c0 5-3.4 8.4-8 9.5C7.4 20.4 4 17 4 12V6l8-3z" />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M4 8h3l2-2h6l2 2h3v11H4V8z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  );
}

function DatabaseIcon() {
  return (
    <svg {...iconProps()}>
      <ellipse cx="12" cy="6" rx="7" ry="3" />
      <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg {...iconProps()}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.2 11l6.6-4M8.2 13l6.6 4" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

function ServerIcon() {
  return (
    <svg {...iconProps()}>
      <rect x="4" y="4" width="16" height="6" rx="1.5" />
      <rect x="4" y="14" width="16" height="6" rx="1.5" />
      <path d="M8 7h.01M8 17h.01" />
    </svg>
  );
}

function PuzzleIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M8 4h3a2 2 0 1 1 0 4h1v3a2 2 0 1 0 4 0V9h3v11H5V9h3V8a2 2 0 1 1 0-4z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg {...iconProps()}>
      <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      className="wt-www-band__globe"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </svg>
  );
}
