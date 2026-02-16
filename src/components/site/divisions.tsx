import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { renderGradientTitle } from "@/lib/gradient-title";

const divisions = [
  {
    icon: Palette,
    name: "Culture",
    description:
      "Promotes the diverse cultural palette of the region through themed events, traditions, food, music, and collaborations, celebrating diversity and creating cultural osmosis on campus.",
    accent: "var(--brand-caramel)",
  },
  {
    icon: Scale,
    name: "Diplomacy & Politics",
    description:
      "Organizes debates, discussions, panels, and speaker events on international relations, policy, and regional affairs, encouraging informed debate and engagement with current issues.",
    accent: "var(--brand-crimson)",
  },
  {
    icon: TrendingUp,
    name: "Fintech",
    description:
      "Curates events and learning opportunities focused on fintech and innovation in the region, connecting students with industry trends, professionals, and practical insights in finance and tech.",
    accent: "var(--brand-teal)",
  },
  {
    icon: Users,
    name: "Social",
    description:
      "Plans and delivers social events that bring people together, both members and guests, strengthen the community, and create a welcoming space for networking and friendships.",
    accent: "var(--brand-teal-soft)",
  },
] as const;

export async function Divisions() {
  return (
    <section className="relative border-y border-[var(--accents-2)]">
      <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_6%,var(--background))]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_70%_50%,rgba(25,101,107,0.04),transparent)]" />

      <div className="ui-site-container relative py-24">
        <FadeInStagger className="space-y-16">
          <FadeIn>
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
              <div className="ui-title-stack">
                <h2 className="ui-section-title">{renderGradientTitle("Our Divisions")}</h2>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--accents-5)] sm:text-right">
                Each division owns its programming, calendar, and partnerships - united by CEEA&apos;s identity and standards.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-5 sm:grid-cols-2">
            {divisions.map((division, i) => (
              <FadeIn key={division.name}>
                <article className="ui-hover-lift group relative flex h-full flex-col rounded-2xl border border-[var(--accents-2)] bg-[var(--background)] p-8 text-center transition-[border-color,box-shadow] duration-300 hover:border-[var(--accents-3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] sm:text-left">
                  <div className="absolute left-8 right-8 top-0 h-[2px] rounded-full" style={{ background: division.accent }} />

                  <div className="flex items-start justify-center gap-4 sm:justify-between">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-[transform,color,background-color] duration-300 group-hover:scale-105"
                      style={{
                        background: `color-mix(in oklch, ${division.accent} 12%, transparent)`,
                        color: division.accent,
                      }}
                    >
                      <division.icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs tabular-nums text-[var(--accents-4)]">0{i + 1}</span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl text-[var(--foreground)]">{division.name}</h3>
                  <p className="mt-4 flex-1 text-sm leading-7 text-[var(--accents-5)]">{division.description}</p>
                </article>
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>
      </div>
    </section>
  );
}
