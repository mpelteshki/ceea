"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/site/section-header";
import { assembliesGroup } from "@/lib/divisions-data";
import { getAccentSurface, getReadableAccentText } from "@/lib/accent-colors";

export function Assemblies() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />

      <div className="ui-site-container relative py-12 sm:py-16">
        <FadeIn>
          <SectionHeader
            title="Assemblies"
            accent="var(--brand-pink)"
            className="mb-6 sm:mb-8"
          />
        </FadeIn>

        <FadeIn>
          <div className="grid grid-cols-1 divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-y-0">
            {assembliesGroup.map((d, i) => {
              const accentText = getReadableAccentText(d.accent);

              return (
                <div key={d.slug}>
                  <Link
                    href={`/divisions/${d.slug}`}
                    className={[
                      "group ui-hover-panel flex flex-col items-center gap-5 py-10 text-center sm:px-6 sm:py-12",
                      i < assembliesGroup.length - 1
                        ? "sm:border-r sm:border-border"
                        : "",
                    ].join(" ")}
                  >
                    <div
                      className="ui-hover-icon flex h-12 w-12 items-center justify-center rounded-2xl"
                      style={{
                        color: accentText,
                        background: getAccentSurface(d.accent, 10),
                      }}
                    >
                      <d.icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <h4 className="font-display text-lg font-semibold text-foreground sm:text-xl">
                      {d.name}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {d.description}
                    </p>
                    <span
                      className="ui-hover-cta mt-auto inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide"
                      style={{ color: accentText }}
                    >
                      Explore
                      <ArrowRight className="ui-icon-shift h-3 w-3" />
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
