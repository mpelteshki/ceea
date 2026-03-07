import type { Metadata } from "next";
import { FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/site/page-header";
import { Mail, Instagram, Linkedin, ArrowUpRight } from "lucide-react";
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
    label: "Instagram",
    value: SITE_CONTACT.instagram.handle,
    href: SITE_CONTACT.instagram.url,
    accent: "var(--brand-caramel)",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
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
      <PageHeader title="Contact Us" />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        <FadeInStagger className="grid gap-5 sm:grid-cols-3">
          {channels.map((channel) => (
            <StaggerItem key={channel.value} scale={0.97}>
              <a
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group flex h-full flex-col justify-between ui-card p-8"
              >
                <div className="text-center sm:text-left">
                  <div
                    className="mx-auto mb-8 flex h-12 w-12 items-center justify-center rounded-xl sm:mx-0"
                    style={{
                      background: `color-mix(in oklch, ${channel.accent} 12%, var(--background))`,
                      color: channel.accent,
                    }}
                  >
                    <channel.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl text-[var(--foreground)]">{channel.label}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{channel.value}</p>
                </div>
                <div className="mt-8 flex items-center justify-center gap-2 text-sm font-medium text-[var(--brand-teal)] sm:justify-start">
                  <span>Open</span>
                  <ArrowUpRight className="ui-icon-shift h-3.5 w-3.5" />
                </div>
              </a>
            </StaggerItem>
          ))}
        </FadeInStagger>
      </div>
    </>
  );
}
