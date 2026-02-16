"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsAdminPage() {
    const projects = useQuery(api.projects.get);
    const createProject = useMutation(api.projects.create);
    const deleteProject = useMutation(api.projects.remove);

    const [form, setForm] = useState({
        titleEn: "",
        titleIt: "",
        descEn: "",
        descIt: "",
        imageUrl: "",
        link: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createProject({
            title: { en: form.titleEn, it: form.titleIt },
            description: { en: form.descEn, it: form.descIt },
            imageUrl: form.imageUrl || undefined,
            link: form.link || undefined,
        });
        setForm({
            titleEn: "", titleIt: "",
            descEn: "", descIt: "",
            imageUrl: "", link: "",
        });
    };

    if (!projects) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse bg-[var(--accents-2)] rounded" />
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="h-32 animate-pulse bg-[var(--accents-1)] rounded-lg border border-[var(--accents-2)]" />
                    <div className="h-32 animate-pulse bg-[var(--accents-1)] rounded-lg border border-[var(--accents-2)]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <header className="space-y-1">
                <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Projects</h2>
                <p className="text-sm text-[var(--muted-foreground)] max-w-2xl">
                    Showcase the initiatives and impact of CEEA.
                </p>
            </header>

            <section className="space-y-6">
                <form onSubmit={handleSubmit} className="ui-card p-6 grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Title (EN)">
                            <input
                                name="project_title_en"
                                autoComplete="off"
                                placeholder="Project title…"
                                value={form.titleEn}
                                onChange={e => setForm({ ...form, titleEn: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Title (IT)">
                            <input
                                name="project_title_it"
                                autoComplete="off"
                                placeholder="Titolo…"
                                value={form.titleIt}
                                onChange={e => setForm({ ...form, titleIt: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Description (EN)">
                            <textarea
                                name="project_description_en"
                                autoComplete="off"
                                placeholder="English description…"
                                value={form.descEn}
                                onChange={e => setForm({ ...form, descEn: e.target.value })}
                                className="ui-input min-h-[160px] resize-y"
                                required
                            />
                        </Field>
                        <Field label="Description (IT)">
                            <textarea
                                name="project_description_it"
                                autoComplete="off"
                                placeholder="Descrizione…"
                                value={form.descIt}
                                onChange={e => setForm({ ...form, descIt: e.target.value })}
                                className="ui-input min-h-[160px] resize-y"
                                required
                            />
                        </Field>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Image URL">
                            <input
                                type="url"
                                inputMode="url"
                                spellCheck={false}
                                name="project_image_url"
                                autoComplete="off"
                                placeholder="https://…"
                                value={form.imageUrl}
                                onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                        <Field label="Project Link">
                            <input
                                type="url"
                                inputMode="url"
                                spellCheck={false}
                                name="project_link"
                                autoComplete="off"
                                placeholder="https://…"
                                value={form.link}
                                onChange={e => setForm({ ...form, link: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                    </div>

                    <div className="flex justify-end">
                        <button type="submit" className="ui-btn">
                            Add Project <span className="text-[10px]">→</span>
                        </button>
                    </div>
                </form>
            </section>

            <section className="space-y-4 pt-8 border-t border-[var(--border)]">
                <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">Current Projects</h3>
                {projects.length === 0 ? (
                    <div className="ui-card p-8 text-center text-sm text-[var(--muted-foreground)]">
                        No projects found.
                    </div>
                ) : (
                    <div className="grid gap-3">
                        <AnimatePresence initial={false}>
                            {projects.map((p) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="ui-card group grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--secondary)]/50"
                                >
                                    <div>
                                        <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                                            {p.title.en}
                                        </h4>
                                        <p className="mt-1 text-sm text-[var(--muted-foreground)] line-clamp-2 max-w-2xl">{p.description.en}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete ${p.title.en}?`)) deleteProject({ id: p._id });
                                            }}
                                            className="ui-btn py-1.5 px-3 h-auto text-xs bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold"
                                        >
                                            Delete
                                        </button>
                                    </div>
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
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                {label}
            </div>
            {children}
        </label>
    );
}
