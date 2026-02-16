import type { Metadata } from "next";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Mail, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { SITE_CONTACT, SITE_EMAIL_HREF } from "@/lib/site-contact";

const channels = [
  {
    icon: Mail,
    label: "Email",
    value: SITE_CONTACT.email,
    href: SITE_EMAIL_HREF,
    accent: "var(--brand-teal)",
  },
  {
    icon: Instagram,
    label: "Follow Us",
    value: SITE_CONTACT.instagram.handle,
    href: SITE_CONTACT.instagram.url,
    accent: "var(--brand-caramel)",
  },
  {
    icon: Linkedin,
    label: "Follow Us",
    value: SITE_CONTACT.linkedin.label,
    href: SITE_CONTACT.linkedin.url,
    accent: "var(--brand-teal-soft)",
  },
] as const;

export const metadata: Metadata = buildPageMetadata({
  pathname: "/contacts",
  title: "Contact Us",
  description: toMetaDescription(
    "Contact CEEA Bocconi for partnerships, opportunities, and collaboration with the Central & Eastern Europe community.",
  ),
});

export default async function ContactPage() {
  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="ui-site-container relative pb-12 pt-12 sm:pb-16 sm:pt-20">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle("Contact Us")}</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-16 sm:py-24">
        <FadeInStagger className="grid gap-5 sm:grid-cols-3">
          {channels.map((channel) => (
            <FadeIn key={channel.value}>
              <a
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="ui-hover-lift group flex h-full flex-col justify-between rounded-2xl border border-[var(--accents-2)] p-8 transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)]"
              >
                <div className="text-center sm:text-left">
                  <div
                    className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-xl sm:mx-0"
                    style={{
                      background: `color-mix(in oklch, ${channel.accent} 12%, transparent)`,
                      color: channel.accent,
                    }}
                  >
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-[var(--foreground)]">{channel.label}</h3>
                  <p className="mt-2 text-sm text-[var(--accents-5)]">{channel.value}</p>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[var(--brand-teal)] sm:justify-start">
                  <span className="group-hover:underline">Open</span>
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
