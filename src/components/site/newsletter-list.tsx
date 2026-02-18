import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/ui/fade-in";
import { fmtShortDate } from "@/lib/format-date";

type PostDoc = Doc<"posts">;

export async function NewsletterList() {
  if (!hasConvex) {
    return (
      <div className="ui-card border-border bg-card p-6 text-sm text-muted-foreground">
        Backend not configured. Set <span className="font-mono text-foreground">NEXT_PUBLIC_CONVEX_URL</span> in Vercel to show newsletter posts.
      </div>
    );
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return <EmptyState title="No newsletter posts yet." description="Check back later for updates." className="border-border bg-card" />;
  }

  const posts = (await convex.query(api.posts.listPublished, { limit: 30 })) as PostDoc[];

  if (posts.length === 0) {
    return <EmptyState title="No newsletter posts yet." description="Check back later for updates." className="border-border bg-card" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, idx) => {
        const title = String(post.title || "");
        const excerpt = String(post.excerpt || "");
        const isFeatured = idx === 0;

        return (
          <FadeIn key={post._id} delay={Math.min(idx * 0.04, 0.2)}>
            <Link
              href={`/newsletter/${post.slug}`}
              className={`group flex flex-col ui-card overflow-hidden bg-card text-center transition-colors hover:bg-[var(--accents-1)] sm:text-left ${isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}`}
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-center gap-3 sm:justify-start">
                  <span className="ui-tag border-border text-muted-foreground">
                    {post.publishedAt ? fmtShortDate(post.publishedAt) : "Draft"}
                  </span>
                </div>

                <h3 className="font-display text-lg leading-snug text-foreground">
                  {title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{excerpt}</p>

                <div className="mt-auto pt-6 inline-flex items-center gap-2 text-xs font-medium text-primary">
                  Read
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
