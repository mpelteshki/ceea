"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { hasConvex } from "@/lib/public-env";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(ms));
}

export function NewsletterArticle({ slug }: { slug: string }) {
  if (!hasConvex) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          Backend not configured. Set{" "}
          <span className="font-mono">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
          show articles.
        </div>
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-5 py-2.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white/90 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          Back to newsletter <span className="font-mono text-[12px]">→</span>
        </Link>
      </div>
    );
  }

  return <NewsletterArticleInner slug={slug} />;
}

function NewsletterArticleInner({ slug }: { slug: string }) {
  const post = useQuery(api.posts.getBySlug, { slug }) as PostDoc | null | undefined;

  if (post === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-2/3 animate-pulse rounded-xl border border-black/10 bg-white/40 dark:border-white/10 dark:bg-white/5" />
        <div className="h-6 w-1/3 animate-pulse rounded-xl border border-black/10 bg-white/40 dark:border-white/10 dark:bg-white/5" />
        <div className="h-[360px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5" />
      </div>
    );
  }

  if (post === null || post.publishedAt == null) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
          Not found.
        </div>
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white/60 px-5 py-2.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white/90 dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
        >
          Back to newsletter <span className="font-mono text-[12px]">→</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-8">
      <header className="space-y-4">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-black/75 hover:text-black dark:text-white/75 dark:hover:text-white"
        >
          <span className="font-mono">←</span> Newsletter
        </Link>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-xs text-black/60 dark:text-white/60">
          <span className="rounded-full border border-black/10 bg-black/5 px-2 py-1 font-mono text-[11px] tracking-wide text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
            {fmtDate(post.publishedAt)}
          </span>
          <span className="font-mono">/{post.slug}</span>
        </div>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          {post.excerpt}
        </p>
      </header>

      <div className="rounded-3xl border border-black/10 bg-white/55 p-7 dark:border-white/10 dark:bg-white/5 sm:p-10">
        <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-display prose-headings:tracking-tight prose-p:leading-7 prose-a:font-semibold prose-a:underline prose-a:decoration-2 prose-a:underline-offset-4 prose-a:decoration-[color:var(--danube)] prose-code:rounded prose-code:bg-black/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] dark:prose-code:bg-white/10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            components={{
              a: ({ href, children, ...props }) => {
                const url = href ?? "";
                const external = /^https?:\/\//.test(url);
                if (url.startsWith("/")) {
                  return (
                    <Link href={url} {...props}>
                      {children}
                    </Link>
                  );
                }
                return (
                  <a
                    href={url}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noreferrer noopener" : undefined}
                    {...props}
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {post.body}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
