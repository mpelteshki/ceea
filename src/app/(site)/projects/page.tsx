import type { Metadata } from "next";

import { FadeIn } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/site/page-header";
import { ProjectCard } from "@/components/site/project-card";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
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
      <div className="ui-site-container pt-10 pb-16">
        <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show projects.
        </div>
      </div>
    );
  }

  const convex = getConvexServerClient();
  const projects = convex ? ((await convex.query(api.projects.get, {})) as ProjectDoc[]) : [];

  return (
    <>
      <PageHeader title="Our Projects" />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet." description="Check back later for updates." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {projects.map((project, idx) => (
              <FadeIn key={project._id} delay={Math.min(idx * 0.05, 0.2)}>
                <ProjectCard project={project} index={idx} featured={idx === 0 && projects.length > 1} />
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
