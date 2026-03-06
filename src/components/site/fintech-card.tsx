import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { toPlainText } from "@/lib/plain-text";
import { cn } from "@/lib/utils";
import { getReadableAccentText } from "@/lib/accent-colors";

type FintechLike = {
  _id: string;
  title: string | Record<string, unknown>;
  description: string | Record<string, unknown>;
  imageUrl?: string | null;
  link?: string | null;
};

/**
 * Card-style fintech card used on /fintech and /divisions/[slug].
 */
export function FintechCard({
  fintech,
  index,
  featured = false,
}: {
  fintech: FintechLike;
  index: number;
  /** Spanning 2 columns on sm grid */
  featured?: boolean;
}) {
  const title = toPlainText(fintech.title);
  const description = toPlainText(fintech.description);
  const accentText = getReadableAccentText("var(--brand-teal)");

  return (
    <article
      className={cn(
        "group flex flex-col h-full ui-card overflow-hidden bg-card",
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
        {fintech.imageUrl ? (
          <Image
            src={fintech.imageUrl}
            alt={title}
            fill
            className="ui-hover-media object-cover"
            sizes={featured ? "(max-width: 640px) 100vw, 80vw" : "(max-width: 640px) 100vw, 50vw"}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-display text-4xl opacity-20" style={{ color: accentText }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-6 flex items-center gap-2">
          <span className="ui-tag border-border text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <h2
            className={cn(
              "font-display leading-snug text-foreground",
              featured ? "text-2xl sm:text-3xl font-semibold" : "text-xl font-medium",
            )}
          >
            {title}
          </h2>

          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>

        {fintech.link ? (
          <div
            className="ui-hover-cta mt-auto flex items-center gap-2 pt-6 text-sm font-medium"
            style={{ color: accentText }}
          >
            <a
              href={fintech.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group/link flex items-center gap-2"
            >
              <span>Learn More</span>
              <ArrowUpRight className="ui-icon-shift h-3.5 w-3.5" />
            </a>
          </div>
        ) : null}
      </div>
    </article>
  );
}
