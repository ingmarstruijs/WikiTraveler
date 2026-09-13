import { CANONICAL_SITE_URL } from "../lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/story", "/privacy"].map((path) => ({
    url: `${CANONICAL_SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
