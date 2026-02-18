import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ExpandableText } from "@/components/ui/expandable-text";
import { toPlainText } from "@/lib/plain-text";

type ProjectLike = {
  _id: string;
  title: string | Record<string, unknown>;
  description: string | Record<string, unknown>;
  imageUrl?: string | null;
  link?: string | null;
};

/**
 * Reusable alternating-layout project card.
 * Used on both /projects and /divisions/[slug].
 */
export function ProjectCard({
  project,
  index,
}: {
  project: ProjectLike;
  index: number;
}) {
  const isReversed = index % 2 === 1;
  const title = toPlainText(project.title);
  const description = toPlainText(project.description);

  return (
    <article
      className="group grid items-center gap-8 rounded-2xl p-2 lg:grid-cols-2 lg:gap-16"
    >
      <div
        className={`relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--accents-2)] ${isReversed ? "lg:order-last" : ""}`}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : null}
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-center gap-3 lg:justify-start">
          <span className="font-mono text-xs tabular-nums text-[var(--accents-4)]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-px flex-1 bg-[var(--accents-2)]" />
        </div>
        <h2 className="font-display text-3xl leading-[1.1] text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
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
  );
}
