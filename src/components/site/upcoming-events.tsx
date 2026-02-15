"use client";

import { Link } from "@/i18n/routing";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Section } from "./section";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/localization";

type EventDoc = Doc<"events">;

function fmtDate(ms: number) {
  const d = new Date(ms);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(d)
    .toUpperCase();
}

export function UpcomingEvents() {
  const t = useTranslations("UpcomingEvents");

  if (!hasConvex) {
    return (
      <Section eyebrow={t("eyebrow")} title={t("title")}>
        <div className="mt-6 border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
          Backend not configured. Set{" "}
          <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
          show events.
        </div>
      </Section>
    );
  }

  return <UpcomingEventsContent t={t} />;
}

function UpcomingEventsContent({ t }: { t: any }) {
  const events = useQuery(api.events.listUpcoming, { limit: 3 });
  const locale = useLocale();

  return (
    <Section eyebrow={t("eyebrow")} title={t("title")}>
      <div className="mt-10">
        <FadeInStagger className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
          {(events ?? Array.from({ length: 3 })).map((e, idx) => {
            if (!e) {
              return (
                <FadeIn key={idx} className="py-6 px-4">
                  <div className="h-8 w-2/3 animate-pulse bg-[var(--accents-2)] rounded" />
                  <div className="mt-3 h-4 w-1/2 animate-pulse bg-[var(--accents-2)] rounded" />
                </FadeIn>
              );
            }
            const ev = e as EventDoc;
            const { title } = getLocalized(ev, locale, ["title"]);

            return (
              <FadeIn
                key={ev._id}
              >
                <Link
                  href={ev.rsvpUrl || "/events"}
                  aria-label={`${t("viewEvent")}: ${title}`}
                  className="ui-rowlink group md:grid-cols-[1fr_auto] md:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                        {title}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-[var(--accents-5)] mt-1">
                        <span className="ui-tag">{ev.kind}</span>
                        <span className="flex items-center gap-1.5 font-variant-numeric tabular-nums">
                          <Calendar className="h-3.5 w-3.5" />
                          {fmtDate(ev.startsAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {ev.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 flex justify-end">
                    <div className="h-8 w-8 flex items-center justify-center rounded-full border border-[var(--accents-2)] transition-colors group-hover:border-[var(--foreground)] group-hover:bg-[var(--foreground)] group-hover:text-[var(--background)]">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              </FadeIn>
            );
          })}
        </FadeInStagger>
      </div>

      <FadeIn delay={0.2} className="mt-8 flex justify-end">
        <Link
          href="/events"
          className="ui-link text-sm flex items-center gap-2"
        >
          {t("viewFull")} <ArrowRight className="h-4 w-4" />
        </Link>
      </FadeIn>
    </Section>
  );
}
