import { getTranslations } from "next-intl/server";
import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { renderGradientTitle } from "@/lib/gradient-title";

const divisionKeys = [
  { icon: Palette, key: "culture", accent: "var(--brand-caramel)" },
  { icon: Scale, key: "diplomacy", accent: "var(--brand-crimson)" },
  { icon: TrendingUp, key: "fintech", accent: "var(--brand-teal)" },
  { icon: Users, key: "social", accent: "var(--brand-teal-soft)" },
] as const;

export async function Divisions() {
  const t = await getTranslations("Divisions");
  const title = t("title");

  return (
    <section className="relative border-y border-[var(--accents-2)]">
      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_6%,var(--background))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(25,101,107,0.04),transparent)]" />

      <div className="ui-site-container relative py-24">
        <FadeInStagger className="space-y-16">
          <FadeIn>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="ui-title-stack">
                <h2 className="ui-section-title">{renderGradientTitle(title)}</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--accents-5)] sm:text-right">{t("subtitle")}</p>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            {divisionKeys.map((d, i) => (
              <FadeIn key={d.key}>
                <article className="ui-hover-lift group relative flex h-full flex-col rounded-2xl border border-[var(--accents-2)] bg-[var(--background)] p-8 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:text-left">
                  <div className="absolute top-0 left-8 right-8 h-[2px] rounded-full" style={{ background: d.accent }} />

                  <div className="flex items-start justify-center gap-4 sm:justify-between">
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition-[transform,color,background-color] duration-300 shrink-0 group-hover:scale-105"
                      style={{
                        background: `color-mix(in oklch, ${d.accent} 12%, transparent)`,
                        color: d.accent,
                      }}
                    >
                      <d.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs text-[var(--accents-4)] tabular-nums">0{i + 1}</span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl text-[var(--foreground)]">{t(`${d.key}Name`)}</h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--accents-5)] flex-1">{t(`${d.key}Desc`)}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </section>
  );
}
