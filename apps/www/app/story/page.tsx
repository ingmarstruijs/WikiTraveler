import { loadStoryMarkdown } from "../../lib/loadStory";
import { renderStoryHtml } from "../../lib/renderStory";
import { StoryArticle } from "../StoryArticle";

export const metadata = {
  title: "The hotel said “accessible.” That wasn’t enough.",
  description:
    "Origin story of WikiTraveler: Maurice, sidecar UX, and building a federated accessibility commons for stays.",
};

export default function StoryPage() {
  const html = renderStoryHtml(loadStoryMarkdown());

  return (
    <main id="main-content" className="wt-www-main">
      <StoryArticle html={html} />
    </main>
  );
}
