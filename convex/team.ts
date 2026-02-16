import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

const MAX_TEAM_RETURNED = 300;

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("team").order("desc").take(MAX_TEAM_RETURNED);
  },
});

export const getByType = query({
  args: { type: v.union(v.literal("member"), v.literal("alumni")) },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("team")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .take(MAX_TEAM_RETURNED);
  },
});

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    role: v.object({
      en: v.string(),
      it: v.string(),
    }),
    type: v.union(v.literal("member"), v.literal("alumni")),
    linkedinUrl: v.optional(v.string()),
    photoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("team", {
      ...args,
      linkedinUrl: normalizeOptionalUrl(args.linkedinUrl, "LinkedIn URL"),
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("team"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    role: v.optional(
      v.object({
        en: v.string(),
        it: v.string(),
      }),
    ),
    type: v.optional(v.union(v.literal("member"), v.literal("alumni"))),
    linkedinUrl: v.optional(v.string()),
    photoId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: {
      firstName?: string;
      lastName?: string;
      role?: { en: string; it: string };
      type?: "member" | "alumni";
      linkedinUrl?: string | undefined;
      photoId?: string | undefined;
    } = {};

    if (args.firstName !== undefined) patch.firstName = args.firstName;
    if (args.lastName !== undefined) patch.lastName = args.lastName;
    if (args.role !== undefined) patch.role = args.role;
    if (args.type !== undefined) patch.type = args.type;
    if (args.linkedinUrl !== undefined) {
      patch.linkedinUrl = normalizeOptionalUrl(args.linkedinUrl, "LinkedIn URL");
    }
    if (args.photoId !== undefined) patch.photoId = args.photoId.trim() || undefined;

    await ctx.db.patch(args.id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("team") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});
