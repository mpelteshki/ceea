"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Id } from "../../../convex/_generated/dataModel";

type ProjectSort = "newest" | "oldest" | "title";

const PROJECTS_PAGE_SIZE = 9;

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

export default function ProjectsAdminPage() {
  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.remove);

  const [form, setForm] = useState({
    titleEn: "",
    titleIt: "",
    descEn: "",
    descIt: "",
    imageUrl: "",
    link: "",
  });
  const [editingProjectId, setEditingProjectId] = useState<Id<"projects"> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingProjectId, setDeletingProjectId] = useState<Id<"projects"> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<ProjectSort>("newest");
  const [page, setPage] = useState(1);

  const resetForm = () => {
    setForm({
      titleEn: "",
      titleIt: "",
      descEn: "",
      descIt: "",
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
          title: { en: form.titleEn, it: form.titleIt },
          description: { en: form.descEn, it: form.descIt },
          imageUrl: form.imageUrl.trim(),
          link: form.link.trim(),
        });
      } else {
        await createProject({
          title: { en: form.titleEn, it: form.titleIt },
          description: { en: form.descEn, it: form.descIt },
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
        project.title.en,
        project.title.it,
        project.description.en,
        project.description.it,
        project.link,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });

    if (sortBy === "title") {
      list.sort((a, b) => a.title.en.localeCompare(b.title.en));
    } else {
      list.sort((a, b) => (sortBy === "newest" ? b.createdAt - a.createdAt : a.createdAt - b.createdAt));
    }

    return list;
  }, [projects, searchQuery, sortBy]);

  const pagination = useMemo(
    () => paginate(filteredProjects, page, PROJECTS_PAGE_SIZE),
    [filteredProjects, page],
  );

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
    <div className="space-y-10 text-center sm:text-left">
      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </div>
      ) : null}
      <header className="space-y-1">
        <h2 className="text-3xl font-bold font-display tracking-tight text-[var(--foreground)]">Projects</h2>
        <p className="mx-auto max-w-2xl text-sm text-[var(--muted-foreground)] sm:mx-0">
          Showcase the initiatives and impact of CEEA.
        </p>
      </header>

      <section className="space-y-6">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">
            {editingProjectId ? "Edit project" : "Create project"}
          </h3>
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

        <form onSubmit={handleSubmit} className="ui-card p-6 grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title (EN)">
              <input
                name="project_title_en"
                autoComplete="off"
                placeholder="Project title..."
                value={form.titleEn}
                onChange={(e) => setForm({ ...form, titleEn: e.target.value })}
                className="ui-input"
                required
              />
            </Field>
            <Field label="Title (IT)">
              <input
                name="project_title_it"
                autoComplete="off"
                placeholder="Titolo..."
                value={form.titleIt}
                onChange={(e) => setForm({ ...form, titleIt: e.target.value })}
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
                placeholder="English description..."
                value={form.descEn}
                onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                className="ui-input min-h-[160px] resize-y"
                required
              />
            </Field>
            <Field label="Description (IT)">
              <textarea
                name="project_description_it"
                autoComplete="off"
                placeholder="Descrizione..."
                value={form.descIt}
                onChange={(e) => setForm({ ...form, descIt: e.target.value })}
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
                placeholder="https://..."
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
                placeholder="https://..."
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="ui-input"
              />
            </Field>
          </div>

          <div className="flex justify-center sm:justify-end">
            <button type="submit" className={["ui-btn", isSaving ? "opacity-60 cursor-not-allowed" : ""].join(" ")} disabled={isSaving}>
              {isSaving ? (editingProjectId ? "Saving..." : "Creating...") : (editingProjectId ? "Save changes" : "Add project")} <span className="text-[10px]">{isSaving ? "" : "->"}</span>
            </button>
          </div>
        </form>
      </section>

      <section className="space-y-4 pt-8 border-t border-[var(--border)]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h3 className="font-display text-xl font-semibold text-[var(--foreground)]">Current Projects</h3>
          <div className="text-sm text-[var(--muted-foreground)]">
            {filteredProjects.length} of {projects.length} shown
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
          <input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search title, description, link..."
            className="ui-input"
          />
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as ProjectSort);
              setPage(1);
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

        {filteredProjects.length === 0 ? (
          <div className="ui-card p-8 text-center text-sm text-[var(--muted-foreground)]">
            {projects.length === 0 ? "No projects found." : "No projects match the current filters."}
          </div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence initial={false}>
              {pagination.items.map((project) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="ui-card group grid gap-4 p-4 md:grid-cols-[1fr_auto] md:items-center transition-colors hover:bg-[var(--secondary)]/50"
                >
                  <div className="text-center sm:text-left">
                    <h4 className="font-display text-lg font-semibold text-[var(--foreground)]">
                      {project.title.en}
                    </h4>
                    <p className="mx-auto mt-1 max-w-2xl line-clamp-2 text-sm text-[var(--muted-foreground)] sm:mx-0">{project.description.en}</p>
                  </div>

                  <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProjectId(project._id);
                        setForm({
                          titleEn: project.title.en,
                          titleIt: project.title.it,
                          descEn: project.description.en,
                          descIt: project.description.it,
                          imageUrl: project.imageUrl ?? "",
                          link: project.link ?? "",
                        });
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="ui-link text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={deletingProjectId === project._id}
                      onClick={async () => {
                        if (!confirm(`Delete ${project.title.en}?`)) return;
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
                      className="ui-btn py-1.5 px-3 h-auto text-xs bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold disabled:opacity-50"
                    >
                      {deletingProjectId === project._id ? "Deleting..." : "Delete"}
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
      <div className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
      {children}
    </label>
  );
}
