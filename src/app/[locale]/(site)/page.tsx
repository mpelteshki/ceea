import { Hero } from "@/components/site/hero";
import { HomeHighlights } from "@/components/site/home-highlights";
import { LatestDispatch } from "@/components/site/latest-dispatch";
import { UpcomingEvents } from "@/components/site/upcoming-events";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

export default function HomePage() {
  return (
    <FadeInStagger className="space-y-24 md:space-y-32">
      <FadeIn>
        <Hero />
      </FadeIn>
      <FadeIn>
        <UpcomingEvents />
      </FadeIn>
      <FadeIn>
        <LatestDispatch />
      </FadeIn>
      <FadeIn>
        <HomeHighlights />
      </FadeIn>
    </FadeInStagger>
  );
}

