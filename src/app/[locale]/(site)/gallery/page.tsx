"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useLocale, useTranslations } from "next-intl";
import { FadeIn, FadeInStagger } from "@/components/ui/fade-in";

export default function GalleryPage() {
    const locale = useLocale();
    const t = useTranslations("GalleryPage");
    const gallery = useQuery(api.gallery.get);

    if (!gallery) return null;

    return (
        <div className="py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <FadeIn>
                    <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                        {t("title")}
                    </h1>
                </FadeIn>

                <FadeInStagger className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {gallery.map((item) => (
                        <FadeIn key={item._id}>
                            <div className="group relative break-inside-avoid overflow-hidden rounded-xl bg-[var(--accents-1)]">
                                <img
                                    src={item.imageUrl}
                                    alt={item.caption[locale as "en" | "it" | "bg"]}
                                    className="w-full object-cover transition duration-300 group-hover:scale-105"
                                    style={{ aspectRatio: "4/3" }} // Or use masonry layout if needed
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-6 flex items-end">
                                    <p className="text-white font-medium">
                                        {item.caption[locale as "en" | "it" | "bg"]}
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </FadeInStagger>
            </div>
        </div>
    );
}
