import Link from "next/link";
import { Calendar, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { renderGradientTitle } from "@/lib/gradient-title";

type EventDoc = Doc<"events">;

function fmtDate(ms: number) {
  const d = new Date(ms);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d).toUpperCase(),
    day: d.getDate().toString().padStart(2, "0"),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(d),
  };
}

export async function UpcomingEvents() {
  if (!hasConvex) {
    return (
      <section className="space-y-12">
        <div className="ui-title-stack">
          <div className="ui-kicker">Calendar</div>
          <h2 className="mt-4 ui-section-title">{renderGradientTitle("Moments worth showing up for")}</h2>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show events.
        </div>
      </section>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title="No upcoming events." description="Check back later for updates." className="border-none bg-transparent" />;
  }

  const events = (await convex.query(api.events.listUpcoming, { limit: 4 })) as EventDoc[];

  return (
    <section className="space-y-12">
      <FadeIn>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="ui-title-stack">
            <h2 className="mt-4 ui-section-title">{renderGradientTitle("Moments worth showing up for")}</h2>
          </div>
          <Link href="/events" className="ui-btn shrink-0" data-variant="secondary">
            View full calendar
            <ArrowRight className="ui-icon-shift h-4 w-4" />
          </Link>
        </div>
      </FadeIn>

      {events.length === 0 ? (
        <EmptyState title="No upcoming events." description="Check back later for updates." className="border-none bg-transparent" />
      ) : (
        <FadeInStagger className="divide-y divide-[var(--accents-2)] border-y border-[var(--accents-2)]">
          {events.map((event) => {
            const title = String(event.title || "");
            const date = fmtDate(event.startsAt);

            return (
              <FadeIn key={event._id}>
                <Link
                  href={event.rsvpUrl || "/events"}
                  className="ui-hover-lift-sm group -mx-4 grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-xl px-4 py-6 text-center transition-colors hover:bg-[color-mix(in_oklch,var(--brand-cream)_4%,transparent)] sm:gap-8 sm:py-8 sm:text-left"
                >
                  <div className="flex w-16 flex-col items-center justify-center sm:w-20">
                    <span className="text-[10px] font-mono tracking-widest text-[var(--accents-4)]">{date.weekday}</span>
                    <span className="font-display text-3xl leading-none text-[var(--foreground)] sm:text-4xl">{date.day}</span>
                    <span className="text-[10px] font-mono tracking-widest text-[var(--accents-4)]">{date.month}</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-display text-xl leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-teal)] sm:text-2xl">
                      {title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[var(--accents-4)] sm:justify-start">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" /> {date.time}
                      </span>
                      {event.location ? (
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" /> {event.location}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[var(--accents-2)] text-[var(--accents-4)] transition-colors duration-300 group-hover:border-transparent group-hover:bg-[var(--brand-teal)] group-hover:text-white">
                    <ArrowUpRight className="ui-icon-shift h-4 w-4" />
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </FadeInStagger>
      )}
    </section>
  );
}
