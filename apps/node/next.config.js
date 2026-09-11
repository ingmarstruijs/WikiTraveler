const path = require("path");
const rootPkg = require("../../package.json");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    WIKITRAVELER_VERSION:
      process.env.WIKITRAVELER_VERSION ?? rootPkg.version,
  },
  transpilePackages: ["@wikitraveler/ui"],
  // Docker/self-host need standalone; Vercel + Next 16.3 + adapter breaks on
  // missing next-server.js.nft.json (vercel/next.js#96646).
  output: process.env.VERCEL ? undefined : "standalone",
  // pnpm stores Prisma engines outside the default trace path
  outputFileTracingIncludes: {
    "/*": [
      "./node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**",
      "../../node_modules/.pnpm/@prisma+client*/node_modules/.prisma/client/**",
    ],
  },
  // CORS for /api/* is applied dynamically in proxy.ts (trusted Origin reflection).
  // See apps/node/lib/corsOrigins.ts and RFC-0002.
};

module.exports = nextConfig;
