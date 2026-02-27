
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/site/section-header";
import { fmtEventDate } from "@/lib/format-date";
import { EventRowAnimations } from "@/components/site/event-row-animations";

type EventDoc = Doc<"events">;

const KIND_META: Record<string, { label: string; color: string }> = {
  signature: { label: "Signature", color: "var(--brand-teal)" },
  career:    { label: "Career",    color: "var(--brand-caramel)" },
  culture:   { label: "Culture",   color: "var(--brand-crimson)" },
  community: { label: "Community", color: "var(--muted-foreground)" },
};

export async function UpcomingEvents() {
    if (!hasConvex) {
        return (
            <section className="space-y-12">
                <SectionHeader
                    title="Moments worth showing up for"
                    accent="var(--brand-crimson)"
                />
                <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                    Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show events.
                </div>
            </section>
        );
    }

    const convex = getConvexServerClient();
    if (!convex) {
        return <EmptyState title="No upcoming events yet." description="Check back later for updates." className="border-none bg-transparent" />;
    }

    const events = (await convex.query(api.events.listUpcoming, { limit: 4 })) as EventDoc[];

    // Serialize event data for client component
    const eventData = events.map((event) => {
        const date = fmtEventDate(event.startsAt);
        return {
            id: event._id,
            title: String(event.title || ""),
            rsvpUrl: event.rsvpUrl || "/events",
            location: event.location || null,
            date,
        };
    });

    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: "var(--home-section-bg, var(--background))" }}
            />

            <div className="ui-site-container relative py-12 sm:py-16">
                <EventRowAnimations events={eventData} />
            </div>
        </section>
    );
}
