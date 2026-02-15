import "server-only";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function parseAdminEmails(raw: string | undefined): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean),
  );
}

export async function isAdmin(): Promise<boolean> {
  const admins = parseAdminEmails(process.env.ADMIN_EMAILS);
  if (admins.size === 0) return false;
  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase();
  if (!email) return false;
  return admins.has(email);
}

export async function requireAdmin() {
  const user = await currentUser();
  if (!user) redirect("/sign-in");
  const ok = await isAdmin();
  if (!ok) redirect("/");
}

