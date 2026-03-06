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

function clerkOriginFromPublishableKey(value: string | undefined) {
  if (!value) return null;

  try {
    const encoded = value.split("_").slice(2).join("_").replace(/\$$/, "");
    const host = Buffer.from(encoded, "base64url").toString("utf8").replace(/\$$/, "");
    return host ? toOrigin(host) : null;
  } catch {
    return null;
  }
}

function buildCsp() {
  const isDev = process.env.NODE_ENV !== "production";
  const clerkOrigins = [
    clerkOriginFromPublishableKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
    toOrigin(process.env.CLERK_JWT_ISSUER_DOMAIN),
    toOrigin(process.env.NEXT_PUBLIC_CLERK_PROXY_URL),
    toOrigin(process.env.CLERK_PROXY_URL),
    toOrigin(process.env.NEXT_PUBLIC_CLERK_DOMAIN),
    toOrigin(process.env.CLERK_DOMAIN),
    toOrigin(process.env.NEXT_PUBLIC_CLERK_FAPI),
    toOrigin(process.env.CLERK_FAPI),
  ].filter((value): value is string => Boolean(value));

  const scriptSrc = [
    "'self'",
    "'unsafe-inline'",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://challenges.cloudflare.com",
    "https://*.vercel-scripts.com",
    ...clerkOrigins,
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
    ...clerkOrigins,
  ];

  if (isDev) {
    connectSrc.push(
      "http://localhost:*",
      "ws://localhost:*",
      "http://127.0.0.1:*",
      "ws://127.0.0.1:*",
    );
  }

  const extraConnectOrigins = [
    toOrigin(process.env.NEXT_PUBLIC_CONVEX_URL),
    toOrigin(process.env.NEXT_PUBLIC_SITE_URL),
  ].filter((value): value is string => Boolean(value));

  connectSrc.push(...extraConnectOrigins);

  const frameSrc = [
    "'self'",
    "https://*.clerk.accounts.dev",
    "https://*.clerk.com",
    "https://challenges.cloudflare.com",
    ...clerkOrigins,
  ];

  return [
    "default-src 'self'",
    `script-src ${Array.from(new Set(scriptSrc)).join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "img-src 'self' data: blob: https: https://img.clerk.com",
    "media-src 'self' data: https:",
    "connect-src " + Array.from(new Set(connectSrc)).join(" "),
    `frame-src ${Array.from(new Set(frameSrc)).join(" ")}`,
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
