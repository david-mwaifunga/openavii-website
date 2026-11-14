import type { NextConfig } from "next";

/**
 * Security headers sent on every route. Strict-Transport-Security is left to
 * the hosting platform, which terminates TLS.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  // Do not advertise the framework.
  poweredByHeader: false,
  images: {
    // Smallest modern format first; the optimised source images are WebP.
    // Every <Image> uses the default quality (75), so no custom `qualities` list is needed.
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
