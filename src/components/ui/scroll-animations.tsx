"use client";

import { m, useReducedMotion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TextRevealTag = "p" | "h1" | "h2" | "h3" | "span" | "div";

const textRevealMotionTags: Record<TextRevealTag, React.ElementType> = {
  p: m.p,
  h1: m.h1,
  h2: m.h2,
  h3: m.h3,
  span: m.span,
  div: m.div,
};

/* ================================================================== */
/*  1. TextReveal — words/chars appear one at a time on scroll         */
/* ================================================================== */

export function TextReveal({
  children,
  className,
  as: Tag = "p",
  mode = "word",
  stagger = 0.03,
  blur = true,
}: {
  children: string;
  className?: string;
  as?: TextRevealTag;
  /** Split text by word or character */
  mode?: "word" | "char";
  /** Delay between each item (seconds) */
  stagger?: number;
  /** Whether to apply a blur effect */
  blur?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const reduceMotion = useReducedMotion();
  const items = mode === "word" ? children.split(" ") : children.split("");
  void blur;

  const Component = textRevealMotionTags[Tag];

  return (
    <Component ref={ref}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className={cn("flex flex-wrap", className)}>
        {items.map((item, i) => (
          <m.span
            key={`${item}-${i}`}
            initial={reduceMotion ? {} : { opacity: 0, y: 20 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : reduceMotion
                  ? {}
                  : { opacity: 0, y: 20 }
            }
            transition={{
              duration: 0.5,
              delay: i * stagger,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
            style={{ marginRight: mode === "word" ? "0.3em" : undefined }}
          >
            {item}
          </m.span>
        ))}
      </span>
    </Component>
  );
}

/* ================================================================== */
/*  2. SlideIn — directional entrance with scroll trigger              */
/* ================================================================== */

export function SlideIn({
  children,
  className,
  from = "left",
  distance = 80,
  duration = 0.7,
  delay = 0,
  rotate = 0,
  scale = 1,
  once = true,
  blur = false,
}: {
  children: ReactNode;
  className?: string;
  from?: "left" | "right" | "top" | "bottom";
  distance?: number;
  duration?: number;
  delay?: number;
  /** Initial rotation in degrees */
  rotate?: number;
  /** Initial scale */
  scale?: number;
  once?: boolean;
  blur?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  void blur;

  const offsets = {
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
    top: { x: 0, y: -distance },
    bottom: { x: 0, y: distance },
  };

  const initial = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 0,
        ...offsets[from],
        rotate,
        scale,
      };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
  };

  return (
    <m.div
      className={className}
      initial={initial}
      whileInView={visible}
      viewport={{ once, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: reduceMotion ? 0 : duration,
        delay: reduceMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  3. ScrollScale — element scales up as it enters the viewport       */
/* ================================================================== */

export function ScrollScale({
  children,
  className,
  from = 0.85,
  to = 1,
  rotateFrom = 0,
  rotateTo = 0,
}: {
  children: ReactNode;
  className?: string;
  from?: number;
  to?: number;
  rotateFrom?: number;
  rotateTo?: number;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial={
        reduceMotion
          ? { opacity: 1, scale: 1, rotate: rotateTo }
          : { opacity: 0, scale: from, rotate: rotateFrom }
      }
      whileInView={{ opacity: 1, scale: to, rotate: rotateTo }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: reduceMotion ? 0 : 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  4. DrawLine — decorative SVG line that draws itself on scroll      */
/* ================================================================== */

export function DrawLine({
  className,
  color = "var(--brand-teal)",
  width = 2,
  orientation = "horizontal",
}: {
  className?: string;
  color?: string;
  width?: number;
  orientation?: "horizontal" | "vertical";
}) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={cn(
          orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
          className,
        )}
        style={{ background: color }}
      />
    );
  }

  return (
    <m.div
      className={cn(
        orientation === "horizontal" ? "w-full origin-left" : "h-full origin-top",
        className,
      )}
      initial={orientation === "horizontal" ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={orientation === "horizontal" ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true, margin: "0px 0px -60px 0px" }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        [orientation === "horizontal" ? "height" : "width"]: width,
        background: color,
      }}
    />
  );
}

/* ================================================================== */
/*  5. ScrollRevealMask — clip-path reveal on scroll                  */
/* ================================================================== */

export function ScrollRevealMask({
  children,
  className,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const reduceMotion = useReducedMotion();

  const clipPaths: Record<string, { hidden: string; visible: string }> = {
    up: {
      hidden: "inset(100% 0 0 0)",
      visible: "inset(0 0 0 0)",
    },
    down: {
      hidden: "inset(0 0 100% 0)",
      visible: "inset(0 0 0 0)",
    },
    left: {
      hidden: "inset(0 100% 0 0)",
      visible: "inset(0 0 0 0)",
    },
    right: {
      hidden: "inset(0 0 0 100%)",
      visible: "inset(0 0 0 0)",
    },
  };

  return (
    <m.div
      ref={ref}
      className={className}
      initial={reduceMotion ? {} : { clipPath: clipPaths[direction].hidden }}
      animate={
        isInView
          ? { clipPath: clipPaths[direction].visible }
          : reduceMotion
            ? {}
            : { clipPath: clipPaths[direction].hidden }
      }
      transition={{
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </m.div>
  );
}
