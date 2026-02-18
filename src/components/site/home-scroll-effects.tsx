import { cn } from "@/lib/utils";

type HomeScrollTone = "teal" | "warm" | "crimson" | "soft";

type HomeScrollSectionProps = {
  children: React.ReactNode;
  className?: string;
  /** Colour family — controls the subtle tinted background */
  tone?: HomeScrollTone;
};

/* ------------------------------------------------------------------ */
/*  Scroll section — plain semantic wrapper with tone class            */
/* ------------------------------------------------------------------ */

export function HomeScrollSection({
  children,
  className,
  tone,
}: HomeScrollSectionProps) {
  return (
    <section
      className={cn(
        "ui-home-scroll-section relative isolate",
        tone && `ui-home-scroll-section--${tone}`,
        className,
      )}
      data-tone={tone}
    >
      {children}
    </section>
  );
}
