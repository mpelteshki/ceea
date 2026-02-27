import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { FadeIn } from "@/components/ui/fade-in";
import type { Post } from "@/lib/posts";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { fmtLongDate } from "@/lib/format-date";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";

async function resolvePost(slug: string): Promise<Post | null> {
  if (!hasConvex) return null;
  const convex = getConvexServerClient();
  if (!convex) return null;

  const row = await convex.query(api.posts.getBySlug, { slug });
  if (!row || row.publishedAt == null) return null;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    publishedAt: row.publishedAt,
  };
}

export async function NewsletterArticle({ slug }: { slug: string }) {
  const post = await resolvePost(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/newsletter/${post.slug}`);
  const publishedAtIso = new Date(post.publishedAt).toISOString();
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
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

      {/* Hero Header */}
      <div className="relative overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 bg-[var(--background)]" />
        {/* Glow Effects */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--brand-tan)]/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
          <FadeIn duration={0.7} delay={0.1}>
            <Link
              href="/newsletter"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-10 sm:mb-14"
            >
              &larr; Back to Dispatch
            </Link>

            <h1 className="text-balance font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
              {post.title}
            </h1>
          </FadeIn>

          <FadeIn delay={0.25} direction="up" distance={20}>
            <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/50 pt-8">
              <span className="inline-flex items-center rounded-full bg-[var(--accents-1)] px-3 py-1 font-mono text-[0.75rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {fmtLongDate(post.publishedAt)}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                CEEA Dispatch
              </span>
            </div>

            {post.excerpt && (
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-[1.25rem]">
                {post.excerpt}
              </p>
            )}
          </FadeIn>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative bg-[var(--background)]">
        {/* Subtle bottom glow */}
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--brand-teal)]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-20">
          <FadeIn delay={0.4} direction="up" distance={20}>
            <div className="rounded-3xl border border-border/60 bg-white/40 dark:bg-black/20 p-6 sm:p-12 md:p-16 backdrop-blur-md shadow-sm">
              <div className="prose prose-lg md:prose-xl max-w-none text-left prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:text-[1.125rem] md:prose-p:text-[1.25rem] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:pl-6 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:text-muted-foreground prose-strong:text-[var(--foreground)] prose-li:text-muted-foreground prose-li:text-[1.125rem] md:prose-li:text-[1.25rem]">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSanitize]}
                  components={{
                    a: ({ node, href, children, ...props }) => {
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
                    img: ({ node, ...props }) => {
                      const caption = props.title || (props.alt && props.alt !== "Image" ? props.alt : "");
                      return (
                        <span className="my-8 block overflow-hidden rounded-2xl border border-border/60 shadow-lg bg-[var(--accents-1)]/30 backdrop-blur-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            {...props}
                            alt={props.alt || "Article image"}
                            className="w-full h-auto object-cover max-h-[70vh] m-0"
                            loading="lazy"
                            decoding="async"
                          />
                          {caption && (
                            <span className="block border-t border-border/50 bg-[var(--background)]/80 px-4 py-3 text-center text-sm font-medium text-[var(--muted-foreground)]">
                              {caption}
                            </span>
                          )}
                        </span>
                      );
                    },
                  }}
                >
                  {post.body}
                </ReactMarkdown>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </>
  );
}
