import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { buildPageMetadata, SITE_NAME, toMetaDescription } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/",
  title: SITE_NAME,
  description: toMetaDescription(
    "A central hub for Eastern European students. Where Western European funding meets Eastern European minds",
  ),
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <Divisions />

      <div className="ui-site-container space-y-16 py-16 sm:space-y-24 sm:py-24">
        <UpcomingEvents />
        <LatestDispatch />
      </div>
    </>
  );
}
