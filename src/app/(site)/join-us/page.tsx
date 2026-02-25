import type { Metadata } from "next";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";
import { ArrowRight } from "lucide-react";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION = "We are always looking for new members to join our team. Connect with us to learn more about recruitment.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/join-us",
  title: "Join Us",
  description: toMetaDescription(DESCRIPTION),
});

export default function JoinUsPage() {
  return (
    <div className="ui-site-container">
      <div className="flex flex-col items-center pt-28 pb-16 text-center sm:items-start sm:pt-32 sm:pb-24 sm:text-left">
        <FadeIn duration={0.7}>
          <h1 className="font-display text-[clamp(2.2rem,7vw,7rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance text-foreground">
            Join CEEA
          </h1>
        </FadeIn>

        <FadeIn delay={0.1} duration={0.5}>
          <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-[var(--brand-teal)] sm:mx-0" />
        </FadeIn>

        <FadeIn delay={0.2} direction="up" distance={20}>
          <div className="mt-8 flex max-w-2xl flex-col items-center gap-8 sm:items-start">
            <p className="text-base leading-relaxed text-[var(--muted-foreground)] sm:text-[1.05rem]">
              {DESCRIPTION}
            </p>
            <div className="flex shrink-0 flex-wrap justify-center gap-3 sm:justify-start">
              <Link href="/contacts" className="ui-btn group">
                Get in touch
                <ArrowRight className="ui-icon-shift h-4 w-4" />
              </Link>
              <Link href="/events" className="ui-btn" data-variant="secondary">
                See events
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
