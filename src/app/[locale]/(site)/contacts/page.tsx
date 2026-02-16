import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Mail, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { renderGradientTitle } from "@/lib/gradient-title";
import { AppLocale, buildPageMetadata, resolveLocale, toMetaDescription } from "@/lib/seo";
import { SITE_CONTACT, SITE_EMAIL_HREF } from "@/lib/site-contact";

const channels = [
  {
    icon: Mail,
    labelKey: "email",
    value: SITE_CONTACT.email,
    href: SITE_EMAIL_HREF,
    accent: "var(--brand-teal)",
  },
  {
    icon: Instagram,
    labelKey: "followUs",
    value: SITE_CONTACT.instagram.handle,
    href: SITE_CONTACT.instagram.url,
    accent: "var(--brand-caramel)",
  },
  {
    icon: Linkedin,
    labelKey: "followUs",
    value: SITE_CONTACT.linkedin.label,
    href: SITE_CONTACT.linkedin.url,
    accent: "var(--brand-teal-soft)",
  },
] as const;

function contactDescriptionByLocale(locale: AppLocale) {
  if (locale === "it") {
    return "Contatta CEEA Bocconi per partnership, opportunita e collaborazione con la comunita dell'Europa centrale e orientale.";
  }
  return "Contact CEEA Bocconi for partnerships, opportunities, and collaboration with the Central & Eastern Europe community.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const typedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: typedLocale, namespace: "ContactPage" });

  return buildPageMetadata({
    locale: typedLocale,
    pathname: "/contacts",
    title: t("title"),
    description: toMetaDescription(contactDescriptionByLocale(typedLocale)),
  });
}

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="ui-site-container relative pt-12 sm:pt-20 pb-12 sm:pb-16">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-16 sm:py-24">
        <FadeInStagger className="grid gap-5 sm:grid-cols-3">
          {channels.map((ch) => (
            <FadeIn key={ch.value}>
              <a
                href={ch.href}
                target={ch.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={ch.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="ui-hover-lift group flex flex-col justify-between rounded-2xl border border-[var(--accents-2)] p-8 h-full transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="text-center sm:text-left">
                  <div
                    className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl mx-auto sm:mx-0"
                    style={{
                      background: `color-mix(in oklch, ${ch.accent} 12%, transparent)`,
                      color: ch.accent,
                    }}
                  >
                    <ch.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-[var(--foreground)]">{t(ch.labelKey)}</h3>
                  <p className="mt-2 text-sm text-[var(--accents-5)]">{ch.value}</p>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[var(--brand-teal)] sm:justify-start">
                  <span className="group-hover:underline">{t("open")}</span>
                  <ArrowUpRight className="ui-icon-shift h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                </div>
              </a>
            </FadeIn>
          ))}
        </FadeInStagger>
      </div>
    </>
  );
}
