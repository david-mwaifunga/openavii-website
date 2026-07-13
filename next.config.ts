import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quality values used by next/image across the site (Next.js 16 requires
    // every non-default quality to be explicitly allowed here).
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
