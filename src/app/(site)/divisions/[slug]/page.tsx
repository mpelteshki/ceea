import Link from "next/link";
import { Suspense } from "react";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { DrawLine } from "@/components/ui/scroll-animations";
import { SectionHeader } from "@/components/site/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ListLoadingState } from "@/components/site/loading-states";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { divisions, assembliesGroup } from "@/lib/divisions-data";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { fmtEventDate } from "@/lib/format-date";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";

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

  return (
    <>
      {/* Hero header — renders instantly, no data dependency */}
      <div className="relative border-b border-border">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn duration={0.7} delay={0.1}>
            <div className="flex items-center gap-4">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  color: division.accent,
                  background: `color-mix(in oklch, ${division.accent} 10%, var(--background))`,
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

      {/* Assemblies: sub-divisions + upcoming events */}
      {division.slug === "assemblies" && (
        <>
          <div className="ui-site-container pt-10 pb-4 sm:pt-14 sm:pb-6">
            <FadeIn>
              <SectionHeader
                title="Sub-divisions"
                accent="var(--brand-green)"
                className="mb-6 sm:mb-8"
              />
            </FadeIn>

            <DrawLine className="mb-8" color="var(--brand-green)" width={1} />

            <FadeInStagger className="ui-card-grid grid grid-cols-1 gap-6 sm:grid-cols-2">
              {assembliesGroup.map((sub) => (
                <StaggerItem key={sub.slug} scale={0.97}>
                  <Link
                    href={`/divisions/${sub.slug}`}
                    className="group ui-card flex h-full flex-col items-start gap-5 p-8"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                      style={{
                        color: sub.accent,
                        background: `color-mix(in oklch, ${sub.accent} 12%, var(--background))`,
                      }}
                    >
                      <sub.icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <h3 className="font-display text-lg font-semibold text-foreground">
                        {sub.name}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {sub.description}
                      </p>
                    </div>

                    <div
                      className="mt-auto flex items-center gap-2 pt-4 text-sm font-medium"
                      style={{ color: sub.accent }}
                    >
                      <span>Explore</span>
                      <ArrowRight className="ui-icon-shift h-3.5 w-3.5" />
                    </div>
                  </Link>
                </StaggerItem>
              ))}
            </FadeInStagger>
          </div>

          <div className="ui-site-container pt-8 pb-12 sm:pt-12 sm:pb-16">
            <Suspense fallback={<ListLoadingState label="Loading events" />}>
              <AssembliesEvents />
            </Suspense>
          </div>
        </>
      )}

      {/* Other divisions: coming soon */}
      {division.slug !== "assemblies" && (
        <div className="ui-site-container py-8 sm:py-16">
          <EmptyState
            title="No projects yet."
            description={`Check back later for ${division.name.toLowerCase()} projects and initiatives.`}
          />
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Server component — upcoming events for assemblies kinds            */
/* ------------------------------------------------------------------ */

type EventDoc = Doc<"events">;

const ASSEMBLIES_KINDS = new Set(["culture", "community", "signature"]);

async function AssembliesEvents() {
  if (!hasConvex) return null;

  const convex = getConvexServerClient();
  if (!convex) return null;

  const all = (await convex.query(api.events.listUpcoming, { limit: 50 })) as EventDoc[];
  const events = all.filter((e) => ASSEMBLIES_KINDS.has(e.kind));

  if (events.length === 0) {
    return (
      <>
        <FadeIn>
          <SectionHeader
            title="Upcoming events"
            accent="var(--brand-crimson)"
            cta={{ label: "All events", href: "/events" }}
            className="mb-6 sm:mb-8"
          />
        </FadeIn>
        <EmptyState
          title="No upcoming assemblies events."
          description="Check the full events page or come back later."
          icon={Calendar}
          className="border-border bg-card/70 py-12"
        />
      </>
    );
  }

  return (
    <>
      <FadeIn>
        <SectionHeader
          title="Upcoming events"
          accent="var(--brand-crimson)"
          cta={{ label: "All events", href: "/events" }}
          className="mb-6 sm:mb-8"
        />
      </FadeIn>

      <DrawLine className="mb-8" color="var(--brand-crimson)" width={1} />

      <div className="divide-y divide-border border-t border-border">
        {events.slice(0, 6).map((event, idx) => {
          const date = fmtEventDate(event.startsAt);
          const kindColor =
            event.kind === "culture"
              ? "var(--brand-crimson)"
              : event.kind === "community"
                ? "var(--muted-foreground)"
                : "var(--brand-teal)";

          return (
            <FadeIn key={event._id} delay={Math.min(idx * 0.04, 0.2)} direction="up">
              <div className="group -mx-4 grid grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-6 transition-colors duration-200 hover:bg-[var(--accents-1)] sm:gap-8 sm:py-8">
                <div className="flex w-16 flex-col items-center justify-center sm:w-20">
                  <span className="font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-muted-foreground">
                    {date.weekday}
                  </span>
                  <span className="font-display text-3xl leading-none text-foreground sm:text-4xl">
                    {date.day}
                  </span>
                  <span className="font-mono text-[0.6875rem] font-medium tracking-[0.12em] text-muted-foreground">
                    {date.month}
                  </span>
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-display text-lg leading-snug text-foreground sm:text-xl">
                    {event.title}
                  </h3>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span
                      className="inline-flex items-center rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-[0.08em]"
                      style={{
                        color: kindColor,
                        borderColor: `color-mix(in oklch, ${kindColor} 35%, transparent)`,
                        background: `color-mix(in oklch, ${kindColor} 8%, transparent)`,
                      }}
                    >
                      {event.kind}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="h-3 w-3" aria-hidden="true" /> {date.time}
                    </span>
                    {event.location ? (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="h-3 w-3" aria-hidden="true" /> {event.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  {event.rsvpUrl ? (
                    <a
                      href={event.rsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ui-btn min-h-0 px-4 py-2 text-xs"
                    >
                      RSVP
                    </a>
                  ) : null}
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </>
  );
}
