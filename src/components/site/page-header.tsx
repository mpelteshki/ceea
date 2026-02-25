"use client";

import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

/**
 * Animated page header — consistent entrance for all sub-pages.
 * Renders a full-width band with a fade-in title + optional subtitle.
 */
export function PageHeader({
  title,
  subtitle,
  kicker,
  className,
  children,
}: {
  title: string;
  subtitle?: string;
  /** Optional mono eyebrow above the title, like the home hero */
  kicker?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn("relative border-b border-border", className)}>
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="ui-site-container relative pb-12 pt-16 text-center sm:pb-16 sm:pt-20 sm:text-left">
        {kicker && (
          <FadeIn duration={0.6}>
            <p className="mb-6 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {kicker}
            </p>
          </FadeIn>
        )}
        <FadeIn duration={0.7} delay={kicker ? 0.1 : 0}>
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-foreground">{title}</h1>
          <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-[var(--brand-teal)] sm:mx-0" />
        </FadeIn>
        {(subtitle || children) && (
          <FadeIn delay={0.25} direction="up" distance={20}>
            <div className="mt-6">
              {subtitle && (
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:mx-0 sm:text-[1.05rem]">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </FadeIn>
        )}
      </div>
    </div>
  );
}
