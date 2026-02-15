"use client";

import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/ui/fade-in";
import { Mail, Instagram, Linkedin } from "lucide-react";

export default function ContactPage() {
    const t = useTranslations("ContactPage");

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        {t("title")}
                    </h1>
                </FadeIn>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <FadeIn className="rounded-2xl border border-[var(--accents-2)] p-8">
                        <h3 className="font-display text-xl font-bold">{t("email")}</h3>
                        <a href="mailto:ceea@unibocconi.it" className="mt-4 flex items-center gap-3 text-[var(--accents-5)] hover:text-[var(--foreground)]">
                            <Mail className="h-5 w-5" />
                            ceea@unibocconi.it
                        </a>
                    </FadeIn>
                    <FadeIn className="rounded-2xl border border-[var(--accents-2)] p-8">
                        <h3 className="font-display text-xl font-bold">{t("followUs")}</h3>
                        <div className="mt-4 flex flex-col gap-4">
                            <a href="https://instagram.com/ceea_bocconi" target="_blank" rel="noopener" className="flex items-center gap-3 text-[var(--accents-5)] hover:text-[var(--foreground)]">
                                <Instagram className="h-5 w-5" />
                                Instagram
                            </a>
                            <a href="https://linkedin.com/company/ceea-bocconi" target="_blank" rel="noopener" className="flex items-center gap-3 text-[var(--accents-5)] hover:text-[var(--foreground)]">
                                <Linkedin className="h-5 w-5" />
                                LinkedIn
                            </a>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </div>
    );
}
