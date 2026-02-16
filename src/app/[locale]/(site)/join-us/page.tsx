import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, resolveLocale, toMetaDescription } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: typedLocale, namespace: "JoinUsPage" });

  return buildPageMetadata({
    locale: typedLocale,
    pathname: "/join-us",
    title: t("title"),
    description: toMetaDescription(t("content")),
  });
}

export default async function JoinUsPage() {
  const t = await getTranslations("JoinUsPage");

  return (
    <div className="relative min-h-[70vh] flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_40%,rgba(25,101,107,0.06),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_70%,rgba(196,154,108,0.05),transparent)]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--accents-2)]" />

      <div className="ui-site-container relative py-24 sm:py-32">
        <div className="mx-auto max-w-4xl sm:mx-0">
          <FadeInStagger className="space-y-10">
            <FadeIn>
              <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
            </FadeIn>
            <FadeIn>
              <p className="mx-auto max-w-xl text-base leading-relaxed text-[var(--accents-5)] sm:mx-0 sm:text-lg">
                {t("content")}
              </p>
            </FadeIn>
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-4 pt-4 sm:justify-start">
                <Link href="/contacts" className="ui-btn group">
                  {t("getInTouch")}
                  <ArrowRight className="ui-icon-shift h-4 w-4" />
                </Link>
                <Link href="/events" className="ui-btn" data-variant="secondary">
                  {t("seeEvents")}
                </Link>
              </div>
            </FadeIn>
          </FadeInStagger>
        </div>
      </div>
    </div>
  );
}
