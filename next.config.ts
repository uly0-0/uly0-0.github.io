import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/PortfolioV2",
  env: {
    NEXT_PUBLIC_BASE_PATH: "/PortfolioV2",
  },
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
