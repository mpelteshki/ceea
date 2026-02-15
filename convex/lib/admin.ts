import type { UserIdentity } from "convex/server";

function parseAdminEmails(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function identityEmail(identity: UserIdentity): string | undefined {
  const direct = identity.email;
  if (direct) return direct.toLowerCase();

  const asRecord = identity as unknown as Record<string, unknown>;
  const claims = asRecord["claims"];
  if (claims && typeof claims === "object") {
    const c = claims as Record<string, unknown>;
    const email =
      (typeof c["email"] === "string" && c["email"]) ||
      (typeof c["primary_email"] === "string" && c["primary_email"]) ||
      (typeof c["primaryEmail"] === "string" && c["primaryEmail"]);
    return email ? email.toLowerCase() : undefined;
  }

  return undefined;
}

export async function requireAdmin(ctx: {
  auth: { getUserIdentity: () => Promise<UserIdentity | null> };
}) {
  const admins = parseAdminEmails(process.env.ADMIN_EMAILS);
  if (admins.size === 0) {
    throw new Error(
      "ADMIN_EMAILS is not configured in Convex env. Set it to a comma-separated list.",
    );
  }

  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new Error("Not authenticated.");

  const email = identityEmail(identity);
  if (!email) throw new Error("No email claim present on identity.");

  if (!admins.has(email)) throw new Error("Not authorized.");
  return { identity, email };
}
