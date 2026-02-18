"use client";

import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Suspense, useMemo, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { FolderOpen, SearchX } from "lucide-react";
import { useRouter } from "next/navigation";
import type { Id } from "../../../convex/_generated/dataModel";
import { toPlainText } from "@/lib/plain-text";
import { EmptyState } from "@/components/ui/empty-state";
import { paginate, readSearchParam, parsePage, parseEnum, AdminPanelFallback } from "@/lib/admin-utils";
import { ConfirmButton } from "@/components/ui/confirm-button";

const PROJECT_SORTS = ["newest", "oldest", "title"] as const;
type ProjectSort = typeof PROJECT_SORTS[number];
type ProjectForm = {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
};

const PROJECTS_PAGE_SIZE = 9;

function useProjectsAdminState() {
  const [form, setForm] = useState<ProjectForm>({
    title: "",
    description: "",
    imageUrl: "",
    link: "",
  });
  const [editingProjectId, setEditingProjectId] = useState<Id<"projects"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<Id<"projects"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(() => readSearchParam("q") ?? "");
  const [sortBy, setSortBy] = useState<ProjectSort>(() => parseEnum(readSearchParam("sort"), PROJECT_SORTS, "newest"));
  const [page, setPage] = useState(() => parsePage(readSearchParam("page")));

  return {
    form,
    setForm,
    editingProjectId,
    setEditingProjectId,
    isSaving,
    setIsSaving,
    deletingProjectId,
    setDeletingProjectId,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    page,
    setPage,
  };
}

export default function ProjectsAdminPage() {
  return (
    <Suspense fallback={<AdminPanelFallback label="Loading projects..." />}>
      <ProjectsAdminPageInner />
    </Suspense>
  );
}

function ProjectsAdminPageInner() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const projects = useQuery(api.projects.get, isAuthenticated ? {} : "skip");
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  const {
    form,
    setForm,
    editingProjectId,
    setEditingProjectId,
    isSaving,
    setIsSaving,
    deletingProjectId,
    setDeletingProjectId,
    error,
    setError,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    page,
    setPage,
  } = useProjectsAdminState();

  const syncListState = (updates: { q?: string; sort?: ProjectSort; page?: number }) => {
    const nextQuery = updates.q ?? searchQuery;
    const nextSort = updates.sort ?? sortBy;
    const nextPage = updates.page ?? page;
    const params = new URLSearchParams();

    if (nextQuery.trim().length > 0) params.set("q", nextQuery);
    else params.delete("q");

    if (nextSort === "newest") params.delete("sort");
    else params.set("sort", nextSort);

    if (nextPage > 1) params.set("page", String(nextPage));
    else params.delete("page");

    const queryString = params.toString();
    router.replace(queryString ? `/admin/projects?${queryString}` : "/admin/projects", { scroll: false });
  };

  const resetForm = () => {
    setForm({
      title: "",
      description: "",
      imageUrl: "",
      link: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    setError(null);

    try {
      if (editingProjectId) {
        await updateProject({
          id: editingProjectId,
          title: form.title.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl.trim(),
          link: form.link.trim(),
        });
      } else {
        await createProject({
          title: form.title.trim(),
          description: form.description.trim(),
          imageUrl: form.imageUrl.trim() || undefined,
          link: form.link.trim() || undefined,
        });
      }
      setEditingProjectId(null);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const filteredProjects = useMemo(() => {
    const listSource = projects ?? [];
    const q = searchQuery.trim().toLowerCase();
    const list = listSource.filter((project) => {
      if (q.length === 0) return true;
      return [
        toPlainText(project.title),
        toPlainText(project.description),
        project.link,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });

    if (sortBy === "title") {
      list.sort((a, b) => toPlainText(a.title).localeCompare(toPlainText(b.title)));
    } else {
      list.sort((a, b) => (sortBy === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    }

    return list;
  }, [projects, searchQuery, sortBy]);

  const pagination = useMemo(
    () => paginate(filteredProjects, page, PROJECTS_PAGE_SIZE),
    [filteredProjects, page],
  );

  if (isLoading) return <AdminPanelFallback label="Authenticating…" />;

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex flex-col border-t border-[var(--accents-2)]">
      {error && (
        <div className="ui-site-container mt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300" role="alert">
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
                Projects
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                Showcase the initiatives and impact of CEEA.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--accents-1)]/30 py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
              {editingProjectId ? "Edit project" : "Create project"}
            </h2>
            {editingProjectId ? (
              <button
                type="button"
                onClick={() => {
                  setEditingProjectId(null);
                  resetForm();
                }}
                className="ui-btn"
                data-variant="secondary"
              >
                New project
              </button>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-6">
            <Field label="Title">
              <input
                name="project_title"
                autoComplete="off"
                placeholder="Project title…"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="ui-input"
                required
              />
            </Field>

            <Field label="Description">
                <textarea
                  name="project_description"
                  autoComplete="off"
                  placeholder="Project description…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="ui-input min-h-[120px] resize-y"
                required
              />
            </Field>

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
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
                  onChange={(e) => setForm({ ...form, link: e.target.value })}
                  className="ui-input"
                />
              </Field>
            </div>

            <div className="flex justify-center sm:justify-start pt-2">
              <button type="submit" className={["ui-btn", isSaving ? "opacity-60 cursor-not-allowed" : ""].join(" ")} disabled={isSaving}>
                {isSaving ? (editingProjectId ? "Saving…" : "Creating…") : (editingProjectId ? "Save changes" : "Add project")} <span className="text-[10px]">{isSaving ? "" : "->"}</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">Current Projects</h2>
            <div className="mt-1 text-sm text-[var(--accents-5)]">
              {projects ? `${filteredProjects.length} of ${projects.length} shown` : "Loading…"}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_180px_auto] mb-6">
            <input
              name="projects_search"
              autoComplete="off"
              aria-label="Search projects"
              value={searchQuery}
              onChange={(e) => {
                const nextQuery = e.target.value;
                setSearchQuery(nextQuery);
                setPage(1);
                syncListState({ q: nextQuery, page: 1 });
              }}
              placeholder="Search title, description, link…"
              className="ui-input"
            />
            <select
              name="projects_sort"
              autoComplete="off"
              aria-label="Sort projects"
              value={sortBy}
              onChange={(e) => {
                const nextSort = e.target.value as ProjectSort;
                setSortBy(nextSort);
                setPage(1);
                syncListState({ sort: nextSort, page: 1 });
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

          {!projects ? (
            <div className="py-20 text-center">
              <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <EmptyState
              title={projects?.length === 0 ? "No projects yet." : "No projects match the current filters."}
              description={projects?.length === 0 ? "Add your first project using the form above." : "Try adjusting or clearing your filters."}
              icon={projects?.length === 0 ? FolderOpen : SearchX}
              className="ui-card border-border bg-card/70 py-10"
            />
          ) : (
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {pagination.items.map((project) => (
                  <m.div
                    key={project._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--secondary)]/50"
                  >
                    <div className="text-center sm:text-left">
                      {(() => {
                        const title = toPlainText(project.title);
                        const description = toPlainText(project.description);
                        return (
                          <>
                            <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                              {title}
                            </h3>
                            <p className="mx-auto mt-1 max-w-2xl line-clamp-2 text-sm text-[var(--muted-foreground)] sm:mx-0">{description}</p>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingProjectId(project._id);
                          const title = toPlainText(project.title);
                          const description = toPlainText(project.description);
                          setForm({
                            title,
                            description,
                            imageUrl: project.imageUrl ?? "",
                            link: project.link ?? "",
                          });
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="ui-link text-sm"
                      >
                        Edit
                      </button>
                      <ConfirmButton
                        pending={deletingProjectId === project._id}
                        onConfirm={async () => {
                          setDeletingProjectId(project._id);
                          setError(null);
                          try {
                            await deleteProject({ id: project._id });
                            if (editingProjectId === project._id) {
                              setEditingProjectId(null);
                              resetForm();
                            }
                          } catch (err) {
                            setError(err instanceof Error ? err.message : "Failed to delete project");
                          } finally {
                            setDeletingProjectId(null);
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
    </LazyMotion>
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
