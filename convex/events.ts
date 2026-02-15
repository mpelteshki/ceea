import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";

export const listUpcoming = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const now = Date.now();
    const limit = Math.max(1, Math.min(50, args.limit ?? 6));
    return await ctx.db
      .query("events")
      .withIndex("by_startsAt", (q) => q.gte("startsAt", now))
      .order("asc")
      .take(limit);
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("events")
      .withIndex("by_startsAt", (q) => q)
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    summary: v.string(),
    location: v.string(),
    kind: v.union(
      v.literal("flagship"),
      v.literal("career"),
      v.literal("culture"),
      v.literal("community"),
    ),
    startsAt: v.number(),
    rsvpUrl: v.optional(v.string()),
    moreInfoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);
    const now = Date.now();
    return await ctx.db.insert("events", {
      ...args,
      createdAt: now,
      createdBy: identity.tokenIdentifier,
    });
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
