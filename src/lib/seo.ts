import type { Metadata } from "next";
import { routing } from "@/i18n/routing";

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

export type AppLocale = (typeof routing.locales)[number];
export const PUBLIC_SITE_PATHS = ["/", "/about", "/events", "/newsletter", "/projects", "/team", "/join-us", "/contacts"] as const;

const OG_LOCALE_BY_APP_LOCALE: Record<AppLocale, string> = {
  en: "en_US",
  it: "it_IT",
};

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === "/") return "";
  return pathname.startsWith("/") ? pathname : `/${pathname}`;
}

export function resolveLocale(locale: string): AppLocale {
  return routing.locales.includes(locale as AppLocale) ? (locale as AppLocale) : routing.defaultLocale;
}

export function localizedPath(locale: AppLocale, pathname = "/"): string {
  return `/${locale}${normalizePathname(pathname)}`;
}

export function absoluteLocalizedUrl(locale: AppLocale, pathname = "/"): string {
  return new URL(localizedPath(locale, pathname), SITE_URL).toString();
}

export function localizedAlternates(pathname = "/") {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = localizedPath(locale, pathname);
  }
  languages["x-default"] = localizedPath(routing.defaultLocale, pathname);
  return languages;
}

export function toMetaDescription(input: string, maxLength = 160): string {
  const normalized = input.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  noIndex = false,
  keywords,
}: {
  locale: AppLocale;
  pathname: string;
  title: string;
  description: string;
  noIndex?: boolean;
  keywords?: string[];
}): Metadata {
  const canonical = localizedPath(locale, pathname);
  const openGraphAlternateLocales = routing.locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => OG_LOCALE_BY_APP_LOCALE[candidate]);

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
      languages: localizedAlternates(pathname),
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale: OG_LOCALE_BY_APP_LOCALE[locale],
      alternateLocale: openGraphAlternateLocales,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex
      ? NO_INDEX_ROBOTS
      : undefined,
  };
}
