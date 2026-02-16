import { mutation } from "./_generated/server";

function pickEnglishText(value: unknown): string {
  if (typeof value === "string") {
    return value.trim();
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const candidates = [record.en, record.it, record.bg];
    for (const candidate of candidates) {
      if (typeof candidate === "string" && candidate.trim().length > 0) {
        return candidate.trim();
      }
    }
  }
  return "";
}

export const flattenLegacyLocalization = mutation({
  args: {},
  handler: async (ctx) => {
    let changedEvents = 0;
    let changedPosts = 0;
    let changedProjects = 0;
    let changedTeam = 0;
    let changedGallery = 0;

    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      const legacy = event as Record<string, unknown>;
      const nextTitle = pickEnglishText(legacy.title);
      const nextSummary = pickEnglishText(legacy.summary);
      const patch: Record<string, unknown> = {};
      if (nextTitle && nextTitle !== legacy.title) patch.title = nextTitle;
      if (nextSummary && nextSummary !== legacy.summary) patch.summary = nextSummary;
      if ("title_it" in legacy) patch.title_it = undefined;
      if ("summary_it" in legacy) patch.summary_it = undefined;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(event._id, patch);
        changedEvents += 1;
      }
    }

    const posts = await ctx.db.query("posts").collect();
    for (const post of posts) {
      const legacy = post as Record<string, unknown>;
      const nextTitle = pickEnglishText(legacy.title);
      const nextExcerpt = pickEnglishText(legacy.excerpt);
      const patch: Record<string, unknown> = {};
      if (nextTitle && nextTitle !== legacy.title) patch.title = nextTitle;
      if (nextExcerpt && nextExcerpt !== legacy.excerpt) patch.excerpt = nextExcerpt;
      if ("title_it" in legacy) patch.title_it = undefined;
      if ("excerpt_it" in legacy) patch.excerpt_it = undefined;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(post._id, patch);
        changedPosts += 1;
      }
    }

    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      const legacy = project as Record<string, unknown>;
      const nextTitle = pickEnglishText(legacy.title);
      const nextDescription = pickEnglishText(legacy.description);
      const patch: Record<string, unknown> = {};
      if (nextTitle && nextTitle !== legacy.title) patch.title = nextTitle;
      if (nextDescription && nextDescription !== legacy.description) patch.description = nextDescription;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(project._id, patch);
        changedProjects += 1;
      }
    }

    const team = await ctx.db.query("team").collect();
    for (const member of team) {
      const legacy = member as Record<string, unknown>;
      const nextRole = pickEnglishText(legacy.role);
      if (nextRole && nextRole !== legacy.role) {
        await ctx.db.patch(member._id, { role: nextRole });
        changedTeam += 1;
      }
    }

    const gallery = await ctx.db.query("gallery").collect();
    for (const item of gallery) {
      const legacy = item as Record<string, unknown>;
      const nextCaption = pickEnglishText(legacy.caption);
      if (nextCaption && nextCaption !== legacy.caption) {
        await ctx.db.patch(item._id, { caption: nextCaption });
        changedGallery += 1;
      }
    }

    return {
      changedEvents,
      changedPosts,
      changedProjects,
      changedTeam,
      changedGallery,
    };
  },
});
