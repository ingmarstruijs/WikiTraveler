import { PrivacyPolicyArticle } from "@wikitraveler/ui";
import { NodeAppShell } from "../NodeAppShell";

export const metadata = {
  title: "Privacy — WikiTraveler",
  description:
    "Privacy policy for WikiTraveler Lens, Access, Node, and the agency SDK — what we store, what we do not do, and how to reach the operator.",
};

export default function PrivacyPage() {
  return (
    <NodeAppShell maxWidth={720}>
      <PrivacyPolicyArticle />
    </NodeAppShell>
  );
}
