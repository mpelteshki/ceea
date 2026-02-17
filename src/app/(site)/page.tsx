import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { HomeScrollProgress, HomeScrollSection } from "@/components/site/home-scroll-effects";
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
      <HomeScrollProgress />

      <HomeScrollSection tone="teal" depth={1.18}>
        <Hero />
      </HomeScrollSection>

      <HomeScrollSection tone="warm" depth={0.95}>
        <Divisions />
      </HomeScrollSection>

      <HomeScrollSection tone="soft" depth={0.88}>
        <UpcomingEvents />
      </HomeScrollSection>

      <HomeScrollSection tone="crimson" depth={0.86}>
        <LatestDispatch />
      </HomeScrollSection>
    </>
  );
}
