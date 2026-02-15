"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GalleryAdminPage() {
    const gallery = useQuery(api.gallery.get);
    const createItem = useMutation(api.gallery.create);
    const deleteItem = useMutation(api.gallery.remove);

    const [form, setForm] = useState({
        imageUrl: "",
        captionEn: "",
        captionIt: "",
        captionBg: "",
        category: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createItem({
            imageUrl: form.imageUrl,
            caption: {
                en: form.captionEn,
                it: form.captionIt,
                bg: form.captionBg,
            },
            category: form.category || undefined,
        });
        setForm({
            imageUrl: "",
            captionEn: "",
            captionIt: "",
            captionBg: "",
            category: "",
        });
    };

    if (!gallery) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="h-48 animate-pulse bg-[var(--accents-1)] rounded-lg border border-[var(--accents-2)]" />
                    <div className="h-48 animate-pulse bg-[var(--accents-1)] rounded-lg border border-[var(--accents-2)]" />
                    <div className="h-48 animate-pulse bg-[var(--accents-1)] rounded-lg border border-[var(--accents-2)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="space-y-1">
                <div className="ui-kicker">Manage</div>
                <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Gallery</h2>
                <p className="text-sm text-[var(--accents-5)] max-w-2xl">
                    Visual highlights from the community.
                </p>
            </header>

            <section className="space-y-6">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <Field label="Image URL">
                        <input
                            placeholder="https://..."
                            value={form.imageUrl}
                            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                            className="ui-input"
                            required
                        />
                    </Field>
                    <div className="grid gap-4 md:grid-cols-3">
                        <Field label="Caption (EN)">
                            <input
                                placeholder="English caption"
                                value={form.captionEn}
                                onChange={(e) => setForm({ ...form, captionEn: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Caption (IT)">
                            <input
                                placeholder="Didascalia"
                                value={form.captionIt}
                                onChange={(e) => setForm({ ...form, captionIt: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Caption (BG)">
                            <input
                                placeholder="Описание"
                                value={form.captionBg}
                                onChange={(e) => setForm({ ...form, captionBg: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                    </div>
                    <Field label="Category">
                        <input
                            placeholder="Events, Social, etc."
                            value={form.category}
                            onChange={(e) => setForm({ ...form, category: e.target.value })}
                            className="ui-input"
                        />
                    </Field>

                    <button type="submit" className="ui-btn w-fit">
                        Add Image <span className="text-[10px]">→</span>
                    </button>
                </form>
            </section>

            <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
                <h3 className="text-xl font-semibold">Current Gallery</h3>
                {gallery.length === 0 ? (
                    <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-8 text-center text-sm text-[var(--accents-5)] rounded-md">
                        No images found.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        <AnimatePresence initial={false}>
                            {gallery.map((item) => (
                                <motion.div
                                    key={item._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="group relative aspect-square overflow-hidden rounded-lg border border-[var(--accents-2)] bg-[var(--accents-1)]"
                                >
                                    <img
                                        src={item.imageUrl}
                                        alt={item.caption.en}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                                        <p className="text-xs text-white line-clamp-1">{item.caption.en}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this image?")) deleteItem({ id: item._id });
                                        }}
                                        className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                                    >
                                        <span className="text-xl leading-none">&times;</span>
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </section>
        </div>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="block space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accents-5)]">
                {label}
            </div>
            {children}
        </label>
    );
}
