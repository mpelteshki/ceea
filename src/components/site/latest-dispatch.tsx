import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/site/section-header";
import { fmtPostDate } from "@/lib/format-date";
import type { Post } from "@/lib/posts";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import { DispatchAnimations } from "@/components/site/dispatch-animations";

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

  // Serialize date info for client component
  const postData = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: fmtPostDate(post.publishedAt),
  }));

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />

      <div className="ui-site-container relative py-12 sm:py-16">
        <DispatchAnimations posts={postData} />
      </div>
    </section>
  );
}
