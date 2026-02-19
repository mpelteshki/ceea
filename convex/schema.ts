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

  team: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    role: v.union(
      v.string(),
      v.object({
        en: v.string(),
        it: v.string(),
      }),
    ),
    type: v.union(v.literal("member"), v.literal("alumni")),
    linkedinUrl: v.optional(v.string()),
    photoId: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_type", ["type"]),

  projects: defineTable({
    title: v.union(
      v.string(),
      v.object({
        en: v.string(),
        it: v.string(),
      }),
    ),
    description: v.union(
      v.string(),
      v.object({
        en: v.string(),
        it: v.string(),
      }),
    ),
    imageUrl: v.optional(v.string()),
    link: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_createdAt", ["createdAt"]),
});
