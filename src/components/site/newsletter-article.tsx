"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
          Backend not configured. Set{" "}
          <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to
          show articles.
        </div>
        <Link
          href="/newsletter"
          className="ui-btn"
        >
          Back to newsletter <span className="text-[13px]">→</span>
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
      <div className="space-y-8">
        <div className="h-6 w-24 animate-pulse bg-[var(--accents-2)] rounded" />
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse bg-[var(--accents-2)] rounded" />
          <div className="h-12 w-3/4 animate-pulse bg-[var(--accents-2)] rounded" />
        </div>
        <div className="ui-rule-strong pt-8">
          <div className="h-[360px] animate-pulse bg-[var(--accents-1)] rounded" />
        </div>
      </div>
    );
  }

  if (post === null || post.publishedAt == null) {
    return (
      <div className="space-y-6">
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
          Not found.
        </div>
        <Link
          href="/newsletter"
          className="ui-btn"
        >
          Back to newsletter <span className="text-[13px]">→</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="space-y-12">
      <header className="space-y-8">
        <Link
          href="/newsletter"
          className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--accents-5)] transition-colors hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          <span>Back</span>
        </Link>

        <div className="space-y-4">
          <div className="ui-kicker">
            {fmtDate(post.publishedAt)}
          </div>
          <h1 className="text-balance font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
            {post.title}
          </h1>
          <div className="font-mono text-xs uppercase tracking-widest text-[var(--accents-4)]">
            /{post.slug}
          </div>
        </div>
        <p className="max-w-2xl text-balance text-lg leading-8 text-[var(--accents-5)]">
          {post.excerpt}
        </p>
      </header>

      <div className="border-t border-[var(--accents-2)] pt-10">
        <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-7 prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--accents-3)] prose-a:underline-offset-2 hover:prose-a:decoration-[var(--foreground)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none">
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
