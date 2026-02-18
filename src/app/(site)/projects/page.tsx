import type { Metadata } from "next";

import { FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
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
      <PageHeader title="Our Projects" />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        {projects.length === 0 ? (
          <EmptyState title="No projects yet." description="Check back later for updates." />
        ) : (
          <FadeInStagger className="space-y-20">
            {projects.map((project, idx) => (
              <StaggerItem key={project._id}>
                <ProjectCard project={project} index={idx} />
              </StaggerItem>
            ))}
          </FadeInStagger>
        )}
      </div>
    </>
  );
}
