"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/site/section-header";
import { divisions } from "@/lib/divisions-data";

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
            title="Four divisions"
            accent="var(--brand-teal)"
            className="mb-6 sm:mb-8"
          />
        </FadeIn>

        <FadeIn>
        <div className="grid grid-cols-1 divide-y divide-[var(--border)] sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {divisions.map((d) => (
            <div key={d.name}>
              <Link
                href={`/divisions/${d.slug}`}
                className="group flex flex-col items-center gap-6 py-10 text-center transition-colors duration-200 sm:py-12 sm:px-6 sm:border-r sm:border-[var(--border)] last:border-none"
              >
                {/* Icon */}
                <div
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{
                    color: d.accent,
                    background: `color-mix(in oklch, ${d.accent} 10%, var(--background))`,
                  }}
                >
                  <d.icon className="h-7 w-7" strokeWidth={1.75} />
                </div>

                {/* Title */}
                <h3 className="font-display text-lg font-semibold text-[var(--foreground)] sm:text-xl">
                  {d.name}
                </h3>

                {/* Description */}
                <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
                  {d.description}
                </p>

                {/* CTA */}
                <span
                  className="mt-auto inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-200"
                  style={{ color: d.accent }}
                >
                  Explore
                  <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          ))}
        </div>
        </FadeIn>
      </div>
    </section>
  );
}
