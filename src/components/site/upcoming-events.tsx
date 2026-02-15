"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Section } from "./section";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";

type EventDoc = Doc<"events">;

function fmtDate(ms: number) {
  const d = new Date(ms);
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function UpcomingEvents() {
  if (!hasConvex) {
    return (
      <Section eyebrow="Calendar" title="Moments worth showing up for.">
        <div className="mt-6 rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          Backend not configured. Set{" "}
          <span className="font-mono">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
          show events.
        </div>
      </Section>
    );
  }

  return <UpcomingEventsInner />;
}

function UpcomingEventsInner() {
  const events = useQuery(api.events.listUpcoming, { limit: 3 });

  return (
    <Section eyebrow="Calendar" title="Moments worth showing up for.">
      <div className="mt-10 border-t border-black/10 dark:border-white/10">
        <FadeInStagger className="grid divide-y divide-black/10 border-b border-black/10 dark:divide-white/10 dark:border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0 text-left">
          {(events ?? Array.from({ length: 3 })).map((e, idx) => {
            if (!e) {
              return (
                <FadeIn key={idx} className="p-6 md:p-8">
                  <div className="h-40 animate-pulse bg-black/5 dark:bg-white/5" />
                </FadeIn>
              );
            }
            const ev = e as EventDoc;
            return (
              <FadeIn key={ev._id} className="group relative transition-colors hover:bg-black/5 dark:hover:bg-white/5">
                <Link href={ev.rsvpUrl || "/events"} className="block h-full p-6 md:p-8">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">
                      {ev.kind}
                    </span>
                    <ArrowRight className="h-4 w-4 text-black/30 transition-transform group-hover:-rotate-45 group-hover:text-black dark:text-white/30 dark:group-hover:text-white" />
                  </div>

                  <h3 className="mt-6 font-display text-2xl leading-tight group-hover:text-[color:var(--danube)] transition-colors">
                    {ev.title}
                  </h3>

                  <div className="mt-8 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-black/60 dark:text-white/60">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{fmtDate(ev.startsAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-black/50 dark:text-white/50">
                      <MapPin className="h-3.5 w-3.5" />
                      <span className="truncate">{ev.location}</span>
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
          className="group inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-black/70 dark:text-white dark:hover:text-white/70"
        >
          Full calendar <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </FadeIn>
    </Section>
  );
}

