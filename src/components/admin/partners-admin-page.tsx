"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Id } from "../../../convex/_generated/dataModel";

type Tier = "lead" | "supporting" | "community";
type PartnerSort = "tier" | "name" | "newest";

const PARTNERS_PAGE_SIZE = 10;

function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    safePage,
    totalPages,
    totalItems: items.length,
  };
}

function safeHostname(raw: string): string {
  try {
    return new URL(raw).hostname;
  } catch {
    return raw;
  }
}

export default function PartnersAdminPage() {
  const partners = useQuery(api.partners.listAll);
  const createPartner = useMutation(api.partners.create);
  const updatePartner = useMutation(api.partners.update);
  const deletePartner = useMutation(api.partners.remove);

  const [form, setForm] = useState({
    name: "",
    tier: "community" as Tier,
    websiteUrl: "",
    logoUrl: "",
  });
  const [editingPartnerId, setEditingPartnerId] = useState<Id<"partners"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPartnerId, setDeletingPartnerId] = useState<Id<"partners"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<"all" | Tier>("all");
  const [sortBy, setSortBy] = useState<PartnerSort>("tier");
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setForm({
      name: "",
      tier: "community",
      websiteUrl: "",
      logoUrl: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editingPartnerId) {
        await updatePartner({
          id: editingPartnerId,
          name: form.name,
          tier: form.tier,
          websiteUrl: form.websiteUrl.trim(),
          logoUrl: form.logoUrl.trim(),
        });
      } else {
        await createPartner({
          name: form.name,
          tier: form.tier,
          websiteUrl: form.websiteUrl.trim() || undefined,
          logoUrl: form.logoUrl.trim() || undefined,
        });
      }
      setEditingPartnerId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save partner");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPartners = useMemo(() => {
    const listSource = partners ?? [];
    const q = searchQuery.trim().toLowerCase();
    const list = listSource.filter((partner) => {
      const matchesTier = tierFilter === "all" ? true : partner.tier === tierFilter;
      const matchesQuery = q.length === 0
        ? true
        : [partner.name, partner.websiteUrl, partner.logoUrl]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      return matchesTier && matchesQuery;
    });

    const tierRank: Record<Tier, number> = { lead: 0, supporting: 1, community: 2 };
    if (sortBy === "name") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "newest") {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else {
      list.sort((a, b) => {
        const byTier = tierRank[a.tier] - tierRank[b.tier];
        return byTier !== 0 ? byTier : a.name.localeCompare(b.name);
      });
    }

    return list;
  }, [partners, searchQuery, sortBy, tierFilter]);

  const pagination = useMemo(
    () => paginate(filteredPartners, page, PARTNERS_PAGE_SIZE),
    [filteredPartners, page],
  );

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
    <div className="space-y-10 text-center sm:text-left">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      ) : null}

      <header className="space-y-1">
        <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Partners</h2>
        <p className="mx-auto max-w-2xl text-sm text-[var(--muted-foreground)] sm:mx-0">
          Add organizations and companies that support the CEEA mission.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
            {editingPartnerId ? "Edit partner" : "Create partner"}
          </h3>
          {editingPartnerId ? (
            <button
              type="button"
              onClick={() => {
                setEditingPartnerId(null);
                resetForm();
              }}
              className="ui-btn"
              data-variant="secondary"
            >
              New partner
            </button>
          ) : null}
        </div>

        <form onSubmit={handleSubmit} className="ui-card p-6 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name">
              <input
                name="partner_name"
                autoComplete="off"
                placeholder="Partner name..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="ui-input"
                required
              />
            </Field>
            <Field label="Tier">
              <select
                name="partner_tier"
                autoComplete="off"
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
                inputMode="url"
                spellCheck={false}
                name="partner_website_url"
                autoComplete="off"
                placeholder="https://company.com..."
                value={form.websiteUrl}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                className="ui-input"
              />
            </Field>
            <Field label="Logo URL">
              <input
                type="url"
                inputMode="url"
                spellCheck={false}
                name="partner_logo_url"
                autoComplete="off"
                placeholder="https://company.com/logo.png..."
                value={form.logoUrl}
                onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
                className="ui-input"
              />
            </Field>
          </div>

          <div className="flex justify-center sm:justify-end">
            <button type="submit" className={["ui-btn", isSaving ? "opacity-60 cursor-not-allowed" : ""].join(" ")} disabled={isSaving}>
              {isSaving ? (editingPartnerId ? "Saving..." : "Creating...") : (editingPartnerId ? "Save changes" : "Add partner")} <span className="text-[10px]">{isSaving ? "" : "->"}</span>
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">Current Partners</h3>
          <div className="text-sm text-[var(--muted-foreground)]">
            {filteredPartners.length} of {partners.length} shown
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, website, logo URL..."
            className="ui-input"
          />
          <select
            value={tierFilter}
            onChange={(e) => {
              setTierFilter(e.target.value as "all" | Tier);
              setPage(1);
            }}
            className="ui-input"
          >
            <option value="all">All tiers</option>
            <option value="lead">Lead</option>
            <option value="supporting">Supporting</option>
            <option value="community">Community</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as PartnerSort);
              setPage(1);
            }}
            className="ui-input"
          >
            <option value="tier">Tier then name</option>
            <option value="name">Name A-Z</option>
            <option value="newest">Newest first</option>
          </select>
          <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)] sm:justify-end">
            <button
              type="button"
              className="ui-btn px-3 py-1.5 min-h-0 text-xs"
              data-variant="secondary"
              disabled={pagination.safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span>
              Page {pagination.safePage}/{pagination.totalPages}
            </span>
            <button
              type="button"
              className="ui-btn px-3 py-1.5 min-h-0 text-xs"
              data-variant="secondary"
              disabled={pagination.safePage >= pagination.totalPages}
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {filteredPartners.length === 0 ? (
          <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-8 text-center text-sm text-[var(--accents-5)] rounded-md">
            {partners.length === 0 ? "No partners found. Add one above." : "No partners match the current filters."}
          </div>
        ) : (
          <div className="divide-y divide-[var(--accents-2)] border-t border-[var(--accents-2)]">
            <AnimatePresence initial={false}>
              {pagination.items.map((partner) => (
                <motion.div
                  key={partner._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="group grid gap-4 py-6 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--accents-1)]/50 -mx-4 px-4 rounded-lg"
                >
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    {partner.logoUrl ? (
                      <div className="relative h-10 w-10 overflow-hidden rounded border border-[var(--accents-2)] bg-white p-1">
                        <Image
                          src={partner.logoUrl}
                          alt={partner.name}
                          fill
                          className="object-contain p-1"
                          sizes="40px"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded border border-[var(--accents-2)] bg-[var(--accents-1)] flex items-center justify-center text-[10px] font-bold text-[var(--accents-4)]">
                        LOGO
                      </div>
                    )}
                    <div>
                      <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        {partner.name}
                      </h4>
                      <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                        <span className="ui-tag">{partner.tier}</span>
                        {partner.websiteUrl ? (
                          <a
                            href={partner.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--accents-5)] hover:text-[var(--foreground)] transition-colors underline decoration-[var(--accents-2)]"
                          >
                            {safeHostname(partner.websiteUrl)}
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingPartnerId(partner._id);
                        setForm({
                          name: partner.name,
                          tier: partner.tier,
                          websiteUrl: partner.websiteUrl ?? "",
                          logoUrl: partner.logoUrl ?? "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="ui-link text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingPartnerId === partner._id}
                      onClick={async () => {
                        if (!confirm(`Delete ${partner.name}?`)) return;
                        setDeletingPartnerId(partner._id);
                        setError(null);
                        try {
                          await deletePartner({ id: partner._id });
                          if (editingPartnerId === partner._id) {
                            setEditingPartnerId(null);
                            resetForm();
                          }
                        } catch (err) {
                          setError(err instanceof Error ? err.message : "Failed to delete partner");
                        } finally {
                          setDeletingPartnerId(null);
                        }
                      }}
                      className="ui-btn py-2 px-4 bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold disabled:opacity-50"
                    >
                      {deletingPartnerId === partner._id ? "Deleting..." : "Delete"}
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
    <label className="block space-y-2 text-center sm:text-left">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--accents-5)]">
        {label}
      </div>
      {children}
    </label>
  );
}
