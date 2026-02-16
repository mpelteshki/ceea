import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { DeferredAnalytics } from "@/components/ui/deferred-analytics";
import type { Metadata } from "next";
import { buildPageMetadata, resolveLocale, SITE_NAME, toMetaDescription } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const heroT = await getTranslations({ locale: typedLocale, namespace: "Hero" });

  return buildPageMetadata({
    locale: typedLocale,
    pathname: "/",
    title: SITE_NAME,
    description: toMetaDescription(heroT("description")),
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
      <DeferredAnalytics />
    </NextIntlClientProvider>
  );
}
