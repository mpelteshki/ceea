"use client";

import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.55,
  once = true,
  amount = 0.2,
  y = 18,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  y?: number;
}) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y };
  const visible = { opacity: 1, y: 0 };

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={initial}
      whileInView={visible}
      viewport={{ once, amount }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInStagger({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  faster?: boolean;
}) {
  return <div className={className}>{children}</div>;
}
