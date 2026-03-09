import Link from "next/link";
import { ArrowUpRight, Handshake } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

type PartnerDoc = Doc<"partners">;
type Tier = PartnerDoc["tier"];

const TIER_LABELS: Record<Tier, string> = {
  lead: "Lead Partners",
  supporting: "Supporting Partners",
  community: "Community Network",
};

const TIER_ORDER: Tier[] = ["lead", "supporting", "community"];

async function getPartners(): Promise<PartnerDoc[]> {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  return (await convex.query(api.partners.listAll, {})) as PartnerDoc[];
}

export async function PartnersShowcase({
  emptyTitle = "No partners listed yet.",
  emptyDescription = "This page will update as new collaborators and supporting organizations come on board.",
}: {
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const partners = await getPartners();

  if (partners.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={Handshake}
        className="border-border bg-card/70"
      />
    );
  }

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    items: partners.filter((partner) => partner.tier === tier),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="space-y-12">
      {grouped.map((group, groupIndex) => (
        <section key={group.tier}>
          <FadeIn delay={Math.min(groupIndex * 0.05, 0.15)}>
            <div className="mb-5 flex items-center gap-4">
              <h2 className="font-display text-2xl text-foreground">
                {TIER_LABELS[group.tier]}
              </h2>
              <span className="h-px flex-1 bg-border" />
            </div>
          </FadeIn>

          <FadeInStagger className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" faster>
            {group.items.map((partner) => (
              <StaggerItem key={partner._id} as="article" scale={0.98}>
                <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-flex items-center rounded-full border border-border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {group.tier}
                      </span>
                      <h3 className="mt-4 font-display text-xl leading-tight text-foreground">
                        {partner.name}
                      </h3>
                    </div>
                    {partner.logoUrl ? (
                      <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-white/80 p-2">
                        {/* Arbitrary external logo hosts are editor-managed, so this stays a plain img. */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={partner.logoUrl}
                          alt={`${partner.name} logo`}
                          className="max-h-full max-w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                  </div>

                  <div className="mt-auto pt-6">
                    {partner.websiteUrl ? (
                      <Link
                        href={partner.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--brand-teal)] transition-colors hover:text-foreground"
                      >
                        Visit site
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Partner profile available on request.
                      </p>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </FadeInStagger>
        </section>
      ))}
    </div>
  );
}
