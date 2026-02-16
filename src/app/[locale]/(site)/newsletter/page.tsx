import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsletterList } from "@/components/site/newsletter-list";
import { FadeIn } from "@/components/ui/fade-in";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, resolveLocale, toMetaDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: typedLocale, namespace: "NewsletterPage" });

  return buildPageMetadata({
    locale: typedLocale,
    pathname: "/newsletter",
    title: t("title"),
    description: toMetaDescription(t("description")),
  });
}

export default async function NewsletterPage() {
  const t = await getTranslations("NewsletterPage");

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="ui-site-container relative pt-12 sm:pt-20 pb-12 sm:pb-16">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[var(--accents-5)] sm:mx-0 sm:text-lg">
              {t("description")}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-16">
        <NewsletterList />
      </div>
    </>
  );
}
