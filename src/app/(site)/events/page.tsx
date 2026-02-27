import type { Metadata } from "next";
import { EventsList } from "@/components/site/events-list";
import { Suspense } from "react";
import { EventsListSkeleton } from "@/components/site/list-skeletons";
import { PageHeader } from "@/components/site/page-header";
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
      <PageHeader title="Events" subtitle={DESCRIPTION} />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Suspense fallback={<EventsListSkeleton />}>
          <EventsList />
        </Suspense>
      </div>
    </>
  );
}
