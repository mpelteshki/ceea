import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { ExpandableText } from "@/components/ui/expandable-text";
import { EmptyState } from "@/components/ui/empty-state";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { renderGradientTitle } from "@/lib/gradient-title";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";

type ProjectDoc = Doc<"projects">;

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = await getTranslations("ProjectsPage");

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
        <div className="ui-site-container relative pt-12 sm:pt-20 pb-12 sm:pb-16">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-20">
        {projects.length === 0 ? (
          <EmptyState title={t("noProjects")} description={t("checkBackLater")} />
        ) : (
          <FadeInStagger className="space-y-20">
            {projects.map((project, idx) => {
              const isReversed = idx % 2 === 1;
              const title = project.title[locale as "en" | "it"] ?? project.title.en;
              const description = project.description[locale as "en" | "it"] ?? project.description.en;

              return (
                <FadeIn key={project._id}>
                  <article className={`ui-hover-lift-sm group rounded-2xl p-2 grid gap-8 lg:gap-16 lg:grid-cols-2 items-center ${isReversed ? "lg:[direction:rtl]" : ""}`}>
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
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[var(--accents-4)] tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                        <span className="h-px flex-1 bg-[var(--accents-2)]" />
                      </div>
                      <h2 className="font-display text-3xl sm:text-4xl text-[var(--foreground)] leading-[1.1]">{title}</h2>
                      <ExpandableText
                        text={description}
                        readMoreLabel={t("readMore")}
                        readLessLabel={t("readLess")}
                        maxLines={4}
                      />
                      {project.link ? (
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--brand-teal)] hover:underline"
                        >
                          {t("learnMore")}
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
