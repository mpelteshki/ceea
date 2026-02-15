import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("projects").order("desc").collect();
    },
});

export const create = mutation({
    args: {
        title: v.object({
            en: v.string(),
            it: v.string(),
            bg: v.string(),
        }),
        description: v.object({
            en: v.string(),
            it: v.string(),
            bg: v.string(),
        }),
        imageUrl: v.optional(v.string()),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        return await ctx.db.insert("projects", {
            ...args,
            createdAt: Date.now(),
        });
    },
});

export const update = mutation({
    args: {
        id: v.id("projects"),
        title: v.optional(
            v.object({
                en: v.string(),
                it: v.string(),
                bg: v.string(),
            })
        ),
        description: v.optional(
            v.object({
                en: v.string(),
                it: v.string(),
                bg: v.string(),
            })
        ),
        imageUrl: v.optional(v.string()),
        link: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { id, ...rest } = args;
        await ctx.db.patch(id, rest);
    },
});

export const remove = mutation({
    args: { id: v.id("projects") },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});
