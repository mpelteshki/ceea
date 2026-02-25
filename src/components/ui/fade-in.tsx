"use client";

import { m, useReducedMotion } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Direction → initial offset map                                     */
/* ------------------------------------------------------------------ */

type Direction = "up" | "down" | "left" | "right" | "none";

function directionOffset(direction: Direction, distance: number) {
  switch (direction) {
    case "up":
      return { x: 0, y: distance };
    case "down":
      return { x: 0, y: -distance };
    case "left":
      return { x: distance, y: 0 };
    case "right":
      return { x: -distance, y: 0 };
    case "none":
      return { x: 0, y: 0 };
  }
}

/* ------------------------------------------------------------------ */
/*  FadeIn                                                             */
/* ------------------------------------------------------------------ */

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.55,
  once = true,
  amount = 0.2,
  direction = "up",
  distance,
  blur = false,
  scale,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
  /** Slide-in direction ("none" for opacity-only) */
  direction?: Direction;
  /** Slide distance in px (defaults to 18 for "up", 24 otherwise) */
  distance?: number;
  /** Start with a CSS blur that clears on reveal */
  blur?: boolean;
  /** Start scaled (e.g. 0.95) and animate to 1 */
  scale?: number;
  /** Rendered HTML element */
  as?: "div" | "section" | "article" | "li" | "span" | "p" | "h1" | "h2" | "h3";
}) {
  const reduceMotion = useReducedMotion();

  const dist = distance ?? (direction === "up" ? 18 : 24);
  const offset = directionOffset(direction, dist);

  const initial = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 0,
        ...offset,
        ...(blur ? { filter: "blur(6px)" } : {}),
        ...(scale != null ? { scale } : {}),
      };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    ...(blur ? { filter: "blur(0px)" } : {}),
    ...(scale != null ? { scale: 1 } : {}),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (m as any)[Tag] as typeof m.div;

  return (
    <Component
      className={className}
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
    </Component>
  );
}

/* ------------------------------------------------------------------ */
/*  FadeInStagger                                                      */
/* ------------------------------------------------------------------ */

export function FadeInStagger({
  children,
  className,
  faster = false,
  once = true,
  amount = 0.15,
}: {
  children: React.ReactNode;
  className?: string;
  faster?: boolean;
  once?: boolean;
  amount?: number;
}) {
  const reduceMotion = useReducedMotion();
  const stagger = reduceMotion ? 0 : faster ? 0.06 : 0.1;

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </m.div>
  );
}

/* ------------------------------------------------------------------ */
/*  StaggerItem — child that responds to parent stagger                */
/* ------------------------------------------------------------------ */

export function StaggerItem({
  children,
  className,
  direction = "up",
  distance = 20,
  blur = false,
  scale,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  distance?: number;
  blur?: boolean;
  scale?: number;
  as?: "div" | "li" | "article" | "section";
}) {
  const reduceMotion = useReducedMotion();
  const offset = directionOffset(direction, distance);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (m as any)[Tag] as typeof m.div;

  return (
    <Component
      className={className}
      variants={{
        hidden: reduceMotion
          ? { opacity: 1 }
          : {
              opacity: 0,
              ...offset,
              ...(blur ? { filter: "blur(6px)" } : {}),
              ...(scale != null ? { scale } : {}),
            },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          ...(blur ? { filter: "blur(0px)" } : {}),
          ...(scale != null ? { scale: 1 } : {}),
          transition: {
            duration: reduceMotion ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </Component>
  );
}
