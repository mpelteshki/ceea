"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Post } from "@/lib/posts";
import { fmtLongDate } from "@/lib/format-date";

/* ------------------------------------------------------------------ */
/* Shared                                                              */
/* ------------------------------------------------------------------ */

function MarkdownBody({ body, className }: { body: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          a: ({ href, children, ...props }) => {
            const url = href ?? "";
            const external = /^https?:\/\//.test(url);
            if (url.startsWith("/")) {
              return <Link href={url} {...props}>{children}</Link>;
            }
            return (
              <a href={url} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined} {...props}>
                {children}
              </a>
            );
          },
        }}
      >
        {body}
      </ReactMarkdown>
    </div>
  );
}

const prose = "prose max-w-none prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-[1.75] prose-p:text-muted-foreground prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-teal)]/40 prose-a:underline-offset-[3px] hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-muted-foreground prose-strong:text-[var(--foreground)] prose-li:text-muted-foreground";

function BackLink() {
  return (
    <Link
      href="/newsletter"
      className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:-translate-x-0.5">
        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      All articles
    </Link>
  );
}

/* ================================================================== */
/*  FOLIO LAYOUT                                                        */
/* ================================================================== */

export function ArticleWithDesignSwitcher({ post }: { post: Post }) {
  const dateStr = fmtLongDate(post.publishedAt);

  return (
    <article className="pb-24">
      {/* Wide title area */}
      <div className="mx-auto max-w-5xl px-5 pt-28 sm:px-8 sm:pt-36">
        <h1 className="max-w-4xl text-balance font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground">
          {post.title}
        </h1>
      </div>

      {/* Meta bar */}
      <div className="mx-auto mt-8 max-w-5xl px-5 sm:px-8">
        <div className="flex flex-col gap-5 border-y border-border py-6 sm:flex-row sm:items-center sm:gap-8">
          <span className="inline-flex shrink-0 items-center gap-2 rounded bg-[var(--brand-teal)]/8 px-3 py-1.5 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-[var(--brand-teal)]">
            <span className="h-1 w-1 rounded-full bg-[var(--brand-teal)]" />
            {dateStr}
          </span>
          {post.excerpt && (
            <p className="text-[0.9375rem] leading-relaxed text-muted-foreground sm:border-l sm:border-border sm:pl-8">
              {post.excerpt}
            </p>
          )}
        </div>
      </div>

      {/* Body — narrower for reading comfort */}
      <div className="mx-auto mt-12 max-w-[42rem] px-5 sm:px-6">
        <MarkdownBody body={post.body} className={`${prose} text-left`} />
      </div>

      {/* Footer */}
      <div className="mx-auto mt-16 max-w-[42rem] px-5 sm:px-6">
        <div className="border-t border-border pt-6">
          <BackLink />
        </div>
      </div>
    </article>
  );
}
