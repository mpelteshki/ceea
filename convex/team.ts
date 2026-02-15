import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("team").collect();
    },
});

export const getByType = query({
    args: { type: v.union(v.literal("member"), v.literal("alumni")) },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("team")
            .withIndex("by_type", (q) => q.eq("type", args.type))
            .collect();
    },
});

export const create = mutation({
    args: {
        firstName: v.string(),
        lastName: v.string(),
        role: v.object({
            en: v.string(),
            it: v.string(),
            bg: v.string(),
        }),
        type: v.union(v.literal("member"), v.literal("alumni")),
        linkedinUrl: v.optional(v.string()),
        photoId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("team", {
            ...args,
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
                bg: v.string(),
            })
        ),
        type: v.optional(v.union(v.literal("member"), v.literal("alumni"))),
        linkedinUrl: v.optional(v.string()),
        photoId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("team") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
