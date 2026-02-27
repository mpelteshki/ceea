"use client";

import { Suspense, useMemo, useState } from "react";
import { useMutation, useQuery, useConvexAuth } from "convex/react";
import { AnimatePresence, m } from "framer-motion";
import { Calendar, SearchX } from "lucide-react";

import { api } from "../../../convex/_generated/api";
import type { Doc, Id } from "../../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { hasConvex } from "@/lib/public-env";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { EmptyState } from "@/components/ui/empty-state";
import { paginate, readSearchParam, parsePage, parseEnum, AdminPanelFallback } from "@/lib/admin-utils";
import { ConfirmButton } from "@/components/ui/confirm-button";

type Kind = "signature" | "career" | "culture" | "community";
const KINDS = ["signature", "career", "culture", "community"] as const;
const EVENT_KINDS_WITH_ALL = ["all", ...KINDS] as const;
const EVENT_SORTS = ["soonest", "latest"] as const;

type EventDoc = Omit<Doc<"events">, "kind"> & { kind: Kind };
type EventSort = typeof EVENT_SORTS[number];

const EVENTS_PAGE_SIZE = 8;

function toDatetimeLocal(ms: number) {
  const date = new Date(ms);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function useAdminDashboardState() {
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<Id<"events"> | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("Bocconi University");
  const [kind, setKind] = useState<Kind>("signature");
  const [startsAt, setStartsAt] = useState(() =>
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  );
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [moreInfoUrl, setMoreInfoUrl] = useState("");
  const [editingEventId, setEditingEventId] = useState<Id<"events"> | null>(null);

  const [eventsQuery, setEventsQuery] = useState(() => readSearchParam("eq") ?? "");
  const [eventsKindFilter, setEventsKindFilter] = useState<typeof EVENT_KINDS_WITH_ALL[number]>(() =>
    parseEnum(readSearchParam("ek"), EVENT_KINDS_WITH_ALL, "all"),
  );
  const [eventsSort, setEventsSort] = useState<EventSort>(() =>
    parseEnum(readSearchParam("es"), EVENT_SORTS, "soonest"),
  );
  const [eventsPage, setEventsPage] = useState(() => parsePage(readSearchParam("ep")));

  return {
    isCreatingEvent,
    setIsCreatingEvent,
    deletingEventId,
    setDeletingEventId,
    error,
    setError,
    title,
    setTitle,
    summary,
    setSummary,
    location,
    setLocation,
    kind,
    setKind,
    startsAt,
    setStartsAt,
    rsvpUrl,
    setRsvpUrl,
    moreInfoUrl,
    setMoreInfoUrl,
    editingEventId,
    setEditingEventId,
    eventsQuery,
    setEventsQuery,
    eventsKindFilter,
    setEventsKindFilter,
    eventsSort,
    setEventsSort,
    eventsPage,
    setEventsPage,
  };
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

  return (
    <Suspense fallback={<AdminPanelFallback label="Loading dashboard…" />}>
      <AdminDashboardInner />
    </Suspense>
  );
}

function AdminDashboardInner() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();

  const events = useQuery(api.events.listAll, isAuthenticated ? {} : "skip") as EventDoc[] | undefined;
  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const removeEvent = useMutation(api.events.remove);

  const team = useQuery(api.team.get, isAuthenticated ? {} : "skip");
  const projects = useQuery(api.projects.get, isAuthenticated ? {} : "skip");
  const partners = useQuery(api.partners.listAll, isAuthenticated ? {} : "skip");

  const {
    isCreatingEvent,
    setIsCreatingEvent,
    deletingEventId,
    setDeletingEventId,
    error,
    setError,
    title,
    setTitle,
    summary,
    setSummary,
    location,
    setLocation,
    kind,
    setKind,
    startsAt,
    setStartsAt,
    rsvpUrl,
    setRsvpUrl,
    moreInfoUrl,
    setMoreInfoUrl,
    editingEventId,
    setEditingEventId,
    eventsQuery,
    setEventsQuery,
    eventsKindFilter,
    setEventsKindFilter,
    eventsSort,
    setEventsSort,
    eventsPage,
    setEventsPage,
  } = useAdminDashboardState();

  const syncEventsUrl = (updates: { eq?: string; ek?: string; es?: string; ep?: number }) => {
    const params = new URLSearchParams(window.location.search);
    if ("eq" in updates) { if (updates.eq) params.set("eq", updates.eq); else params.delete("eq"); }
    if ("ek" in updates) { if (updates.ek && updates.ek !== "all") params.set("ek", updates.ek); else params.delete("ek"); }
    if ("es" in updates) { if (updates.es && updates.es !== "soonest") params.set("es", updates.es); else params.delete("es"); }
    if ("ep" in updates) { if (updates.ep && updates.ep > 1) params.set("ep", String(updates.ep)); else params.delete("ep"); }
    const qs = params.toString();
    router.replace(qs ? `/admin?${qs}` : "/admin", { scroll: false });
  };


  const canSubmit = useMemo(() => {
    return (
      title.trim().length >= 3 &&
      summary.trim().length >= 10 &&
      location.trim().length >= 2
    );
  }, [title, summary, location]);


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


  const eventsPagination = useMemo(
    () => paginate(filteredEvents, eventsPage, EVENTS_PAGE_SIZE),
    [filteredEvents, eventsPage],
  );

  if (isLoading) return <AdminPanelFallback label="Authenticating…" />;

  return (
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

      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-[var(--accents-2)] bg-[var(--background)] py-12 sm:py-16">
        <div className="ui-site-container relative">
          <div className="flex flex-col gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Dashboard
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
                Manage your site&rsquo;s content. All changes are synced in real-time.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Events", value: events?.length ?? "…" },
                { label: "Team", value: team?.length ?? "…" },
                { label: "Projects", value: projects?.length ?? "…" },
                { label: "Partners", value: partners?.length ?? "…" },
              ].map((stat) => (
                <div key={stat.label} className="ui-card p-4">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.label}</div>
                  <div className="mt-1 text-2xl font-bold font-display text-foreground">{stat.value}</div>
                </div>
              ))}
            </div>


          </div>
        </div>
      </section>

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
                  setKind("signature");
                  setStartsAt(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16));
                  setRsvpUrl("");
                  setMoreInfoUrl("");
                }}
                className="ui-btn"
                data-variant="secondary"
              >
                Cancel edit
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
                <option value="signature">Signature</option>
                <option value="career">Career</option>
                <option value="culture">Culture</option>
                <option value="community">Community</option>
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
              <MarkdownEditor
                value={summary}
                onChange={setSummary}
                rows={4}
                placeholder="A speaker night about building cross-border careers…"
                name="event_summary"
                ariaLabel="Event summary (markdown)"
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
                  setKind("signature");
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
              <h2 className="font-display text-2xl font-semibold text-foreground">Events</h2>
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
                  syncEventsUrl({ eq: e.target.value, ep: 1 });
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
                  syncEventsUrl({ ek: e.target.value, ep: 1 });
                }}
                name="events_kind_filter"
                autoComplete="off"
                aria-label="Filter events by kind"
                className="ui-input"
              >
                <option value="all">All kinds</option>
                <option value="signature">Signature</option>
                <option value="career">Career</option>
                <option value="culture">Culture</option>
                <option value="community">Community</option>
              </select>
              <select
                value={eventsSort}
                onChange={(e) => {
                  setEventsSort(e.target.value as EventSort);
                  setEventsPage(1);
                  syncEventsUrl({ es: e.target.value, ep: 1 });
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
                  onClick={() => {
                    const next = Math.max(1, eventsPagination.safePage - 1);
                    setEventsPage(next);
                    syncEventsUrl({ ep: next });
                  }}
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
                  onClick={() => {
                    const next = Math.min(eventsPagination.totalPages, eventsPagination.safePage + 1);
                    setEventsPage(next);
                    syncEventsUrl({ ep: next });
                  }}
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
                  <m.div
                    key={e._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="ui-card group grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-start"
                  >
                    <div className="min-w-0 space-y-3">
                      <div className="flex flex-wrap items-center justify-center gap-2 md:block">
                        <h3 className="font-display text-lg font-semibold text-foreground">
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
                      <ConfirmButton
                        pending={deletingEventId === e._id}
                        onConfirm={async () => {
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
