"use client";

import { Link } from "@/i18n/routing";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
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

export function NewsletterList() {
  if (!hasConvex) {
    return (
      <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
        Backend not configured. Set{" "}
        <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
        show newsletter posts.
      </div>
    );
  }

  return <NewsletterListInner />;
}

function NewsletterListInner() {
  const posts = useQuery(api.posts.listPublished, { limit: 30 }) as
    | PostDoc[]
    | undefined;
  const locale = useLocale();
  const t = useTranslations("NewsletterList");

  if (!posts) {
    return <div className="text-[var(--accents-5)]">Loading posts...</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="py-12 text-center text-[var(--accents-5)]">
        No newsletter posts yet.
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => {
        const { title, excerpt } = getLocalized(p, locale, ["title", "excerpt"]);

        return (
          <Link
            key={p._id}
            href={`/newsletter/${p.slug}`}
            className="group block rounded-sm border border-[var(--accents-2)] bg-[var(--background)] p-6 transition-all hover:border-[var(--accents-4)] hover:shadow-sm"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[var(--accents-1)] px-2.5 py-0.5 text-xs font-medium text-[var(--foreground)]">
                  Newsletter
                </span>
                <span className="text-xs text-[var(--accents-4)]">
                  {p.publishedAt
                    ? fmtDate(p.publishedAt)
                    : "Draft"}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold leading-snug text-[var(--foreground)] group-hover:underline decoration-[var(--accents-3)] underline-offset-4">
                {title}
              </h3>

              <div className="h-px w-10 bg-[var(--accents-2)] group-hover:bg-[var(--foreground)] transition-colors" />

              {/* Author field removed as it's not in schema yet
              <div className="hidden">
                <span className="text-xs text-[var(--accents-4)]">
                  By {p.authorName || "Team"}
                </span>
              </div>
              */}
              <p className="max-w-2xl line-clamp-3 text-sm leading-6 text-[var(--accents-5)]">
                {excerpt}
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accents-6)] group-hover:text-[var(--foreground)]">
                {t("read")} <span className="text-[10px]">→</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
