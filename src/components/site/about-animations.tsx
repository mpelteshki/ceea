"use client";

import type { LucideIcon } from "lucide-react";
import {
  Palette,
  Scale,
  TrendingUp,
  Users,
  Briefcase,
  Newspaper,
} from "lucide-react";
import {
  SlideIn,
  ScrollScale,
  DrawLine,
  TextReveal,
  ScrollRevealMask,
  StaggerReveal,
  StaggerRevealItem,
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
        <SlideIn from="left" distance={60} blur>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              <TextReveal as="span" mode="word" stagger={0.05}>
                Our Divisions
              </TextReveal>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Six verticals across two tracks — Assemblies (Culture, Diplomacy &
              Politics, Community) and standalone divisions (Projects, Career
              Services, Newsletter) — each owning its own programming, calendar,
              and partnerships.
            </p>
          </div>
        </SlideIn>

        <DrawLine className="mb-6" color="var(--brand-teal)" width={1} />

        <div className="grid gap-5 sm:grid-cols-2">
          {divisionCards.map((division, i) => {
            const IconComp = ICON_MAP[division.iconName] || Palette;
            return (
              <SlideIn
                key={division.name}
                from={i % 2 === 0 ? "left" : "right"}
                distance={70}
                delay={i * 0.08}
                rotate={i % 2 === 0 ? -1.5 : 1.5}
                scale={0.93}
                blur
              >
                <ScrollScale from={0.95} to={1}>
                  <div className="relative flex h-full flex-col rounded-2xl border border-border bg-card p-8 sm:p-10">
                    <div
                      className="absolute left-8 right-8 top-0 h-[2px] rounded-full"
                      style={{ background: division.accent }}
                    />
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-opacity duration-300 hover:opacity-80"
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
                </ScrollScale>
              </SlideIn>
            );
          })}
        </div>
      </div>

      {/* ── The Bocconi association reality ──────────────── */}
      <div className="space-y-12">
        <SlideIn from="right" distance={60} blur>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              <TextReveal as="span" mode="word" stagger={0.04}>
                The Bocconi association reality
              </TextReveal>
            </h2>
          </div>
        </SlideIn>

        <DrawLine className="mb-6" color="var(--brand-crimson)" width={1} />

        <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
          {realityItems.map((item, idx) => (
            <ScrollRevealMask
              key={item.number}
              direction={idx % 2 === 0 ? "left" : "right"}
            >
              <SlideIn
                from={idx % 2 === 0 ? "left" : "right"}
                distance={50}
                delay={idx * 0.1}
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
              </SlideIn>
            </ScrollRevealMask>
          ))}
        </div>
      </div>

      {/* ── Partners ─────────────────────────────────────── */}
      <div className="space-y-12">
        <SlideIn from="left" distance={60} blur>
          <div className="mb-6">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              <TextReveal as="span" mode="word" stagger={0.05}>
                Partners
              </TextReveal>
            </h2>
          </div>
        </SlideIn>

        <FadeIn delay={0.2} direction="up" distance={20} blur>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted-foreground sm:mx-0 sm:ml-7">
            We collaborate with companies, alumni, and other Bocconi
            associations. If you want a curated audience and a clean execution,
            we should talk.
          </p>
        </FadeIn>

        <DrawLine className="my-6" color="var(--brand-caramel)" width={1} />

        <div className="grid gap-5 sm:grid-cols-3">
          {partnerItems.map((item, idx) => (
            <SlideIn
              key={item.number}
              from="bottom"
              distance={50}
              delay={idx * 0.12}
              scale={0.92}
              blur
            >
              <ScrollScale from={0.93} to={1}>
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
              </ScrollScale>
            </SlideIn>
          ))}
        </div>
      </div>
    </div>
  );
}
