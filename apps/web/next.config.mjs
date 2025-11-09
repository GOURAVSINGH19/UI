/** @type {import('next').NextConfig} */
import { createMDX } from "fumadocs-mdx/next";
const nextConfig = {
  transpilePackages: ["@workspace/ui"],
  pageExtensions: ["ts", "tsx", "mdx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
});

export default withMDX(nextConfig);
