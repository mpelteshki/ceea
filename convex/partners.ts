import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/admin";
import { normalizeOptionalUrl } from "./lib/url";

export const listAll = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("partners")
            .withIndex("by_tier_name", (q) => q)
            .order("asc")
            .collect();
    },
});

export const create = mutation({
    args: {
        name: v.string(),
        tier: v.union(
            v.literal("lead"),
            v.literal("supporting"),
            v.literal("community"),
        ),
        websiteUrl: v.optional(v.string()),
        logoUrl: v.optional(v.string()),
    },
  handler: async (ctx, args) => {
    const { identity } = await requireAdmin(ctx);
    const now = Date.now();
    return await ctx.db.insert("partners", {
        ...args,
        websiteUrl: normalizeOptionalUrl(args.websiteUrl, "Partner website URL"),
        logoUrl: normalizeOptionalUrl(args.logoUrl, "Partner logo URL"),
        createdAt: now,
        createdBy: identity.tokenIdentifier,
    });
  },
});

export const remove = mutation({
    args: { id: v.id("partners") },
    handler: async (ctx, args) => {
        await requireAdmin(ctx);
        await ctx.db.delete(args.id);
    },
});
