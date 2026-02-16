import { mutation } from "./_generated/server";

type LocalizedText = {
  en: string;
  it: string;
  bg?: string;
};

export const removeBulgarianFields = mutation({
  args: {},
  handler: async (ctx) => {
    const projects = await ctx.db.query("projects").collect();
    for (const project of projects) {
      const newTitle: LocalizedText = { ...project.title };
      const newDesc: LocalizedText = { ...project.description };

      let changed = false;
      if ("bg" in newTitle) {
        delete newTitle.bg;
        changed = true;
      }
      if ("bg" in newDesc) {
        delete newDesc.bg;
        changed = true;
      }

      if (changed) {
        await ctx.db.patch(project._id, {
          title: newTitle,
          description: newDesc,
        });
      }
    }

    const team = await ctx.db.query("team").collect();
    for (const member of team) {
      const newRole: LocalizedText = { ...member.role };
      if ("bg" in newRole) {
        delete newRole.bg;
        await ctx.db.patch(member._id, { role: newRole });
      }
    }

    const gallery = await ctx.db.query("gallery").collect();
    for (const item of gallery) {
      const newCaption: LocalizedText = { ...item.caption };
      if ("bg" in newCaption) {
        delete newCaption.bg;
        await ctx.db.patch(item._id, { caption: newCaption });
      }
    }

    return "Migration complete: Bulgarian fields removed.";
  },
});
