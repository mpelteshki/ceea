"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Tier = "lead" | "supporting" | "community";

export default function PartnersAdminPage() {
    const partners = useQuery(api.partners.listAll);
    const createPartner = useMutation(api.partners.create);
    const deletePartner = useMutation(api.partners.remove);

    const [form, setForm] = useState({
        name: "",
        tier: "community" as Tier,
        websiteUrl: "",
        logoUrl: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createPartner({
            name: form.name,
            tier: form.tier,
            websiteUrl: form.websiteUrl || undefined,
            logoUrl: form.logoUrl || undefined,
        });
        setForm({
            name: "",
            tier: "community",
            websiteUrl: "",
            logoUrl: "",
        });
    };

    if (!partners) {
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
                <div className="ui-kicker">Manage</div>
                <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Partners</h2>
                <p className="text-sm text-[var(--accents-5)] max-w-2xl">
                    Add organizations and companies that support the CEEA mission.
                </p>
            </header>

            <section className="space-y-6">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Name">
                            <input
                                placeholder="Partner name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Tier">
                            <select
                                value={form.tier}
                                onChange={(e) => setForm({ ...form, tier: e.target.value as Tier })}
                                className="ui-input"
                            >
                                <option value="lead">Lead</option>
                                <option value="supporting">Supporting</option>
                                <option value="community">Community</option>
                            </select>
                        </Field>
                        <Field label="Website URL">
                            <input
                                type="url"
                                placeholder="https://company.com"
                                value={form.websiteUrl}
                                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                        <Field label="Logo URL">
                            <input
                                placeholder="https://company.com/logo.png"
                                value={form.logoUrl}
                                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                    </div>

                    <button type="submit" className="ui-btn w-fit">
                        Add Partner <span className="text-[10px]">→</span>
                    </button>
                </form>
            </section>

            <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
                <h3 className="text-xl font-semibold">Current Partners</h3>
                {partners.length === 0 ? (
                    <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-8 text-center text-sm text-[var(--accents-5)] rounded-md">
                        No partners found. Add one above.
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
                        <AnimatePresence initial={false}>
                            {partners.map((p) => (
                                <motion.div
                                    key={p._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--accents-1)]/50 -mx-4 px-4 rounded-lg"
                                >
                                    <div className="flex items-center gap-4">
                                        {p.logoUrl ? (
                                            <img src={p.logoUrl} alt={p.name} className="h-10 w-10 object-contain rounded border border-[var(--accents-2)] bg-white p-1" />
                                        ) : (
                                            <div className="h-10 w-10 rounded border border-[var(--accents-2)] bg-[var(--accents-1)] flex items-center justify-center text-[10px] font-bold text-[var(--accents-4)]">
                                                LOGO
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                                                {p.name}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="ui-tag">{p.tier}</span>
                                                {p.websiteUrl && (
                                                    <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--accents-5)] hover:text-[var(--foreground)] transition-colors underline decoration-[var(--accents-2)]">
                                                        {new URL(p.websiteUrl).hostname}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete ${p.name}?`)) deletePartner({ id: p._id });
                                            }}
                                            className="ui-btn py-2 px-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-all font-bold"
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
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accents-5)]">
                {label}
            </div>
            {children}
        </label>
    );
}
