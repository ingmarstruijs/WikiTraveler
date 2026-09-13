import type { CSSProperties } from "react";

const h1: CSSProperties = { fontSize: 26, fontWeight: 700, marginBottom: 8 };
const lead: CSSProperties = {
  color: "var(--wt-text-muted)",
  fontSize: 15,
  lineHeight: 1.6,
  marginBottom: 24,
};
const section: CSSProperties = { marginBottom: 28 };
const h2: CSSProperties = { fontSize: 18, fontWeight: 600, marginBottom: 10 };
const p: CSSProperties = { lineHeight: 1.6, color: "var(--wt-text)", marginBottom: 10 };
const ul: CSSProperties = { paddingLeft: 20, lineHeight: 1.7, color: "var(--wt-text)", marginBottom: 10 };
const muted: CSSProperties = { fontSize: 13, color: "var(--wt-text-muted)" };
const link: CSSProperties = { color: "var(--wt-primary)" };

const ISSUES_URL = "https://github.com/ingmarstruijs/WikiTraveler/issues";
const SECURITY_URL = "https://github.com/ingmarstruijs/WikiTraveler/blob/main/SECURITY.md";
const HUB_PRIVACY = "https://node-eu.wikitraveler.org/privacy";

export const PRIVACY_POLICY_UPDATED = "13 September 2026";

/** Public privacy policy (English). Served at `/privacy` on Node and Access. */
export function PrivacyPolicyArticle() {
  return (
    <article>
      <h1 style={h1}>Privacy policy</h1>
      <p style={lead}>
        WikiTraveler is open-source software for community-verified stay accessibility facts.
        The <strong>operator of the WikiTraveler node you connect to</strong> is the data controller
        for that node. The project hub used in this listing is{" "}
        <a href={HUB_PRIVACY} style={link}>
          node-eu.wikitraveler.org
        </a>{" "}
        (Access: access.wikitraveler.org).
      </p>

      <section style={section}>
        <h2 style={h2}>Who this covers</h2>
        <p style={p}>
          This policy describes WikiTraveler <strong>Lens</strong> (Chrome extension),{" "}
          <strong>Access</strong> (traveler/auditor app), the <strong>Node</strong> dashboard and
          API, and the optional agency <strong>SDK</strong> widget — as shipped in this project.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>What we store</h2>
        <ul style={ul}>
          <li>
            <strong>Account.</strong> Username, password hash, and role on the node you register
            with. Lens and Access send the password only to that node’s login API; they do not keep
            the password after sign-in.
          </li>
          <li>
            <strong>Session.</strong> A short-lived JWT. Node and Access keep it in an HTTP cookie
            (<code>wt_token</code>). Lens stores the token, username, home-node URL, and locale in{" "}
            <code>chrome.storage.sync</code> so they follow your Chrome profile across devices.
          </li>
          <li>
            <strong>Preferences.</strong> Accessibility search preferences, theme, locale, and
            favorites. Access may sync those to your home-node account when you are signed in.
          </li>
          <li>
            <strong>Audits.</strong> Structured accessibility facts, notes, and photos attached to
            wizard steps or room types — submitted by auditors to the node.
          </li>
          <li>
            <strong>Lens on booking sites.</strong> To look up a listing, Lens reads the page URL
            and visible hotel name/address. It does not read payment forms, booking personal data,
            or your Google account. Host access is limited to Booking.com, Expedia, and Hotels.com
            unless you grant optional HTTPS access so the service worker can reach the node (and
            mesh peers) you configured.
          </li>
          <li>
            <strong>Technical.</strong> Operators may log request metadata and apply IP-based rate
            limits (optional Upstash/Redis) to protect public APIs.
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>What we do not do</h2>
        <ul style={ul}>
          <li>We do not sell personal data.</li>
          <li>We do not show ads, and the shipped apps do not embed third-party analytics SDKs.</li>
          <li>Lens does not scrape booking sites for inventory or prices — only enough to resolve a WikiTraveler property.</li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>Optional services operators may enable</h2>
        <ul style={ul}>
          <li>
            <strong>AI gap-fill / vision.</strong> If the operator sets an AI provider key, selected
            audit fields or photos may be sent to that provider to produce <code>AI_GUESS</code>{" "}
            facts.
          </li>
          <li>
            <strong>Photo storage.</strong> Audit photos may live in the node database or in
            operator-configured object storage (for example R2 or Supabase).
          </li>
          <li>
            <strong>Federation.</strong> Linked peer nodes may receive gossip copies of facts and
            photo references for properties in their region.
          </li>
          <li>
            <strong>Agency SDK.</strong> Partner sites that embed the widget receive the
            accessibility facts the node is configured to share (including optional public reads).
          </li>
        </ul>
      </section>

      <section style={section}>
        <h2 style={h2}>Legal bases and retention</h2>
        <p style={p}>
          Where GDPR applies: we process account and session data to provide the service
          (contract), security and rate limiting as legitimate interest, and optional AI only when
          the operator has enabled it. Data is kept until you delete your account or the operator’s
          retention policy says otherwise. JWTs last until they expire or you sign out.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>Your rights</h2>
        <p style={p}>
          You can sign out (clears the Lens/Access token on that device), ask the node operator to
          correct or delete your account, or{" "}
          <a href={ISSUES_URL} style={link}>
            open a project issue
          </a>{" "}
          for the hub. Security reports go through{" "}
          <a href={SECURITY_URL} style={link}>
            private vulnerability reporting
          </a>
          , not a public issue.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>Children and transfers</h2>
        <p style={p}>
          WikiTraveler is not directed at children under 16. If an operator federates with peers in
          other countries, facts you submit may be stored there as well.
        </p>
      </section>

      <section style={section}>
        <h2 style={h2}>Changes</h2>
        <p style={p}>
          Material changes will be published on this page with an updated date. Chrome Web Store
          listings point at{" "}
          <a href={HUB_PRIVACY} style={link}>
            {HUB_PRIVACY}
          </a>
          .
        </p>
      </section>

      <p style={muted}>Last updated: {PRIVACY_POLICY_UPDATED}</p>
    </article>
  );
}
