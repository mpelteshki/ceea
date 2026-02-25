
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/site/section-header";
import { fmtEventDate } from "@/lib/format-date";

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

    return (
        <section className="relative overflow-hidden">
            <div
                className="absolute inset-0"
                style={{ background: "var(--home-section-bg, var(--background))" }}
            />

            <div className="ui-site-container relative py-12 sm:py-16">
                <FadeIn>
                    <SectionHeader
                        title="Upcoming events"
                        accent="var(--brand-crimson)"
                        cta={{ label: "View all events", href: "/events" }}
                    />
                </FadeIn>

                {events.length === 0 ? (
                    <EmptyState title="No upcoming events yet." description="Check back later for updates." className="relative border-none bg-transparent" />
                ) : (
                    <FadeInStagger>
                        <div className="divide-y divide-[var(--border)]">
                            {events.map((event) => {
                                const title = String(event.title || "");
                                const date = fmtEventDate(event.startsAt);

                                return (
                                    <StaggerItem key={event._id}>
                                        <Link
                                            href={event.rsvpUrl || "/events"}
                                            className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-5 transition-colors duration-200 hover:bg-[var(--accents-1)] sm:gap-8 sm:py-6"
                                        >
                                            {/* Date block */}
                                            <div className="flex flex-col items-center justify-center w-16 sm:w-20">
                                                <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--color-crimson)]">
                                                    {date.month}
                                                </span>
                                                <span className="font-display text-3xl leading-none tracking-tight text-foreground mt-0.5 sm:text-4xl">
                                                    {date.day}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="truncate font-display text-lg leading-snug text-foreground sm:text-xl">
                                                    {title}
                                                </h3>
                                                <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3" aria-hidden="true" />
                                                        {date.time}
                                                    </span>
                                                    {event.location && (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            <MapPin className="h-3 w-3" aria-hidden="true" />
                                                            {event.location}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Arrow */}
                                            <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full border border-border text-muted-foreground transition-colors duration-200 group-hover:border-transparent group-hover:bg-primary group-hover:text-primary-foreground">
                                                <ArrowUpRight className="ui-icon-shift h-4 w-4" />
                                            </div>
                                        </Link>
                                    </StaggerItem>
                                );
                            })}
                        </div>
                    </FadeInStagger>
                )}
            </div>
        </section>
    );
}
