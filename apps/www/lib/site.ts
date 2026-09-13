export const CANONICAL_SITE_URL = "https://www.wikitraveler.org";
export const CANONICAL_PRIVACY_URL = `${CANONICAL_SITE_URL}/privacy`;

export const LINKS = {
  site: CANONICAL_SITE_URL,
  story: `${CANONICAL_SITE_URL}/story`,
  privacy: CANONICAL_PRIVACY_URL,
  access: "https://access.wikitraveler.org",
  node: "https://node-eu.wikitraveler.org",
  accessibility: "https://node-eu.wikitraveler.org/accessibility",
  github: "https://github.com/ingmarstruijs/WikiTraveler",
  docs: "https://github.com/ingmarstruijs/WikiTraveler/blob/main/docs/README.md",
  contributing: "https://github.com/ingmarstruijs/WikiTraveler/blob/main/CONTRIBUTING.md",
  lensRelease: "https://github.com/ingmarstruijs/WikiTraveler/releases/latest",
  changelog: "https://github.com/ingmarstruijs/WikiTraveler/blob/main/CHANGELOG.md",
  sdk: "https://www.npmjs.com/package/@wikitraveler/sdk",
  issues: "https://github.com/ingmarstruijs/WikiTraveler/issues",
} as const;
