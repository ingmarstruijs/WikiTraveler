import { PrivacyPolicyArticle } from "@wikitraveler/ui";

export const metadata = {
  title: "Privacy",
  description:
    "Privacy policy for WikiTraveler Lens, Access, Node, and the agency SDK. Canonical URL for the Chrome Web Store.",
};

export default function PrivacyPage() {
  return (
    <main id="main-content" className="wt-www-main">
      <PrivacyPolicyArticle />
    </main>
  );
}
