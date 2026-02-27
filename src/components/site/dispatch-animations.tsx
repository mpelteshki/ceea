"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SlideIn, ScrollScale } from "@/components/ui/scroll-animations";
import { SectionHeader } from "@/components/site/section-header";
import { EmptyState } from "@/components/ui/empty-state";

type PostData = {
  slug: string;
  title: string;
  excerpt: string;
  date: { month: string; year: number } | null;
};

export function DispatchAnimations({ posts }: { posts: PostData[] }) {
  return (
    <>
      <SlideIn from="left" distance={60} blur>
        <SectionHeader
          title="Latest dispatches"
          accent="var(--brand-teal)"
          cta={{ label: "View all dispatches", href: "/newsletter" }}
        />
      </SlideIn>

      {posts.length === 0 ? (
        <EmptyState
          title="No posts yet."
          description="Check back later for updates."
          className="relative border-none bg-transparent"
        />
      ) : (
        <div
          className={`grid gap-4 sm:gap-5 ${posts.length === 1
            ? ""
            : posts.length === 2
              ? "sm:grid-cols-2"
              : "sm:grid-cols-3"
            }`}
        >
          {posts.map((post, idx) => (
            <SlideIn
              key={post.slug}
              from="bottom"
              distance={60}
              delay={idx * 0.12}
              scale={0.93}
              blur
            >
              <ScrollScale from={0.94} to={1}>
                <Link
                  href={`/newsletter/${post.slug}`}
                  className="group ui-card flex h-full flex-col gap-4 p-6 sm:p-8"
                >
                  {post.date && (
                    <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                      {post.date.month} {post.date.year}
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
              </ScrollScale>
            </SlideIn>
          ))}
        </div>
      )}
    </>
  );
}
