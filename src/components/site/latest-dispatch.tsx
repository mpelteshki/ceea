"use client";

import { Link } from "@/i18n/routing";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { Section } from "./section";
import { hasConvex } from "@/lib/public-env";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getLocalized } from "@/lib/localization";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(ms));
}

export function LatestDispatch() {
  const t = useTranslations("LatestDispatch");
  if (!hasConvex) {
    return (
      <Section eyebrow={t("eyebrow")} title={t("title")}>
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
          Backend not configured. Set{" "}
          <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
          show newsletter posts.
        </div>
      </Section>
    );
  }

  return <LatestDispatchInner />;
}

function LatestDispatchInner() {
  const posts = useQuery(api.posts.listPublished, { limit: 2 }) as
    | PostDoc[]
    | undefined;
  const locale = useLocale();
  const t = useTranslations("LatestDispatch");

  return (
    <Section eyebrow={t("eyebrow")} title={t("title")}>
      <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
        {(posts ?? Array.from({ length: 2 })).map((p, idx) => {
          if (!p) {
            return (
              <div key={idx} className="py-8 px-4">
                <div className="h-6 w-2/3 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="mt-4 h-4 w-1/2 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="mt-4 h-16 w-full animate-pulse bg-[var(--accents-1)] rounded border border-[var(--accents-2)]" />
              </div>
            );
          }

          const { title, excerpt } = getLocalized(p, locale, ["title", "excerpt"]);

          return (
            <Link
              key={p._id}
              href={`/newsletter/${p.slug}`}
              aria-label={`${t("viewPost")}: ${title}`}
              className="ui-rowlink group md:grid-cols-[1fr_auto] md:items-start"
            >
              <div className="min-w-0">
                <div className="flex flex-col gap-1">
                  <div className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    {title}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[var(--accents-5)] mt-1">
                    <span className="ui-tag">
                      {p.publishedAt ? fmtDate(p.publishedAt) : "draft"}
                    </span>
                  </div>
                </div>
                <p className="mt-3 max-w-2xl line-clamp-2 text-sm leading-6 text-[var(--accents-5)]">
                  {excerpt}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--foreground)]">
                  Read post <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-8">
        <Link
          href="/newsletter"
          className="ui-btn"
          data-variant="secondary"
        >
          View all posts
        </Link>
      </div>
    </Section>
  );
}
