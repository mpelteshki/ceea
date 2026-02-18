
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

export async function UpcomingEvents() {
    if (!hasConvex) {
        return (
            <section className="space-y-12">
                <SectionHeader
                    title="Moments worth showing up for"
                    accent="var(--brand-crimson)"
                />
                <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
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
                                        className="group grid grid-cols-[4rem_1fr] items-center gap-4 py-5 transition-colors duration-200 hover:bg-[var(--accents-1)] sm:grid-cols-[5rem_1fr_auto] sm:gap-8 sm:py-6 -mx-4 px-4 rounded-xl"
                                    >
                                        {/* Date block */}
                                        <div className="text-center">
                                            <div className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                                {date.month}
                                            </div>
                                            <div className="font-display text-3xl font-semibold leading-none tracking-tight text-[var(--foreground)]">
                                                {date.day}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="min-w-0">
                                            <h3 className="truncate font-display text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl">
                                                {title}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                                                    {date.time}
                                                </span>
                                                {event.location && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                                                        {event.location}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ArrowUpRight className="block h-4 w-4 shrink-0 text-[var(--muted-foreground)]" />
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
