import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

const MAX_PROJECTS_RETURNED = 200;

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_createdAt", (q) => q)
      .order("desc")
      .take(MAX_PROJECTS_RETURNED);
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    imageUrl: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("projects", {
      ...args,
      imageUrl: normalizeOptionalUrl(args.imageUrl, "Project image URL"),
      link: normalizeOptionalUrl(args.link, "Project link"),
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("projects"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: {
      title?: string;
      description?: string;
      imageUrl?: string | undefined;
      link?: string | undefined;
    } = {};

    if (args.title !== undefined) patch.title = args.title;
    if (args.description !== undefined) patch.description = args.description;
    if (args.imageUrl !== undefined) {
      patch.imageUrl = normalizeOptionalUrl(args.imageUrl, "Project image URL");
    }
    if (args.link !== undefined) {
      patch.link = normalizeOptionalUrl(args.link, "Project link");
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
