import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn } from "@/components/ui/fade-in";
import { fmtShortDate } from "@/lib/format-date";
import { getAllPosts } from "@/lib/posts";

export async function NewsletterList() {
  const posts = getAllPosts();

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
              className={`group flex flex-col ui-card overflow-hidden bg-card text-center transition-colors hover:bg-[var(--accents-1)] sm:text-left ${isFeatured ? "sm:col-span-2 lg:col-span-2" : ""}`}
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
