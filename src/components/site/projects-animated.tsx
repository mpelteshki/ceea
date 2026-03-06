"use client";

import { SlideIn, ScrollScale, MagneticHover } from "@/components/ui/scroll-animations";
import { ProjectCard } from "@/components/site/project-card";
import type { Doc } from "../../../convex/_generated/dataModel";

type ProjectDoc = Doc<"projects">;

export function ProjectsAnimated({ projects }: { projects: ProjectDoc[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {projects.map((project, idx) => (
        <SlideIn
          key={project._id}
          from={idx % 2 === 0 ? "left" : "right"}
          distance={60}
          delay={Math.min(idx * 0.08, 0.3)}
          rotate={idx % 2 === 0 ? -1 : 1}
          scale={0.93}
          blur
        >
          <ScrollScale from={0.95} to={1}>
            <MagneticHover strength={0.1}>
              <ProjectCard
                project={project}
                index={idx}
                featured={idx === 0 && projects.length > 1}
              />
            </MagneticHover>
          </ScrollScale>
        </SlideIn>
      ))}
    </div>
  );
}
