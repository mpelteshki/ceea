import type { Metadata } from "next";
import { NewsletterList } from "@/components/site/newsletter-list";
import { FadeIn } from "@/components/ui/fade-in";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION =
  "Short, high-signal updates: what we hosted, what's next, and the people and ideas we're bringing to campus.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/newsletter",
  title: "Newsletter",
  description: toMetaDescription(DESCRIPTION),
});

export default async function NewsletterPage() {
  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn>
            <h1 className="ui-page-title">Newsletter</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--accents-5)] sm:mx-0 sm:text-lg">
              {DESCRIPTION}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-16">
        <NewsletterList />
      </div>
    </>
  );
}
