"use client";

import {
  m,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useInView,
} from "framer-motion";
import {
  useRef,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/* ================================================================== */
/*  1. ScrollProgress — thin progress bar pinned to the top            */
/* ================================================================== */

export function ScrollProgress({
  className,
  color = "var(--brand-teal)",
  height = 3,
}: {
  className?: string;
  color?: string;
  height?: number;
}) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const reduceMotion = useReducedMotion();

  if (reduceMotion) return null;

  return (
    <m.div
      className={cn("fixed inset-x-0 top-0 z-[100] origin-left", className)}
      style={{
        scaleX,
        height,
        background: color,
      }}
    />
  );
}

/* ================================================================== */
/*  2. ParallaxLayer — element with parallax scroll offset             */
/* ================================================================== */

export function ParallaxLayer({
  children,
  className,
  speed = 0.3,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  /** Parallax intensity: 0 = static, 1 = full scroll speed, negative = reverse */
  speed?: number;
  direction?: "up" | "down";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const reduceMotion = useReducedMotion();

  const range = direction === "up" ? [100 * speed, -100 * speed] : [-100 * speed, 100 * speed];
  const y = useTransform(scrollYProgress, [0, 1], range);
  const smoothY = useSpring(y, { stiffness: 120, damping: 30 });

  return (
    <m.div
      ref={ref}
      className={className}
      style={reduceMotion ? {} : { y: smoothY }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  3. TextReveal — words/chars appear one at a time on scroll         */
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
  as?: "p" | "h1" | "h2" | "h3" | "span" | "div";
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Component = (m as any)[Tag] as typeof m.p;

  return (
    <Component ref={ref} className={cn("flex flex-wrap", className)}>
      {items.map((item, i) => (
        <m.span
          key={`${item}-${i}`}
          initial={reduceMotion ? {} : { opacity: 0, y: 20, ...(blur ? { filter: "blur(4px)" } : {}) }}
          animate={
            isInView
              ? { opacity: 1, y: 0, ...(blur ? { filter: "blur(0px)" } : {}) }
              : reduceMotion
                ? {}
                : { opacity: 0, y: 20, ...(blur ? { filter: "blur(4px)" } : {}) }
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
    </Component>
  );
}

/* ================================================================== */
/*  4. SlideIn — directional entrance with scroll trigger              */
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
      ...(blur ? { filter: "blur(8px)" } : {}),
    };

  const visible = {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    ...(blur ? { filter: "blur(0px)" } : {}),
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
/*  5. ScrollScale — element scales up as it enters the viewport       */
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });
  const reduceMotion = useReducedMotion();

  const scale = useTransform(scrollYProgress, [0, 1], [from, to]);
  const rotate = useTransform(scrollYProgress, [0, 1], [rotateFrom, rotateTo]);

  return (
    <m.div
      ref={ref}
      className={className}
      style={
        reduceMotion
          ? {}
          : { scale, rotate }
      }
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  6. HorizontalScroll — scroll-hijack horizontal section             */
/* ================================================================== */

export function HorizontalScroll({
  children,
  className,
  innerClassName,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [windowHeight, setWindowHeight] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!trackRef.current) return;
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(trackRef.current.scrollWidth - window.innerWidth);
        setWindowHeight(window.innerHeight);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [children]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);
  const smoothX = useSpring(x, { stiffness: 80, damping: 30 });

  if (reduceMotion) {
    return (
      <div className={cn("overflow-x-auto", className)}>
        <div className={cn("flex gap-6", innerClassName)}>{children}</div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative", className)}
      style={{ height: `${trackWidth + windowHeight}px` }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="flex h-full items-center">
          <m.div
            ref={trackRef}
            className={cn("flex gap-6", innerClassName)}
            style={{ x: smoothX }}
          >
            {children}
          </m.div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  7. CountUp — animated number counter on scroll                     */
/* ================================================================== */

export function CountUp({
  to,
  duration = 2,
  className,
  prefix = "",
  suffix = "",
}: {
  to: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = to;
    const stepTime = (duration * 1000) / end;
    const timer = setInterval(() => {
      start += Math.ceil(end / 60);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [isInView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

/* ================================================================== */
/*  8. DrawLine — decorative SVG line that draws itself on scroll      */
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
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.8", "start 0.4"],
  });
  const reduceMotion = useReducedMotion();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  if (reduceMotion) {
    return (
      <div
        ref={ref}
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
      ref={ref}
      className={cn(
        orientation === "horizontal" ? "w-full origin-left" : "h-full origin-top",
        className,
      )}
      style={{
        [orientation === "horizontal" ? "height" : "width"]: width,
        background: color,
        [orientation === "horizontal" ? "scaleX" : "scaleY"]: scaleX,
      }}
    />
  );
}

/* ================================================================== */
/*  9. ScrollOpacity — fade element based on scroll position           */
/* ================================================================== */

export function ScrollOpacity({
  children,
  className,
  fadeOut = false,
}: {
  children: ReactNode;
  className?: string;
  /** If true, fades out as element scrolls up. If false (default), fades in. */
  fadeOut?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: fadeOut ? ["start start", "end start"] : ["start end", "end center"],
  });
  const reduceMotion = useReducedMotion();

  const opacityFadeIn = useTransform(scrollYProgress, [0, 0.5, 1], [0, 0.8, 1]);
  const opacityFadeOut = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.5, 0]);
  const yFadeIn = useTransform(scrollYProgress, [0, 1], [30, 0]);
  const yFadeOut = useTransform(scrollYProgress, [0, 1], [0, -30]);

  const opacity = fadeOut ? opacityFadeOut : opacityFadeIn;
  const y = fadeOut ? yFadeOut : yFadeIn;

  return (
    <m.div
      ref={ref}
      className={className}
      style={reduceMotion ? {} : { opacity, y }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  10. MagneticHover — element subtly follows cursor on hover         */
/* ================================================================== */

export function MagneticHover({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const reduceMotion = useReducedMotion();

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setPosition({
      x: (e.clientX - centerX) * strength,
      y: (e.clientY - centerY) * strength,
    });
  };

  const handleLeave = () => setPosition({ x: 0, y: 0 });

  return (
    <m.div
      ref={ref}
      className={className}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      animate={position}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  11. StaggerReveal — container that reveals children with stagger   */
/*      and alternating directions                                     */
/* ================================================================== */

export function StaggerReveal({
  children,
  className,
  staggerDelay = 0.1,
  alternateDirection = false,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  /** Alternate children sliding from left/right */
  alternateDirection?: boolean;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduceMotion ? 0 : staggerDelay,
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

export function StaggerRevealItem({
  children,
  className,
  index = 0,
  alternateDirection = false,
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  alternateDirection?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const fromLeft = alternateDirection ? index % 2 === 0 : true;

  return (
    <m.div
      className={className}
      variants={{
        hidden: reduceMotion
          ? { opacity: 1 }
          : {
            opacity: 0,
            x: fromLeft ? -60 : 60,
            scale: 0.95,
            filter: "blur(4px)",
          },
        visible: {
          opacity: 1,
          x: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}

/* ================================================================== */
/*  12. ScrollRevealMask — clip-path reveal on scroll                  */
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
