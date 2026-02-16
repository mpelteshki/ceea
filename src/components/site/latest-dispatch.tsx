import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { renderGradientTitle } from "@/lib/gradient-title";

type PostDoc = Doc<"posts">;

function fmtDate(ms: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(ms));
}

export async function LatestDispatch() {
  const sectionTitle = "Latest newsletter posts";

  if (!hasConvex) {
    return (
      <section className="space-y-12">
        <div className="ui-title-stack">
          <h2 className="mt-4 ui-section-title">{renderGradientTitle(sectionTitle)}</h2>
        </div>
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show posts.
        </div>
      </section>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title="No posts yet." className="border-border bg-card py-20" />;
  }

  const posts = (await convex.query(api.posts.listPublished, { limit: 3 })) as PostDoc[];

  return (
    <section className="space-y-12">
      <FadeIn>
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="ui-title-stack">
            <h2 className="mt-4 ui-section-title">{renderGradientTitle(sectionTitle)}</h2>
          </div>
          <Link href="/newsletter" className="ui-btn shrink-0" data-variant="secondary">
            View all posts
            <ArrowRight className="ui-icon-shift h-4 w-4" />
          </Link>
        </div>
      </FadeIn>

      <FadeInStagger>
        {posts.length > 0 ? (
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <FadeIn>
              <FeaturedPost post={posts[0]} />
            </FadeIn>

            <div className="grid gap-5">
              {posts.slice(1).map((post) => (
                <FadeIn key={post._id}>
                  <CompactPost post={post} />
                </FadeIn>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No posts yet." className="border-border bg-card py-20" />
        )}
      </FadeInStagger>
    </section>
  );
}

function FeaturedPost({ post }: { post: PostDoc }) {
  const title = String(post.title || "");
  const excerpt = String(post.excerpt || "");

  return (
    <Link
      href={`/newsletter/${post.slug}`}
      className="ui-hover-lift group flex flex-col justify-between rounded-2xl border border-[var(--accents-2)] p-8 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:text-left"
    >
      <div>
        <div className="mb-6 flex items-center justify-center gap-4 sm:justify-start">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
            {post.publishedAt ? fmtDate(post.publishedAt) : "Draft"}
          </span>
          <span className="h-px flex-1 bg-[var(--accents-2)]" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">Featured</span>
        </div>
        <h3 className="font-display text-3xl leading-[1.1] text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-teal)] sm:text-4xl">
          {title}
        </h3>
        <p className="mt-6 line-clamp-4 leading-relaxed text-[var(--accents-5)]">{excerpt}</p>
      </div>
      <div className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-teal)]">
        <span className="group-hover:underline">Read post</span>
        <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
      </div>
    </Link>
  );
}

function CompactPost({ post }: { post: PostDoc }) {
  const title = String(post.title || "");
  const excerpt = String(post.excerpt || "");

  return (
    <Link
      href={`/newsletter/${post.slug}`}
      className="ui-hover-lift-sm group flex items-start gap-6 rounded-2xl border border-[var(--accents-2)] p-6 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)] sm:text-left"
    >
      <div className="min-w-0 flex-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--accents-4)]">
          {post.publishedAt ? fmtDate(post.publishedAt) : "Draft"}
        </span>
        <h3 className="mt-2 line-clamp-2 font-display text-lg leading-snug text-[var(--foreground)] transition-colors group-hover:text-[var(--brand-teal)]">
          {title}
        </h3>
        <p className="mt-2 hidden line-clamp-2 text-sm leading-relaxed text-[var(--accents-5)] sm:block">{excerpt}</p>
      </div>
      <div className="mt-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--accents-2)] text-[var(--accents-4)] transition-colors group-hover:border-transparent group-hover:bg-[var(--brand-teal)] group-hover:text-white">
        <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
      </div>
    </Link>
  );
}
