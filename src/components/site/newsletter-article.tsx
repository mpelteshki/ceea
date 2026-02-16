import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(ms));
}

export async function NewsletterArticle({ slug }: { slug: string }) {
  if (!hasConvex) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-center sm:px-6">
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Backend not configured.
        </div>
      </div>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-5 py-16 text-center sm:px-6">
        <p className="text-sm text-[var(--accents-5)]">Not found.</p>
        <Link href="/newsletter" className="ui-btn">
          Back to newsletter
        </Link>
      </div>
    );
  }

  const post = (await convex.query(api.posts.getBySlug, { slug })) as PostDoc | null;

  if (!post || post.publishedAt == null) {
    notFound();
  }

  const title = String(post.title || "");
  const excerpt = String(post.excerpt || "");
  const body = String(post.body || "");
  const articleUrl = absoluteUrl(`/newsletter/${post.slug}`);
  const publishedAtIso = new Date(post.publishedAt).toISOString();
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    datePublished: publishedAtIso,
    dateModified: publishedAtIso,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL.origin,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL.origin}/favicon.ico`,
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }} />
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_4%,var(--background))]" />
        <div className="relative mx-auto max-w-3xl space-y-8 px-5 pb-12 pt-8 text-center sm:px-6 sm:pb-16 sm:pt-16 sm:text-left">
          <Link
            href="/newsletter"
            className="group ui-link py-1 text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back
          </Link>

          <div className="space-y-5">
            <div className="flex items-center justify-center gap-4 sm:justify-start">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
                {fmtDate(post.publishedAt)}
              </span>
              <span className="h-px flex-1 bg-[var(--accents-2)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accents-4)]">/{post.slug}</span>
            </div>
            <h1 className="text-balance font-display text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight text-[var(--foreground)]">{title}</h1>
            <p className="mx-auto max-w-2xl text-balance text-base leading-relaxed text-[var(--accents-5)] sm:mx-0 sm:text-lg">
              {excerpt}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="prose prose-zinc max-w-none text-left dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-8 prose-p:text-[var(--accents-5)] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-[var(--accents-5)] prose-strong:text-[var(--foreground)] first:prose-p:first-letter:font-display first:prose-p:first-letter:text-5xl first:prose-p:first-letter:float-left first:prose-p:first-letter:mr-3 first:prose-p:first-letter:mt-1 first:prose-p:first-letter:text-[var(--brand-teal)]">
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
      </div>
    </>
  );
}
