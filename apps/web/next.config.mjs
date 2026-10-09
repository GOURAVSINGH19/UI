import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["ts", "tsx", "mdx"],
  cacheComponents: true,
  // Pin the monorepo root so a stray lockfile higher up isn't picked instead.
  turbopack: {
    root: fileURLToPath(new URL("../..", import.meta.url)),
  },
  // Proxy PostHog through our own domain. Swap "us" for "eu" if the project lives in the EU cloud.
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: "https://us-assets.i.posthog.com/static/:path*" },
      { source: "/ingest/:path*", destination: "https://us.i.posthog.com/:path*" },
    ];
  },
  // PostHog API paths end in slashes; don't let Next redirect them.
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
