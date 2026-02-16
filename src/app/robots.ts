import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/sso-callback",
  "/api",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: PRIVATE_PATH_PREFIXES,
      },
    ],
    sitemap: new URL("/sitemap.xml", SITE_URL).toString(),
    host: SITE_URL.origin,
  };
}
