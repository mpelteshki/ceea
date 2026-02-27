import type { Metadata } from "next";
import { NewsletterList } from "@/components/site/newsletter-list";
import { Suspense } from "react";
import { EventsListSkeleton } from "@/components/site/list-skeletons";
import { PageHeader } from "@/components/site/page-header";
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
      <PageHeader title="Newsletter" subtitle={DESCRIPTION} />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Suspense fallback={<EventsListSkeleton />}>
          <NewsletterList />
        </Suspense>
      </div>
    </>
  );
}
