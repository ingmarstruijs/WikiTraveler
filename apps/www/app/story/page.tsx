import { marked } from "marked";
import { loadStoryMarkdown } from "../../lib/loadStory";

export const metadata = {
  title: "The hotel said “accessible.” That wasn’t enough.",
  description:
    "Origin story of WikiTraveler: Maurice, sidecar UX, and building a federated accessibility commons for stays.",
};

export default function StoryPage() {
  const html = marked.parse(loadStoryMarkdown(), { gfm: true, async: false }) as string;

  return (
    <main id="main-content" className="wt-www-main">
      <article className="wt-www-article" dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
