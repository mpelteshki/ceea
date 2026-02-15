"use client";

import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { useTranslations } from "next-intl";

function Pillar({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div>
      <div className="mb-2 font-mono text-xs text-[var(--accents-4)]">
        {number}
      </div>
      <div className="font-display text-lg font-semibold text-[var(--foreground)]">
        {title}
      </div>
      <p className="mt-2 text-sm leading-6 text-[var(--accents-5)]">
        {desc}
      </p>
    </div>
  );
}

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
        <FadeInStagger className="space-y-8">

          <FadeIn>
            <h1 className="font-display text-5xl font-bold tracking-tighter text-[var(--foreground)] sm:text-7xl lg:text-8xl">
              {t("titleLine1")}
              <span className="block text-gradient mt-2">
                {t("titleLine2")}
              </span>
            </h1>
          </FadeIn>

          <FadeIn>
            <p className="max-w-xl text-lg leading-8 text-[var(--accents-5)]">
              {t("description")}
            </p>
          </FadeIn>

          <FadeIn>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/events" className="ui-btn group">
                {t("eventsBtn")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/contact" className="ui-btn" data-variant="secondary">
                {t("sponsorBtn")}
              </Link>
            </div>
          </FadeIn>
        </FadeInStagger>

        <FadeInStagger className="hidden lg:block">
          <div className="border-l border-[var(--accents-2)] pl-12 pt-4 h-full">
            <FadeIn>
              <h2 className="mb-8 ui-kicker">
                {t("pillarsTitle")}
              </h2>
            </FadeIn>
            <div className="space-y-10">
              <FadeIn>
                <Pillar
                  number="01"
                  title={t("pillar1Title")}
                  desc={t("pillar1Desc")}
                />
              </FadeIn>
              <FadeIn>
                <Pillar
                  number="02"
                  title={t("pillar2Title")}
                  desc={t("pillar2Desc")}
                />
              </FadeIn>
              <FadeIn>
                <Pillar
                  number="03"
                  title={t("pillar3Title")}
                  desc={t("pillar3Desc")}
                />
              </FadeIn>
            </div>
          </div>
        </FadeInStagger>
      </div>

      {/* Mobile Pillars */}
      <FadeIn delay={0.3} className="mt-20 lg:hidden">
        <h2 className="mb-8 ui-kicker">
          {t("pillarsTitle")}
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <Pillar
            number="01"
            title={t("pillar1Title")}
            desc={t("pillar1Desc")}
          />
          <Pillar
            number="02"
            title={t("pillar2Title")}
            desc={t("pillar2Desc")}
          />
          <Pillar
            number="03"
            title={t("pillar3Title")}
            desc={t("pillar3Desc")}
          />
        </div>
      </FadeIn>
    </section>
  );
}
