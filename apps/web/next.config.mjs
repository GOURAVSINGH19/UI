/** @type {import('next').NextConfig} */
import { createMDX } from "fumadocs-mdx/next";
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  cacheComponents: true
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
