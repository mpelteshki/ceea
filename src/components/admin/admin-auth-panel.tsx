"use client";

import { SignIn, SignUp, useAuth } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import type { AdminState } from "@/lib/admin";

type Mode = "sign-in" | "sign-up";

export function AdminAuthPanel({ state }: { state: AdminState }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("sign-in");

  const shouldForceSignOut = useMemo(() => {
    if (state.ok) return false;
    return state.reason === "unauthorized" || state.reason === "no_email";
  }, [state]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!shouldForceSignOut) return;
    if (!isSignedIn) return;

    // Make "login fail" for non-admins: immediately clear the session,
    // then return to /admin so the user sees the sign-in UI again.
    void signOut({ redirectUrl: "/admin" });
  }, [isLoaded, isSignedIn, shouldForceSignOut, signOut]);

  if (state.ok) return null;
  if (state.reason === "clerk_not_configured") return null;
  if (state.reason === "admin_emails_not_set") return null;

  // If unauthorized, we trigger signOut above; render sign-in UI so once the
  // redirect lands back here, the user can try another account.
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-sm">
        <button
          type="button"
          onClick={() => setMode("sign-in")}
          className={
            mode === "sign-in"
              ? "rounded-md bg-[var(--foreground)] px-3 py-1.5 font-medium text-[var(--background)]"
              : "rounded-md border border-[var(--accents-2)] bg-[var(--background)] px-3 py-1.5 font-medium text-[var(--foreground)] hover:bg-[var(--accents-1)]"
          }
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => setMode("sign-up")}
          className={
            mode === "sign-up"
              ? "rounded-md bg-[var(--foreground)] px-3 py-1.5 font-medium text-[var(--background)]"
              : "rounded-md border border-[var(--accents-2)] bg-[var(--background)] px-3 py-1.5 font-medium text-[var(--foreground)] hover:bg-[var(--accents-1)]"
          }
        >
          Sign up
        </button>
      </div>

      <div className="mt-4">
        {mode === "sign-in" ? (
          <SignIn />
        ) : (
          <SignUp />
        )}
      </div>
    </div>
  );
}

