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

/* Deterministic accent palette based on slug — gives each article a unique feel */
const ACCENTS = [
  { from: "var(--brand-teal)", to: "#1a6b5a" },
  { from: "#6366f1", to: "#4338ca" },
  { from: "#f59e0b", to: "#d97706" },
  { from: "#64748b", to: "#475569" },
  { from: "#8b5cf6", to: "#6d28d9" },
  { from: "#06b6d4", to: "#0891b2" },
];

function hashSlug(slug: string) {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export async function NewsletterList() {
  const posts = await getPosts();

  if (posts.length === 0) {
    return <EmptyState title="No newsletter posts yet." description="Check back later for updates." className="border-border bg-card" />;
  }

  return (
    <div className="flex flex-col gap-5">
      {posts.map((post, idx) => {
        const accent = ACCENTS[hashSlug(post.slug) % ACCENTS.length];

        return (
          <FadeIn key={post.slug} delay={Math.min(idx * 0.06, 0.24)}>
            <Link
              href={`/newsletter/${post.slug}`}
              className="group flex flex-col sm:flex-row ui-card overflow-hidden bg-card"
            >
              {/* Decorative cover image area */}
              <div
                className="relative shrink-0 h-48 sm:h-auto sm:w-56 lg:w-72 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                }}
              >
                {/* Abstract pattern overlay */}
                <div className="absolute inset-0 opacity-[0.12]">
                  <svg
                    viewBox="0 0 200 200"
                    className="h-full w-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <circle cx="160" cy="40" r="80" fill="white" />
                    <circle cx="40" cy="160" r="60" fill="white" />
                    <rect x="80" y="80" width="100" height="100" rx="12" fill="white" opacity="0.5" />
                  </svg>
                </div>
                {/* Icon / motif */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    viewBox="0 0 48 48"
                    className="h-12 w-12 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="6" y="10" width="36" height="28" rx="3" />
                    <path d="M6 18h36" />
                    <path d="M14 26h12" />
                    <path d="M14 32h8" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6 sm:p-7 lg:p-8">
                <div className="mb-3 flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded bg-[var(--accents-1)] px-2.5 py-1 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: accent.from }}
                    />
                    {fmtShortDate(post.publishedAt)}
                  </span>
                </div>

                <h3 className="font-display text-xl leading-snug tracking-tight text-foreground lg:text-2xl">
                  {post.title}
                </h3>

                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-auto pt-5 inline-flex items-center gap-2 text-xs font-medium text-primary">
                  Read article
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          </FadeIn>
        );
      })}
    </div>
  );
}
