"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect, useMemo } from "react";
import type { AdminState } from "@/lib/admin";
import { CustomSignIn } from "@/components/auth/custom-sign-in";

export function AdminAuthPanel({ state }: { state: AdminState }) {
  const { isLoaded, isSignedIn, signOut } = useAuth();

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
    <div className="mt-8">
      <CustomSignIn />
    </div>
  );
}

