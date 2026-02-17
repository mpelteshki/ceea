"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchX, Users } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Id } from "../../../convex/_generated/dataModel";
import { toPlainText } from "@/lib/plain-text";
import { EmptyState } from "@/components/ui/empty-state";

type TeamSort = "newest" | "oldest" | "name";

const TEAM_PAGE_SIZE = 10;
type TeamStatus = "all" | "member" | "alumni";

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

function parsePage(raw: string | null): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

function parseSort(raw: string | null): TeamSort {
  if (raw === "oldest" || raw === "name" || raw === "newest") return raw;
  return "newest";
}

function parseStatus(raw: string | null): TeamStatus {
  if (raw === "member" || raw === "alumni" || raw === "all") return raw;
  return "all";
}

export default function TeamAdminPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const team = useQuery(api.team.get);
  const createMember = useMutation(api.team.create);
  const updateMember = useMutation(api.team.update);
  const deleteMember = useMutation(api.team.remove);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
    type: "member" as "member" | "alumni",
    linkedinUrl: "",
    photoId: "",
  });
  const [editingMemberId, setEditingMemberId] = useState<Id<"team"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingMemberId, setDeletingMemberId] = useState<Id<"team"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<TeamStatus>(() => parseStatus(searchParams.get("status")));
  const [sortBy, setSortBy] = useState<TeamSort>(() => parseSort(searchParams.get("sort")));
  const [page, setPage] = useState(() => parsePage(searchParams.get("page")));

  const syncListState = (updates: { q?: string; status?: TeamStatus; sort?: TeamSort; page?: number }) => {
    const nextQuery = updates.q ?? searchQuery;
    const nextStatus = updates.status ?? statusFilter;
    const nextSort = updates.sort ?? sortBy;
    const nextPage = updates.page ?? page;
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim().length > 0) params.set("q", nextQuery);
    else params.delete("q");

    if (nextStatus === "all") params.delete("status");
    else params.set("status", nextStatus);

    if (nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);

    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");

    const queryString = params.toString();
    router.replace(queryString ? `/admin/team?${queryString}` : "/admin/team", { scroll: false });
  };

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      role: "",
      type: "member",
      linkedinUrl: "",
      photoId: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editingMemberId) {
        await updateMember({
          id: editingMemberId,
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role,
          type: form.type,
          linkedinUrl: form.linkedinUrl.trim(),
          photoId: form.photoId.trim(),
        });
      } else {
        await createMember({
          firstName: form.firstName,
          lastName: form.lastName,
          role: form.role,
          type: form.type,
          linkedinUrl: form.linkedinUrl.trim() || undefined,
          photoId: form.photoId.trim() || undefined,
        });
      }
      setEditingMemberId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save team member");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTeam = useMemo(() => {
    const listSource = team ?? [];
    const q = searchQuery.trim().toLowerCase();
    const list = listSource.filter((member) => {
      const matchesStatus = statusFilter === "all" ? true : member.type === statusFilter;
      const matchesQuery = q.length === 0
        ? true
        : [
          member.firstName,
          member.lastName,
          toPlainText(member.role),
          member.linkedinUrl,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });

    if (sortBy === "name") {
      list.sort((a, b) => `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`));
    } else {
      list.sort((a, b) => (sortBy === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    }

    return list;
  }, [team, searchQuery, sortBy, statusFilter]);

  const pagination = useMemo(() => paginate(filteredTeam, page, TEAM_PAGE_SIZE), [filteredTeam, page]);

  return (
    <div className="flex flex-col border-t border-[var(--accents-2)]">
      {error && (
        <div className="ui-site-container mt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Error:</span>
              {error}
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="mt-2 text-xs underline hover:no-underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Team
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                Maintain the list of student leaders and alumni members.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--accents-1)]/30 py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {editingMemberId ? "Edit member" : "Create member"}
            </h2>
            {editingMemberId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingMemberId(null);
                  resetForm();
                }}
                className="ui-btn"
                data-variant="secondary"
              >
                New member
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="First Name">
                <input
                  name="team_first_name"
                  autoComplete="off"
                  placeholder="First name…"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                  className="ui-input"
                  required
                />
              </Field>
              <Field label="Last Name">
                <input
                  name="team_last_name"
                  autoComplete="off"
                  placeholder="Last name…"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                  className="ui-input"
                  required
                />
              </Field>
              <Field label="Role">
                <input
                  name="team_role"
                  autoComplete="off"
                  placeholder="President…"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="ui-input"
                  required
                />
              </Field>
              <Field label="Status">
                <select
                  name="team_status"
                  autoComplete="off"
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
                  type="url"
                  inputMode="url"
                  spellCheck={false}
                  name="team_linkedin_url"
                  autoComplete="off"
                  placeholder="https://…"
                  value={form.linkedinUrl}
                  onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                  className="ui-input"
                />
              </Field>
              <Field label="Photo ID/URL">
                <input
                  name="team_photo_id"
                  autoComplete="off"
                  placeholder="Photo ID from Convex or external URL…"
                  value={form.photoId}
                  onChange={(e) => setForm({ ...form, photoId: e.target.value })}
                  className="ui-input"
                />
              </Field>
            </div>

            <div className="flex justify-center sm:justify-start pt-2">
              <button type="submit" className={["ui-btn", isSaving ? "opacity-60 cursor-not-allowed" : ""].join(" ")} disabled={isSaving}>
                {isSaving ? (editingMemberId ? "Saving…" : "Creating…") : (editingMemberId ? "Save changes" : "Add member")} <span className="text-[10px]">{isSaving ? "" : "->"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">Current Roster</h2>
            <div className="mt-1 text-sm text-[var(--accents-5)]">
              {team ? `${filteredTeam.length} of ${team.length} shown` : "Loading…"}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto] mb-6">
            <input
              name="team_search"
              autoComplete="off"
              aria-label="Search team members"
              value={searchQuery}
              onChange={(e) => {
                const nextQuery = e.target.value;
                setSearchQuery(nextQuery);
                setPage(1);
                syncListState({ q: nextQuery, page: 1 });
              }}
              placeholder="Search name, role, LinkedIn…"
              className="ui-input"
            />
            <select
              name="team_status_filter"
              autoComplete="off"
              aria-label="Filter team members by status"
              value={statusFilter}
              onChange={(e) => {
                const nextStatus = e.target.value as TeamStatus;
                setStatusFilter(nextStatus);
                setPage(1);
                syncListState({ status: nextStatus, page: 1 });
              }}
              className="ui-input"
            >
              <option value="all">All statuses</option>
              <option value="member">Members</option>
              <option value="alumni">Alumni</option>
            </select>
            <select
              name="team_sort"
              autoComplete="off"
              aria-label="Sort team members"
              value={sortBy}
              onChange={(e) => {
                const nextSort = e.target.value as TeamSort;
                setSortBy(nextSort);
                setPage(1);
                syncListState({ sort: nextSort, page: 1 });
              }}
              className="ui-input"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="name">Name A-Z</option>
            </select>
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)] sm:justify-end">
              <button
                type="button"
                className="ui-btn px-3 py-1.5 min-h-0 text-xs"
                data-variant="secondary"
                disabled={pagination.safePage <= 1}
                onClick={() => {
                  const nextPage = Math.max(1, pagination.safePage - 1);
                  setPage(nextPage);
                  syncListState({ page: nextPage });
                }}
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
                onClick={() => {
                  const nextPage = Math.min(pagination.totalPages, pagination.safePage + 1);
                  setPage(nextPage);
                  syncListState({ page: nextPage });
                }}
              >
                Next
              </button>
            </div>
          </div>

          {!team ? (
            <div className="py-20 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
            </div>
          ) : filteredTeam.length === 0 ? (
            <EmptyState
              title={team.length === 0 ? "No team members yet." : "No team members match the current filters."}
              description={team.length === 0 ? "Add your first member using the form above." : "Try adjusting or clearing your filters."}
              icon={team.length === 0 ? Users : SearchX}
              className="ui-card border-border bg-card/70 py-10"
            />
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {pagination.items.map((member) => (
                  <motion.div
                    key={member._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--secondary)]/50"
                  >
                    <div className="text-center sm:text-left">
                      <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        {member.firstName} {member.lastName}
                      </h4>
                      <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                        <span className="ui-tag">{member.type}</span>
                        <span className="text-sm text-[var(--muted-foreground)]">{toPlainText(member.role)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMemberId(member._id);
                          setForm({
                            firstName: member.firstName,
                            lastName: member.lastName,
                            role: toPlainText(member.role),
                            type: member.type,
                            linkedinUrl: member.linkedinUrl ?? "",
                            photoId: member.photoId ?? "",
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="ui-link text-sm"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={deletingMemberId === member._id}
                        onClick={async () => {
                          if (!confirm(`Delete ${member.firstName}?`)) return;
                          setDeletingMemberId(member._id);
                          setError(null);
                          try {
                            await deleteMember({ id: member._id });
                            if (editingMemberId === member._id) {
                              setEditingMemberId(null);
                              resetForm();
                            }
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to delete team member");
                          } finally {
                            setDeletingMemberId(null);
                          }
                        }}
                        className="ui-btn py-1.5 px-3 h-auto text-xs bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold disabled:opacity-50"
                      >
                        {deletingMemberId === member._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-2 text-center sm:text-left">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
      {children}
    </label>
  );
}
