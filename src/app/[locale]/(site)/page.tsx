import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { getTranslations } from "next-intl/server";
import { buildPageMetadata, resolveLocale, SITE_NAME, toMetaDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const heroT = await getTranslations({ locale: typedLocale, namespace: "Hero" });

  return buildPageMetadata({
    locale: typedLocale,
    pathname: "/",
    title: SITE_NAME,
    description: toMetaDescription(heroT("description")),
  });
}

export default function HomePage() {
  return (
    <>
      {/* Full-bleed hero — no container */}
      <Hero />

      {/* Full-bleed divisions band */}
      <Divisions />

      {/* Contained sections */}
      <div className="ui-site-container space-y-16 py-16 sm:space-y-24 sm:py-24">
        <UpcomingEvents />
        <LatestDispatch />
      </div>
    </>
  );
}
