import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { FintechCard } from "@/components/site/fintech-card";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";
import { divisions, assembliesGroup } from "@/lib/divisions-data";
import { getAccentSurface, getReadableAccentText } from "@/lib/accent-colors";

type FintechDoc = Doc<"fintech">;

const divisionBySlug = Object.fromEntries(
  divisions.map((d) => [d.slug, d])
);

export function generateStaticParams() {
  return divisions.map((d) => ({ slug: d.slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const division = divisionBySlug[slug];
  if (!division) return {};

  return buildPageMetadata({
    pathname: `/divisions/${slug}`,
    title: division.name,
    description: toMetaDescription(division.description),
  });
}

export default async function DivisionPage({ params }: PageProps) {
  const { slug } = await params;
  const division = divisionBySlug[slug];
  if (!division) notFound();
  const divisionAccentText = getReadableAccentText(division.accent);

  let fintech: FintechDoc[] = [];

  if (hasConvex) {
    const convex = getConvexServerClient();
    fintech = convex ? ((await convex.query(api.fintech.get, {})) as FintechDoc[]) : [];
  }

  return (
    <>
      {/* Hero header */}
      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn duration={0.7} delay={0.1}>
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  color: divisionAccentText,
                  background: getAccentSurface(division.accent, 10),
                }}
              >
                <division.icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h1 className="font-display text-[clamp(2.5rem,5.5vw,5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">{division.name}</h1>
            </div>
          </FadeIn>
          <FadeIn delay={0.25} direction="up" distance={20}>
            <div className="mt-8 border-t border-border pt-8">
              <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
                {division.description}
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* Assemblies: show three sub-divisions */}
      {division.slug === "assemblies" && (
        <div className="ui-site-container py-8 sm:py-16">
          <FadeIn>
            <p className="mb-8 max-w-2xl text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Sub-divisions
            </p>
          </FadeIn>
          <FadeInStagger className="grid gap-px bg-[var(--border)] sm:grid-cols-3">
            {assembliesGroup.map((sub) => {
              const subAccentText = getReadableAccentText(sub.accent);

              return (
                <FadeIn key={sub.slug}>
                  <div className="ui-hover-panel group bg-[var(--background)] p-8">
                    <div
                      className="ui-hover-icon mb-5 flex h-11 w-11 items-center justify-center rounded-xl"
                      style={{
                        color: subAccentText,
                        background: getAccentSurface(sub.accent, 10),
                      }}
                    >
                      <sub.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display mb-2 text-lg font-semibold text-foreground">
                      {sub.name}
                    </h3>
                    <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                      {sub.description}
                    </p>
                    <Link
                      href={`/divisions/${sub.slug}`}
                      className="ui-hover-cta group inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide transition-colors duration-200"
                      style={{ color: subAccentText }}
                    >
                      Explore
                      <ArrowRight className="ui-icon-shift h-3 w-3" />
                    </Link>
                  </div>
                </FadeIn>
              );
            })}
          </FadeInStagger>
        </div>
      )}

      {/* Fintech */}
      {division.slug !== "assemblies" && (
        <div className="ui-site-container py-8 sm:py-16">
          {fintech.length === 0 ? (
            <EmptyState
              title="No fintech yet."
              description={`Check back later for ${division.name.toLowerCase()} fintech and initiatives.`}
            />
          ) : (
            <FadeInStagger className="space-y-20">
              {fintech.map((fintech, idx) => (
                <FadeIn key={fintech._id}>
                  <FintechCard fintech={fintech} index={idx} />
                </FadeIn>
              ))}
            </FadeInStagger>
          )}
        </div>
      )}
    </>
  );
}
