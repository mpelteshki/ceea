import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

const MAX_EVENTS_RETURNED = 200;

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
      .take(MAX_EVENTS_RETURNED);
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
      rsvpUrl: normalizeOptionalUrl(args.rsvpUrl, "RSVP URL"),
      moreInfoUrl: normalizeOptionalUrl(args.moreInfoUrl, "More info URL"),
      createdAt: now,
      createdBy: identity.tokenIdentifier,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    location: v.optional(v.string()),
    kind: v.optional(
      v.union(
        v.literal("flagship"),
        v.literal("career"),
        v.literal("culture"),
        v.literal("community"),
      ),
    ),
    startsAt: v.optional(v.number()),
    rsvpUrl: v.optional(v.string()),
    moreInfoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: {
      title?: string;
      summary?: string;
      location?: string;
      kind?: "flagship" | "career" | "culture" | "community";
      startsAt?: number;
      rsvpUrl?: string | undefined;
      moreInfoUrl?: string | undefined;
    } = {};

    if (args.title !== undefined) patch.title = args.title;
    if (args.summary !== undefined) patch.summary = args.summary;
    if (args.location !== undefined) patch.location = args.location;
    if (args.kind !== undefined) patch.kind = args.kind;
    if (args.startsAt !== undefined) patch.startsAt = args.startsAt;
    if (args.rsvpUrl !== undefined) {
      patch.rsvpUrl = normalizeOptionalUrl(args.rsvpUrl, "RSVP URL");
    }
    if (args.moreInfoUrl !== undefined) {
      patch.moreInfoUrl = normalizeOptionalUrl(args.moreInfoUrl, "More info URL");
    }

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
