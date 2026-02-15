import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("gallery").order("desc").collect();
    },
});

export const create = mutation({
    args: {
        imageUrl: v.string(),
        caption: v.object({
            en: v.string(),
            it: v.string(),
            bg: v.string(),
        }),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("gallery", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("gallery"),
        imageUrl: v.optional(v.string()),
        caption: v.optional(
            v.object({
                en: v.string(),
                it: v.string(),
                bg: v.string(),
            })
        ),
        category: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("gallery") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
