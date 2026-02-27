"use client";

import { ScrollScale } from "@/components/ui/scroll-animations";
import { FadeIn } from "@/components/ui/fade-in";
import { ProjectCard } from "@/components/site/project-card";
import type { Doc } from "../../../convex/_generated/dataModel";

type ProjectDoc = Doc<"projects">;

export function ProjectsAnimated({ projects }: { projects: ProjectDoc[] }) {
  return (
    <FadeIn delay={0.1} direction="up" distance={40} blur>
      <div className="grid gap-6 sm:grid-cols-2">
        {projects.map((project, idx) => (
          <ScrollScale key={project._id} from={0.95} to={1}>
            <ProjectCard
              project={project}
              index={idx}
              featured={idx === 0 && projects.length > 1}
            />
          </ScrollScale>
        ))}
      </div>
    </FadeIn>
  );
}
