import type { Metadata } from "next";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const divisionCards = [
  {
    icon: Palette,
    accent: "var(--brand-caramel)",
    name: "Culture",
    description:
      "Promotes the diverse cultural palette of the region through themed events, traditions, food, music, and collaborations, celebrating diversity and creating cultural osmosis on campus.",
  },
  {
    icon: Scale,
    accent: "var(--brand-crimson)",
    name: "Diplomacy & Politics",
    description:
      "Organizes debates, discussions, panels, and speaker events on international relations, policy, and regional affairs, encouraging informed debate and engagement with current issues.",
  },
  {
    icon: TrendingUp,
    accent: "var(--brand-teal)",
    name: "Fintech",
    description:
      "Curates events and learning opportunities focused on fintech and innovation in the region, connecting students with industry trends, professionals, and practical insights in finance and tech.",
  },
  {
    icon: Users,
    accent: "var(--brand-teal-soft)",
    name: "Social",
    description:
      "Plans and delivers social events that bring people together, both members and guests, strengthen the community, and create a welcoming space for networking and friendships.",
  },
] as const;

const realityItems = [
  {
    number: "01",
    title: "Recruitment cycles",
    body: "Associations typically recruit at the start of semesters and during on-campus association fairs. Consistency and clear roles matter more than huge headcount.",
  },
  {
    number: "02",
    title: "Execution culture",
    body: "The strongest associations operate like a small studio: defined owners, repeatable formats, and a high bar for comms, logistics, and partner experience.",
  },
  {
    number: "03",
    title: "Collaboration is normal",
    body: "Joint events with other associations are common and high-leverage: they extend reach, share best practices, and create more interesting formats.",
  },
  {
    number: "04",
    title: "Brand is a differentiator",
    body: "In a campus full of posters, your visual system is part of your credibility. A consistent aesthetic signals seriousness, even for events.",
  },
] as const;

const partnerItems = [
  {
    number: "01",
    title: "Workshop",
    body: "A focused session (60-90 min) with real value: case, hiring, or region-specific insights.",
  },
  {
    number: "02",
    title: "Flagship sponsorship",
    body: "Brand placement + speaking moment + recruiting angle, aligned with a signature event.",
  },
  {
    number: "03",
    title: "Community support",
    body: "Enable small formats: dinners, cultural calendar moments, and student travel experiences.",
  },
] as const;

const MISSION =
  "A student association at Bocconi is a structured, student-run organization that builds community and creates programming on campus: events, partnerships, and a visible presence in the student ecosystem. CEEA focuses that energy around Central & Eastern Europe.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/about",
  title: "What CEEA is.",
  description: toMetaDescription(MISSION),
});

export default async function AboutPage() {
  return (
    <>
      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_80%_30%,rgba(25,101,107,0.04),transparent)]" />
        <div className="ui-site-container relative pb-12 pt-12 sm:pb-16 sm:pt-20">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle("What CEEA is.")}</h1>
            <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-muted-foreground sm:mx-0 sm:text-lg">
              {MISSION}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_3%,var(--background))]" />
        <div className="ui-site-container relative py-16 sm:py-24">
          <FadeInStagger className="space-y-12">
            <FadeIn>
              <div className="mb-2 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                <span className="hidden h-6 w-1 rounded-full bg-[var(--brand-teal)] sm:block" />
                <h2 className="ui-section-title text-foreground">{renderGradientTitle("Our Divisions")}</h2>
                <span className="hidden h-px flex-1 bg-border sm:block" />
              </div>
              <p className="mx-auto max-w-2xl text-sm leading-7 text-muted-foreground sm:mx-0 sm:ml-7">
                Four verticals, one mission. Each owns its programming, calendar, and partnerships.
              </p>
            </FadeIn>

            <div className="grid gap-5 sm:grid-cols-2">
              {divisionCards.map((division, i) => (
                <FadeIn key={division.name}>
                  <div className="ui-hover-lift-sm relative flex h-full flex-col rounded-2xl border border-border bg-card p-8 sm:p-10">
                    <div className="absolute left-8 right-8 top-0 h-[2px] rounded-full" style={{ background: division.accent }} />
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{ background: `color-mix(in oklch, ${division.accent} 12%, transparent)`, color: division.accent }}
                      >
                        <division.icon className="h-5 w-5" />
                      </div>
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">0{i + 1}</span>
                    </div>
                    <h3 className="font-display text-2xl text-foreground">{division.name}</h3>
                    <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">{division.description}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        </div>
      </div>

      <div className="ui-site-container space-y-24 py-16 sm:py-24">
        <FadeInStagger className="space-y-12">
          <FadeIn>
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
              <span className="hidden h-6 w-1 rounded-full bg-[var(--brand-caramel)] sm:block" />
              <h2 className="ui-section-title text-foreground">{renderGradientTitle("The Bocconi association reality")}</h2>
              <span className="hidden h-px flex-1 bg-border sm:block" />
            </div>
          </FadeIn>

          <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
            {realityItems.map((item) => (
              <FadeIn key={item.number}>
                <div className="h-full bg-card p-8 sm:p-10">
                  <span className="mb-4 block font-mono text-xs tabular-nums text-muted-foreground">{item.number}</span>
                  <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>

        <FadeInStagger className="space-y-12">
          <FadeIn>
            <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
              <span className="hidden h-6 w-1 rounded-full bg-[var(--brand-crimson)] sm:block" />
              <h2 className="ui-section-title text-foreground">{renderGradientTitle("Partners")}</h2>
              <span className="hidden h-px flex-1 bg-border sm:block" />
            </div>
          </FadeIn>
          <FadeIn>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground sm:mx-0 sm:ml-7">
              We collaborate with companies, alumni, and other Bocconi associations. If you want a curated audience and a clean execution, we should talk.
            </p>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-3">
            {partnerItems.map((item) => (
              <FadeIn key={item.number}>
                <div className="ui-hover-lift-sm h-full rounded-2xl border border-border p-8">
                  <span className="mb-4 block font-mono text-xs tabular-nums text-muted-foreground">{item.number}</span>
                  <h3 className="font-display text-xl text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </>
  );
}
