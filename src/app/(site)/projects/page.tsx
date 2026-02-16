import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { ExpandableText } from "@/components/ui/expandable-text";
import { EmptyState } from "@/components/ui/empty-state";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { toPlainText } from "@/lib/plain-text";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

type ProjectDoc = Doc<"projects">;

export const metadata: Metadata = buildPageMetadata({
  pathname: "/projects",
  title: "Our Projects",
  description: toMetaDescription(
    "Explore CEEA Bocconi projects: student-led initiatives across culture, diplomacy, fintech, and community.",
  ),
});

export default async function ProjectsPage() {
  if (!hasConvex) {
    return (
      <div className="ui-site-container py-16">
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show projects.
        </div>
      </div>
    );
  }

  const convex = getConvexServerClient();
  const projects = convex ? ((await convex.query(api.projects.get, {})) as ProjectDoc[]) : [];

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="ui-site-container relative pb-12 pt-12 sm:pb-16 sm:pt-20">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle("Our Projects")}</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-20">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet." description="Check back later for updates." />
        ) : (
          <FadeInStagger className="space-y-20">
            {projects.map((project, idx) => {
              const isReversed = idx % 2 === 1;
              const title = toPlainText(project.title);
              const description = toPlainText(project.description);

              return (
                <FadeIn key={project._id}>
                  <article className={`ui-hover-lift-sm group grid items-center gap-8 rounded-2xl p-2 lg:grid-cols-2 lg:gap-16 ${isReversed ? "lg:[direction:rtl]" : ""}`}>
                    <div
                      className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--accents-1)] to-[var(--accents-2)] ${isReversed ? "lg:[direction:ltr]" : ""}`}
                    >
                      {project.imageUrl ? (
                        <Image
                          src={project.imageUrl}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      ) : null}
                    </div>

                    <div className={`space-y-6 ${isReversed ? "lg:[direction:ltr]" : ""}`}>
                      <div className="flex items-center justify-center gap-3 lg:justify-start">
                        <span className="font-mono text-xs tabular-nums text-[var(--accents-4)]">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="h-px flex-1 bg-[var(--accents-2)]" />
                      </div>
                      <h2 className="font-display text-3xl leading-[1.1] text-[var(--foreground)] sm:text-4xl">{title}</h2>
                      <ExpandableText
                        text={description}
                        readMoreLabel="Read more"
                        readLessLabel="Read less"
                        maxLines={4}
                      />
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-teal)] hover:underline"
                        >
                          Learn More
                          <ArrowUpRight className="ui-icon-shift h-4 w-4" />
                        </a>
                      ) : null}
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </FadeInStagger>
        )}
      </div>
    </>
  );
}
