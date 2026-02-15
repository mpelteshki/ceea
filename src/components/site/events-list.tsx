"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { usePathname, useSearchParams } from "next/navigation";
import { hasConvex } from "@/lib/public-env";

type Kind = "flagship" | "career" | "culture" | "community";
type EventDoc = Doc<"events">;

function fmtDate(ms: number) {
  const d = new Date(ms);
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function KindChip({
  kind,
  active,
  href,
}: {
  kind: Kind | "all";
  active: boolean;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={[
        "rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
        active
          ? "border-black/20 bg-black text-white dark:border-white/20 dark:bg-white dark:text-black"
          : "border-black/15 bg-white/55 text-black hover:bg-white/85 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
      ].join(" ")}
    >
      {kind === "all" ? "All" : kind}
    </Link>
  );
}

export function EventsList() {
  if (!hasConvex) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Backend not configured. Set{" "}
        <span className="font-mono">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
        show events.
      </div>
    );
  }

  return <EventsListInner />;
}

function EventsListInner() {
  const events = useQuery(api.events.listAll, {}) as EventDoc[] | undefined;
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const kindParam = searchParams.get("kind");
  const filter: Kind | "all" =
    kindParam === "flagship" ||
    kindParam === "career" ||
    kindParam === "culture" ||
    kindParam === "community"
      ? kindParam
      : "all";

  const filtered = useMemo(() => {
    const list = events ?? [];
    if (filter === "all") return list;
    return list.filter((e) => e.kind === filter);
  }, [events, filter]);

  if (!events) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[150px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-5 dark:border-white/10 dark:bg-white/5"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <KindChip
          kind="all"
          active={filter === "all"}
          href={pathname}
        />
        <KindChip
          kind="flagship"
          active={filter === "flagship"}
          href={`${pathname}?kind=flagship`}
        />
        <KindChip
          kind="career"
          active={filter === "career"}
          href={`${pathname}?kind=career`}
        />
        <KindChip
          kind="culture"
          active={filter === "culture"}
          href={`${pathname}?kind=culture`}
        />
        <KindChip
          kind="community"
          active={filter === "community"}
          href={`${pathname}?kind=community`}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          No events yet. Admins can add events from{" "}
          <span className="font-mono">/admin</span>.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((e) => (
            <div
              key={e._id}
              className="group rounded-2xl border border-black/10 bg-white/55 p-6 transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-display text-2xl leading-none">
                    {e.title}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/65 dark:text-white/65">
                    {e.summary}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-black/10 bg-black/5 px-2 py-1 font-mono text-[11px] tracking-wide text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                  {e.kind}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-black/60 dark:text-white/60">
                <div className="font-mono">{fmtDate(e.startsAt)}</div>
                <div className="truncate">{e.location}</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {e.rsvpUrl ? (
                  <a
                    href={e.rsvpUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    RSVP <span className="font-mono text-[12px]">→</span>
                  </a>
                ) : null}
                {e.moreInfoUrl ? (
                  <a
                    href={e.moreInfoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white/90 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    Details <span className="font-mono text-[12px]">↗</span>
                  </a>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
