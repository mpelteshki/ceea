
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { SectionHeader } from "@/components/site/section-header";
import { fmtPostDate } from "@/lib/format-date";

type PostDoc = Doc<"posts">;

export async function LatestDispatch() {
    if (!hasConvex) {
        return (
            <section className="space-y-12">
                <SectionHeader
                    title="Latest dispatches"
                    accent="var(--brand-teal-soft)"
                />
                <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
                    Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show posts.
                </div>
            </section>
        );
    }

    const convex = getConvexServerClient();
    if (!convex) {
        return <EmptyState title="No posts yet." description="Check back later for updates." className="border-border bg-card py-20" />;
    }

    const posts = (await convex.query(api.posts.listPublished, { limit: 3 })) as PostDoc[];

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
                        <div className="grid gap-px bg-[var(--border)] overflow-hidden rounded-xl border border-[var(--border)] sm:grid-cols-3">
                            {posts.map((post) => {
                                const title = String(post.title || "");
                                const excerpt = String(post.excerpt || "");
                                const date = post.publishedAt ? fmtPostDate(post.publishedAt) : null;

                                return (
                                    <StaggerItem key={post._id} className="h-full">
                                    <Link
                                        href={`/newsletter/${post.slug}`}
                                        className="group flex h-full flex-col gap-4 bg-[var(--background)] p-6 transition-colors duration-200 hover:bg-[var(--accents-1)] sm:p-8"
                                    >
                                        {/* Date */}
                                        {date && (
                                            <p className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                                                {date.month} {date.year}
                                            </p>
                                        )}

                                        {/* Title */}
                                        <h3 className="font-display text-lg font-semibold leading-snug text-[var(--foreground)] sm:text-xl">
                                            {title}
                                        </h3>

                                        {/* Excerpt */}
                                        {excerpt && (
                                            <p className="line-clamp-3 text-sm leading-relaxed text-[var(--muted-foreground)]">
                                                {excerpt}
                                            </p>
                                        )}

                                        {/* Footer */}
                                        <div className="mt-auto flex items-center gap-1.5 pt-2 text-xs font-medium uppercase tracking-wide text-[var(--brand-teal)] transition-colors duration-200">
                                            Read
                                            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
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
