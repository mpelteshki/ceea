"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TextReveal, ParallaxLayer } from "@/components/ui/scroll-animations";
import { FadeIn } from "@/components/ui/fade-in";
import { SITE_APPLY_FORM_URL } from "@/lib/site-contact";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient gradient — dynamic premium mesh */}
      <div className="absolute inset-0 -z-10 bg-[var(--background)]">
        <ParallaxLayer speed={0.15} className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] max-w-6xl max-h-[800px] opacity-60 dark:opacity-40"
            style={{
              background: "radial-gradient(circle at center, color-mix(in oklch, var(--brand-teal) 15%, transparent) 0%, transparent 60%)",
              filter: "blur(60px)"
            }} />
        </ParallaxLayer>
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--background)] to-transparent" />
      </div>

      <div className="ui-site-container relative">
        <div className="flex flex-col items-center pt-32 pb-24 text-center sm:pt-40 sm:pb-32">
          {/* Heading — word-by-word text reveal with glow */}
          <div className="flex flex-col items-center gap-6 relative">
            {/* Ambient subtle glow behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-[var(--brand-teal)]/10 blur-3xl -z-10 rounded-full mix-blend-screen" />

            <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[1.05] tracking-[-0.03em] text-balance text-foreground sm:leading-[1.02] sm:tracking-[-0.04em] max-w-5xl mx-auto drop-shadow-sm">
              <TextReveal
                as="span"
                className="justify-center"
                mode="word"
                stagger={0.06}
              >
                Central &amp; Eastern European
              </TextReveal>
              <span className="block text-gradient pb-2 relative">
                <TextReveal
                  as="span"
                  className="justify-center"
                  mode="char"
                  stagger={0.04}
                  blur={false}
                >
                  Association
                </TextReveal>
              </span>
            </h1>
          </div>

          {/* Body + CTA */}
          <FadeIn delay={0.5} direction="up" distance={30} blur>
            <div className="mt-8 flex flex-col items-center gap-8">
              <p className="max-w-2xl text-lg tracking-[-0.01em] leading-relaxed text-muted-foreground sm:text-xl sm:leading-loose">
                From the heart of Europe to the heart of Bocconi. We are a community dedicated to fostering connections, sharing culture, and building the future together.
              </p>
              <div className="flex flex-col sm:flex-row shrink-0 flex-wrap justify-center gap-4 w-full sm:w-auto">
                <a href={SITE_APPLY_FORM_URL} className="ui-btn group" target="_blank" rel="noopener noreferrer">
                  Join the Community
                  <ArrowRight className="ui-icon-shift h-4 w-4" />
                </a>
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
