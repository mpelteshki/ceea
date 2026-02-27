"use client";

import Link from "next/link";
import { Calendar, MapPin, ArrowUpRight } from "lucide-react";
import { SlideIn, ScrollRevealMask } from "@/components/ui/scroll-animations";
import { SectionHeader } from "@/components/site/section-header";
import { EmptyState } from "@/components/ui/empty-state";

type EventData = {
  id: string;
  title: string;
  rsvpUrl: string;
  location: string | null;
  date: {
    month: string;
    day: string;
    time: string;
  };
};

export function EventRowAnimations({ events }: { events: EventData[] }) {
  return (
    <>
      <SlideIn from="right" distance={60} blur>
        <SectionHeader
          title="Upcoming events"
          accent="var(--brand-crimson)"
          cta={{ label: "View all events", href: "/events" }}
        />
      </SlideIn>

      {events.length === 0 ? (
        <EmptyState
          title="No upcoming events yet."
          description="Check back later for updates."
          className="relative border-none bg-transparent"
        />
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {events.map((event, idx) => (
            <SlideIn
              key={event.id}
              from="bottom"
              distance={80}
              delay={idx * 0.1}
              blur
            >
              <ScrollRevealMask direction="up">
                <Link
                  href={event.rsvpUrl}
                  className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-5 transition-colors duration-200 hover:bg-[var(--accents-1)] sm:gap-8 sm:py-6"
                >
                  {/* Date block */}
                  <div className="flex flex-col items-center justify-center w-16 sm:w-20">
                    <span className="font-mono text-[0.65rem] font-medium uppercase tracking-[0.12em] text-[var(--color-crimson)]">
                      {event.date.month}
                    </span>
                    <span className="font-display text-3xl leading-none tracking-tight text-foreground mt-0.5 sm:text-4xl">
                      {event.date.day}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-display text-lg leading-snug text-foreground sm:text-xl">
                      {event.title}
                    </h3>
                    <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" aria-hidden="true" />
                        {event.date.time}
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
                  <div className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full border border-border text-muted-foreground transition-colors duration-200 group-hover:border-[var(--ring)] group-hover:text-[var(--foreground)]">
                    <ArrowUpRight className="ui-icon-shift h-4 w-4" />
                  </div>
                </Link>
              </ScrollRevealMask>
            </SlideIn>
          ))}
        </div>
      )}
    </>
  );
}
