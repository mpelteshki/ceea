import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Next inferring a parent workspace root due to unrelated lockfiles.
    root: process.cwd(),
  },
};

export default nextConfig;
