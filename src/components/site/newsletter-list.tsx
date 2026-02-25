import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/ui/fade-in";
import { fmtShortDate } from "@/lib/format-date";
import type { Post } from "@/lib/posts";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";

async function getPosts(): Promise<Post[]> {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  const rows = (await convex.query(api.posts.listPublished, {})) as Array<{
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

export async function NewsletterList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <EmptyState title="No newsletter posts yet." description="Check back later for updates." className="border-border bg-card" />;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, idx) => {
        const isFeatured = idx === 0;

        return (
          <FadeIn key={post.slug} delay={Math.min(idx * 0.04, 0.2)}>
            <Link
              href={`/newsletter/${post.slug}`}
              className={`group flex flex-col ui-card overflow-hidden bg-card sm:text-left ${isFeatured ? (posts.length === 1 ? "sm:col-span-2 lg:col-span-3" : "sm:col-span-2 lg:col-span-2") : ""}`}
            >
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex items-center justify-center gap-3 sm:justify-start">
                  <span className="ui-tag border-border text-muted-foreground">
                    {fmtShortDate(post.publishedAt)}
                  </span>
                </div>

                <h3 className="font-display text-lg leading-snug text-foreground">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>

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
