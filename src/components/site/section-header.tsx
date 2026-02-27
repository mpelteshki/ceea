import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

type SectionHeaderProps = {
  /** Small mono eyebrow text above the title */
  kicker?: string;
  /** Main heading — can include JSX for emphasis */
  title: ReactNode;
  /** Optional supporting copy below the title */
  subtitle?: string;
  /** Accent colour applied to the kicker dot */
  accent?: string;
  /** Optional CTA link on the right */
  cta?: { label: string; href: string };
  className?: string;
};

export function SectionHeader({
  kicker,
  title,
  subtitle,
  accent = "var(--brand-teal)",
  cta,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("mb-8 sm:mb-10", className)}>
      {/* Row: heading + CTA side by side */}
      <div className="flex items-center justify-between text-center sm:text-left">
        <div className="flex-1">
          {kicker && (
            <div
              className="ui-section-kicker"
              style={{ "--section-kicker-accent": accent } as CSSProperties}
            >
              {kicker}
            </div>
          )}

          <h2 className={cn("ui-section-heading", kicker ? "mt-5 sm:mt-6" : "mt-0")}>
            {title}
          </h2>
        </div>

        {/* CTA — hidden on mobile, shown inline on desktop */}
        {cta && (
          <Link
            href={cta.href}
            className="group ui-section-cta hidden sm:ml-8 sm:inline-flex sm:shrink-0"
          >
            {cta.label}
            <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
          </Link>
        )}
      </div>

      {/* CTA — mobile only, below heading */}
      {cta && (
        <div className="mt-4 text-center sm:hidden">
          <Link
            href={cta.href}
            className="ui-section-cta inline-flex"
          >
            {cta.label}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      {subtitle && (
        <div
          className="mx-auto mt-3 h-0.5 w-10 rounded-full sm:mx-0"
          style={{ background: accent }}
        />
      )}

      {subtitle && (
        <p className="mt-4 max-w-2xl text-center text-base leading-relaxed text-muted-foreground sm:text-left sm:text-lg sm:leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
