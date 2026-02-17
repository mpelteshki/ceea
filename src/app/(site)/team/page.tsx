import Image from "next/image";
import { Linkedin } from "lucide-react";
import type { Metadata } from "next";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { EmptyState } from "@/components/ui/empty-state";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { renderGradientTitle } from "@/lib/gradient-title";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";
import { toPlainText } from "@/lib/plain-text";
import { api } from "../../../../convex/_generated/api";
import type { Doc } from "../../../../convex/_generated/dataModel";

type TeamDoc = Doc<"team">;

export const metadata: Metadata = buildPageMetadata({
  pathname: "/team",
  title: "Our Team",
  description: toMetaDescription(
    "Meet the CEEA Bocconi team: members and alumni leading events, partnerships, and initiatives across campus.",
  ),
});

export default async function TeamPage() {
  if (!hasConvex) {
    return (
      <div className="ui-site-container py-16">
        <div className="rounded-2xl border border-dashed border-[var(--accents-3)] p-8 text-center text-sm text-[var(--accents-5)]">
          Set <code className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</code> to show team members.
        </div>
      </div>
    );
  }

  const convex = getConvexServerClient();
  const team = convex ? ((await convex.query(api.team.get, {})) as TeamDoc[]) : [];

  const members = team.filter((member) => member.type === "member");
  const alumni = team.filter((member) => member.type === "alumni");

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[var(--background)]" />
        <div className="ui-site-container relative pb-12 pt-28 sm:pb-16 sm:pt-32">
          <FadeIn>
            <h1 className="ui-page-title">Our Team</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container space-y-20 py-12 sm:py-20">
        <FadeInStagger>
          {members.length === 0 ? (
            <EmptyState title="No team members yet." description="Check back later for updates." />
          ) : (
            <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {members.map((member) => (
                <FadeIn key={member._id}>
                  <MemberCard member={member} />
                </FadeIn>
              ))}
            </div>
          )}
        </FadeInStagger>

        {alumni.length > 0 ? (
          <FadeInStagger>
            <FadeIn>
              <div className="mb-10 flex flex-col items-center gap-3 text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left">
                <span className="hidden h-6 w-1 rounded-full bg-[var(--brand-caramel)] sm:block" />
                <h2 className="font-display text-2xl text-[var(--foreground)]">{renderGradientTitle("Alumni")}</h2>
                <span className="hidden h-px flex-1 bg-[var(--accents-2)] sm:block" />
                <span className="hidden font-mono text-xs text-[var(--accents-4)] sm:inline">{alumni.length}</span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-1 gap-5 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {alumni.map((member) => (
                <FadeIn key={member._id}>
                  <MemberCard member={member} />
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        ) : null}
      </div>
    </>
  );
}

function MemberCard({ member }: { member: TeamDoc }) {
  const role = toPlainText(member.role);

  return (
    <div className="ui-hover-lift-sm group rounded-2xl p-1">
      <div className="relative mb-4 aspect-[3/4] w-full overflow-hidden rounded-2xl bg-[var(--accents-2)]">
        {member.photoId ? (
          <Image
            src={member.photoId}
            alt={`${member.firstName} ${member.lastName}`}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-4xl font-display text-[var(--brand-teal)] opacity-20">
              {member.firstName[0]}
              {member.lastName[0]}
            </span>
          </div>
        )}
      </div>
      <h3 className="font-display text-base leading-snug text-[var(--foreground)]">
        {member.firstName} {member.lastName}
      </h3>
      <p className="mt-0.5 text-xs text-[var(--accents-5)]">{role}</p>
      {member.linkedinUrl ? (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-2 inline-flex items-center gap-1.5 text-xs text-[var(--accents-4)] transition-colors hover:text-[var(--brand-teal)]"
        >
          <Linkedin className="ui-icon-shift h-3 w-3" />
          Connect
        </a>
      ) : null}
    </div>
  );
}
