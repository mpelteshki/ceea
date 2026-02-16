import { Hero } from "@/components/site/hero";
import { Divisions } from "@/components/site/divisions";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { LatestDispatch } from "@/components/site/latest-dispatch";

export default function HomePage() {
  return (
    <>
      {/* Full-bleed hero — no container */}
      <Hero />

      {/* Full-bleed divisions band */}
      <Divisions />

      {/* Contained sections */}
      <div className="ui-site-container space-y-24 py-24">
        <UpcomingEvents />
        <LatestDispatch />
      </div>
    </>
  );
}
