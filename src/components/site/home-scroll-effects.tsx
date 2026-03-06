"use client";

import { cn } from "@/lib/utils";

type HomeScrollTone = "blue" | "green" | "red" | "pink";

type HomeScrollSectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Colour family — controls the subtle tinted background */
  tone?: HomeScrollTone;
};

/* ------------------------------------------------------------------ */
/*  Scroll section — parallax wrapper with scroll-linked transforms     */
/* ------------------------------------------------------------------ */

export function HomeScrollSection({
  children,
  className,
  tone,
}: HomeScrollSectionProps) {
  return (
    <section
      className={cn(
        "ui-home-scroll-section relative isolate overflow-hidden",
        tone && `ui-home-scroll-section--${tone}`,
        className,
      )}
      data-tone={tone}
    >
      {children}
    </section>
  );
}
