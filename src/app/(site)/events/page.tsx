import { EventsList } from "@/components/site/events-list";
import { Suspense } from "react";

export default function EventsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Calendar</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Events
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          From flagship speaker nights to small, high-trust formats. If it feels
          like something you would tell a friend about the next day, we do it.
        </p>
      </header>

      <Suspense
        fallback={
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-[150px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-5 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        }
      >
        <EventsList />
      </Suspense>
    </div>
  );
}
