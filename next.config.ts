import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Next inferring a parent workspace root due to unrelated lockfiles.
    root: process.cwd(),
  },
};

export default withNextIntl(nextConfig);
