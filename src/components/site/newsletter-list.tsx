"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";

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
      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Backend not configured. Set{" "}
        <span className="font-mono">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
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

  if (!posts) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-[150px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        No posts yet. Admins can publish from <span className="font-mono">/admin</span>.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {posts.map((p) => (
        <Link
          key={p._id}
          href={`/newsletter/${p.slug}`}
          className="group rounded-2xl border border-black/10 bg-white/55 p-6 transition-transform hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="font-display text-2xl leading-none">{p.title}</div>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-black/65 dark:text-white/65">
                {p.excerpt}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-black/10 bg-black/5 px-2 py-1 font-mono text-[11px] tracking-wide text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
              {p.publishedAt ? fmtDate(p.publishedAt) : "draft"}
            </span>
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-black/80 group-hover:text-black dark:text-white/80 dark:group-hover:text-white">
            Read <span className="font-mono text-[12px]">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
