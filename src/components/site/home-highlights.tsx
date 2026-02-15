import { Link } from "@/i18n/routing";
import { Section } from "./section";
import { useTranslations } from "next-intl";

export function HomeHighlights() {
  const t = useTranslations("Highlights");

  return (
    <Section eyebrow={t("eyebrow")} title={t("title")}>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
        <div className="space-y-6">
          <p className="max-w-prose text-base leading-7 text-[var(--accents-5)]">
            {t("p1")}
          </p>
          <div className="h-px bg-[var(--accents-2)]" />
          <p className="max-w-prose text-base leading-7 text-[var(--accents-5)]">
            {t("p2")}
          </p>
        </div>

        <div className="divide-y divide-[var(--accents-2)]">
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
            href="/contact" // Assuming /contact is the page
          />
        </div>
      </div>

      <div className="mt-16 border-y border-[var(--accents-2)]">
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
    <div
      className="py-8 first:pt-0 last:pb-0"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="ui-tag">{number}</span>
        <Link href={href} className="ui-link text-sm">
          {cta} &rarr;
        </Link>
      </div>
      <div className="mt-4 font-display text-2xl font-semibold text-[var(--foreground)]">
        {title}
      </div>
      <p className="mt-3 max-w-prose text-sm leading-6 text-[var(--accents-5)]">
        {desc}
      </p>
    </div>
  );
}

function Format({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 md:p-8">
      <div className="font-display text-xl font-semibold text-[var(--foreground)]">{title}</div>
      <p className="mt-3 text-sm leading-6 text-[var(--accents-5)]">
        {desc}
      </p>
    </div>
  );
}

