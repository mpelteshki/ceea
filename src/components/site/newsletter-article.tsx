import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { FadeIn } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format-date";

type PostDoc = Doc<"posts">;

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
      <Script id={`newsletter-article-structured-data-${post.slug}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleStructuredData)}
      </Script>
      <div className="relative border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="relative mx-auto max-w-3xl px-5 pb-12 pt-28 sm:px-6 sm:pb-16 sm:pt-32">
          <FadeIn duration={0.6}>
            <Link
              href="/newsletter"
              className="group mb-6 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3 w-3" />
              Newsletter
            </Link>
          </FadeIn>
          <FadeIn duration={0.7} delay={0.1}>
            <h1 className="text-balance font-display text-[clamp(2.25rem,5.5vw,4.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">{title}</h1>
          </FadeIn>
          <FadeIn delay={0.25} direction="up" distance={20}>
            <div className="mt-8 border-t border-[var(--border)]/50 pt-8">
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                  {fmtLongDate(post.publishedAt)}
                </span>
              </div>
              {excerpt && (
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-[1.05rem]">
                  {excerpt}
                </p>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <div className="prose prose-zinc max-w-none text-left prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-muted-foreground prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-muted-foreground prose-strong:text-[var(--foreground)]">
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
