import { Calendar } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtEventDate } from "@/lib/format-date";
import { EventsListAnimated } from "@/components/site/events-list-animated";

type EventDoc = Doc<"events">;

export async function EventsList() {
  if (!hasConvex) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Set <code className="font-mono text-foreground">NEXT_PUBLIC_CONVEX_URL</code> to show events.
      </div>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        Backend is currently unavailable.
      </div>
    );
  }

  const list = (await convex.query(api.events.listAll, {})) as EventDoc[];

  if (list.length === 0) {
    return (
      <EmptyState
        title="No events yet."
        description="Check back later for updates."
        icon={Calendar}
        className="border-border bg-card/70 py-16"
      />
    );
  }

  // Serialize for client component
  const eventData = list.map((event) => ({
    id: event._id,
    title: String(event.title || ""),
    summary: event.summary || "",
    kind: event.kind,
    location: event.location || null,
    rsvpUrl: event.rsvpUrl || null,
    moreInfoUrl: event.moreInfoUrl || null,
    date: fmtEventDate(event.startsAt),
  }));

  return <EventsListAnimated events={eventData} />;
}
