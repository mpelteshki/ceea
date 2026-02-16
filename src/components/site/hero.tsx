import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export async function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_88%_54%_at_2%_42%,rgba(25,101,107,0.12),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_62%_at_100%_0%,rgba(196,154,108,0.1),transparent_62%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(25,101,107,0.02)_68%,transparent_100%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accents-2)]" />

      <div className="ui-site-container relative">
        <div className="grid min-h-[calc(100dvh-4.15rem)] content-center py-10 sm:py-14 md:py-16">
          <div className="space-y-10 sm:space-y-12 md:space-y-14">
            <FadeIn>
              <h1 className="mx-auto max-w-6xl text-center sm:mx-0 sm:text-left">
                <span className="block font-display text-[clamp(3.2rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.045em] text-[var(--foreground)]">
                  Central &amp; Eastern European
                </span>
                <span className="mt-2 block font-display text-[clamp(3.2rem,8.8vw,8.8rem)] leading-[0.88] tracking-[-0.045em] text-gradient">
                  Association
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 md:mx-0 md:flex-row md:items-end md:justify-between md:gap-10">
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-[var(--accents-5)] sm:text-lg md:mx-0 md:flex-1 md:text-[1.22rem] md:leading-relaxed">
                  A central hub for Eastern European students. Where Western European funding meets Eastern European minds
                </p>
                <div className="flex shrink-0 flex-wrap justify-center gap-4 md:justify-end">
                  <Link href="/join-us" className="ui-btn group">
                    Join Us
                    <ArrowRight className="ui-icon-shift h-4 w-4" />
                  </Link>
                  <Link href="/events" className="ui-btn" data-variant="secondary">
                    Upcoming events
                  </Link>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
