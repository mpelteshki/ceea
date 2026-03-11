import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

const MAX_AUTHORS_RETURNED = 200;

/* ------------------------------------------------------------------ */
/*  Public queries                                                     */
/* ------------------------------------------------------------------ */

/** All authors, alphabetically by name. */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const rows = await ctx.db
      .query("authors")
      .order("asc")
      .take(MAX_AUTHORS_RETURNED);
    return rows.sort((a, b) => a.name.localeCompare(b.name));
  },
});

/** Single author by ID. */
export const get = query({
  args: { id: v.id("authors") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

/* ------------------------------------------------------------------ */
/*  Admin mutations                                                    */
/* ------------------------------------------------------------------ */

export const create = mutation({
  args: {
    name: v.string(),
    bio: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    websiteUrl: v.optional(v.string()),
    photoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("authors", {
      name: args.name.trim(),
      bio: args.bio?.trim() || undefined,
      linkedinUrl: normalizeOptionalUrl(args.linkedinUrl, "LinkedIn URL"),
      websiteUrl: normalizeOptionalUrl(args.websiteUrl, "Website URL"),
      photoId: args.photoId?.trim() || undefined,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("authors"),
    name: v.optional(v.string()),
    bio: v.optional(v.union(v.string(), v.null())),
    linkedinUrl: v.optional(v.union(v.string(), v.null())),
    websiteUrl: v.optional(v.union(v.string(), v.null())),
    photoId: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: Record<string, unknown> = {};

    if (args.name !== undefined) patch.name = args.name.trim();
    if (args.bio !== undefined) patch.bio = args.bio?.trim() || undefined;
    if (args.linkedinUrl !== undefined) {
      patch.linkedinUrl = args.linkedinUrl
        ? normalizeOptionalUrl(args.linkedinUrl, "LinkedIn URL")
        : undefined;
    }
    if (args.websiteUrl !== undefined) {
      patch.websiteUrl = args.websiteUrl
        ? normalizeOptionalUrl(args.websiteUrl, "Website URL")
        : undefined;
    }
    if (args.photoId !== undefined) {
      patch.photoId = args.photoId?.trim() || undefined;
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("authors") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
