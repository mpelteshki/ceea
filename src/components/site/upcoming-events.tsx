import { getLocale, getTranslations } from "next-intl/server";
import { Calendar, MapPin, ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { getLocalized } from "@/lib/localization";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { renderGradientTitle } from "@/lib/gradient-title";

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

export async function UpcomingEvents() {
  const t = await getTranslations("UpcomingEvents");
  const sectionTitle = t("title");

  if (!hasConvex) {
    return (
      <section className="space-y-12">
        <div className="ui-title-stack">
          <div className="ui-kicker">{t("eyebrow")}</div>
          <h2 className="ui-section-title mt-4">{renderGradientTitle(sectionTitle)}</h2>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show events.
        </div>
      </section>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title={t("noEvents")} description={t("checkBackLater")} className="border-none bg-transparent" />;
  }

  const locale = await getLocale();
  const events = (await convex.query(api.events.listUpcoming, { limit: 4 })) as EventDoc[];

  return (
    <section className="space-y-12">
      <FadeIn>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="ui-title-stack">
            <h2 className="ui-section-title mt-4">{renderGradientTitle(sectionTitle)}</h2>
          </div>
          <Link href="/events" className="ui-btn shrink-0" data-variant="secondary">
            {t("viewFull")}
            <ArrowRight className="ui-icon-shift h-4 w-4" />
          </Link>
        </div>
      </FadeIn>

      {events.length === 0 ? (
        <EmptyState title={t("noEvents")} description={t("checkBackLater")} className="border-none bg-transparent" />
      ) : (
        <FadeInStagger className="divide-y divide-[var(--accents-2)] border-y border-[var(--accents-2)]">
          {events.map((event) => {
            const localized = getLocalized(event, locale, ["title"] as const);
            const title = String(localized.title ?? "");
            const date = fmtDate(event.startsAt, locale);

            return (
              <FadeIn key={event._id}>
                <Link
                  href={event.rsvpUrl || "/events"}
                  className="ui-hover-lift-sm group grid grid-cols-[auto_1fr_auto] gap-6 sm:gap-8 items-center py-6 sm:py-8 transition-colors hover:bg-[color-mix(in_oklch,var(--brand-cream)_4%,transparent)] -mx-4 px-4 rounded-xl"
                >
                  <div className="flex flex-col items-center justify-center w-16 sm:w-20">
                    <span className="text-[10px] font-mono tracking-widest text-[var(--accents-4)]">{date.weekday}</span>
                    <span className="font-display text-3xl sm:text-4xl leading-none text-[var(--foreground)]">{date.day}</span>
                    <span className="text-[10px] font-mono tracking-widest text-[var(--accents-4)]">{date.month}</span>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-xl sm:text-2xl text-[var(--foreground)] leading-snug truncate group-hover:text-[var(--brand-teal)] transition-colors">
                      {title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--accents-4)]">
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

                  <div className="h-10 w-10 rounded-full border border-[var(--accents-2)] flex items-center justify-center text-[var(--accents-4)] group-hover:bg-[var(--brand-teal)] group-hover:border-transparent group-hover:text-white transition-colors duration-300 shrink-0">
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
