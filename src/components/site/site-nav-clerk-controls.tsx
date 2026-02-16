"use client";

import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { Link } from "@/i18n/routing";

export default function SiteNavClerkControls() {
  return (
    <>
      <SignedOut>{/* Public login links hidden - admin only access via /admin */}</SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="ui-link hidden text-sm font-medium text-[var(--accents-5)] hover:text-[var(--foreground)] lg:inline"
          >
            Admin
          </Link>
          <UserButton />
          <SignOutButton>
            <button className="ui-link ui-pressable text-sm font-medium text-[var(--accents-5)] hover:text-[var(--foreground)]">
              Sign out
            </button>
          </SignOutButton>
        </div>
      </SignedIn>
    </>
  );
}
