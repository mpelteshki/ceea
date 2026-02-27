"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { TextReveal, DrawLine } from "@/components/ui/scroll-animations";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";

/**
 * Animated page header — dramatic entrance with parallax and text reveal.
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
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: header content moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);

  return (
    <div ref={ref} className={cn("relative border-b border-border overflow-hidden", className)}>
      <div className="absolute inset-0 bg-[var(--background)]" />
      <m.div
        className="ui-site-container relative pb-12 pt-16 text-left sm:pb-16 sm:pt-20"
        style={reduceMotion ? {} : { y, opacity }}
      >
        {kicker && (
          <FadeIn duration={0.6}>
            <p className="mb-6 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-gradient-context">
              {kicker}
            </p>
          </FadeIn>
        )}

        <div className="relative">
          {/* Subtle text glow behind header */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3/4 h-[120%] bg-[var(--brand-teal)]/5 blur-3xl -z-10 rounded-full hidden sm:block pointer-events-none mix-blend-screen" />

          <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-foreground drop-shadow-sm">
            <TextReveal as="span" mode="word" stagger={0.05} className="justify-start">
              {title}
            </TextReveal>
          </h1>
        </div>

        <DrawLine
          className="mt-3 max-w-[40px]"
          color="var(--brand-teal)"
          width={2}
        />

        {(subtitle || children) && (
          <FadeIn delay={0.35} direction="up" distance={25} blur>
            <div className="mt-6">
              {subtitle && (
                <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
                  {subtitle}
                </p>
              )}
              {children}
            </div>
          </FadeIn>
        )}
      </m.div>
    </div>
  );
}
