"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
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
      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Convex backend not configured. Set{" "}
        <span className="font-mono">NEXT_PUBLIC_CONVEX_URL</span> and Convex
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

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [location, setLocation] = useState("Bocconi University");
  const [kind, setKind] = useState<Kind>("flagship");
  const [startsAt, setStartsAt] = useState(() =>
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 16),
  );
  const [rsvpUrl, setRsvpUrl] = useState("");
  const [moreInfoUrl, setMoreInfoUrl] = useState("");

  const [postTitle, setPostTitle] = useState("");
  const [postSlug, setPostSlug] = useState("");
  const [postExcerpt, setPostExcerpt] = useState("");
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
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Admin</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Dashboard
        </h1>
        <p className="max-w-2xl text-sm leading-6 text-black/70 dark:text-white/70">
          Minimal admin for now: create and remove events. Mutations are
          protected server-side in Convex via `ADMIN_EMAILS`.
        </p>
      </header>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => router.replace("/admin?tab=events", { scroll: false })}
          className={[
            "rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
            tab === "events"
              ? "border-black/20 bg-black text-white dark:border-white/20 dark:bg-white dark:text-black"
              : "border-black/15 bg-white/55 text-black hover:bg-white/85 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
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
            "rounded-full border px-4 py-2 text-sm font-semibold tracking-wide transition-colors",
            tab === "posts"
              ? "border-black/20 bg-black text-white dark:border-white/20 dark:bg-white dark:text-black"
              : "border-black/15 bg-white/55 text-black hover:bg-white/85 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10",
          ].join(" ")}
        >
          Newsletter
        </button>
      </div>

      {tab === "events" ? (
        <>
          <section className="rounded-3xl border border-black/10 bg-white/55 p-7 dark:border-white/10 dark:bg-white/5">
        <div className="font-display text-2xl leading-none">Create event</div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Danube Dialogues: Growth & Identity"
              name="event_title"
              autoComplete="off"
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
            />
          </Field>
          <Field label="Kind">
            <select
              value={kind}
              onChange={(e) => setKind(e.target.value as Kind)}
              name="event_kind"
              autoComplete="off"
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
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
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
            />
          </Field>
          <Field label="Location">
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Velodromo Building, Room N01"
              name="event_location"
              autoComplete="off"
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
            />
          </Field>
          <Field label="Summary" full>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              placeholder="A speaker night about building cross-border careers between Milan and the region…"
              name="event_summary"
              autoComplete="off"
              className="w-full resize-none rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
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
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
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
              className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
            />
          </Field>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            disabled={!canSubmit}
            onClick={async () => {
              const ms = new Date(startsAt).getTime();
              await createEvent({
                title: title.trim(),
                summary: summary.trim(),
                location: location.trim(),
                kind,
                startsAt: ms,
                rsvpUrl: rsvpUrl.trim() || undefined,
                moreInfoUrl: moreInfoUrl.trim() || undefined,
              });
              setTitle("");
              setSummary("");
              setRsvpUrl("");
              setMoreInfoUrl("");
            }}
            className={[
              "rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors",
              canSubmit
                ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                : "cursor-not-allowed bg-black/20 text-white/70 dark:bg-white/15 dark:text-white/60",
            ].join(" ")}
          >
            Create
          </button>
          <div className="text-xs text-black/60 dark:text-white/60">
            If this fails: check Clerk JWT + Convex auth config, and `ADMIN_EMAILS`.
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <div className="font-display text-2xl leading-none">Events</div>
            <div className="mt-2 text-sm text-black/65 dark:text-white/65">
              {events ? `${events.length} total` : "Loading…"}
            </div>
          </div>
        </div>

        {!events ? (
          <div className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-[110px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            No events yet.
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {events.map((e) => (
              <div
                key={e._id}
                className="rounded-2xl border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-2xl leading-none">
                      {e.title}
                    </div>
                    <div className="mt-2 line-clamp-2 text-sm leading-6 text-black/65 dark:text-white/65">
                      {e.summary}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-black/60 dark:text-white/60">
                      <span className="font-mono">
                        {new Date(e.startsAt).toISOString()}
                      </span>
                      <span>{e.location}</span>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-black/10 bg-black/5 px-2 py-1 font-mono text-[11px] tracking-wide text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
                    {e.kind}
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!confirm("Delete this event?")) return;
                      removeEvent({ id: e._id });
                    }}
                    className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
        </>
      ) : (
        <>
          <section className="rounded-3xl border border-black/10 bg-white/55 p-7 dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="font-display text-2xl leading-none">
                  {editingPostId ? "Edit post" : "Create post"}
                </div>
                <div className="mt-2 text-sm text-black/65 dark:text-white/65">
                  Renders publicly at <span className="font-mono">/newsletter</span>.
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
                  className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                >
                  New draft
                </button>
              ) : null}
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field label="Title">
                <input
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder="A new semester, a tighter cadence"
                  name="post_title"
                  autoComplete="off"
                  className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
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
                  className="w-full rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
                />
              </Field>
              <Field label="Excerpt" full>
                <textarea
                  value={postExcerpt}
                  onChange={(e) => setPostExcerpt(e.target.value)}
                  rows={3}
                  placeholder="One paragraph summary for the newsletter index…"
                  name="post_excerpt"
                  autoComplete="off"
                  className="w-full resize-none rounded-xl border border-black/15 bg-white/70 px-4 py-3 text-sm focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
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
                  className="w-full resize-none rounded-xl border border-black/15 bg-white/70 px-4 py-3 font-mono text-[12px] leading-5 focus:border-black/30 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 dark:border-white/15 dark:bg-white/5 dark:focus:border-white/30 dark:focus-visible:ring-blue-400/40 dark:focus-visible:ring-offset-[color:var(--paper)]"
                />
              </Field>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={!canSubmitPost}
                onClick={async () => {
                  if (!canSubmitPost) return;
                  if (editingPostId) {
                    await updateDraft({
                      id: editingPostId,
                      title: postTitle.trim(),
                      excerpt: postExcerpt.trim(),
                      body: postBody,
                    });
                    return;
                  }
                  const id = await createDraft({
                    title: postTitle.trim(),
                    excerpt: postExcerpt.trim(),
                    body: postBody,
                    slug: postSlug.trim() || undefined,
                  });
                  setEditingPostId(id);
                }}
                className={[
                  "rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors",
                  canSubmitPost
                    ? "bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                    : "cursor-not-allowed bg-black/20 text-white/70 dark:bg-white/15 dark:text-white/60",
                ].join(" ")}
              >
                {editingPostId ? "Save changes" : "Create draft"}
              </button>

              {editingPostId ? (
                <>
                  <button
                    type="button"
                    onClick={() => publish({ id: editingPostId })}
                    className="rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    Publish
                  </button>
                  <button
                    type="button"
                    onClick={() => unpublish({ id: editingPostId })}
                    className="rounded-full border border-black/15 bg-white/70 px-5 py-3 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                  >
                    Unpublish
                  </button>
                </>
              ) : null}

              <div className="text-xs text-black/60 dark:text-white/60">
                Tip: keep the excerpt short; the body can be longer.
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <div className="font-display text-2xl leading-none">Posts</div>
              <div className="mt-2 text-sm text-black/65 dark:text-white/65">
                {posts ? `${posts.length} total` : "Loading…"}
              </div>
            </div>

            {!posts ? (
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[110px] animate-pulse rounded-2xl border border-black/10 bg-white/40 p-6 dark:border-white/10 dark:bg-white/5"
                  />
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
                No posts yet.
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {posts.map((p) => {
                  const isPublished = p.publishedAt != null;
                  return (
                    <div
                      key={p._id}
                      className="rounded-2xl border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-display text-2xl leading-none">
                            {p.title}
                          </div>
                          <div className="mt-2 line-clamp-2 text-sm leading-6 text-black/65 dark:text-white/65">
                            {p.excerpt}
                          </div>
                          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-black/60 dark:text-white/60">
                            <span className="font-mono">/{p.slug}</span>
                            <span className="font-mono">
                              {isPublished
                                ? `published ${new Date(p.publishedAt!).toISOString()}`
                                : "draft"}
                            </span>
                          </div>
                        </div>
                        <span
                          className={[
                            "shrink-0 rounded-full border px-2 py-1 font-mono text-[11px] tracking-wide",
                            isPublished
                              ? "border-[color:var(--danube)]/30 bg-[color:var(--danube)]/12 text-black/80 dark:text-white/80"
                              : "border-black/10 bg-black/5 text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70",
                          ].join(" ")}
                        >
                          {isPublished ? "published" : "draft"}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPostId(p._id);
                            setPostTitle(p.title);
                            setPostSlug("");
                            setPostExcerpt(p.excerpt);
                            setPostBody(p.body);
                          }}
                          className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                          Edit
                        </button>
                        {isPublished ? (
                          <button
                            type="button"
                            onClick={() => unpublish({ id: p._id })}
                            className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => publish({ id: p._id })}
                            className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (!confirm("Delete this post?")) return;
                            removePost({ id: p._id });
                          }}
                          className="rounded-full border border-black/15 bg-white/70 px-4 py-2 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                        >
                          Delete
                        </button>
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
      <div className="mb-2 text-xs uppercase tracking-[0.22em] text-black/60 dark:text-white/60">
        {label}
      </div>
      {children}
    </label>
  );
}
