"use client";

import { Link } from "@/i18n/routing";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { usePathname, useSearchParams } from "next/navigation";
import { hasConvex } from "@/lib/public-env";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/localization";

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
        "inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
        active
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "bg-[var(--accents-1)] text-[var(--accents-5)] hover:bg-[var(--accents-2)] hover:text-[var(--foreground)]",
      ].join(" ")}
    >
      {kind === "all" ? "All" : kind.charAt(0).toUpperCase() + kind.slice(1)}
    </Link>
  );
}

export function EventsList() {
  if (!hasConvex) {
    return (
      <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
        Backend not configured. Set{" "}
        <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
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
  const locale = useLocale();
  const t = useTranslations("EventsList");

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
      <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-6">
            <div className="h-5 w-1/2 animate-pulse bg-[var(--accents-2)] rounded" />
            <div className="mt-3 h-4 w-2/3 animate-pulse bg-[var(--accents-2)] rounded" />
            <div className="mt-6 h-4 w-1/3 animate-pulse bg-[var(--accents-2)] rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 border-b border-[var(--accents-2)] pb-6">
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
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-6 text-sm text-[var(--accents-5)] rounded-sm">
          No events found. Admins can add events from{" "}
          <span className="font-mono text-[var(--foreground)]">/admin</span>.
        </div>
      ) : (
        <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
          {filtered.map((e) => {
            const { title, summary } = getLocalized(e, locale, ["title", "summary"]);

            return (
              <article key={e._id} className="group py-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                        {title}
                      </h3>
                      <span className="ui-tag">{e.kind}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--accents-5)]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        <span>{fmtDate(e.startsAt)}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        <span>{e.location}</span>
                      </div>
                    </div>

                    <p className="max-w-3xl text-sm leading-6 text-[var(--accents-5)]">
                      {summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 mt-2 md:mt-0 pt-1">
                    {e.rsvpUrl ? (
                      <a
                        href={e.rsvpUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ui-btn"
                      >
                        RSVP
                      </a>
                    ) : null}
                    {e.moreInfoUrl ? (
                      <a
                        href={e.moreInfoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="ui-btn"
                        data-variant="secondary"
                      >
                        {t("details")}
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
