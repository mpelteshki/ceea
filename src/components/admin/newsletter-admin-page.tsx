"use client";

import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Suspense, useMemo, useState } from "react";
import { AnimatePresence, m } from "framer-motion";
import { FileText, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Id } from "../../../convex/_generated/dataModel";
import { EmptyState } from "@/components/ui/empty-state";
import {
  paginate,
  readSearchParam,
  parsePage,
  parseEnum,
  AdminPanelFallback,
} from "@/lib/admin-utils";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { MarkdownEditor, AdminMarkdownRenderer } from "@/components/admin/markdown-editor";
import { fmtLongDate } from "@/lib/format-date";

/* ------------------------------------------------------------------ */
/*  Types & constants                                                  */
/* ------------------------------------------------------------------ */

/** Mirrors the shape returned by `api.posts.listAll` (minus `createdBy`). */
type PostDoc = {
  _id: Id<"posts">;
  _creationTime: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt?: number;
  createdAt: number;
  updatedAt: number;
};

const POST_SORTS = ["newest", "oldest", "title"] as const;
type PostSort = (typeof POST_SORTS)[number];
const POST_STATUSES = ["all", "published", "draft"] as const;
type PostStatus = (typeof POST_STATUSES)[number];

const PAGE_SIZE = 10;

type PostForm = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  isDraft: boolean;
  publishedAt: string; // datetime-local string
};

const EMPTY_FORM: PostForm = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  isDraft: false,
  publishedAt: new Date().toISOString().slice(0, 16),
};

/* ------------------------------------------------------------------ */
/*  Slug helper                                                        */
/* ------------------------------------------------------------------ */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/* ------------------------------------------------------------------ */
/*  State hook                                                         */
/* ------------------------------------------------------------------ */

function usePostsAdminState() {
  const [form, setForm] = useState<PostForm>({ ...EMPTY_FORM });
  const [editingPostId, setEditingPostId] = useState<Id<"posts"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<Id<"posts"> | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    () => readSearchParam("q") ?? "",
  );
  const [statusFilter, setStatusFilter] = useState<PostStatus>(() =>
    parseEnum(readSearchParam("status"), POST_STATUSES, "all"),
  );
  const [sortBy, setSortBy] = useState<PostSort>(() =>
    parseEnum(readSearchParam("sort"), POST_SORTS, "newest"),
  );
  const [page, setPage] = useState(() => parsePage(readSearchParam("page")));
  /** Track whether the user has manually edited the slug */
  const [slugTouched, setSlugTouched] = useState(false);

  return {
    form,
    setForm,
    editingPostId,
    setEditingPostId,
    isSaving,
    setIsSaving,
    deletingPostId,
    setDeletingPostId,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    slugTouched,
    setSlugTouched,
  };
}

/* ------------------------------------------------------------------ */
/*  Component (wrapped in Suspense)                                    */
/* ------------------------------------------------------------------ */

export default function NewsletterAdminPage() {
  return (
    <Suspense fallback={<AdminPanelFallback label="Loading newsletter…" />}>
      <NewsletterAdminPageInner />
    </Suspense>
  );
}

function NewsletterAdminPageInner() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const postsRaw = useQuery(api.posts.listAll, isAuthenticated ? {} : "skip");
  const posts = postsRaw as PostDoc[] | undefined;
  const createPost = useMutation(api.posts.create);
  const updatePost = useMutation(api.posts.update);
  const deletePost = useMutation(api.posts.remove);

  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    form,
    setForm,
    editingPostId,
    setEditingPostId,
    isSaving,
    setIsSaving,
    deletingPostId,
    setDeletingPostId,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    page,
    setPage,
    slugTouched,
    setSlugTouched,
  } = usePostsAdminState();

  /* ---- URL sync ---- */
  const syncListState = (updates: {
    q?: string;
    status?: PostStatus;
    sort?: PostSort;
    page?: number;
  }) => {
    const nextQuery = updates.q ?? searchQuery;
    const nextStatus = updates.status ?? statusFilter;
    const nextSort = updates.sort ?? sortBy;
    const nextPage = updates.page ?? page;
    const params = new URLSearchParams();

    if (nextQuery.trim().length > 0) params.set("q", nextQuery);
    if (nextStatus !== "all") params.set("status", nextStatus);
    if (nextSort !== "newest") params.set("sort", nextSort);
    if (nextPage > 1) params.set("page", String(nextPage));

    const qs = params.toString();
    router.replace(qs ? `/admin/newsletter?${qs}` : "/admin/newsletter", {
      scroll: false,
    });
  };

  /* ---- Form helpers ---- */
  const resetForm = () => {
    setForm({ ...EMPTY_FORM, publishedAt: new Date().toISOString().slice(0, 16) });
    setSlugTouched(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      const publishedAtMs = form.isDraft
        ? undefined
        : new Date(form.publishedAt).getTime();

      if (editingPostId) {
        await updatePost({
          id: editingPostId,
          slug: form.slug.trim(),
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          body: form.body,
          publishedAt: form.isDraft ? null : (publishedAtMs ?? null),
        });
      } else {
        await createPost({
          slug: form.slug.trim(),
          title: form.title.trim(),
          excerpt: form.excerpt.trim(),
          body: form.body,
          publishedAt: publishedAtMs,
        });
      }
      setEditingPostId(null);
      resetForm();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save newsletter post",
      );
    } finally {
      setIsSaving(false);
    }
  };

  /* ---- Filtering & sorting ---- */
  const filteredPosts = useMemo(() => {
    const listSource = posts ?? [];
    const q = searchQuery.trim().toLowerCase();
    const list = listSource.filter((post) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
            ? post.publishedAt != null
            : post.publishedAt == null;
      const matchesQuery =
        q.length === 0
          ? true
          : [post.title, post.excerpt, post.slug]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });

    if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      list.sort((a, b) => b.createdAt - a.createdAt);
    }

    return list;
  }, [posts, searchQuery, sortBy, statusFilter]);

  const pagination = useMemo(
    () => paginate(filteredPosts, page, PAGE_SIZE),
    [filteredPosts, page],
  );

  if (isLoading) return <AdminPanelFallback label="Authenticating…" />;

  /* ---- Render ---- */
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
                Newsletter
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                Create and edit newsletter posts. Supports full Markdown with
                live preview.
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
              {editingPostId ? "Edit Post" : "Create Post"}
            </h2>
            {editingPostId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingPostId(null);
                  resetForm();
                }}
                className="ui-btn"
                data-variant="secondary"
              >
                New post
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  name="post_title"
                  autoComplete="off"
                  placeholder="Welcome to CEEA…"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      // Auto-generate slug from title unless user touched it
                      ...(slugTouched ? {} : { slug: slugify(title) }),
                    }));
                  }}
                  className="ui-input"
                  required
                />
              </Field>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
              >
                {showAdvanced ? "Hide Advanced Settings" : "Show Advanced Settings"}
              </button>
            </div>

            {showAdvanced && (
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Slug">
                  <input
                    name="post_slug"
                    autoComplete="off"
                    placeholder="welcome-to-ceea (used in URL)"
                    spellCheck={false}
                    value={form.slug}
                    onChange={(e) => {
                      setSlugTouched(true);
                      setForm((prev) => ({ ...prev, slug: e.target.value }));
                    }}
                    className="ui-input font-mono text-sm"
                    required
                  />
                </Field>
              </div>
            )}

            <Field label="Subheading">
              <textarea
                name="post_excerpt"
                autoComplete="off"
                placeholder="A brief summary shown in the dispatch list…"
                value={form.excerpt}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                className="ui-input min-h-[60px] resize-y"
                rows={2}
                required
              />
            </Field>

            <Field label="Article Content">
              <MarkdownEditor
                value={form.body}
                onChange={(v) => setForm((prev) => ({ ...prev, body: v }))}
                rows={20}
                placeholder="Write your article in Markdown…"
                name="post_body"
                ariaLabel="Post body (markdown)"
                required
                renderPreview={(value) => (
                  <div className="relative bg-[var(--background)] min-h-[500px] font-sans rounded-b-lg border-t-0 -mt-px border border-border/80">
                    {/* Hero Header */}
                    <div className="relative overflow-hidden border-b border-border/40">
                      <div className="absolute inset-0 bg-[var(--background)]" />
                      {/* Glow Effects */}
                      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--brand-tan)]/10 blur-[100px] rounded-full pointer-events-none" />

                      <div className="relative mx-auto max-w-5xl px-5 pb-16 pt-24 sm:px-6 sm:pb-24 sm:pt-32">
                        <div className="inline-flex items-center text-sm font-medium text-muted-foreground mb-10 sm:mb-14">
                          &larr; Back to Dispatch
                        </div>

                        <h1 className="text-balance font-display text-[clamp(2.5rem,6vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
                          {form.title || "Post Title"}
                        </h1>

                        <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-border/50 pt-8">
                          <span className="inline-flex items-center rounded-full bg-[var(--accents-1)] px-3 py-1 font-mono text-[0.75rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                            {form.isDraft ? "Draft" : fmtLongDate(new Date(form.publishedAt).getTime())}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">
                            CEEA Dispatch
                          </span>
                        </div>

                        {form.excerpt && (
                          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-[1.25rem]">
                            {form.excerpt}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="relative bg-[var(--background)]">
                      {/* Subtle bottom glow */}
                      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--brand-teal)]/5 blur-[120px] rounded-full pointer-events-none" />

                      <div className="relative mx-auto max-w-5xl px-5 py-12 sm:px-6 sm:py-20">
                        <div className="rounded-3xl border border-border/60 bg-white/40 dark:bg-black/20 p-6 sm:p-12 md:p-16 backdrop-blur-md shadow-sm">
                          <div className="prose prose-lg md:prose-xl max-w-none text-left prose-headings:font-display prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-[var(--foreground)] prose-p:leading-relaxed prose-p:text-muted-foreground prose-p:text-[1.125rem] md:prose-p:text-[1.25rem] prose-a:font-medium prose-a:text-[var(--foreground)] prose-a:underline prose-a:decoration-[var(--brand-tan)] prose-a:underline-offset-4 hover:prose-a:decoration-[var(--brand-teal)] prose-code:bg-[var(--accents-1)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-[0.9em] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-blockquote:border-l-4 prose-blockquote:border-l-[var(--brand-teal)] prose-blockquote:pl-6 prose-blockquote:text-lg prose-blockquote:italic prose-blockquote:text-muted-foreground prose-strong:text-[var(--foreground)] prose-li:text-muted-foreground prose-li:text-[1.125rem] md:prose-li:text-[1.25rem]">
                            <AdminMarkdownRenderer value={value} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              />
            </Field>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Publish date">
                <input
                  type="datetime-local"
                  name="post_published_at"
                  value={form.publishedAt}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      publishedAt: e.target.value,
                    }))
                  }
                  disabled={form.isDraft}
                  className="ui-input disabled:opacity-50"
                />
              </Field>
              <Field label="Status">
                <label className="flex items-center gap-3 py-2">
                  <input
                    type="checkbox"
                    checked={form.isDraft}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        isDraft: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-[var(--accents-3)] accent-[var(--foreground)]"
                  />
                  <span className="text-sm text-[var(--foreground)]">
                    Keep as draft (hidden from public)
                  </span>
                </label>
              </Field>
            </div>

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
                  ? editingPostId
                    ? "Saving…"
                    : "Creating…"
                  : editingPostId
                    ? "Save Changes"
                    : "Publish Post"}
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
              All Posts
            </h2>
            <div className="mt-1 text-sm text-[var(--accents-5)]">
              {posts
                ? `${filteredPosts.length} of ${posts.length} shown`
                : "Loading…"}
            </div>
          </div>

          <div className="mb-6 grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
            <input
              name="posts_search"
              autoComplete="off"
              aria-label="Search posts"
              value={searchQuery}
              onChange={(e) => {
                const nextQuery = e.target.value;
                setSearchQuery(nextQuery);
                setPage(1);
                syncListState({ q: nextQuery, page: 1 });
              }}
              placeholder="Search title, subheading, slug…"
              className="ui-input"
            />
            <select
              name="posts_status_filter"
              autoComplete="off"
              aria-label="Filter posts by status"
              value={statusFilter}
              onChange={(e) => {
                const next = e.target.value as PostStatus;
                setStatusFilter(next);
                setPage(1);
                syncListState({ status: next, page: 1 });
              }}
              className="ui-input"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
            <select
              name="posts_sort"
              autoComplete="off"
              aria-label="Sort posts"
              value={sortBy}
              onChange={(e) => {
                const next = e.target.value as PostSort;
                setSortBy(next);
                setPage(1);
                syncListState({ sort: next, page: 1 });
              }}
              className="ui-input"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A-Z</option>
            </select>
            <div className="flex items-center justify-center gap-2 text-xs text-[var(--muted-foreground)] sm:justify-end">
              <button
                type="button"
                className="ui-btn min-h-0 px-3 py-1.5 text-xs"
                data-variant="secondary"
                disabled={pagination.safePage <= 1}
                onClick={() => {
                  const next = Math.max(1, pagination.safePage - 1);
                  setPage(next);
                  syncListState({ page: next });
                }}
              >
                Prev
              </button>
              <span>
                Page {pagination.safePage}/{pagination.totalPages}
              </span>
              <button
                type="button"
                className="ui-btn min-h-0 px-3 py-1.5 text-xs"
                data-variant="secondary"
                disabled={pagination.safePage >= pagination.totalPages}
                onClick={() => {
                  const next = Math.min(
                    pagination.totalPages,
                    pagination.safePage + 1,
                  );
                  setPage(next);
                  syncListState({ page: next });
                }}
              >
                Next
              </button>
            </div>
          </div>

          {!posts ? (
            <div className="py-20 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState
              title={
                posts.length === 0
                  ? "No newsletter posts yet."
                  : "No posts match the current filters."
              }
              description={
                posts.length === 0
                  ? "Create your first post using the form above."
                  : "Try adjusting or clearing your filters."
              }
              icon={posts.length === 0 ? FileText : SearchX}
              className="ui-card border-border bg-card/70 py-10"
            />
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {pagination.items.map((post) => (
                  <m.div
                    key={post._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={[
                      "ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center",
                      editingPostId === post._id ? "ring-2 ring-[var(--brand-teal)] border-transparent" : "",
                    ].join(" ")}
                  >
                    <div className="text-center sm:text-left">
                      <div className="flex items-center justify-center gap-2 sm:justify-start">
                        <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                          {post.title}
                        </h4>
                        <span
                          className={[
                            "ui-tag text-[10px]",
                            post.publishedAt != null
                              ? ""
                              : "border-amber-300 text-amber-600 dark:border-amber-800 dark:text-amber-400",
                          ].join(" ")}
                        >
                          {post.publishedAt != null ? "published" : "draft"}
                        </span>
                      </div>
                      <p className="mx-auto mt-1 max-w-2xl line-clamp-1 text-sm text-[var(--muted-foreground)] sm:mx-0">
                        {post.excerpt}
                      </p>
                      <div className="mt-2 flex items-center justify-center gap-3 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] sm:justify-start">
                        <span>/{post.slug}</span>
                        {post.publishedAt != null && (
                          <span>
                            {new Date(post.publishedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingPostId(post._id);
                          setSlugTouched(true);
                          setForm({
                            slug: post.slug,
                            title: post.title,
                            excerpt: post.excerpt,
                            body: post.body,
                            isDraft: post.publishedAt == null,
                            publishedAt: post.publishedAt
                              ? new Date(post.publishedAt)
                                .toISOString()
                                .slice(0, 16)
                              : new Date().toISOString().slice(0, 16),
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="ui-link text-sm"
                      >
                        Edit
                      </button>
                      <a
                        href={`/newsletter/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ui-link text-sm"
                      >
                        View
                      </a>
                      <ConfirmButton
                        pending={deletingPostId === post._id}
                        onConfirm={async () => {
                          setDeletingPostId(post._id);
                          setError(null);
                          try {
                            await deletePost({ id: post._id });
                            if (editingPostId === post._id) {
                              setEditingPostId(null);
                              resetForm();
                            }
                          } catch (err) {
                            setError(
                              err instanceof Error
                                ? err.message
                                : "Failed to delete post",
                            );
                          } finally {
                            setDeletingPostId(null);
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
