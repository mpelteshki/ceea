"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function TeamAdminPage() {
    const team = useQuery(api.team.get);
    const createMember = useMutation(api.team.create);
    const deleteMember = useMutation(api.team.remove);

    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        roleEn: "",
        roleIt: "",
        roleBg: "",
        type: "member" as "member" | "alumni",
        linkedinUrl: "",
        photoId: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createMember({
            firstName: form.firstName,
            lastName: form.lastName,
            role: {
                en: form.roleEn,
                it: form.roleIt,
                bg: form.roleBg,
            },
            type: form.type,
            linkedinUrl: form.linkedinUrl || undefined,
            photoId: form.photoId || undefined,
        });
        setForm({
            firstName: "",
            lastName: "",
            roleEn: "",
            roleIt: "",
            roleBg: "",
            type: "member",
            linkedinUrl: "",
            photoId: "",
        });
    };

    if (!team) {
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
                <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Team</h2>
                <p className="text-sm text-[var(--accents-5)] max-w-2xl">
                    Maintain the list of student leaders and alumni members.
                </p>
            </header>

            <section className="space-y-6">
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Field label="First Name">
                            <input
                                placeholder="First Name"
                                value={form.firstName}
                                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Last Name">
                            <input
                                placeholder="Last Name"
                                value={form.lastName}
                                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Role (EN)">
                            <input
                                placeholder="President"
                                value={form.roleEn}
                                onChange={(e) => setForm({ ...form, roleEn: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Role (IT)">
                            <input
                                placeholder="Presidente"
                                value={form.roleIt}
                                onChange={(e) => setForm({ ...form, roleIt: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Role (BG)">
                            <input
                                placeholder="Президент"
                                value={form.roleBg}
                                onChange={(e) => setForm({ ...form, roleBg: e.target.value })}
                                className="ui-input"
                                required
                            />
                        </Field>
                        <Field label="Status">
                            <select
                                value={form.type}
                                onChange={(e) => setForm({ ...form, type: e.target.value as "member" | "alumni" })}
                                className="ui-input"
                            >
                                <option value="member">Current Member</option>
                                <option value="alumni">Alumni</option>
                            </select>
                        </Field>
                        <Field label="LinkedIn">
                            <input
                                placeholder="https://..."
                                value={form.linkedinUrl}
                                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                        <Field label="Photo ID/URL">
                            <input
                                placeholder="Photo ID from Convex or external URL"
                                value={form.photoId}
                                onChange={(e) => setForm({ ...form, photoId: e.target.value })}
                                className="ui-input"
                            />
                        </Field>
                    </div>

                    <button type="submit" className="ui-btn w-fit">
                        Add Member <span className="text-[10px]">→</span>
                    </button>
                </form>
            </section>

            <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
                <h3 className="text-xl font-semibold">Current Roster</h3>
                {team.length === 0 ? (
                    <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-8 text-center text-sm text-[var(--accents-5)] rounded-md">
                        No team members found.
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
                        <AnimatePresence initial={false}>
                            {team.map((member) => (
                                <motion.div
                                    key={member._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="group grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--accents-1)]/50 -mx-4 px-4 rounded-lg"
                                >
                                    <div>
                                        <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                                            {member.firstName} {member.lastName}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="ui-tag">{member.type}</span>
                                            <span className="text-sm text-[var(--accents-5)]">{member.role.en}</span>
                                        </div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                if (confirm(`Delete ${member.firstName}?`)) deleteMember({ id: member._id });
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
