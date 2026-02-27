"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type HomeScrollTone = "teal" | "warm" | "crimson" | "soft";

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
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax: content floats 40px slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section
      ref={ref}
      className={cn(
        "ui-home-scroll-section relative isolate overflow-hidden",
        tone && `ui-home-scroll-section--${tone}`,
        className,
      )}
      data-tone={tone}
    >
      <m.div
        style={reduceMotion ? {} : { y }}
      >
        {children}
      </m.div>
    </section>
  );
}
