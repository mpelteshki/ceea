"use client";

import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import type { Post } from "@/lib/posts";
import { fmtLongDate } from "@/lib/format-date";
import { FadeIn } from "@/components/ui/fade-in";

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
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
        <FadeIn delay={0} duration={0.6} direction="up" distance={14}>
          <time className="mb-3 block font-mono text-[0.6875rem] uppercase tracking-[0.15em] text-muted-foreground">
            {dateStr}
          </time>
        </FadeIn>
        <FadeIn delay={0.1} duration={0.7} direction="up" distance={20}>
          <h1 className="max-w-4xl text-balance font-display text-[clamp(2rem,5.5vw,4rem)] font-semibold leading-[1.06] tracking-[-0.03em] text-foreground">
            {post.title}
          </h1>
        </FadeIn>
      </div>

      {/* Body — narrower for reading comfort */}
      <FadeIn delay={0.25} duration={0.7} direction="up" distance={24} as="div" className="mx-auto mt-12 max-w-[42rem] px-5 sm:px-6">
        <MarkdownBody body={post.body} className={`${prose} text-left`} />
      </FadeIn>

      {/* Footer */}
      <FadeIn delay={0.35} duration={0.5} direction="none" as="div" className="mx-auto mt-16 max-w-[42rem] px-5 sm:px-6">
        <div className="border-t border-border pt-6">
          <BackLink />
        </div>
      </FadeIn>
    </article>
  );
}
