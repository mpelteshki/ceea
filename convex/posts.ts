import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";

const MAX_POSTS_RETURNED = 200;

/* ------------------------------------------------------------------ */
/*  Public queries                                                     */
/* ------------------------------------------------------------------ */

/** All published posts, newest-first. Used by the public newsletter list. */
export const listPublished = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(MAX_POSTS_RETURNED);

    // Only return posts that have a publishedAt value (i.e. not drafts)
    return rows
      .filter((r) => r.publishedAt != null)
      .map(({ createdBy: _, body: _b, ...rest }) => rest);
  },
});

/** Single published post by slug. Used by the public article page. */
export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const row = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!row || row.publishedAt == null) return null;
    const { createdBy: _, ...rest } = row;
    return rest;
  },
});

/** N most recent published posts for the homepage. */
export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const n = Math.max(1, Math.min(20, limit ?? 3));
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(n * 2); // over-fetch to account for drafts

    return rows
      .filter((r) => r.publishedAt != null)
      .slice(0, n)
      .map(({ createdBy: _, body: _b, ...rest }) => rest);
  },
});

/* ------------------------------------------------------------------ */
/*  Admin queries                                                      */
/* ------------------------------------------------------------------ */

/** All posts (including drafts) for the admin panel. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(MAX_POSTS_RETURNED);
    // Admin sees everything — strip only sensitive metadata
    return rows.map(({ createdBy: _, ...rest }) => rest);
  },
});

/* ------------------------------------------------------------------ */
/*  Mutations                                                          */
/* ------------------------------------------------------------------ */

export const create = mutation({
  args: {
    slug: v.string(),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    publishedAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);

    // Validate slug uniqueness
    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (existing) {
      throw new Error(`A post with slug "${args.slug}" already exists.`);
    }

    const now = Date.now();
    return await ctx.db.insert("posts", {
      slug: args.slug.trim(),
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      body: args.body,
      publishedAt: args.publishedAt ?? undefined,
      createdAt: now,
      updatedAt: now,
      createdBy: identity.tokenIdentifier,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("posts"),
    slug: v.optional(v.string()),
    title: v.optional(v.string()),
    excerpt: v.optional(v.string()),
    body: v.optional(v.string()),
    publishedAt: v.optional(v.union(v.number(), v.null())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);

    const patch: Record<string, unknown> = { updatedAt: Date.now() };

    if (args.slug !== undefined) {
      const slug = args.slug.trim();
      // Check uniqueness if slug is changing
      const existing = await ctx.db
        .query("posts")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique();
      if (existing && existing._id !== args.id) {
        throw new Error(`A post with slug "${slug}" already exists.`);
      }
      patch.slug = slug;
    }

    if (args.title !== undefined) patch.title = args.title.trim();
    if (args.excerpt !== undefined) patch.excerpt = args.excerpt.trim();
    if (args.body !== undefined) patch.body = args.body;
    if (args.publishedAt !== undefined) {
      patch.publishedAt = args.publishedAt ?? undefined;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

/* ------------------------------------------------------------------ */
/*  Storage                                                            */
/* ------------------------------------------------------------------ */

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const getImageUrl = query({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
