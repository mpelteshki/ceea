import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight, Calendar, MapPin } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { getLocalized } from "@/lib/localization";
import { FadeIn } from "@/components/ui/fade-in";

type EventDoc = Doc<"events">;

function fmtDate(ms: number, locale: string) {
  const d = new Date(ms);
  return {
    month: new Intl.DateTimeFormat(locale, { month: "short" }).format(d).toUpperCase(),
    day: d.getDate().toString().padStart(2, "0"),
    weekday: new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d),
    time: new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit", hour12: true }).format(d),
  };
}

export async function EventsList() {
  const t = await getTranslations("EventsList");

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

  const locale = await getLocale();
  const list = (await convex.query(api.events.listAll, {})) as EventDoc[];

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border py-16 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Calendar className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">{t("noEvents")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="divide-y divide-border border-y border-border">
        {list.map((event, idx) => {
          const localized = getLocalized(event, locale, ["title", "summary"] as const);
          const title = String(localized.title ?? "");
          const summary = localized.summary ? String(localized.summary) : "";
          const date = fmtDate(event.startsAt, locale);

          return (
            <FadeIn key={event._id} delay={Math.min(idx * 0.04, 0.18)}>
              <div className="ui-hover-lift-sm group grid grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-center py-6 sm:py-8 rounded-xl px-3 -mx-3 hover:bg-[color-mix(in_oklch,var(--brand-cream)_4%,transparent)]">
                <div className="flex flex-col items-center justify-center w-16 sm:w-20">
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground">{date.weekday}</span>
                  <span className="font-display text-3xl sm:text-4xl leading-none text-foreground">{date.day}</span>
                  <span className="text-[10px] font-mono tracking-widest text-muted-foreground">{date.month}</span>
                </div>

                <div className="min-w-0">
                  <h3 className="font-display text-lg sm:text-xl text-foreground leading-snug truncate">{title}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" /> {date.time}
                    </span>
                    {event.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                    ) : null}
                  </div>
                  {summary ? <p className="mt-2 text-sm text-muted-foreground line-clamp-2 max-w-2xl hidden sm:block">{summary}</p> : null}
                </div>

                <div className="flex gap-2 shrink-0">
                  {event.rsvpUrl ? (
                    <a href={event.rsvpUrl} target="_blank" rel="noopener noreferrer" className="ui-btn text-xs py-2 px-4 min-h-0">
                      RSVP
                    </a>
                  ) : event.moreInfoUrl ? (
                    <a
                      aria-label="Open event details"
                      href={event.moreInfoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-transparent hover:text-primary-foreground transition-colors"
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
