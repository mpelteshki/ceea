import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { ProjectCard } from "@/components/site/project-card";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import { divisions } from "@/lib/divisions-data";

type ProjectDoc = Doc<"projects">;

const divisionBySlug = Object.fromEntries(
  divisions.map((d) => [d.slug, d])
);

export function generateStaticParams() {
  return divisions.map((d) => ({ slug: d.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const division = divisionBySlug[slug];
  if (!division) return {};

  return buildPageMetadata({
    pathname: `/divisions/${slug}`,
    title: division.name,
    description: toMetaDescription(division.description),
  });
}

export default async function DivisionPage({ params }: PageProps) {
  const { slug } = await params;
  const division = divisionBySlug[slug];
  if (!division) notFound();

  let projects: ProjectDoc[] = [];

  if (hasConvex) {
    const convex = getConvexServerClient();
    projects = convex ? ((await convex.query(api.projects.get, {})) as ProjectDoc[]) : [];
  }

  return (
    <>
      {/* Hero header */}
      <div className="relative border-b border-[var(--border)]">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn duration={0.6}>
            <Link
              href="/#divisions"
              className="mb-6 inline-flex items-center gap-1.5 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-[var(--muted-foreground)] transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft className="h-3 w-3" />
              All divisions
            </Link>
          </FadeIn>
          <FadeIn duration={0.7} delay={0.1}>
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  color: division.accent,
                  background: `color-mix(in oklch, ${division.accent} 10%, var(--background))`,
                }}
              >
                <division.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[var(--foreground)]">{division.name}</h1>
            </div>
          </FadeIn>
          <FadeIn delay={0.25} direction="up" distance={20}>
            <div className="mt-8 border-t border-[var(--border)] pt-8">
              <p className="max-w-2xl text-base leading-relaxed text-[var(--muted-foreground)] sm:text-[1.05rem]">
                {division.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Projects */}
      <div className="ui-site-container py-8 sm:py-16">
        {projects.length === 0 ? (
          <EmptyState
            title="No projects yet."
            description={`Check back later for ${division.name.toLowerCase()} projects and initiatives.`}
          />
        ) : (
          <FadeInStagger className="space-y-20">
            {projects.map((project, idx) => (
              <FadeIn key={project._id}>
                <ProjectCard project={project} index={idx} />
              </FadeIn>
            ))}
          </FadeInStagger>
        )}
      </div>
    </>
  );
}
