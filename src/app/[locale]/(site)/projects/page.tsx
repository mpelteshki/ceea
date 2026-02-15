"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";
import { ArrowUpRight } from "lucide-react";
import { ExpandableText } from "@/components/ui/expandable-text";

export default function ProjectsPage() {
    const locale = useLocale();
    const t = useTranslations("ProjectsPage");
    const projects = useQuery(api.projects.get);

    if (!projects) return null;

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        {t("title")}
                    </h1>
                </FadeIn>

                <FadeInStagger className="mt-16 grid gap-16 lg:grid-cols-2">
                    {projects.map((project) => (
                        <FadeIn key={project._id} className="flex flex-col gap-6">
                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[var(--accents-1)]">
                                {project.imageUrl && (
                                    <img
                                        src={project.imageUrl}
                                        alt={project.title[locale as "en"]}
                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                    />
                                )}
                            </div>
                            <div>
                                <h3 className="font-display text-2xl font-bold text-[var(--foreground)]">
                                    {project.title[locale as "en" | "it" | "bg"]}
                                </h3>
                                <div className="mt-4">
                                    <ExpandableText
                                        text={project.description[locale as "en" | "it" | "bg"]}
                                        readMoreLabel={t("readMore")}
                                        readLessLabel={t("readLess")}
                                        maxLines={3}
                                    />
                                </div>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--foreground)] hover:opacity-70"
                                    >
                                        {t("learnMore")}
                                        <ArrowUpRight className="h-4 w-4" />
                                    </a>
                                )}
                            </div>
                        </FadeIn>
                    ))}
                </FadeInStagger>
            </div>
        </div>
    );
}
