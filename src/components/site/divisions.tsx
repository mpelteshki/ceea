"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/site/section-header";
import { standaloneDivisions } from "@/lib/divisions-data";

export function Divisions() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />

      <div className="ui-site-container relative py-12 sm:py-16">
        <FadeIn>
          <SectionHeader
            title="Our divisions"
            accent="var(--brand-teal)"
            className="mb-6 sm:mb-8"
          />
        </FadeIn>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {standaloneDivisions.map((d, i) => (
            <FadeIn key={d.name} delay={i * 0.08} direction="up" distance={16}>
                <Link
                  href={`/divisions/${d.slug}`}
                  className="group ui-card flex h-full flex-col items-start gap-5 p-8"
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      color: d.accent,
                      background: `color-mix(in oklch, ${d.accent} 12%, var(--background))`,
                    }}
                  >
                    <d.icon className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {d.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {d.description}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-medium" style={{ color: d.accent }}>
                    <span>Explore</span>
                    <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
                  </div>
                </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
