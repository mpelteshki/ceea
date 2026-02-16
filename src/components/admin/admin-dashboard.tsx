"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import type { Id } from "../../../convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { hasConvex } from "@/lib/public-env";

type Kind = "flagship" | "career" | "culture" | "community";
type EventDoc = Doc<"events">;
type PostDoc = Doc<"posts">;

export function AdminDashboard() {
  if (!hasConvex) {
    return (
      <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
        Convex backend not configured. Set{" "}
        <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CONVEX_URL</span> and Convex
        deployment env vars in Vercel.
      </div>
    );
  }

  return <AdminDashboardInner />;
}

function AdminDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const tab: "events" | "posts" = tabParam === "newsletter" ? "posts" : "events";

  const events = useQuery(api.events.listAll, {}) as EventDoc[] | undefined;
  const createEvent = useMutation(api.events.create);
  const removeEvent = useMutation(api.events.remove);

  const posts = useQuery(api.posts.listAll, {}) as PostDoc[] | undefined;
  const createDraft = useMutation(api.posts.createDraft);
  const updateDraft = useMutation(api.posts.updateDraft);
  const publish = useMutation(api.posts.publish);
  const unpublish = useMutation(api.posts.unpublish);
  const removePost = useMutation(api.posts.remove);

  // Loading states for mutations
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<Id<"events"> | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<Id<"posts"> | null>(null);
  const [publishingPostId, setPublishingPostId] = useState<Id<"posts"> | null>(null);

  // Error state
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [title_it, setTitleIt] = useState("");
  const [summary, setSummary] = useState("");
  const [summary_it, setSummaryIt] = useState("");
  const [location, setLocation] = useState("Bocconi University");
  const [kind, setKind] = useState<Kind>("flagship");
  const [startsAt, setStartsAt] = useState(() =>
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  );
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [moreInfoUrl, setMoreInfoUrl] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postTitle_it, setPostTitleIt] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postExcerpt_it, setPostExcerptIt] = useState("");
  const [postBody, setPostBody] = useState(
    `# Title\n\nWrite in **Markdown**.\n\n- Keep it concrete\n- Add links\n`,
  );
  const [editingPostId, setEditingPostId] = useState<Id<"posts"> | null>(null);

  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      summary.trim().length >= 10 &&
      location.trim().length >= 2
    );
  }, [title, summary, location]);

  const canSubmitPost = useMemo(() => {
    return (
      postTitle.trim().length >= 3 &&
      postExcerpt.trim().length >= 10 &&
      postBody.trim().length >= 10
    );
  }, [postTitle, postExcerpt, postBody]);

  return (
    <div className="space-y-10">
      {error && (
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
      )}

      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">

            <h1 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
              Dashboard
            </h1>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          Manage your site&rsquo;s content. All changes are synced in real-time.
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
          {[
            { label: "Events", value: events?.length ?? "..." },
            { label: "Posts", value: posts?.length ?? "..." },
            { label: "Published", value: posts?.filter(p => p.publishedAt).length ?? "..." },
            { label: "Drafts", value: posts?.filter(p => !p.publishedAt).length ?? "..." },
          ].map((stat) => (
            <div key={stat.label} className="ui-card p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{stat.label}</div>
              <div className="mt-1 text-2xl font-bold font-display text-[var(--foreground)]">{stat.value}</div>
            </div>
          ))}
        </div>
      </header>


      <div className="flex gap-1 bg-[var(--secondary)] p-1 rounded-lg w-fit">
        <button
          type="button"
          onClick={() => router.replace("/admin?tab=events", { scroll: false })}
          className={[
            "px-4 py-2 text-sm font-medium transition-colors rounded-md",
            tab === "events"
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          ].join(" ")}
        >
          Events
        </button>
        <button
          type="button"
          onClick={() =>
            router.replace("/admin?tab=newsletter", { scroll: false })
          }
          className={[
            "px-4 py-2 text-sm font-medium transition-colors rounded-md",
            tab === "posts"
              ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
              : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]",
          ].join(" ")}
        >
          Newsletter
        </button>
      </div>

      {tab === "events" ? (
        <>
          <section className="space-y-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">Create event</h2>
                <p className="mt-1 text-sm text-[var(--accents-5)]">
                  Keep it short. The public pages are deliberately minimal.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title (English)">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Danube Dialogues: Growth & Identity"
                  name="event_title"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Title (Italian)">
                <input
                  value={title_it}
                  onChange={(e) => setTitleIt(e.target.value)}
                  placeholder="Dialoghi sul Danubio"
                  name="event_title_it"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Kind">
                <select
                  value={kind}
                  onChange={(e) => setKind(e.target.value as Kind)}
                  name="event_kind"
                  autoComplete="off"
                  className="ui-input"
                >
                  <option value="flagship">flagship</option>
                  <option value="career">career</option>
                  <option value="culture">culture</option>
                  <option value="community">community</option>
                </select>
              </Field>
              <Field label="Starts at">
                <input
                  type="datetime-local"
                  value={startsAt}
                  onChange={(e) => setStartsAt(e.target.value)}
                  name="event_starts_at"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Location">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Velodromo Building, Room N01"
                  name="event_location"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Summary (English)" full>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={3}
                  placeholder="A speaker night about building cross-border careers..."
                  name="event_summary"
                  autoComplete="off"
                  className="ui-input resize-none"
                />
              </Field>
              <Field label="Summary (Italian)" full>
                <textarea
                  value={summary_it}
                  onChange={(e) => setSummaryIt(e.target.value)}
                  rows={3}
                  placeholder="Una serata di discussione..."
                  name="event_summary_it"
                  autoComplete="off"
                  className="ui-input resize-none"
                />
              </Field>
              <Field label="RSVP URL">
                <input
                  value={rsvpUrl}
                  onChange={(e) => setRsvpUrl(e.target.value)}
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                  name="event_rsvp_url"
                  autoComplete="off"
                  spellCheck={false}
                  className="ui-input"
                />
              </Field>
              <Field label="More info URL">
                <input
                  value={moreInfoUrl}
                  onChange={(e) => setMoreInfoUrl(e.target.value)}
                  type="url"
                  inputMode="url"
                  placeholder="https://..."
                  name="event_more_info_url"
                  autoComplete="off"
                  spellCheck={false}
                  className="ui-input"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                type="button"
                disabled={!canSubmit || isCreatingEvent}
                onClick={async () => {
                  if (!canSubmit || isCreatingEvent) return;
                  setIsCreatingEvent(true);
                  setError(null);
                  try {
                    const ms = new Date(startsAt).getTime();
                    await createEvent({
                      title: title.trim(),
                      title_it: title_it.trim() || undefined,
                      summary: summary.trim(),
                      summary_it: summary_it.trim() || undefined,
                      location: location.trim(),
                      kind,
                      startsAt: ms,
                      rsvpUrl: rsvpUrl.trim() || undefined,
                      moreInfoUrl: moreInfoUrl.trim() || undefined,
                    });
                    setTitle("");
                    setTitleIt("");
                    setSummary("");
                    setSummaryIt("");
                    setRsvpUrl("");
                    setMoreInfoUrl("");
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to create event");
                  } finally {
                    setIsCreatingEvent(false);
                  }
                }}
                className={["ui-btn", (!canSubmit || isCreatingEvent) ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
              >
                {isCreatingEvent ? "Creating..." : "Create"} <span className="text-[10px]">{isCreatingEvent ? "" : "→"}</span>
              </button>
              <div className="text-xs text-[var(--muted-foreground)]">
                If this fails: check Clerk JWT + Convex auth config, and `ADMIN_EMAILS`.
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
            <div className="flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">Events</h2>
                <div className="mt-1 text-sm text-[var(--accents-5)]">
                  {events ? `${events.length} total` : "Loading…"}
                </div>
              </div>
            </div>

            {!events ? (
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-6">
                    <div className="h-5 w-2/3 animate-pulse bg-[var(--secondary)] rounded" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse bg-[var(--secondary)] rounded" />
                  </div>
                ))}
              </div>
            ) : events.length === 0 ? (
              <div className="ui-card p-8 text-center text-sm text-[var(--muted-foreground)]">
                No events found. Create one to get started.
              </div>
            ) : (
              <div className="grid gap-4">
                <AnimatePresence initial={false}>
                  {events.map((e) => (
                    <motion.div
                      key={e._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start transition-colors hover:bg-[var(--secondary)]/50"
                    >
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-baseline justify-between gap-4 md:block">
                          <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                            {e.title}
                          </h3>
                          <span className="ui-tag md:mt-2">{e.kind}</span>
                        </div>
                        <p className="line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">
                          {e.summary}
                        </p>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                          <span>{new Date(e.startsAt).toLocaleDateString()} at {new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          <span>{e.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-start gap-4 md:justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          disabled={deletingEventId === e._id}
                          onClick={async () => {
                            if (!confirm("Delete this event?")) return;
                            setDeletingEventId(e._id);
                            setError(null);
                            try {
                              await removeEvent({ id: e._id });
                            } catch (err) {
                              setError(err instanceof Error ? err.message : "Failed to delete event");
                            } finally {
                              setDeletingEventId(null);
                            }
                          }}
                          className="ui-btn py-1.5 px-3 h-auto text-xs bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold disabled:opacity-50"
                        >
                          {deletingEventId === e._id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

          </section>
        </>
      ) : (
        <>
          <section className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">
                  {editingPostId ? "Edit post" : "Create post"}
                </h2>
                <div className="mt-1 text-sm text-[var(--accents-5)]">
                  Renders publicly at <span className="font-mono text-[var(--foreground)]">/newsletter</span>.
                </div>
              </div>
              {editingPostId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null);
                    setPostTitle("");
                    setPostSlug("");
                    setPostExcerpt("");
                    setPostBody(
                      `# Title\n\nWrite in **Markdown**.\n\n- Keep it concrete\n- Add links\n`,
                    );
                  }}
                  className="ui-btn"
                  data-variant="secondary"
                >
                  New draft
                </button>
              ) : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Title (English)">
                <input
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="A new semester, a tighter cadence"
                  name="post_title"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Title (Italian)">
                <input
                  value={postTitle_it}
                  onChange={(e) => setPostTitleIt(e.target.value)}
                  placeholder="Un nuovo semestre..."
                  name="post_title_it"
                  autoComplete="off"
                  className="ui-input"
                />
              </Field>
              <Field label="Slug (optional override)">
                <input
                  value={postSlug}
                  onChange={(e) => setPostSlug(e.target.value)}
                  placeholder="new-semester-tighter-cadence"
                  name="post_slug_override"
                  autoComplete="off"
                  spellCheck={false}
                  className="ui-input"
                />
              </Field>
              <Field label="Excerpt (English)" full>
                <textarea
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  rows={2}
                  placeholder="One paragraph summary..."
                  name="post_excerpt"
                  autoComplete="off"
                  className="ui-input resize-none"
                />
              </Field>
              <Field label="Excerpt (Italian)" full>
                <textarea
                  value={postExcerpt_it}
                  onChange={(e) => setPostExcerptIt(e.target.value)}
                  rows={2}
                  placeholder="Riassunto in un paragrafo..."
                  name="post_excerpt_it"
                  autoComplete="off"
                  className="ui-input resize-none"
                />
              </Field>
              <Field label="Body (Markdown)" full>
                <textarea
                  value={postBody}
                  onChange={(e) => setPostBody(e.target.value)}
                  rows={12}
                  name="post_body_markdown"
                  autoComplete="off"
                  spellCheck={false}
                  className="ui-input resize-none font-mono text-[12px] leading-5"
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                type="button"
                disabled={!canSubmitPost || isCreatingPost}
                onClick={async () => {
                  if (!canSubmitPost || isCreatingPost) return;
                  setIsCreatingPost(true);
                  setError(null);
                  try {
                    if (editingPostId) {
                      await updateDraft({
                        id: editingPostId,
                        title: postTitle.trim(),
                        title_it: postTitle_it.trim() || undefined,
                        excerpt: postExcerpt.trim(),
                        excerpt_it: postExcerpt_it.trim() || undefined,
                        body: postBody,
                      });
                    } else {
                      const id = await createDraft({
                        title: postTitle.trim(),
                        title_it: postTitle_it.trim() || undefined,
                        excerpt: postExcerpt.trim(),
                        excerpt_it: postExcerpt_it.trim() || undefined,
                        body: postBody,
                        slug: postSlug.trim() || undefined,
                      });
                      setEditingPostId(id);
                    }
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "Failed to save post");
                  } finally {
                    setIsCreatingPost(false);
                  }
                }}
                className={["ui-btn", (!canSubmitPost || isCreatingPost) ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
              >
                {isCreatingPost ? (editingPostId ? "Saving..." : "Creating...") : (editingPostId ? "Save changes" : "Create draft")}
              </button>

              {editingPostId ? (
                <>
                  <button
                    type="button"
                    disabled={publishingPostId === editingPostId}
                    onClick={async () => {
                      setPublishingPostId(editingPostId);
                      setError(null);
                      try {
                        await publish({ id: editingPostId });
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to publish");
                      } finally {
                        setPublishingPostId(null);
                      }
                    }}
                    className="ui-btn disabled:opacity-50"
                    data-variant="secondary"
                  >
                    {publishingPostId === editingPostId ? "Publishing..." : "Publish"}
                  </button>
                  <button
                    type="button"
                    disabled={publishingPostId === editingPostId}
                    onClick={async () => {
                      setPublishingPostId(editingPostId);
                      setError(null);
                      try {
                        await unpublish({ id: editingPostId });
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "Failed to unpublish");
                      } finally {
                        setPublishingPostId(null);
                      }
                    }}
                    className="ui-btn disabled:opacity-50"
                    data-variant="secondary"
                  >
                    {publishingPostId === editingPostId ? "Unpublishing..." : "Unpublish"}
                  </button>
                </>
              ) : null}

              <div className="text-xs text-[var(--accents-5)]">
                Tip: keep the excerpt short; the body can be longer.
              </div>
            </div>
          </section>

          <section className="space-y-4 pt-8 border-t border-[var(--accents-2)]">
            <div>
              <h2 className="font-display text-xl font-semibold text-[var(--foreground)]">Posts</h2>
              <div className="mt-1 text-sm text-[var(--accents-5)]">
                {posts ? `${posts.length} total` : "Loading…"}
              </div>
            </div>

            {!posts ? (
              <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="py-6">
                    <div className="h-5 w-2/3 animate-pulse bg-[var(--secondary)] rounded" />
                    <div className="mt-3 h-4 w-1/2 animate-pulse bg-[var(--secondary)] rounded" />
                    <div className="mt-6 h-4 w-1/3 animate-pulse bg-[var(--secondary)] rounded" />
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="ui-card p-4 text-sm text-[var(--muted-foreground)] rounded-md">
                No posts yet.
              </div>
            ) : (
              <div className="grid gap-4">
                {posts.map((p) => {
                  const isPublished = p.publishedAt != null;
                  return (
                    <div
                      key={p._id}
                      className="ui-card p-5 grid gap-4 md:grid-cols-[1fr_auto] md:items-start"
                    >
                      <div className="min-w-0 space-y-3">
                        <div className="flex items-baseline justify-between gap-4 md:block">
                          <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                            {p.title}
                          </h3>
                          <span
                            className={[
                              "ui-tag md:mt-2",
                              isPublished
                                ? "border-green-200 bg-green-50 text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300"
                                : "text-[var(--muted-foreground)]",
                            ].join(" ")}
                          >
                            {isPublished ? "published" : "draft"}
                          </span>
                        </div>

                        <p className="line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">
                          {p.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)]">
                          <span>/{p.slug}</span>
                          <span>
                            {isPublished
                              ? `published ${new Date(p.publishedAt!).toISOString()}`
                              : "draft"}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPostId(p._id);
                              setPostTitle(p.title);
                              setPostTitleIt(p.title_it ?? "");
                              setPostSlug("");
                              setPostExcerpt(p.excerpt);
                              setPostExcerptIt(p.excerpt_it ?? "");
                              setPostBody(p.body);
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="ui-link text-sm"
                          >
                            Edit
                          </button>
                          {isPublished ? (
                            <button
                              type="button"
                              disabled={publishingPostId === p._id}
                              onClick={async () => {
                                setPublishingPostId(p._id);
                                setError(null);
                                try {
                                  await unpublish({ id: p._id });
                                } catch (err) {
                                  setError(err instanceof Error ? err.message : "Failed to unpublish");
                                } finally {
                                  setPublishingPostId(null);
                                }
                              }}
                              className="ui-link text-sm disabled:opacity-50"
                            >
                              {publishingPostId === p._id ? "Unpublishing..." : "Unpublish"}
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={publishingPostId === p._id}
                              onClick={async () => {
                                setPublishingPostId(p._id);
                                setError(null);
                                try {
                                  await publish({ id: p._id });
                                } catch (err) {
                                  setError(err instanceof Error ? err.message : "Failed to publish");
                                } finally {
                                  setPublishingPostId(null);
                                }
                              }}
                              className="ui-link text-sm disabled:opacity-50"
                            >
                              {publishingPostId === p._id ? "Publishing..." : "Publish"}
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={deletingPostId === p._id}
                            onClick={async () => {
                              if (!confirm("Delete this post?")) return;
                              setDeletingPostId(p._id);
                              setError(null);
                              try {
                                await removePost({ id: p._id });
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Failed to delete post");
                              } finally {
                                setDeletingPostId(null);
                              }
                            }}
                            className="ui-link text-sm text-red-600 hover:text-red-700 decoration-red-200 hover:decoration-red-600 disabled:opacity-50"
                          >
                            {deletingPostId === p._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <label className={full ? "md:col-span-2" : ""}>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
        {label}
      </div>
      {children}
    </label>
  );
}
