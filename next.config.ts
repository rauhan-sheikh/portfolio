import withMDX from "@next/mdx";
import type { NextConfig } from "next";

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = withMDXConfig({
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx"],
  // ...other Next.js config options
});

export default nextConfig;
