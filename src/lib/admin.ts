import "server-only";

function debugLog(...args: unknown[]) {
  if (process.env.ADMIN_DEBUG === "1") console.log(...args);
}

type AdminState =
  | { ok: true }
  | {
      ok: false;
      reason: "clerk_not_configured" | "signed_out";
    };

export async function getAdminState(): Promise<AdminState> {
  // DEV-ONLY: skip auth entirely when SKIP_AUTH=1.
  // Convex mutations will still fail without a real identity token.
  if (
    process.env.NODE_ENV === "development" &&
    process.env.SKIP_AUTH === "1"
  ) {
    debugLog("[Admin Debug] SKIP_AUTH enabled — bypassing auth");
    return { ok: true };
  }

  // If Clerk isn't configured, treat as "no admin session" instead of crashing
  // the entire request (common in preview builds).
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    debugLog("[Admin Debug] Missing Clerk keys");
    return { ok: false, reason: "clerk_not_configured" };
  }

  const { currentUser } = await import("@clerk/nextjs/server");
  const user = await currentUser();
  if (!user) return { ok: false, reason: "signed_out" };

  debugLog("[Admin Debug] Signed in user id:", user.id);
  return { ok: true };
}
