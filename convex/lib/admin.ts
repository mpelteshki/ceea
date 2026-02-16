import type { UserIdentity } from "convex/server";

export async function requireAdmin(ctx: {
  auth: { getUserIdentity: () => Promise<UserIdentity | null> };
}) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");
  return { identity };
}
