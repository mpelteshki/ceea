import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export async function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient — subtle teal wash for depth */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,color-mix(in_oklch,var(--brand-teal)_8%,transparent),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="ui-site-container relative">
        <div className="flex flex-col items-center pt-32 pb-24 text-center sm:pt-40 sm:pb-32">
          {/* Heading */}
          <FadeIn duration={0.7} delay={0.1} direction="up" distance={20}>
            <div className="flex flex-col items-center gap-6">

              <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance text-foreground sm:leading-[1.02] sm:tracking-[-0.04em] max-w-5xl mx-auto">
                Central &amp; Eastern European
                <span className="block text-[var(--color-teal)] pb-2">
                  Association
                </span>
              </h1>
            </div>
          </FadeIn>

          {/* Body + CTA */}
          <FadeIn delay={0.2} direction="up" distance={20}>
            <div className="mt-8 flex flex-col items-center gap-8">
              <p className="max-w-2xl text-lg tracking-[-0.01em] leading-relaxed text-muted-foreground sm:text-xl sm:leading-loose">
                From the heart of Europe to the heart of Bocconi. We are a community dedicated to fostering connections, sharing culture, and building the future together.
              </p>
              <div className="flex flex-col sm:flex-row shrink-0 flex-wrap justify-center gap-4 w-full sm:w-auto">
                <Link href="/join-us" className="ui-btn group">
                  Join the Community
                  <ArrowRight className="ui-icon-shift h-4 w-4" />
                </Link>
                <Link href="/events" className="ui-btn bg-background/50 backdrop-blur-md border-border" data-variant="secondary">
                  Explore Events
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
