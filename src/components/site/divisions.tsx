"use client";

import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { accentGradientVars } from "@/lib/gradient-title";
import { FadeIn } from "@/components/ui/fade-in";

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

export function Divisions() {
  return (
    <>
      {divisions.map((division, i) => {
        // First section keeps top border styling
        if (i === 0) {
          return (
            <section key={division.name} className="relative overflow-hidden border-t border-b border-[var(--accents-2)]">
              <div className="absolute inset-0 bg-[var(--background)]" />

              <div className="ui-site-container relative py-24 sm:py-32">
                <FadeIn>
                  <DivisionContent division={division} index={i} />
                </FadeIn>
              </div>
            </section>
          );
        }

        return (
          <section
            key={division.name}
            className="relative overflow-hidden border-b border-[var(--accents-2)]"
          >
            <div className="absolute inset-0 bg-[var(--background)]" />

            <div className="ui-site-container relative py-24 sm:py-32">
              <FadeIn>
                <DivisionContent division={division} index={i} />
              </FadeIn>
            </div>
          </section>
        );
      })}
    </>
  );
}

function DivisionContent({ division, index }: { division: typeof divisions[number], index: number }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-12 lg:items-center lg:gap-24",
        index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
      )}
    >
      {/* Visual Side */}
      <div className="flex-1 relative group">
        <div
          className="aspect-[4/3] w-full overflow-hidden rounded-3xl border border-[var(--accents-2)] bg-[var(--background)] p-8 relative"
        >
          {/* Decorative grid */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-[0.03]" />

          {/* Icon Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-3xl bg-[var(--background)] border border-[var(--accents-2)] shadow-xl transition-transform duration-500 group-hover:scale-110"
              style={{
                color: division.accent
              }}
            >
              <division.icon className="h-10 w-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Content Side */}
      <div className="flex-1">
        <div className="flex flex-col gap-6">
          <h3 className="font-display text-4xl text-[var(--foreground)] sm:text-5xl">
            <span className="text-gradient-context" style={accentGradientVars(division.accent)}>
              {division.name}
            </span>{" "}
            <span>Division</span>
          </h3>

          <div
            className="h-1 w-24 rounded-full"
            style={{ background: division.accent }}
          />

          <p className="text-lg leading-relaxed text-[var(--accents-5)]">
            {division.description}
          </p>
        </div>
      </div>
    </div>
  );
}
