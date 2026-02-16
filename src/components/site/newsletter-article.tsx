import { getLocale, getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

import { Link } from "@/i18n/routing";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { getLocalized } from "@/lib/localization";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(ms));
}

export async function NewsletterArticle({ slug }: { slug: string }) {
  const t = await getTranslations("NewsletterArticle");

  if (!hasConvex) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-16 space-y-6">
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Backend not configured.
        </div>
      </div>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-16 space-y-6 text-center">
        <p className="text-sm text-[var(--accents-5)]">{t("notFound")}</p>
        <Link href="/newsletter" className="ui-btn">
          {t("backToNewsletter")}
        </Link>
      </div>
    );
  }

  const locale = await getLocale();
  const post = (await convex.query(api.posts.getBySlug, { slug })) as PostDoc | null;

  if (!post || post.publishedAt == null) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-16 space-y-6 text-center">
        <p className="text-sm text-[var(--accents-5)]">{t("notFound")}</p>
        <Link href="/newsletter" className="ui-btn">
          {t("backToNewsletter")}
        </Link>
      </div>
    );
  }

  const localized = getLocalized(post, locale, ["title", "excerpt", "body"] as const);
  const title = String(localized.title ?? "");
  const excerpt = String(localized.excerpt ?? "");
  const body = String(localized.body ?? "");

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_4%,var(--background))]" />
        <div className="relative mx-auto max-w-3xl px-5 sm:px-6 pt-8 sm:pt-16 pb-12 sm:pb-16 space-y-8">
          <Link
            href="/newsletter"
            className="group ui-link py-1 text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            {t("back")}
          </Link>

          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
                {fmtDate(post.publishedAt, locale)}
              </span>
              <span className="h-px flex-1 bg-[var(--accents-2)]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--accents-4)]">/{post.slug}</span>
            </div>
            <h1 className="text-balance font-display text-[clamp(2rem,5vw,4rem)] tracking-tight text-[var(--foreground)] leading-[1.05]">{title}</h1>
            <p className="max-w-2xl text-balance text-lg leading-relaxed text-[var(--accents-5)]">{excerpt}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 sm:px-6 py-12 sm:py-16">
        <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-8 prose-p:text-[var(--accents-5)] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:text-[var(--accents-5)] prose-strong:text-[var(--foreground)] first:prose-p:first-letter:font-display first:prose-p:first-letter:text-5xl first:prose-p:first-letter:float-left first:prose-p:first-letter:mr-3 first:prose-p:first-letter:mt-1 first:prose-p:first-letter:text-[var(--brand-teal)]">
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
