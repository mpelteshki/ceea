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
            <StaggerItem key={channel.value} scale={0.97} className="h-full">
              <a
                href={channel.href}
                target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="group ui-card flex h-full flex-col items-start gap-5 p-8"
              >
                <div className="text-center sm:text-left">
                  <div
                    className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                    style={{
                      background: `color-mix(in oklch, ${channel.accent} 12%, var(--background))`,
                      color: channel.accent,
                    }}
                  >
                    <channel.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl font-medium text-[var(--foreground)]">{channel.label}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{channel.value}</p>
                  </div>
                </div>

                <div className="mt-auto pt-6 flex items-center gap-2 text-sm font-medium transition-opacity group-hover:opacity-75" style={{ color: channel.accent }}>
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
