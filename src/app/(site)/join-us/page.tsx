import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";
import { cycleBrandGradientVars } from "@/lib/gradient-title";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION = "We are always looking for new members to join our team. Connect with us to learn more about recruitment.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/join-us",
  title: "Join Us",
  description: toMetaDescription(DESCRIPTION),
});

const HERO_GRADIENT = cycleBrandGradientVars(0);

export default function JoinUsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accents-2)]" />

      <div className="ui-site-container relative">
        <div className="grid min-h-[101dvh] content-center py-10 pt-24 sm:py-14 sm:pt-32 md:py-16 md:pt-36">
          <div className="space-y-10 sm:space-y-12 md:space-y-14">
            <FadeInStagger>
              <FadeIn>
                <h1 className="mx-auto max-w-6xl text-center sm:mx-0 sm:text-left">
                  <span className="block font-display text-[clamp(3.2rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.045em] text-[var(--foreground)]">
                    Join Our
                  </span>
                  <span className="mt-2 block font-display text-[clamp(3.2rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.045em] text-gradient-context" style={HERO_GRADIENT}>
                    Community
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.15}>
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:mx-0 md:flex-row md:items-end md:justify-between md:gap-10 mt-10 sm:mt-12 md:mt-14">
                  <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--accents-5)] sm:text-lg md:mx-0 md:flex-1 md:text-[1.22rem] md:leading-relaxed">
                    {DESCRIPTION}
                  </p>
                  <div className="flex shrink-0 flex-wrap justify-center gap-4 md:justify-end">
                    <Link href="/contacts" className="ui-btn group">
                      Get in touch
                      <ArrowRight className="ui-icon-shift h-4 w-4" />
                    </Link>
                    <Link href="/events" className="ui-btn" data-variant="secondary">
                      See upcoming events
                    </Link>
                  </div>
                </div>
              </FadeIn>
            </FadeInStagger>
          </div>
        </div>
      </div>
    </div>
  );
}
