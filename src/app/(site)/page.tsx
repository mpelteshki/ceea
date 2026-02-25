import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { HomeScrollSection } from "@/components/site/home-scroll-effects";
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
      <HomeScrollSection tone="teal">
        <Hero />
      </HomeScrollSection>

      <HomeScrollSection tone="warm">
        <Divisions />
      </HomeScrollSection>

      <HomeScrollSection tone="teal">
        <UpcomingEvents />
      </HomeScrollSection>

      <HomeScrollSection tone="warm">
        <LatestDispatch />
      </HomeScrollSection>
    </>
  );
}
