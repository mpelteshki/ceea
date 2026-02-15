import { EventsList } from "@/components/site/events-list";
import { Suspense } from "react";

export default function EventsPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="ui-kicker">Calendar</div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
          Events
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)]">
          From flagship speaker nights to small, high-trust formats. If it feels
          like something you would tell a friend about the next day, we do it.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="py-6">
                <div className="h-5 w-1/2 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="mt-3 h-4 w-2/3 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="mt-6 h-4 w-1/3 animate-pulse bg-[var(--accents-2)] rounded" />
              </div>
            ))}
          </div>
        }
      >
        <EventsList />
      </Suspense>
    </div>
  );
}
