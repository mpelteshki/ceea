import type { Metadata } from "next";
import { EventsList } from "@/components/site/events-list";
import { FadeIn } from "@/components/ui/fade-in";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION =
  "From flagship speaker nights to small, high-trust formats. If it feels like something you would tell a friend about the next day, we do it.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/events",
  title: "Events",
  description: toMetaDescription(DESCRIPTION),
});

export default async function EventsPage() {
  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn>
            <h1 className="ui-page-title">Events</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--accents-5)] sm:mx-0 sm:text-lg">
              {DESCRIPTION}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-16">
        <EventsList />
      </div>
    </>
  );
}
