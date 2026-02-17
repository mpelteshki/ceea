"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, FileText, SearchX } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Doc } from "../../../convex/_generated/dataModel";
import type { Id } from "../../../convex/_generated/dataModel";
import { useRouter, useSearchParams } from "next/navigation";
import { hasConvex } from "@/lib/public-env";
import { EmptyState } from "@/components/ui/empty-state";

type Kind = "flagship" | "career" | "culture" | "community";
type EventDoc = Doc<"events">;
type PostDoc = Doc<"posts">;
type EventSort = "soonest" | "latest";
type PostSort = "newest" | "oldest" | "title";
type PostStatusFilter = "all" | "published" | "draft";

const EVENTS_PAGE_SIZE = 8;
const POSTS_PAGE_SIZE = 8;

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

function toDatetimeLocal(ms: number) {
  const date = new Date(ms);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

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
  const updateEvent = useMutation(api.events.update);
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
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("Bocconi University");
  const [kind, setKind] = useState<Kind>("flagship");
  const [startsAt, setStartsAt] = useState(() =>
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  );
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [moreInfoUrl, setMoreInfoUrl] = useState("");
  const [editingEventId, setEditingEventId] = useState<Id<"events"> | null>(null);

  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
  const [postBody, setPostBody] = useState(
    `# Title\n\nWrite in **Markdown**.\n\n- Keep it concrete\n- Add links\n`,
  );
  const [editingPostId, setEditingPostId] = useState<Id<"posts"> | null>(null);
  const [eventsQuery, setEventsQuery] = useState("");
  const [eventsKindFilter, setEventsKindFilter] = useState<"all" | Kind>("all");
  const [eventsSort, setEventsSort] = useState<EventSort>("soonest");
  const [eventsPage, setEventsPage] = useState(1);
  const [postsQuery, setPostsQuery] = useState("");
  const [postsStatusFilter, setPostsStatusFilter] = useState<PostStatusFilter>("all");
  const [postsSort, setPostsSort] = useState<PostSort>("newest");
  const [postsPage, setPostsPage] = useState(1);

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

  const filteredEvents = useMemo(() => {
    if (!events) return [] as EventDoc[];
    const q = eventsQuery.trim().toLowerCase();
    const list = events.filter((event) => {
      const matchesKind = eventsKindFilter === "all" ? true : event.kind === eventsKindFilter;
      const matchesQuery = q.length === 0
        ? true
        : [event.title, event.summary, event.location]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      return matchesKind && matchesQuery;
    });

    list.sort((a, b) => (eventsSort === "soonest" ? a.startsAt - b.startsAt : b.startsAt - a.startsAt));
    return list;
  }, [events, eventsKindFilter, eventsQuery, eventsSort]);

  const filteredPosts = useMemo(() => {
    if (!posts) return [] as PostDoc[];
    const q = postsQuery.trim().toLowerCase();
    const list = posts.filter((post) => {
      const isPublished = post.publishedAt != null;
      const matchesStatus = postsStatusFilter === "all"
        ? true
        : postsStatusFilter === "published"
          ? isPublished
          : !isPublished;
      const matchesQuery = q.length === 0
        ? true
        : [post.title, post.excerpt, post.slug]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });

    if (postsSort === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      list.sort((a, b) => {
        const aDate = a.createdAt;
        const bDate = b.createdAt;
        return postsSort === "newest" ? bDate - aDate : aDate - bDate;
      });
    }
    return list;
  }, [posts, postsQuery, postsSort, postsStatusFilter]);

  const eventsPagination = useMemo(
    () => paginate(filteredEvents, eventsPage, EVENTS_PAGE_SIZE),
    [filteredEvents, eventsPage],
  );
  const postsPagination = useMemo(
    () => paginate(filteredPosts, postsPage, POSTS_PAGE_SIZE),
    [filteredPosts, postsPage],
  );

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

      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl">
                Dashboard
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-[var(--muted-foreground)]">
                Manage your site&rsquo;s content. All changes are synced in real-time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[
                { label: "Events", value: events?.length ?? "…" },
                { label: "Posts", value: posts?.length ?? "…" },
                { label: "Published", value: posts?.filter(p => p.publishedAt).length ?? "…" },
                { label: "Drafts", value: posts?.filter(p => !p.publishedAt).length ?? "…" },
              ].map((stat) => (
                <div key={stat.label} className="ui-card p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold font-display text-[var(--foreground)]">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="mx-auto flex w-fit gap-1 rounded-lg bg-[var(--secondary)] p-1 sm:mx-0">
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
          </div>
        </div>
      </section>

      {tab === "events" ? (
        <>
          <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--accents-1)]/30 py-12 sm:py-16">
            <div className="ui-site-container relative">
              <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
                    {editingEventId ? "Edit event" : "Create event"}
                  </h2>
                  <p className="mt-1 text-sm text-[var(--accents-5)]">
                    Keep it short. The public pages are deliberately minimal.
                  </p>
                </div>
                {editingEventId ? (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingEventId(null);
                      setTitle("");
                      setSummary("");
                      setLocation("Bocconi University");
                      setKind("flagship");
                      setStartsAt(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16));
                      setRsvpUrl("");
                      setMoreInfoUrl("");
                    }}
                    className="ui-btn"
                    data-variant="secondary"
                  >
                    New event
                  </button>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Title">
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Danube Dialogues: Growth & Identity"
                    name="event_title"
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
                <Field label="Summary" full>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    placeholder="A speaker night about building cross-border careers…"
                    name="event_summary"
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
                    placeholder="https://…"
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
                    placeholder="https://…"
                    name="event_more_info_url"
                    autoComplete="off"
                    spellCheck={false}
                    className="ui-input"
                  />
                </Field>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 sm:justify-start">
                <button
                  type="button"
                  disabled={!canSubmit || isCreatingEvent}
                  onClick={async () => {
                    if (!canSubmit || isCreatingEvent) return;
                    setIsCreatingEvent(true);
                    setError(null);
                    try {
                      const ms = new Date(startsAt).getTime();
                      if (editingEventId) {
                        await updateEvent({
                          id: editingEventId,
                          title: title.trim(),
                          summary: summary.trim(),
                          location: location.trim(),
                          kind,
                          startsAt: ms,
                          rsvpUrl: rsvpUrl.trim(),
                          moreInfoUrl: moreInfoUrl.trim(),
                        });
                      } else {
                        await createEvent({
                          title: title.trim(),
                          summary: summary.trim(),
                          location: location.trim(),
                          kind,
                          startsAt: ms,
                          rsvpUrl: rsvpUrl.trim() || undefined,
                          moreInfoUrl: moreInfoUrl.trim() || undefined,
                        });
                      }
                      setTitle("");
                      setSummary("");
                      setLocation("Bocconi University");
                      setKind("flagship");
                      setStartsAt(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16));
                      setRsvpUrl("");
                      setMoreInfoUrl("");
                      setEditingEventId(null);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Failed to save event");
                    } finally {
                      setIsCreatingEvent(false);
                    }
                  }}
                  className={["ui-btn", (!canSubmit || isCreatingEvent) ? "opacity-50 cursor-not-allowed" : ""].join(" ")}
                >
                  {isCreatingEvent
                    ? editingEventId
                      ? "Saving…"
                      : "Creating…"
                    : editingEventId
                      ? "Save changes"
                      : "Create"}{" "}
                  <span className="text-[10px]">{isCreatingEvent ? "" : "→"}</span>
                </button>
                <div className="text-xs text-[var(--muted-foreground)]">
                  If this fails: check Clerk JWT + Convex auth config.
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[var(--background)] py-12 sm:py-16">
            <div className="ui-site-container relative">
              <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left mb-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">Events</h2>
                  <div className="mt-1 text-sm text-[var(--accents-5)]">
                    {events ? `${filteredEvents.length} of ${events.length} shown` : "Loading…"}
                  </div>
                </div>
              </div>

              {events ? (
                <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto] mb-6">
                  <input
                    value={eventsQuery}
                    onChange={(e) => {
                      setEventsQuery(e.target.value);
                      setEventsPage(1);
                    }}
                    placeholder="Search title, summary, location…"
                    name="events_search"
                    autoComplete="off"
                    aria-label="Search events"
                    className="ui-input"
                  />
                  <select
                    value={eventsKindFilter}
                    onChange={(e) => {
                      setEventsKindFilter(e.target.value as "all" | Kind);
                      setEventsPage(1);
                    }}
                    name="events_kind_filter"
                    autoComplete="off"
                    aria-label="Filter events by kind"
                    className="ui-input"
                  >
                    <option value="all">All kinds</option>
                    <option value="flagship">Flagship</option>
                    <option value="career">Career</option>
                    <option value="culture">Culture</option>
                    <option value="community">Community</option>
                  </select>
                  <select
                    value={eventsSort}
                    onChange={(e) => {
                      setEventsSort(e.target.value as EventSort);
                      setEventsPage(1);
                    }}
                    name="events_sort_order"
                    autoComplete="off"
                    aria-label="Sort events"
                    className="ui-input"
                  >
                    <option value="soonest">Soonest first</option>
                    <option value="latest">Latest first</option>
                  </select>
                  <div className="flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
                    <button
                      type="button"
                      className="ui-btn px-3 py-1.5 min-h-0 text-xs"
                      data-variant="secondary"
                      disabled={eventsPagination.safePage <= 1}
                      onClick={() => setEventsPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </button>
                    <span>
                      Page {eventsPagination.safePage}/{eventsPagination.totalPages}
                    </span>
                    <button
                      type="button"
                      className="ui-btn px-3 py-1.5 min-h-0 text-xs"
                      data-variant="secondary"
                      disabled={eventsPagination.safePage >= eventsPagination.totalPages}
                      onClick={() => setEventsPage((p) => Math.min(eventsPagination.totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}

              {!events ? (
                <div className="py-24 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
                </div>
              ) : filteredEvents.length === 0 ? (
                <EmptyState
                  title={events.length === 0 ? "No events yet." : "No events match the current filters."}
                  description={events.length === 0 ? "Create your first event using the form above." : "Try adjusting or clearing your filters."}
                  icon={events.length === 0 ? Calendar : SearchX}
                  className="ui-card border-border bg-card/70 py-10"
                />
              ) : (
                <div className="grid gap-4">
                  <AnimatePresence initial={false}>
                    {eventsPagination.items.map((e) => (
                      <motion.div
                        key={e._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start transition-colors hover:bg-[var(--secondary)]/50"
                      >
                        <div className="min-w-0 space-y-3">
                          <div className="flex flex-wrap items-center justify-center gap-2 md:block">
                            <h3 className="font-display text-lg font-semibold text-[var(--foreground)]">
                              {e.title}
                            </h3>
                            <span className="ui-tag md:mt-2">{e.kind}</span>
                          </div>
                          <p className="line-clamp-2 text-sm leading-6 text-[var(--muted-foreground)]">
                            {e.summary}
                          </p>
                          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[10px] font-mono uppercase tracking-wider text-[var(--muted-foreground)] md:justify-start">
                            <span>{new Date(e.startsAt).toLocaleDateString()} at {new Date(e.startsAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span>{e.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-4 opacity-100 transition-opacity md:justify-end md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEventId(e._id);
                              setTitle(e.title);
                              setSummary(e.summary);
                              setLocation(e.location);
                              setKind(e.kind);
                              setStartsAt(toDatetimeLocal(e.startsAt));
                              setRsvpUrl(e.rsvpUrl ?? "");
                              setMoreInfoUrl(e.moreInfoUrl ?? "");
                              window.scrollTo({ top: 0, behavior: "smooth" });
                            }}
                            className="ui-link text-sm"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={deletingEventId === e._id}
                            onClick={async () => {
                              if (!confirm("Delete this event?")) return;
                              setDeletingEventId(e._id);
                              setError(null);
                              try {
                                await removeEvent({ id: e._id });
                                if (editingEventId === e._id) {
                                  setEditingEventId(null);
                                }
                              } catch (err) {
                                setError(err instanceof Error ? err.message : "Failed to delete event");
                              } finally {
                                setDeletingEventId(null);
                              }
                            }}
                            className="ui-btn py-1.5 px-3 h-auto text-xs bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white border-red-200 dark:border-red-900 transition-colors font-bold disabled:opacity-50"
                          >
                            {deletingEventId === e._id ? "Deleting…" : "Delete"}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--accents-1)]/30 py-12 sm:py-16">
            <div className="ui-site-container relative">
              <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:items-end sm:text-left mb-8">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">
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
                <Field label="Title">
                  <input
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="A new semester, a tighter cadence"
                    name="post_title"
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
                <Field label="Excerpt" full>
                  <textarea
                    value={postExcerpt}
                    onChange={(e) => setPostExcerpt(e.target.value)}
                    rows={2}
                    placeholder="One paragraph summary…"
                    name="post_excerpt"
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

              <div className="flex flex-wrap items-center justify-center gap-3 pt-4 sm:justify-start">
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
                          excerpt: postExcerpt.trim(),
                          body: postBody,
                        });
                      } else {
                        const id = await createDraft({
                          title: postTitle.trim(),
                          excerpt: postExcerpt.trim(),
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
                  {isCreatingPost ? (editingPostId ? "Saving…" : "Creating…") : (editingPostId ? "Save changes" : "Create draft")}
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
                      {publishingPostId === editingPostId ? "Publishing…" : "Publish"}
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
                      {publishingPostId === editingPostId ? "Unpublishing…" : "Unpublish"}
                    </button>
                  </>
                ) : null}

                <div className="text-xs text-[var(--accents-5)]">
                  Tip: keep the excerpt short; the body can be longer.
                </div>
              </div>
            </div>
          </section>

          <section className="relative overflow-hidden bg-[var(--background)] py-12 sm:py-16">
            <div className="ui-site-container relative">
              <div className="mb-8">
                <h2 className="font-display text-2xl font-semibold text-[var(--foreground)]">Posts</h2>
                <div className="mt-1 text-sm text-[var(--accents-5)]">
                  {posts ? `${filteredPosts.length} of ${posts.length} shown` : "Loading…"}
                </div>
              </div>

              {posts ? (
                <div className="grid gap-3 md:grid-cols-[1fr_180px_180px_auto]">
                  <input
                    value={postsQuery}
                    onChange={(e) => {
                      setPostsQuery(e.target.value);
                      setPostsPage(1);
                    }}
                    placeholder="Search title, excerpt, slug…"
                    name="posts_search"
                    autoComplete="off"
                    aria-label="Search posts"
                    className="ui-input"
                  />
                  <select
                    value={postsStatusFilter}
                    onChange={(e) => {
                      setPostsStatusFilter(e.target.value as PostStatusFilter);
                      setPostsPage(1);
                    }}
                    name="posts_status_filter"
                    autoComplete="off"
                    aria-label="Filter posts by status"
                    className="ui-input"
                  >
                    <option value="all">All statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                  <select
                    value={postsSort}
                    onChange={(e) => {
                      setPostsSort(e.target.value as PostSort);
                      setPostsPage(1);
                    }}
                    name="posts_sort_order"
                    autoComplete="off"
                    aria-label="Sort posts"
                    className="ui-input"
                  >
                    <option value="newest">Newest first</option>
                    <option value="oldest">Oldest first</option>
                    <option value="title">Title A-Z</option>
                  </select>
                  <div className="flex items-center justify-end gap-2 text-xs text-[var(--muted-foreground)]">
                    <button
                      type="button"
                      className="ui-btn px-3 py-1.5 min-h-0 text-xs"
                      data-variant="secondary"
                      disabled={postsPagination.safePage <= 1}
                      onClick={() => setPostsPage((p) => Math.max(1, p - 1))}
                    >
                      Prev
                    </button>
                    <span>
                      Page {postsPagination.safePage}/{postsPagination.totalPages}
                    </span>
                    <button
                      type="button"
                      className="ui-btn px-3 py-1.5 min-h-0 text-xs"
                      data-variant="secondary"
                      disabled={postsPagination.safePage >= postsPagination.totalPages}
                      onClick={() => setPostsPage((p) => Math.min(postsPagination.totalPages, p + 1))}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}

              {!posts ? (
                <div className="py-20 text-center">
                  <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
                </div>
              ) : filteredPosts.length === 0 ? (
                <EmptyState
                  title={posts.length === 0 ? "No posts yet." : "No posts match the current filters."}
                  description={posts.length === 0 ? "Create your first newsletter post using the form above." : "Try adjusting or clearing your filters."}
                  icon={posts.length === 0 ? FileText : SearchX}
                  className="ui-card border-border bg-card/70 py-10"
                />
              ) : (
                <div className="grid gap-4">
                  {postsPagination.items.map((p) => {
                    const isPublished = p.publishedAt != null;
                    return (
                      <div
                        key={p._id}
                        className="ui-card grid gap-4 p-5 text-center md:grid-cols-[1fr_auto] md:items-start md:text-left"
                      >
                        <div className="min-w-0 space-y-3">
                          <div className="flex flex-wrap items-center justify-center gap-2 md:block">
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

                          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono uppercase tracking-wider text-[var(--muted-foreground)] md:justify-start">
                            <span>/{p.slug}</span>
                            <span>
                              {isPublished
                                ? `published ${new Date(p.publishedAt!).toISOString()}`
                                : "draft"}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 md:justify-start">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingPostId(p._id);
                                setPostTitle(p.title);
                                setPostSlug("");
                                setPostExcerpt(p.excerpt);
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
                                {publishingPostId === p._id ? "Unpublishing…" : "Unpublish"}
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
                                {publishingPostId === p._id ? "Publishing…" : "Publish"}
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
                              {deletingPostId === p._id ? "Deleting…" : "Delete"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
