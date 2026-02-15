"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { Linkedin } from "lucide-react";
import { Link } from "@/i18n/routing";

export default function TeamPage() {
    const locale = useLocale();
    const t = useTranslations("TeamPage");
    const team = useQuery(api.team.get);

    if (!team) return null;

    const members = team.filter((m) => m.type === "member");
    const alumni = team.filter((m) => m.type === "alumni");

    const renderMember = (member: any) => (
        <div
            key={member._id}
            className="group relative flex flex-col overflow-hidden rounded-sm bg-[var(--accents-1)] transition-colors hover:bg-[var(--accents-2)]"
        >
            <div className="aspect-[3/4] w-full overflow-hidden bg-[var(--accents-2)]">
                {member.photoId ? (
                    <img
                        src={member.photoId} // Assuming URL for now, or use storage URL logic
                        alt={`${member.firstName} ${member.lastName}`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-[var(--accents-3)]">
                        <span className="text-4xl font-display font-bold opacity-20">
                            {member.firstName[0]}
                            {member.lastName[0]}
                        </span>
                    </div>
                )}
            </div>
            <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold text-[var(--foreground)]">
                    {member.firstName} {member.lastName}
                </h3>
                <p className="mt-1 text-sm text-[var(--accents-5)]">
                    {member.role[locale as "en" | "it" | "bg"]}
                </p>
                {member.linkedinUrl && (
                    <div className="mt-4 pt-4 border-t border-[var(--accents-2)]">
                        <a
                            href={member.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-xs font-medium text-[var(--accents-5)] transition-colors hover:text-[#0077b5]"
                        >
                            <Linkedin className="h-4 w-4" />
                            {t("connect")}
                        </a>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        {t("title")}
                    </h1>
                </FadeIn>

                <FadeInStagger className="mt-20">
                    <FadeIn>
                        <h2 className="text-2xl font-bold font-display mb-8 border-b border-[var(--accents-2)] pb-4">{t("members")}</h2>
                    </FadeIn>
                    <div role="list" className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                        {members.map(member => (
                            <FadeIn key={member._id}>{renderMember(member)}</FadeIn>
                        ))}
                    </div>
                </FadeInStagger>

                {alumni.length > 0 && (
                    <FadeInStagger className="mt-24">
                        <FadeIn>
                            <h2 className="text-2xl font-bold font-display mb-8 border-b border-[var(--accents-2)] pb-4">{t("alumni")}</h2>
                        </FadeIn>
                        <div role="list" className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-4">
                            {alumni.map(member => (
                                <FadeIn key={member._id}>{renderMember(member)}</FadeIn>
                            ))}
                        </div>
                    </FadeInStagger>
                )}
            </div>
        </div>
    );
}
