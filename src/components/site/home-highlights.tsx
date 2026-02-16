import { Link } from "@/i18n/routing";
import { Section } from "./section";
import { useTranslations } from "next-intl";

export function HomeHighlights() {
  const t = useTranslations("Highlights");

  return (
    <Section eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="space-y-8">
          <p className="max-w-prose text-base leading-8 text-[var(--accents-5)]">
            {t("p1")}
          </p>
          <div className="ui-divider" />
          <p className="max-w-prose text-base leading-8 text-[var(--accents-5)]">
            {t("p2")}
          </p>
        </div>

        <div className="space-y-6">
          <FeatureRow
            number="01"
            title={t("feature1Title")}
            desc={t("feature1Desc")}
            cta={t("feature1Cta")}
            href="/about"
          />
          <FeatureRow
            number="02"
            title={t("feature2Title")}
            desc={t("feature2Desc")}
            cta={t("feature2Cta")}
            href="/contact"
          />
        </div>
      </div>

      <div className="-mx-5 sm:-mx-6 mt-20">
        <div className="relative overflow-hidden">
          {/* Warm gradient background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_30%_50%,rgba(244,229,211,0.15),transparent)] pointer-events-none" />
          <div className="border-y border-[var(--accents-2)] bg-[var(--accents-1)]">
            <div className="mx-auto max-w-6xl px-5 sm:px-6">
              <div className="grid divide-y divide-[var(--accents-2)] md:grid-cols-3 md:divide-x md:divide-y-0">
                <Format
                  title={t("format1Title")}
                  desc={t("format1Desc")}
                />
                <Format
                  title={t("format2Title")}
                  desc={t("format2Desc")}
                />
                <Format
                  title={t("format3Title")}
                  desc={t("format3Desc")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}

function FeatureRow({
  number,
  title,
  desc,
  cta,
  href,
}: {
  number: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
}) {
  return (
    <div className="group ui-card ui-hover-lift p-8 hover:border-[var(--brand-teal-soft)]">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--brand-teal)_10%,transparent)] text-xs font-mono font-bold text-[var(--brand-teal)]">
          {number}
        </span>
        <Link href={href} className="ui-link text-sm">
          {cta} &rarr;
        </Link>
      </div>
      <div className="font-display text-xl text-[var(--foreground)]">
        {title}
      </div>
      <p className="mt-3 max-w-prose text-sm leading-7 text-[var(--accents-5)]">
        {desc}
      </p>
    </div>
  );
}

function Format({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="ui-hover-lift-sm p-8 md:p-10 group">
      <div className="font-display text-xl text-[var(--foreground)] group-hover:text-[var(--brand-teal)] transition-colors">{title}</div>
      <p className="mt-3 text-sm leading-7 text-[var(--accents-5)]">
        {desc}
      </p>
    </div>
  );
}
