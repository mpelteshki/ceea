import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[var(--background)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_0%_40%,rgba(25,101,107,0.08),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_100%_0%,rgba(196,154,108,0.06),transparent_60%)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accents-2)]" />

      <div className="ui-site-container relative">
        <div className="pt-16 sm:pt-24 md:pt-32 pb-20 sm:pb-28 md:pb-36 space-y-16 md:space-y-20">
          <FadeIn>
            <h1 className="max-w-5xl">
              <span className="block font-display text-[clamp(2.8rem,7.5vw,7.5rem)] leading-[0.92] tracking-[-0.04em] text-[var(--foreground)]">
                {t("titleLine1")}
              </span>
              <span className="block font-display text-[clamp(2.8rem,7.5vw,7.5rem)] leading-[0.92] tracking-[-0.04em] text-gradient mt-2">
                {t("titleLine2")}
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <p className="max-w-xl text-lg sm:text-xl leading-relaxed text-[var(--accents-5)]">
                {t("description")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/join-us" className="ui-btn group">
                  {t("joinBtn")}
                  <ArrowRight className="ui-icon-shift h-4 w-4" />
                </Link>
                <Link href="/events" className="ui-btn" data-variant="secondary">
                  {t("eventsBtn")}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
