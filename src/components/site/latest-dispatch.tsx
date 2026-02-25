import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/site/section-header";
import { fmtPostDate } from "@/lib/format-date";
import type { Post } from "@/lib/posts";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";

async function getRecentPosts(limit: number): Promise<Post[]> {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  const rows = (await convex.query(api.posts.listRecent, { limit })) as Array<{
    slug: string;
    title: string;
    excerpt: string;
    publishedAt?: number | null;
  }>;

  return rows
    .filter((r) => r.publishedAt != null)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      excerpt: r.excerpt,
      body: "",
      publishedAt: r.publishedAt!,
    }));
}

export async function LatestDispatch() {
  const posts = await getRecentPosts(3);

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />

      <div className="ui-site-container relative py-12 sm:py-16">
        <FadeIn>
          <SectionHeader
            title="Latest dispatches"
            accent="var(--brand-teal)"
            cta={{ label: "View all dispatches", href: "/newsletter" }}
          />
        </FadeIn>

        {posts.length === 0 ? (
          <EmptyState title="No posts yet." description="Check back later for updates." className="relative border-none bg-transparent" />
        ) : (
          <FadeInStagger>
            <div className={`grid gap-4 sm:gap-5 ${
              posts.length === 1 ? "" : posts.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
            }`}>
              {posts.map((post) => {
                const date = fmtPostDate(post.publishedAt);

                return (
                  <StaggerItem key={post.slug} className="h-full">
                    <Link
                      href={`/newsletter/${post.slug}`}
                      className="group ui-card flex h-full flex-col gap-4 p-6 sm:p-8"
                    >
                      {date && (
                        <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                          {date.month} {date.year}
                        </p>
                      )}

                      <h3 className="font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-medium uppercase tracking-wide text-[var(--brand-teal)]">
                        Read
                        <ArrowRight className="ui-icon-shift h-3 w-3" />
                      </div>
                    </Link>
                  </StaggerItem>
                );
              })}
            </div>
          </FadeInStagger>
        )}
      </div>
    </section>
  );
}
