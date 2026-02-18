import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtEventDate } from "@/lib/format-date";

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

  return (
    <div className="space-y-8">
      <div className="divide-y divide-border border-t border-border">
        {list.map((event, idx) => {
          const title = String(event.title || "");
          const summary = event.summary || "";
          const date = fmtEventDate(event.startsAt);

          return (
            <FadeIn key={event._id} delay={Math.min(idx * 0.04, 0.18)}>
                <div className="group -mx-4 grid grid-cols-[auto_1fr_auto] items-center gap-6 rounded-xl px-4 py-6 text-center hover:bg-[var(--accents-1)] sm:gap-8 sm:py-8 sm:text-left">
                <div className="flex w-16 flex-col items-center justify-center sm:w-20">
                  <span className="text-[0.6875rem] font-mono font-medium tracking-[0.12em] text-muted-foreground">{date.weekday}</span>
                  <span className="font-display text-3xl leading-none text-foreground sm:text-4xl">{date.day}</span>
                  <span className="text-[0.6875rem] font-mono font-medium tracking-[0.12em] text-muted-foreground">{date.month}</span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg leading-snug text-foreground sm:text-xl">{title}</h3>
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground sm:justify-start">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> {date.time}
                    </span>
                    {event.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" aria-hidden="true" /> {event.location}
                      </span>
                    ) : null}
                  </div>
                  {summary ? <p className="mt-2 hidden max-w-2xl line-clamp-2 text-sm text-muted-foreground sm:block">{summary}</p> : null}
                </div>

                <div className="flex shrink-0 gap-2">
                  {event.rsvpUrl ? (
                    <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer" className="ui-btn min-h-0 px-4 py-2 text-xs">
                      RSVP
                    </a>
                  ) : event.moreInfoUrl ? (
                    <a
                      aria-label="Open event details"
                      href={event.moreInfoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-transparent hover:bg-primary hover:text-primary-foreground"
                    >
                      <ArrowUpRight className="ui-icon-shift h-4 w-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  );
}
