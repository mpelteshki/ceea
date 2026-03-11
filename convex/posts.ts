import { query, mutation, type QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";
import type { Id } from "./_generated/dataModel";

const MAX_POSTS_RETURNED = 200;

type AuthorProfile = {
  _id: string;
  name: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  photoId?: string;
};

function stripPostMetadata<T extends { createdBy?: string; body?: string }>(
  row: T,
  options?: { removeBody?: boolean },
) {
  const cleanRow = { ...row };
  delete cleanRow.createdBy;
  if (options?.removeBody) {
    delete cleanRow.body;
  }
  return cleanRow;
}

async function resolveAuthor(
  ctx: QueryCtx,
  row: { authorId?: Id<"authors"> },
): Promise<AuthorProfile | undefined> {
  if (row.authorId) {
    const author = await ctx.db.get(row.authorId);
    if (author) {
      return {
        _id: author._id,
        name: author.name,
        bio: author.bio,
        linkedinUrl: author.linkedinUrl,
        websiteUrl: author.websiteUrl,
        photoId: author.photoId,
      };
    }
  }
  return undefined;
}

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

    const published = rows.filter((r) => r.publishedAt != null);
    return Promise.all(
      published.map(async (row) => {
        const authorProfile = await resolveAuthor(ctx, row);
        return {
          ...stripPostMetadata(row, { removeBody: true }),
          authorProfile,
        };
      }),
    );
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
    const authorProfile = await resolveAuthor(ctx, row);
    return { ...stripPostMetadata(row), authorProfile };
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

    const published = rows.filter((r) => r.publishedAt != null).slice(0, n);
    return Promise.all(
      published.map(async (row) => {
        const authorProfile = await resolveAuthor(ctx, row);
        return {
          ...stripPostMetadata(row, { removeBody: true }),
          authorProfile,
        };
      }),
    );
  },
});

/* ------------------------------------------------------------------ */
/*  Admin queries                                                      */
/* ------------------------------------------------------------------ */

/** All posts (including drafts) for the admin panel. */
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const rows = await ctx.db
      .query("posts")
      .withIndex("by_publishedAt")
      .order("desc")
      .take(MAX_POSTS_RETURNED);
    // Admin sees everything — strip only sensitive metadata
    return rows.map((row) => stripPostMetadata(row));
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
    authorId: v.optional(v.id("authors")),
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
      authorId: args.authorId ?? undefined,
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
    author: v.optional(v.union(v.string(), v.null())),
    authorId: v.optional(v.union(v.id("authors"), v.null())),
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
    if (args.authorId !== undefined) {
      patch.authorId = args.authorId ?? undefined;
    }
    if (args.author !== undefined) {
      patch.author = args.author?.trim() || undefined;
    }
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
