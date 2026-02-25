import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { toPlainText } from "@/lib/plain-text";
import { cn } from "@/lib/utils";

type ProjectLike = {
  _id: string;
  title: string | Record<string, unknown>;
  description: string | Record<string, unknown>;
  imageUrl?: string | null;
  link?: string | null;
};

/**
 * Card-style project card used on /projects and /divisions/[slug].
 */
export function ProjectCard({
  project,
  index,
  featured = false,
}: {
  project: ProjectLike;
  index: number;
  /** Spanning 2 columns on sm grid */
  featured?: boolean;
}) {
  const title = toPlainText(project.title);
  const description = toPlainText(project.description);

  return (
    <article
      className={cn(
        "group flex flex-col ui-card overflow-hidden bg-card",
        featured && "sm:col-span-2 lg:col-span-2",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative w-full overflow-hidden bg-[var(--accents-2)]",
          featured ? "aspect-[21/9]" : "aspect-[16/9]",
        )}
      >
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes={featured ? "(max-width: 640px) 100vw, 80vw" : "(max-width: 640px) 100vw, 50vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-6xl text-[var(--brand-teal)] opacity-10">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="ui-tag border-border text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <h2
          className={cn(
            "font-display leading-snug text-foreground",
            featured ? "text-2xl sm:text-3xl" : "text-xl",
          )}
        >
          {title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {project.link ? (
          <div className="mt-auto pt-5">
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-teal)] transition-opacity hover:opacity-75"
            >
              Learn More
              <ArrowUpRight className="ui-icon-shift h-3 w-3" />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
