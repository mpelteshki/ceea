import type { Metadata } from "next";
import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { Suspense } from "react";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { HomeScrollSection } from "@/components/site/home-scroll-effects";
import { DispatchLoadingState, EventsLoadingState } from "@/components/site/loading-states";
import { buildPageMetadata, SITE_NAME, toMetaDescription } from "@/lib/seo";

export const dynamic = "force-dynamic";

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
      <HomeScrollSection tone="blue">
        <Hero />
      </HomeScrollSection>

      <HomeScrollSection tone="green">
        <Divisions />
      </HomeScrollSection>

      <HomeScrollSection tone="blue">
        <Suspense fallback={<EventsLoadingState />}>
          <UpcomingEvents />
        </Suspense>
      </HomeScrollSection>

      <HomeScrollSection tone="green">
        <Suspense fallback={<DispatchLoadingState />}>
          <LatestDispatch />
        </Suspense>
      </HomeScrollSection>
    </>
  );
}
