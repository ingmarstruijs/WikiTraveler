import { loadStoryMarkdown } from "../../lib/loadStory";
import { renderStoryHtml } from "../../lib/renderStory";
import { StoryArticle } from "../StoryArticle";

export const metadata = {
  title: "The hotel said “accessible.” That wasn’t enough.",
  description:
    "Origin story of WikiTraveler: sidecar UX, a federated accessibility commons for stays, and why the toolkit stays open to reuse.",
};

export default function StoryPage() {
  const html = renderStoryHtml(loadStoryMarkdown());

  return (
    <main id="main-content" className="wt-www-main">
      <StoryArticle html={html} />
    </main>
  );
}
