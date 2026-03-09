"use client";

import type { LucideIcon } from "lucide-react";
import {
  Palette,
  Scale,
  TrendingUp,
  Users,
  Briefcase,
  Newspaper,
  CalendarDays,
  Megaphone,
} from "lucide-react";
import {
  DrawLine,
} from "@/components/ui/scroll-animations";
import { FadeIn } from "@/components/ui/fade-in";

/* Icon map to resolve from serialized props */
const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Scale,
  TrendingUp,
  Users,
  Briefcase,
  Newspaper,
  CalendarDays,
  Megaphone,
};

type DivisionCard = {
  iconName: string;
  accent: string;
  name: string;
  group: string | null;
  description: string;
};

type NumberedItem = {
  number: string;
  title: string;
  body: string;
};

export function AboutAnimatedSections({
  divisionCards,
  realityItems,
  partnerItems,
}: {
  divisionCards: DivisionCard[];
  realityItems: NumberedItem[];
  partnerItems: NumberedItem[];
}) {
  return (
    <div className="ui-site-container space-y-24 pt-10 pb-16 sm:pt-14 sm:pb-24">
      {/* ── Divisions ─────────────────────────────────────── */}
      <div className="space-y-12">
        <FadeIn>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Our Divisions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              A portfolio of divisions spanning culture, policy, community,
              careers, fintech, communications, and editorial work. Each one
              owns its own programming, cadence, and partnerships.
            </p>
          </div>
        </FadeIn>

        <DrawLine className="mb-6" color="var(--brand-teal)" width={1} />

        <div className="grid gap-5 sm:grid-cols-2">
          {divisionCards.map((division, i) => {
            const IconComp = ICON_MAP[division.iconName] || Palette;
            return (
            <FadeIn
              key={division.name}
              delay={i * 0.06}
              direction="up"
            >
                <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-8 sm:p-10">
                  <div
                    className="absolute left-8 right-8 top-0 h-[2px] rounded-full"
                    style={{ background: division.accent }}
                  />
                  <div className="mb-6 flex items-start justify-between gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: `color-mix(in oklch, ${division.accent} 12%, var(--background))`,
                        color: division.accent,
                      }}
                    >
                      <IconComp className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs tabular-nums text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl text-foreground">
                    {division.name}
                    {division.group && (
                      <span className="ml-2 text-sm font-normal text-muted-foreground">
                        {division.group}
                      </span>
                    )}
                  </h3>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                    {division.description}
                  </p>
                </div>
            </FadeIn>
            );
          })}
        </div>
      </div>

      {/* ── The Bocconi association reality ──────────────── */}
      <div className="space-y-12">
        <FadeIn>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              The Bocconi association reality
            </h2>
          </div>
        </FadeIn>

        <DrawLine className="mb-6" color="var(--brand-crimson)" width={1} />

        <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
          {realityItems.map((item, idx) => (
            <FadeIn
              key={item.number}
              delay={idx * 0.06}
              direction="up"
            >
                <div className="h-full bg-card p-8 sm:p-10">
                  <span className="mb-4 block font-mono text-xs tabular-nums text-muted-foreground">
                    {item.number}
                  </span>
                  <h3 className="font-display text-xl text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
            </FadeIn>
          ))}
        </div>
      </div>

      {/* ── Partners ─────────────────────────────────────── */}
      <div className="space-y-12">
        <FadeIn>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Partners
            </h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.15} direction="up" distance={18}>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:mx-0 sm:ml-7">
            We collaborate with companies, alumni, and other Bocconi
            associations. If you want a curated audience and a clean execution,
            we should talk.
          </p>
        </FadeIn>

        <DrawLine className="my-6" color="var(--brand-caramel)" width={1} />

        <div className="grid gap-5 sm:grid-cols-3">
          {partnerItems.map((item, idx) => (
            <FadeIn
              key={item.number}
              delay={idx * 0.08}
              direction="up"
            >
                  <div className="h-full rounded-2xl border border-border p-8">
                    <span className="mb-4 block font-mono text-xs tabular-nums text-muted-foreground">
                      {item.number}
                    </span>
                    <h3 className="font-display text-xl text-foreground">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.body}
                    </p>
                  </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
