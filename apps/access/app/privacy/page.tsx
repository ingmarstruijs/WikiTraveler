import Link from "next/link";
import { PrivacyPolicyArticle, WikiTravelerLogo } from "@wikitraveler/ui";

export const metadata = {
  title: "Privacy — WikiTraveler Access",
  description:
    "Privacy policy for WikiTraveler Lens, Access, Node, and the agency SDK — what we store, what we do not do, and how to reach the operator.",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--wt-bg)" }}>
      <a href="#main-content" className="wt-skip-link">
        Skip to main content
      </a>
      <header
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "20px 20px 0",
        }}
      >
        <WikiTravelerLogo product="access" size={32} />
      </header>
      <main id="main-content" style={{ maxWidth: 720, margin: "0 auto", padding: "24px 20px 48px" }}>
        <PrivacyPolicyArticle />
        <p style={{ marginTop: 28, fontSize: 14 }}>
          <Link href="/login" style={{ color: "var(--wt-primary)" }}>
            Back to sign in
          </Link>
        </p>
      </main>
    </div>
  );
}
