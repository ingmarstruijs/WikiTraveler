import { StoryContent } from "./StoryContent";

export const metadata = {
  title: "The hotel said “accessible.” That wasn’t enough.",
  description:
    "Origin story of WikiTraveler: sidecar UX, a federated accessibility commons for stays, and why the toolkit stays open to reuse.",
};

export default function StoryPage() {
  return (
    <main id="main-content" className="wt-www-main">
      <StoryContent />
    </main>
  );
}
