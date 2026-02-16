import { getTranslations } from "next-intl/server";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import { renderGradientTitle } from "@/lib/gradient-title";

const divisionKeys = [
  { icon: Palette, key: "culture", accent: "var(--brand-caramel)" },
  { icon: Scale, key: "diplomacy", accent: "var(--brand-crimson)" },
  { icon: TrendingUp, key: "fintech", accent: "var(--brand-teal)" },
  { icon: Users, key: "social", accent: "var(--brand-teal-soft)" },
] as const;

const realityItems = [
  { titleKey: "reality1Title", bodyKey: "reality1Body", number: "01" },
  { titleKey: "reality2Title", bodyKey: "reality2Body", number: "02" },
  { titleKey: "reality3Title", bodyKey: "reality3Body", number: "03" },
  { titleKey: "reality4Title", bodyKey: "reality4Body", number: "04" },
] as const;

const partnerItems = [
  { titleKey: "partner1Title", bodyKey: "partner1Body", number: "01" },
  { titleKey: "partner2Title", bodyKey: "partner2Body", number: "02" },
  { titleKey: "partner3Title", bodyKey: "partner3Body", number: "03" },
] as const;

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");
  const td = await getTranslations("Divisions");

  return (
    <>
      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_30%,rgba(25,101,107,0.04),transparent)]" />
        <div className="ui-site-container relative pt-12 sm:pt-20 pb-12 sm:pb-16">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted-foreground">{t("mission")}</p>
          </FadeIn>
        </div>
      </div>

      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_3%,var(--background))]" />
        <div className="ui-site-container relative py-16 sm:py-24">
          <FadeInStagger className="space-y-12">
            <FadeIn>
              <div className="flex items-center gap-4 mb-2">
                <span className="h-6 w-1 rounded-full bg-[var(--brand-teal)]" />
                <h2 className="font-display text-3xl sm:text-4xl text-foreground">{renderGradientTitle(t("divisionsTitle"))}</h2>
                <span className="h-px flex-1 bg-border" />
              </div>
              <p className="max-w-2xl text-sm leading-7 text-muted-foreground ml-7">{t("divisionsSubtitle")}</p>
            </FadeIn>

            <div className="grid gap-5 sm:grid-cols-2">
              {divisionKeys.map((d, i) => (
                <FadeIn key={d.key}>
                  <div className="ui-hover-lift-sm relative flex flex-col rounded-2xl border border-border bg-card p-8 sm:p-10 h-full">
                    <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full" style={{ background: d.accent }} />
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-xl shrink-0"
                        style={{ background: `color-mix(in oklch, ${d.accent} 12%, transparent)`, color: d.accent }}
                      >
                        <d.icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground tabular-nums">0{i + 1}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{td(`${d.key}Name`)}</h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground flex-1">{td(`${d.key}Desc`)}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </div>

      <div className="ui-site-container py-16 sm:py-24 space-y-24">
        <FadeInStagger className="space-y-12">
          <FadeIn>
            <div className="flex items-center gap-4">
              <span className="h-6 w-1 rounded-full bg-[var(--brand-caramel)]" />
              <h2 className="font-display text-3xl sm:text-4xl text-foreground">{renderGradientTitle(t("realityTitle"))}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
          </FadeIn>

          <div className="grid gap-px bg-border rounded-2xl overflow-hidden sm:grid-cols-2">
            {realityItems.map((item) => (
              <FadeIn key={item.number}>
                <div className="bg-card p-8 sm:p-10 h-full">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums mb-4 block">{item.number}</span>
                  <h3 className="font-display text-xl text-foreground">{t(item.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{t(item.bodyKey)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>

        <FadeInStagger className="space-y-12">
          <FadeIn>
            <div className="flex items-center gap-4">
              <span className="h-6 w-1 rounded-full bg-[var(--brand-crimson)]" />
              <h2 className="font-display text-3xl sm:text-4xl text-foreground">{renderGradientTitle(t("partnersTitle"))}</h2>
              <span className="h-px flex-1 bg-border" />
            </div>
          </FadeIn>
          <FadeIn>
            <p className="max-w-2xl text-base leading-8 text-muted-foreground ml-7">{t("partnersBody")}</p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-3">
            {partnerItems.map((item) => (
              <FadeIn key={item.number}>
                <div className="ui-hover-lift-sm rounded-2xl border border-border p-8 h-full">
                  <span className="font-mono text-xs text-muted-foreground tabular-nums block mb-4">{item.number}</span>
                  <h3 className="font-display text-xl text-foreground">{t(item.titleKey)}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{t(item.bodyKey)}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </>
  );
}
