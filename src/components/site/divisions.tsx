"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SlideIn, ScrollScale } from "@/components/ui/scroll-animations";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/site/section-header";
import { standaloneDivisions } from "@/lib/divisions-data";
import { getAccentSurface, getReadableAccentText } from "@/lib/accent-colors";

export function Divisions() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />

      <div className="ui-site-container relative py-12 sm:py-16">
        <SlideIn from="left" distance={60} blur>
          <SectionHeader
            title="Our divisions"
            accent="var(--brand-teal)"
            className="mb-6 sm:mb-8"
          />
        </SlideIn>

        <FadeIn delay={0.2} direction="up" distance={40} blur>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 ui-card-grid">
            {standaloneDivisions.map((d) => {
              const accentText = getReadableAccentText(d.accent);

              return (
                <ScrollScale key={d.name} from={0.95} to={1} className="h-full">
                  <Link
                    href={`/divisions/${d.slug}`}
                    className="group ui-card flex h-full flex-col items-start gap-5 p-8"
                  >
                    <div
                      className="ui-hover-icon flex h-12 w-12 items-center justify-center rounded-xl"
                      style={{
                        color: accentText,
                        background: getAccentSurface(d.accent),
                      }}
                    >
                      <d.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-xl font-medium text-foreground">
                        {d.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {d.description}
                      </p>
                    </div>

                    <div
                      className="ui-hover-cta mt-auto flex items-center gap-2 pt-6 text-sm font-medium"
                      style={{ color: accentText }}
                    >
                      <span>Explore</span>
                      <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
                    </div>
                  </Link>
                </ScrollScale>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
