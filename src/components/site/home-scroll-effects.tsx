"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

type HomeScrollTone = "teal" | "warm" | "crimson" | "soft";

type HomeScrollSectionProps = {
  children: React.ReactNode;
  className?: string;
  tone?: HomeScrollTone;
  depth?: number;
};

export function HomeScrollProgress() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.24,
  });

  if (reduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60]">
      <motion.div
        className="h-[2px] origin-left bg-[var(--brand-teal)]"
        style={{ scaleX }}
      />
    </div>
  );
}

export function HomeScrollSection({
  children,
  className,
}: HomeScrollSectionProps) {
  return (
    <motion.div className={cn("relative isolate", className)}>
      <div className="relative">
        {children}
      </div>
    </motion.div>
  );
}
