/** @type {import('next').NextConfig} */
import { createMDX } from "fumadocs-mdx/next";
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["ts", "tsx", "mdx"],
  experimental: {
    cacheComponents: true,
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
