import { cn } from "@/lib/utils";

type HomeScrollTone = "teal" | "warm" | "crimson" | "soft" | "blue" | "pink" | "red";

type HomeScrollSectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Colour family — controls the subtle tinted background */
  tone?: HomeScrollTone;
};

/* ------------------------------------------------------------------ */
/*  Scroll section — CSS-only fade at section edges (no JS overhead)   */
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
      <div className="ui-home-scroll-content">
        {children}
      </div>
    </section>
  );
}
