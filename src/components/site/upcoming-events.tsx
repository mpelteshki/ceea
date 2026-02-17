
import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight, ArrowRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { cycleBrandGradientVars, renderGradientTitle } from "@/lib/gradient-title";
import { cn } from "@/lib/utils";

type EventDoc = Doc<"events">;

const EVENTS_TITLE_GRADIENT = cycleBrandGradientVars(2);

function fmtDate(ms: number) {
    const d = new Date(ms);
    return {
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d).toUpperCase(),
        day: d.getDate().toString().padStart(2, "0"),
        weekday: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d),
        time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(d),
    };
}

export async function UpcomingEvents() {
    if (!hasConvex) {
        return (
            <section className="space-y-12">
                <div className="ui-title-stack">
                    <div className="ui-kicker">Calendar</div>
                    <h2 className="mt-4 ui-section-title">{renderGradientTitle("Moments worth showing up for", {
                        highlightClassName: "text-gradient-context",
                        highlightStyle: EVENTS_TITLE_GRADIENT,
                    })}</h2>
                </div>
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
        <section className="relative overflow-hidden border-b border-[var(--accents-2)]">
            <div className="absolute inset-0 bg-[var(--background)]" />

            <div className="ui-site-container relative py-24 sm:py-32">
                <FadeIn>
                    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-24">
                        <div className="ui-title-stack">
                            <h2 className="ui-section-title">{renderGradientTitle("Moments worth showing up for", {
                                highlightClassName: "text-gradient-context",
                                highlightStyle: EVENTS_TITLE_GRADIENT,
                            })}</h2>
                        </div>
                        <Link href="/events" className="ui-btn shrink-0" data-variant="secondary">
                            View full calendar
                            <ArrowRight className="ui-icon-shift h-4 w-4" />
                        </Link>
                    </div>
                </FadeIn>

                {events.length === 0 ? (
                    <EmptyState title="No upcoming events yet." description="Check back later for updates." className="relative border-none bg-transparent" />
                ) : (
                    <div className="flex flex-col gap-24 sm:gap-32">
                        {events.map((event, i) => {
                            const title = String(event.title || "");
                            const date = fmtDate(event.startsAt);

                            // Generate a deterministic distinct accent color for the event visual based on index
                            // Using our brand colors: caramel, crimson, teal, teal-soft
                            const accents = [
                                "var(--brand-caramel)",
                                "var(--brand-crimson)",
                                "var(--brand-teal)",
                                "var(--brand-teal-soft)"
                            ];
                            const accent = accents[i % accents.length];

                            return (
                                <FadeIn key={event._id}>
                                    <div
                                        className={cn(
                                            "flex flex-col gap-12 lg:items-center lg:gap-24",
                                            i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                        )}
                                    >
                                        {/* Visual Side: Date Card */}
                                        <div className="flex-1 relative group">
                                            <Link href={event.rsvpUrl || "/events"} className="block">
                                                <div
                                                    className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[var(--accents-2)] bg-[var(--background)] p-8 relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                                >
                                                    {/* Decorative grid */}
                                                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                                        <span className="font-mono text-sm tracking-widest text-[var(--accents-5)] uppercase">
                                                            {date.weekday}
                                                        </span>
                                                        <span className="font-display text-8xl leading-none tracking-tighter text-[var(--foreground)]" style={{ color: accent }}>
                                                            {date.day}
                                                        </span>
                                                        <span className="font-mono text-xl tracking-widest text-[var(--accents-5)] uppercase">
                                                            {date.month}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Content Side */}
                                        <div className="flex-1">
                                            <div className="flex flex-col gap-6">
                                                <div className="flex items-center gap-3 text-sm text-[var(--accents-5)]">
                                                    <Calendar className="h-4 w-4 text-[var(--accents-4)]" />
                                                    <span>{date.time}</span>
                                                    {event.location && (
                                                        <>
                                                            <span className="h-1 w-1 rounded-full bg-[var(--accents-3)]" />
                                                            <MapPin className="h-4 w-4 text-[var(--accents-4)]" />
                                                            <span>{event.location}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <h3 className="font-display text-4xl text-[var(--foreground)] sm:text-5xl lg:text-6xl leading-[1.1]">
                                                    <Link href={event.rsvpUrl || "/events"} className="hover:text-[var(--accents-6)] transition-colors">
                                                        {title}
                                                    </Link>
                                                </h3>

                                                <div className="pt-4">
                                                    <Link
                                                        href={event.rsvpUrl || "/events"}
                                                        className="inline-flex items-center gap-2 font-medium text-lg transition-colors hover:gap-3"
                                                        style={{ color: accent }}
                                                    >
                                                        View event details
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
