
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { FadeIn } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { cycleBrandGradientVars, renderGradientTitle } from "@/lib/gradient-title";
import { cn } from "@/lib/utils";

type PostDoc = Doc<"posts">;

const DISPATCH_TITLE_GRADIENT = cycleBrandGradientVars(3);

function fmtDate(ms: number) {
    const d = new Date(ms);
    return {
        full: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(d),
        day: d.getDate().toString().padStart(2, "0"),
        month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d).toUpperCase(),
        year: d.getFullYear(),
    };
}

export async function LatestDispatch() {
    const sectionTitle = "Latest newsletter posts";

    if (!hasConvex) {
        return (
            <section className="space-y-12">
                <div className="ui-title-stack">
                    <h2 className="mt-4 ui-section-title">{renderGradientTitle(sectionTitle, {
                        highlightClassName: "text-gradient-context",
                        highlightStyle: DISPATCH_TITLE_GRADIENT,
                    })}</h2>
                </div>
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
        <section className="relative overflow-hidden border-b border-[var(--accents-2)]">
            <div className="absolute inset-0 bg-[var(--background)]" />

            <div className="ui-site-container relative py-24 sm:py-32">
                <FadeIn>
                    <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-24">
                        <div className="ui-title-stack">
                            <h2 className="ui-section-title">{renderGradientTitle(sectionTitle, {
                                highlightClassName: "text-gradient-context",
                                highlightStyle: DISPATCH_TITLE_GRADIENT,
                            })}</h2>
                        </div>
                        <div className="flex flex-col gap-2 sm:items-end">
                            <Link href="/newsletter" className="ui-btn shrink-0" data-variant="secondary">
                                View all posts
                                <ArrowRight className="ui-icon-shift h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </FadeIn>

                {posts.length === 0 ? (
                    <EmptyState title="No posts yet." description="Check back later for updates." className="relative border-none bg-transparent" />
                ) : (
                    <div className="flex flex-col gap-24 sm:gap-32">
                        {posts.map((post, i) => {
                            const title = String(post.title || "");
                            const excerpt = String(post.excerpt || "");
                            const date = post.publishedAt ? fmtDate(post.publishedAt) : null;

                            // Newsletter brand color
                            const accent = "var(--brand-blue)";

                            return (
                                <FadeIn key={post._id}>
                                    <div
                                        className={cn(
                                            "flex flex-col gap-12 lg:items-center lg:gap-24",
                                            i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                                        )}
                                    >
                                        {/* Visual Side: Date/Meta Card */}
                                        <div className="flex-1 relative group">
                                            <Link href={`/newsletter/${post.slug}`} className="block">
                                                <div
                                                    className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[var(--accents-2)] bg-[var(--background)] p-8 relative shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1"
                                                >
                                                    {/* Decorative grid */}
                                                    <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

                                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                                                        <span className="font-mono text-sm tracking-widest text-[var(--accents-5)] uppercase">
                                                            Dispatch
                                                        </span>
                                                        {date && (
                                                            <>
                                                                <span className="font-display text-8xl leading-none tracking-tighter text-[var(--foreground)]" style={{ color: accent }}>
                                                                    {date.day}
                                                                </span>
                                                                <span className="font-mono text-xl tracking-widest text-[var(--accents-5)] uppercase">
                                                                    {date.month} {date.year}
                                                                </span>
                                                            </>
                                                        )}
                                                        {!date && (
                                                            <span className="font-mono text-xl tracking-widest text-[var(--accents-5)] uppercase">
                                                                DRAFT
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* Content Side */}
                                        <div className="flex-1">
                                            <div className="flex flex-col gap-6">
                                                <div className="flex items-center gap-3 text-sm text-[var(--accents-5)]">
                                                    <div className="h-px w-8 bg-[var(--accents-3)]" />
                                                    <span className="uppercase tracking-widest text-xs font-mono">Editorial</span>
                                                </div>

                                                <h3 className="font-display text-4xl text-[var(--foreground)] sm:text-5xl lg:text-6xl leading-[1.1]">
                                                    <Link href={`/newsletter/${post.slug}`} className="hover:text-[var(--accents-6)] transition-colors">
                                                        {title}
                                                    </Link>
                                                </h3>

                                                <p className="text-lg leading-relaxed text-[var(--accents-5)] line-clamp-3">
                                                    {excerpt}
                                                </p>

                                                <div className="pt-4">
                                                    <Link
                                                        href={`/newsletter/${post.slug}`}
                                                        className="inline-flex items-center gap-2 font-medium text-lg transition-colors hover:gap-3"
                                                        style={{ color: accent }}
                                                    >
                                                        Read article
                                                        <ArrowRight className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </FadeIn>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
