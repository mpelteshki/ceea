import type { Metadata } from "next";
import { EventsList } from "@/components/site/events-list";
import { FadeIn } from "@/components/ui/fade-in";
import { renderGradientTitle } from "@/lib/gradient-title";
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
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_20%,rgba(25,101,107,0.04),transparent)]" />
        <div className="ui-site-container relative pb-12 pt-12 sm:pb-16 sm:pt-20">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle("Events")}</h1>
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
