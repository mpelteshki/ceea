import "server-only";

function parseAdminEmails(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

function debugLog(...args: unknown[]) {
  if (process.env.ADMIN_DEBUG === "1") console.log(...args);
}

function normalizeEmails(emails: Array<string | undefined | null>): string[] {
  const out = new Set<string>();
  for (const e of emails) {
    const v = (e ?? "").trim().toLowerCase();
    if (v) out.add(v);
  }
  return Array.from(out);
}

export type AdminState =
  | { ok: true; email: string }
  | {
      ok: false;
      reason:
        | "clerk_not_configured"
        | "admin_emails_not_set"
        | "signed_out"
        | "no_email"
        | "unauthorized";
      email?: string;
    };

export async function getAdminState(): Promise<AdminState> {
  // If Clerk isn't configured, treat as "no admin session" instead of crashing
  // the entire request (common in preview builds).
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    debugLog("[Admin Debug] Missing Clerk keys");
    return { ok: false, reason: "clerk_not_configured" };
  }

  const admins = parseAdminEmails(process.env.ADMIN_EMAILS);
  debugLog("[Admin Debug] Configured admins:", Array.from(admins));

  if (admins.size === 0) {
    debugLog("[Admin Debug] No admins found in env");
    return { ok: false, reason: "admin_emails_not_set" };
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  if (!user) return { ok: false, reason: "signed_out" };

  const emails = normalizeEmails([
    user.primaryEmailAddress?.emailAddress,
    ...(user.emailAddresses?.map((e) => e.emailAddress) ?? []),
  ]);
  const primary = emails[0];

  debugLog("[Admin Debug] Current user email:", primary);

  if (emails.length === 0) {
    debugLog("[Admin Debug] No email found for user");
    return { ok: false, reason: "no_email" };
  }

  const match = emails.find((e) => admins.has(e));
  const isAuthorized = Boolean(match);
  debugLog("[Admin Debug] Is authorized:", isAuthorized);

  if (!match) return { ok: false, reason: "unauthorized", email: primary };
  return { ok: true, email: match };
}

export async function isAdmin(): Promise<boolean> {
  return (await getAdminState()).ok;
}
