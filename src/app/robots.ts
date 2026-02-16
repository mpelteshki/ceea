import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const PRIVATE_PATH_PREFIXES = [
  "/admin",
  "/sign-in",
  "/sign-up",
  "/sso-callback",
  "/en/admin",
  "/en/sign-in",
  "/en/sign-up",
  "/en/sso-callback",
  "/it/admin",
  "/it/sign-in",
  "/it/sign-up",
  "/it/sso-callback",
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
