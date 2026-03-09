import { Suspense } from "react";
import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { SectionHeader } from "@/components/site/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ListLoadingState } from "@/components/site/loading-states";
import { FintechShowcase } from "@/components/site/fintech-showcase";
import { NewsletterList } from "@/components/site/newsletter-list";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { divisions, assembliesGroup } from "@/lib/divisions-data";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { fmtEventDate } from "@/lib/format-date";
import { SITE_APPLY_FORM_URL, SITE_CONTACT } from "@/lib/site-contact";
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

            <FadeInStagger className="ui-card-grid grid grid-cols-1 gap-6 sm:grid-cols-2">
              {assembliesGroup.map((sub) => (
                <StaggerItem key={sub.slug} scale={0.97}>
                  <div
                    className="ui-card flex h-full flex-col items-start gap-5 p-8"
                  >
                    <div
                      className="flex h-12 w-12 items-center justify-center rounded-xl"
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
                  </div>
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

      {division.slug === "career-services" && (
        <div className="ui-site-container py-8 sm:py-16">
          <SectionHeader
            title="What this division does"
            accent="var(--brand-red)"
            subtitle="Career Services turns community into practical momentum: clearer recruiting access, sharper preparation, and better connections across the region."
            className="mb-8"
          />

          <FadeInStagger className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Mentorship",
                body: "Pairing students with alumni and senior members who can translate Bocconi experience into region-specific career advice.",
              },
              {
                title: "Employer access",
                body: "Targeted formats with firms, institutions, and operators relevant to Central and Eastern Europe, not generic campus noise.",
              },
              {
                title: "Practical preparation",
                body: "Smaller workshops, CV reviews, and candid conversations designed to make applications stronger before deadlines hit.",
              },
            ].map((item, index) => (
              <StaggerItem key={item.title} scale={0.98}>
                <article className="h-full rounded-2xl border border-border bg-card p-8">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <h2 className="mt-4 font-display text-2xl text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </FadeInStagger>

          <FadeIn className="mt-8">
            <div className="rounded-2xl border border-border bg-[var(--accents-1)]/60 p-8">
              <h2 className="font-display text-2xl text-foreground">
                Want in on the next cycle?
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Join the association if you want to build formats like these, or reach out if you want to support a specific career initiative.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={SITE_APPLY_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-btn"
                >
                  Join the community
                </a>
                <Link href="/contacts" className="ui-btn" data-variant="secondary">
                  Contact the team
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      )}

      {division.slug === "pr-marketing" && (
        <div className="ui-site-container py-8 sm:py-16">
          <SectionHeader
            title="How the division works"
            accent="var(--brand-pink)"
            subtitle="PR & Marketing gives the association reach and coherence: campaigns, storytelling, social output, and the visual discipline that makes events feel intentional."
            className="mb-8"
          />

          <FadeInStagger className="grid gap-5 lg:grid-cols-3">
            {[
              {
                title: "Campaigns",
                body: "Launching recruitment pushes, flagship event rollouts, and timely narratives that make the right people pay attention.",
              },
              {
                title: "Event storytelling",
                body: "Turning one-off formats into a recognizable editorial rhythm across posters, captions, recaps, and highlights.",
              },
              {
                title: "Partner communications",
                body: "Helping sponsorship and collaboration work land cleanly, with clearer messaging and a more credible outward presence.",
              },
            ].map((item, index) => (
              <StaggerItem key={item.title} scale={0.98}>
                <article className="h-full rounded-2xl border border-border bg-card p-8">
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    0{index + 1}
                  </span>
                  <h2 className="mt-4 font-display text-2xl text-foreground">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.body}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </FadeInStagger>

          <FadeIn className="mt-8">
            <div className="rounded-2xl border border-border bg-[var(--accents-1)]/60 p-8">
              <h2 className="font-display text-2xl text-foreground">
                Follow the public side
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                The fastest way to see this division at work is through the channels where campaigns and event recaps actually live.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={SITE_CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-btn"
                >
                  Instagram
                </a>
                <Link href="/contacts" className="ui-btn" data-variant="secondary">
                  Contact the team
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      )}

      {division.slug === "newsletter" && (
        <div className="ui-site-container py-8 sm:py-16">
          <SectionHeader
            title="Latest dispatches"
            accent="var(--brand-teal)"
            subtitle="This division curates the written side of the association: event recaps, interviews, and sharper signals on what matters around the region."
            cta={{ label: "All newsletter posts", href: "/newsletter" }}
            className="mb-8"
          />
          <NewsletterList />
        </div>
      )}

      {division.slug === "fintech" && (
        <div className="ui-site-container py-8 sm:py-16">
          <SectionHeader
            title="Current initiatives"
            accent="var(--brand-teal)"
            subtitle="A closer look at the work, experiments, and editorial projects currently associated with the fintech track."
            cta={{ label: "Open full fintech page", href: "/fintech" }}
            className="mb-8"
          />
          <FintechShowcase />
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
