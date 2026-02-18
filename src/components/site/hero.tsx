import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export async function Hero() {
  return (
    <section className="relative">
      <div className="ui-site-container">
        <div className="flex flex-col items-center pt-28 pb-16 text-center sm:items-start sm:pt-32 sm:pb-20 sm:text-left">
          {/* Heading */}
          <FadeIn duration={0.7}>
            <h1 className="font-display text-[clamp(2rem,5.5vw,4.5rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-balance text-[var(--foreground)] sm:leading-[1.05] sm:tracking-[-0.03em] sm:text-pretty">
              Central &amp; Eastern European
              <br className="hidden sm:block" />
              Association
            </h1>
          </FadeIn>

          {/* Body + CTA */}
          <FadeIn delay={0.1} direction="up" distance={16}>
            <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-lg text-base leading-relaxed text-[var(--muted-foreground)]">
                A student association for those from Central and Eastern Europe
                studying at Bocconi — connecting culture, policy, and community.
              </p>
              <div className="flex shrink-0 flex-wrap justify-center gap-3 sm:justify-start">
                <Link href="/join-us" className="ui-btn group">
                  Join Us
                  <ArrowRight className="ui-icon-shift h-4 w-4" />
                </Link>
                <Link href="/events" className="ui-btn" data-variant="secondary">
                  Events
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
