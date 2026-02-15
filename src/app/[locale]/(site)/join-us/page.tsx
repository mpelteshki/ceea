"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/fade-in";

export default function JoinUsPage() {
    const t = useTranslations("JoinUsPage");

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
                <FadeIn>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
                        {t("title")}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-[var(--accents-5)]">
                        {t("content")}
                    </p>
                    {/* Add form or more content here */}
                </FadeIn>
            </div>
        </div>
    );
}
