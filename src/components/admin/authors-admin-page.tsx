"use client";

import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Suspense, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { SearchX, UserCircle } from "lucide-react";
import type { Id } from "../../../convex/_generated/dataModel";
import { EmptyState } from "@/components/ui/empty-state";
import { AdminPanelFallback } from "@/lib/admin-utils";
import { ConfirmButton } from "@/components/ui/confirm-button";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type AuthorDoc = {
  _id: Id<"authors">;
  _creationTime: number;
  name: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  photoId?: string;
  createdAt: number;
};

type AuthorForm = {
  name: string;
  bio: string;
  linkedinUrl: string;
  websiteUrl: string;
};

const EMPTY_FORM: AuthorForm = {
  name: "",
  bio: "",
  linkedinUrl: "",
  websiteUrl: "",
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AuthorsAdminPage() {
  return (
    <Suspense fallback={<AdminPanelFallback label="Loading authors…" />}>
      <AuthorsAdminPageInner />
    </Suspense>
  );
}

function AuthorsAdminPageInner() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const authorsRaw = useQuery(api.authors.list, isAuthenticated ? {} : "skip");
  const authors = authorsRaw as AuthorDoc[] | undefined;
  const createAuthor = useMutation(api.authors.create);
  const updateAuthor = useMutation(api.authors.update);
  const deleteAuthor = useMutation(api.authors.remove);

  const [form, setForm] = useState<AuthorForm>({ ...EMPTY_FORM });
  const [editingId, setEditingId] = useState<Id<"authors"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<Id<"authors"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editingId) {
        await updateAuthor({
          id: editingId,
          name: form.name.trim(),
          bio: form.bio.trim() || null,
          linkedinUrl: form.linkedinUrl.trim() || null,
          websiteUrl: form.websiteUrl.trim() || null,
        });
      } else {
        await createAuthor({
          name: form.name.trim(),
          bio: form.bio.trim() || undefined,
          linkedinUrl: form.linkedinUrl.trim() || undefined,
          websiteUrl: form.websiteUrl.trim() || undefined,
        });
      }
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save author");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredAuthors = useMemo(() => {
    const list = authors ?? [];
    const q = searchQuery.trim().toLowerCase();
    if (q.length === 0) return list;
    return list.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.bio?.toLowerCase().includes(q) ||
        a.linkedinUrl?.toLowerCase().includes(q),
    );
  }, [authors, searchQuery]);

  if (isLoading) return <AdminPanelFallback label="Authenticating…" />;

  return (
    <div className="flex flex-col border-t border-[var(--accents-2)]">
      {/* Error banner */}
      {error && (
        <div className="ui-site-container mt-4">
          <div
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300"
            role="alert"
          >
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

      {/* Header */}
      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Authors
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                Manage author profiles. Authors are shown on newsletter articles
                with clickable profiles including LinkedIn and bio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--accents-1)]/30 py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="mb-8 flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {editingId ? "Edit author" : "Add author"}
            </h2>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="ui-btn"
                data-variant="secondary"
              >
                New author
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Name">
                <input
                  name="author_name"
                  autoComplete="off"
                  placeholder="e.g. Jane Doe"
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="ui-input"
                  required
                />
              </Field>
              <Field label="LinkedIn URL">
                <input
                  type="url"
                  inputMode="url"
                  spellCheck={false}
                  name="author_linkedin"
                  autoComplete="off"
                  placeholder="https://linkedin.com/in/…"
                  value={form.linkedinUrl}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      linkedinUrl: e.target.value,
                    }))
                  }
                  className="ui-input"
                />
              </Field>
            </div>

            <Field label="Bio">
              <textarea
                name="author_bio"
                autoComplete="off"
                placeholder="A short bio about this author…"
                value={form.bio}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, bio: e.target.value }))
                }
                className="ui-input min-h-[60px] resize-y"
                rows={2}
              />
            </Field>

            <Field label="Website URL">
              <input
                type="url"
                inputMode="url"
                spellCheck={false}
                name="author_website"
                autoComplete="off"
                placeholder="https://…"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    websiteUrl: e.target.value,
                  }))
                }
                className="ui-input"
              />
            </Field>

            <div className="flex justify-center pt-2 sm:justify-start">
              <button
                type="submit"
                className={[
                  "ui-btn",
                  isSaving ? "opacity-60 cursor-not-allowed" : "",
                ].join(" ")}
                disabled={isSaving}
              >
                {isSaving
                  ? editingId
                    ? "Saving…"
                    : "Creating…"
                  : editingId
                    ? "Save changes"
                    : "Add author"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* List */}
      <section className="relative overflow-hidden bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              All Authors
            </h2>
            <div className="mt-1 text-sm text-[var(--accents-5)]">
              {authors
                ? `${filteredAuthors.length} of ${authors.length} shown`
                : "Loading…"}
            </div>
          </div>

          <div className="mb-6">
            <input
              name="authors_search"
              autoComplete="off"
              aria-label="Search authors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, bio…"
              className="ui-input max-w-md"
            />
          </div>

          {!authors ? (
            <div className="py-20 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
            </div>
          ) : filteredAuthors.length === 0 ? (
            <EmptyState
              title={
                authors.length === 0
                  ? "No authors yet."
                  : "No authors match the search."
              }
              description={
                authors.length === 0
                  ? "Add your first author using the form above."
                  : "Try adjusting your search query."
              }
              icon={authors.length === 0 ? UserCircle : SearchX}
              className="ui-card border-border bg-card/70 py-10"
            />
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {filteredAuthors.map((author) => (
                  <m.div
                    key={author._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={[
                      "ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center",
                      editingId === author._id
                        ? "ring-2 ring-[var(--brand-teal)] border-transparent"
                        : "",
                    ].join(" ")}
                  >
                    <div className="text-center sm:text-left">
                      <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                        {author.name}
                      </h4>
                      {author.bio && (
                        <p className="mx-auto mt-1 max-w-2xl line-clamp-1 text-sm text-[var(--muted-foreground)] sm:mx-0">
                          {author.bio}
                        </p>
                      )}
                      <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] sm:justify-start">
                        {author.linkedinUrl && (
                          <a
                            href={author.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground"
                          >
                            LinkedIn
                          </a>
                        )}
                        {author.websiteUrl && (
                          <a
                            href={author.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-foreground"
                          >
                            Website
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(author._id);
                          setForm({
                            name: author.name,
                            bio: author.bio ?? "",
                            linkedinUrl: author.linkedinUrl ?? "",
                            websiteUrl: author.websiteUrl ?? "",
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="ui-link text-sm"
                      >
                        Edit
                      </button>
                      <ConfirmButton
                        pending={deletingId === author._id}
                        onConfirm={async () => {
                          setDeletingId(author._id);
                          setError(null);
                          try {
                            await deleteAuthor({ id: author._id });
                            if (editingId === author._id) resetForm();
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Failed to delete author",
                            );
                          } finally {
                            setDeletingId(null);
                          }
                        }}
                      />
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-center sm:text-left">
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
      {children}
    </label>
  );
}
