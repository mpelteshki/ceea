import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

const MAX_GALLERY_RETURNED = 300;

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("gallery")
      .withIndex("by_createdAt", (q) => q)
      .order("desc")
      .take(MAX_GALLERY_RETURNED);
  },
});

export const create = mutation({
  args: {
    imageUrl: v.string(),
    caption: v.string(),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const imageUrl = normalizeOptionalUrl(args.imageUrl, "Gallery image URL");
    if (!imageUrl) throw new Error("Gallery image URL is required.");

    return await ctx.db.insert("gallery", {
      ...args,
      imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("gallery"),
    imageUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: {
      imageUrl?: string;
      caption?: string;
      category?: string;
    } = {};

    if (args.imageUrl !== undefined) {
      const normalized = normalizeOptionalUrl(args.imageUrl, "Gallery image URL");
      if (!normalized) throw new Error("Gallery image URL is required.");
      patch.imageUrl = normalized;
    }
    if (args.caption !== undefined) patch.caption = args.caption;
    if (args.category !== undefined) patch.category = args.category;

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("gallery") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
