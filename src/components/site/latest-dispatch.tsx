import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { getLocalized } from "@/lib/localization";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { renderGradientTitle } from "@/lib/gradient-title";

type PostDoc = Doc<"posts">;

type DispatchLabels = {
  draft: string;
  featured: string;
  readPost: string;
};

function fmtDate(ms: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(ms));
}

export async function LatestDispatch() {
  const t = await getTranslations("LatestDispatch");
  const sectionTitle = t("title");

  if (!hasConvex) {
    return (
      <section className="space-y-12">
        <div className="ui-title-stack">
          <h2 className="ui-section-title mt-4">{renderGradientTitle(sectionTitle)}</h2>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show posts.
        </div>
      </section>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title={t("noPostsYet")} className="bg-card border-border py-20" />;
  }

  const locale = await getLocale();
  const posts = (await convex.query(api.posts.listPublished, { limit: 3 })) as PostDoc[];

  return (
    <section className="space-y-12">
      <FadeIn>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="ui-title-stack">
            <h2 className="ui-section-title mt-4">{renderGradientTitle(sectionTitle)}</h2>
          </div>
          <Link href="/newsletter" className="ui-btn shrink-0" data-variant="secondary">
            {t("viewAll")}
            <ArrowRight className="ui-icon-shift h-4 w-4" />
          </Link>
        </div>
      </FadeIn>

      <FadeInStagger>
        {posts.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <FadeIn>
              <FeaturedPost
                post={posts[0]}
                locale={locale}
                labels={{ draft: t("draft"), featured: t("featured"), readPost: t("readPost") }}
              />
            </FadeIn>

            <div className="grid gap-5">
              {posts.slice(1).map((post) => (
                <FadeIn key={post._id}>
                  <CompactPost post={post} locale={locale} labels={{ draft: t("draft"), featured: t("featured"), readPost: t("readPost") }} />
                </FadeIn>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title={t("noPostsYet")} className="bg-card border-border py-20" />
        )}
      </FadeInStagger>
    </section>
  );
}

function FeaturedPost({
  post,
  locale,
  labels,
}: {
  post: PostDoc;
  locale: string;
  labels: DispatchLabels;
}) {
  const localized = getLocalized(post, locale, ["title", "excerpt"] as const);
  const title = String(localized.title ?? "");
  const excerpt = String(localized.excerpt ?? "");

  return (
    <Link
      href={`/newsletter/${post.slug}`}
      className="ui-hover-lift group flex flex-col justify-between rounded-2xl border border-[var(--accents-2)] p-8 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:text-left"
    >
      <div>
        <div className="mb-6 flex items-center justify-center gap-4 sm:justify-start">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
            {post.publishedAt ? fmtDate(post.publishedAt, locale) : labels.draft}
          </span>
          <span className="h-px flex-1 bg-[var(--accents-2)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">{labels.featured}</span>
        </div>
        <h3 className="font-display text-3xl sm:text-4xl text-[var(--foreground)] leading-[1.1] group-hover:text-[var(--brand-teal)] transition-colors">
          {title}
        </h3>
        <p className="mt-6 text-[var(--accents-5)] leading-relaxed line-clamp-4">{excerpt}</p>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-teal)]">
        <span className="group-hover:underline">{labels.readPost}</span>
        <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function CompactPost({
  post,
  locale,
  labels,
}: {
  post: PostDoc;
  locale: string;
  labels: DispatchLabels;
}) {
  const localized = getLocalized(post, locale, ["title", "excerpt"] as const);
  const title = String(localized.title ?? "");
  const excerpt = String(localized.excerpt ?? "");

  return (
    <Link
      href={`/newsletter/${post.slug}`}
      className="ui-hover-lift-sm group flex items-start gap-6 rounded-2xl border border-[var(--accents-2)] p-6 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:text-left"
    >
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
          {post.publishedAt ? fmtDate(post.publishedAt, locale) : labels.draft}
        </span>
        <h3 className="mt-2 font-display text-lg text-[var(--foreground)] leading-snug group-hover:text-[var(--brand-teal)] transition-colors line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-sm text-[var(--accents-5)] line-clamp-2 leading-relaxed hidden sm:block">{excerpt}</p>
      </div>
      <div className="h-8 w-8 rounded-full border border-[var(--accents-2)] flex items-center justify-center text-[var(--accents-4)] group-hover:bg-[var(--brand-teal)] group-hover:border-transparent group-hover:text-white transition-colors shrink-0 mt-4">
        <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
