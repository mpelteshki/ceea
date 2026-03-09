import Link from "next/link";
import { ArrowUpRight, FolderOpen } from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import { FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { toPlainText } from "@/lib/plain-text";
import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";

type FintechDoc = Doc<"fintech">;

async function getFintechItems(): Promise<FintechDoc[]> {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  return (await convex.query(api.fintech.get, {})) as FintechDoc[];
}

export async function FintechShowcase({
  emptyTitle = "No fintech initiatives yet.",
  emptyDescription = "Check back later for projects, publications, and experiments from the division.",
}: {
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  const items = await getFintechItems();

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        icon={FolderOpen}
        className="border-border bg-card/70"
      />
    );
  }

  return (
    <FadeInStagger className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {items.map((item, index) => {
        const title = toPlainText(item.title);
        const description = toPlainText(item.description);

        return (
          <StaggerItem key={item._id} as="article" scale={0.97}>
            <article className="group flex h-full flex-col rounded-2xl border border-border bg-card p-7 sm:p-8">
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="inline-flex items-center rounded-full border border-border px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.link ? (
                  <Link
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--brand-teal)] transition-colors hover:text-foreground"
                  >
                    Open
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ) : null}
              </div>

              <h3 className="font-display text-2xl leading-tight text-foreground">
                {title}
              </h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>

              {item.imageUrl ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-border/70 bg-[var(--accents-1)]">
                  {/* Arbitrary external image hosts are editor-managed, so this stays a plain img. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="h-52 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="mt-6 flex h-36 items-end rounded-2xl border border-dashed border-border bg-[linear-gradient(135deg,color-mix(in_oklch,var(--brand-teal)_12%,transparent),transparent_60%)] p-5">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-muted-foreground">
                    Initiative
                  </span>
                </div>
              )}
            </article>
          </StaggerItem>
        );
      })}
    </FadeInStagger>
  );
}
