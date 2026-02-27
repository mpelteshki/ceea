import type { Metadata } from "next";

export const SITE_NAME = "CEEA Bocconi";
export const SITE_DESCRIPTION =
  "Central & Eastern European Association at Bocconi University. Culture, careers, and community across the region.";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ceea-bocconi.com";
const normalizedSiteUrl = rawSiteUrl.startsWith("http") ? rawSiteUrl : `https://${rawSiteUrl}`;
const sanitizedSiteUrl = normalizedSiteUrl.replace(/\/+$/, "");

export const SITE_URL = new URL(sanitizedSiteUrl);
export const NO_INDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  nocache: true,
  googleBot: {
    index: false,
    follow: false,
    noimageindex: true,
  },
};

export const PUBLIC_SITE_PATHS = ["/", "/about", "/events", "/newsletter", "/team", "/contacts"] as const;

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "/";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function absoluteUrl(pathname = "/"): string {
  return new URL(normalizePathname(pathname), SITE_URL).toString();
}

export function toMetaDescription(input: string, maxLength = 160): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildPageMetadata({
  pathname,
  title,
  description,
  noIndex = false,
  keywords,
}: {
  pathname: string;
  title: string;
  description: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonical = normalizePathname(pathname);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? NO_INDEX_ROBOTS : undefined,
  };
}
