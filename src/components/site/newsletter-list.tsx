import { getLocale, getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { getLocalized } from "@/lib/localization";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/ui/fade-in";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(ms));
}

export async function NewsletterList() {
  const t = await getTranslations("NewsletterList");

  if (!hasConvex) {
    return (
      <div className="ui-card p-6 text-sm text-muted-foreground bg-card border-border">
        Backend not configured. Set <span className="font-mono text-foreground">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to show newsletter posts.
      </div>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title={t("noPostsYet")} className="bg-card border-border" />;
  }

  const locale = await getLocale();
  const posts = (await convex.query(api.posts.listPublished, { limit: 30 })) as PostDoc[];

  if (posts.length === 0) {
    return <EmptyState title={t("noPostsYet")} className="bg-card border-border" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, idx) => {
        const localized = getLocalized(post, locale, ["title", "excerpt"] as const);
        const title = String(localized.title ?? "");
        const excerpt = String(localized.excerpt ?? "");
        const isFeatured = idx === 0;

        return (
          <FadeIn key={post._id} delay={Math.min(idx * 0.04, 0.2)}>
            <Link
              href={`/newsletter/${post.slug}`}
              className={`group block ui-card ui-hover-lift overflow-hidden bg-card transition-colors hover:border-ring ${isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div className="h-1 bg-gradient-to-r from-primary to-brand-caramel" />

              <div className={`p-6 ${isFeatured ? "sm:p-8" : ""}`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="ui-tag text-muted-foreground border-border">
                    {post.publishedAt ? fmtDate(post.publishedAt, locale) : t("draft")}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{t("dispatch")}</span>
                </div>

                <h3
                  className={`font-display leading-snug text-foreground group-hover:text-primary transition-colors duration-200 ${isFeatured ? "text-2xl sm:text-3xl" : "text-lg"}`}
                >
                  {title}
                </h3>

                <div className="my-4 ui-divider max-w-[60px]" />

                <p className={`line-clamp-3 text-sm leading-7 text-muted-foreground ${isFeatured ? "max-w-2xl" : ""}`}>{excerpt}</p>

                <div className="mt-6 inline-flex items-center gap-2 text-xs font-medium text-primary">
                  <span className="group-hover:underline">{t("read")}</span>
                  <ArrowRight className="ui-icon-shift h-3 w-3" />
                </div>
              </div>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}
