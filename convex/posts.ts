import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";

const MAX_POSTS_RETURNED = 200;

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/["']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = Math.max(1, Math.min(MAX_POSTS_RETURNED, args.limit ?? 30));
    return await ctx.db
      .query("posts")
      .withIndex("by_publishedAt", (q) => q.gte("publishedAt", 0))
      .order("desc")
      .take(limit);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return await ctx.db.query("posts").order("desc").take(MAX_POSTS_RETURNED);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!post || post.publishedAt == null) return null;
    return post;
  },
});

export const getBySlugAdmin = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const createDraft = mutation({
  args: {
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
    slug: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);
    const now = Date.now();
    const slug = slugify(args.slug?.trim() || args.title);
    if (!slug) throw new Error("Slug is empty.");

    const existing = await ctx.db
      .query("posts")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (existing) throw new Error("Slug already exists.");

    return await ctx.db.insert("posts", {
      title: args.title.trim(),
      slug,
      excerpt: args.excerpt.trim(),
      body: args.body,
      createdAt: now,
      createdBy: identity.tokenIdentifier,
      publishedAt: undefined,
    });
  },
});

export const updateDraft = mutation({
  args: {
    id: v.id("posts"),
    title: v.string(),
    excerpt: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      title: args.title.trim(),
      excerpt: args.excerpt.trim(),
      body: args.body,
    });
  },
});

export const publish = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { publishedAt: Date.now() });
  },
});

export const unpublish = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { publishedAt: undefined });
  },
});

export const remove = mutation({
  args: { id: v.id("posts") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
