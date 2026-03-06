import type { NextConfig } from "next";

function toOrigin(value: string | undefined) {
  if (!value) return null;
  try {
    const normalized = value.startsWith("http") ? value : `https://${value}`;
    return new URL(normalized).origin;
  } catch {
    return null;
  }
}

function buildCsp() {
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://*.vercel-scripts.com",
  ];
  if (isDev) scriptSrc.push("'unsafe-eval'");

  const connectSrc = [
    "'self'",
    "https://*.convex.cloud",
    "wss://*.convex.cloud",
    "https://*.convex.site",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://clerk-telemetry.com",
    "https://*.vercel-insights.com",
  ];

  if (isDev) {
    connectSrc.push(
      "http://localhost:*",
      "ws://localhost:*",
      "http://127.0.0.1:*",
      "ws://127.0.0.1:*",
    );
  }

  const envOrigins = [
    toOrigin(process.env.NEXT_PUBLIC_CONVEX_URL),
    toOrigin(process.env.CLERK_JWT_ISSUER_DOMAIN),
    toOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  ].filter((value): value is string => Boolean(value));

  connectSrc.push(...envOrigins);

  return [
    "default-src 'self'",
    `script-src ${Array.from(new Set(scriptSrc)).join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "media-src 'self' data: https:",
    "connect-src " + Array.from(new Set(connectSrc)).join(" "),
    "frame-src 'self' https://*.clerk.accounts.dev https://*.clerk.com",
    "worker-src 'self' blob:",
    "base-uri 'self'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "object-src 'none'",
  ].join("; ");
}

const nextConfig: NextConfig = {
  turbopack: {
    // Avoid Next inferring a parent workspace root due to unrelated lockfiles.
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shocking-cormorant-881.convex.cloud",
      },
      {
        protocol: "https",
        hostname: "shocking-cormorant-881.convex.site",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: buildCsp(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
