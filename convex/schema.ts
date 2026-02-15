import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  events: defineTable({
    title: v.string(),
    summary: v.string(),
    location: v.string(),
    kind: v.union(
      v.literal("flagship"),
      v.literal("career"),
      v.literal("culture"),
      v.literal("community"),
    ),
    startsAt: v.number(), // epoch ms
    rsvpUrl: v.optional(v.string()),
    moreInfoUrl: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.optional(v.string()), // tokenIdentifier
  })
    .index("by_startsAt", ["startsAt"])
    .index("by_kind_startsAt", ["kind", "startsAt"]),

  posts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    body: v.string(),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_publishedAt", ["publishedAt"]),

  partners: defineTable({
    name: v.string(),
    tier: v.union(
      v.literal("lead"),
      v.literal("supporting"),
      v.literal("community"),
    ),
    websiteUrl: v.optional(v.string()),
    logoUrl: v.optional(v.string()),
    createdAt: v.number(),
    createdBy: v.optional(v.string()),
  }).index("by_tier_name", ["tier", "name"]),
});
