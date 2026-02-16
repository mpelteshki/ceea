import Image from "next/image";
import { Linkedin } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { renderGradientTitle } from "@/lib/gradient-title";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";

type TeamDoc = Doc<"team">;

export default async function TeamPage() {
  const locale = await getLocale();
  const t = await getTranslations("TeamPage");

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

  const members = team.filter((m) => m.type === "member");
  const alumni = team.filter((m) => m.type === "alumni");

  return (
    <>
      <div className="relative border-b border-[var(--accents-2)]">
        <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--brand-cream)_5%,var(--background))]" />
        <div className="ui-site-container relative pt-12 sm:pt-20 pb-12 sm:pb-16">
          <FadeIn>
            <h1 className="ui-page-title">{renderGradientTitle(t("title"))}</h1>
          </FadeIn>
        </div>
      </div>

      <div className="ui-site-container py-12 sm:py-20 space-y-20">
        <FadeInStagger>
          <FadeIn>
            <div className="flex items-center gap-4 mb-10">
              <span className="h-6 w-1 rounded-full bg-[var(--brand-teal)]" />
              <h2 className="font-display text-2xl text-[var(--foreground)]">{renderGradientTitle(t("members"))}</h2>
              <span className="h-px flex-1 bg-[var(--accents-2)]" />
              <span className="font-mono text-xs text-[var(--accents-4)]">{members.length}</span>
            </div>
          </FadeIn>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {members.map((member) => (
              <FadeIn key={member._id}>
                <MemberCard member={member} locale={locale} connectLabel={t("connect")} />
              </FadeIn>
            ))}
          </div>
        </FadeInStagger>

        {alumni.length > 0 ? (
          <FadeInStagger>
            <FadeIn>
              <div className="flex items-center gap-4 mb-10">
                <span className="h-6 w-1 rounded-full bg-[var(--brand-caramel)]" />
                <h2 className="font-display text-2xl text-[var(--foreground)]">{renderGradientTitle(t("alumni"))}</h2>
                <span className="h-px flex-1 bg-[var(--accents-2)]" />
                <span className="font-mono text-xs text-[var(--accents-4)]">{alumni.length}</span>
              </div>
            </FadeIn>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {alumni.map((member) => (
                <FadeIn key={member._id}>
                  <MemberCard member={member} locale={locale} connectLabel={t("connect")} />
                </FadeIn>
              ))}
            </div>
          </FadeInStagger>
        ) : null}
      </div>
    </>
  );
}

function MemberCard({
  member,
  locale,
  connectLabel,
}: {
  member: TeamDoc;
  locale: string;
  connectLabel: string;
}) {
  const role = member.role[locale as "en" | "it"] ?? member.role.en;

  return (
    <div className="ui-hover-lift-sm group rounded-2xl p-1">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-[color-mix(in_oklch,var(--brand-cream)_30%,var(--accents-1))] to-[var(--accents-2)] mb-4">
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
      <h3 className="font-display text-base text-[var(--foreground)] leading-snug">
        {member.firstName} {member.lastName}
      </h3>
      <p className="mt-0.5 text-xs text-[var(--accents-5)]">{role}</p>
      {member.linkedinUrl ? (
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1.5 mt-2 text-xs text-[var(--accents-4)] hover:text-[var(--brand-teal)] transition-colors"
        >
          <Linkedin className="ui-icon-shift h-3 w-3" />
          {connectLabel}
        </a>
      ) : null}
    </div>
  );
}
