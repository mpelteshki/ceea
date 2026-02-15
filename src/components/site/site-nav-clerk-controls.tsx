"use client";

import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import { Link } from "@/i18n/routing";

export default function SiteNavClerkControls({ isAdmin }: { isAdmin: boolean }) {
  return (
    <>
      <SignedOut>
        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/sign-in"
            className="text-sm font-medium text-[var(--accents-5)] hover:text-[var(--foreground)]"
          >
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="rounded-md bg-[var(--foreground)] px-3 py-1.5 text-sm font-medium text-[var(--background)] hover:opacity-90"
          >
            Sign up
          </Link>
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <Link
              href="/admin"
              className="hidden text-sm font-medium text-[var(--accents-5)] hover:text-[var(--foreground)] lg:inline"
            >
              Admin
            </Link>
          ) : null}
          <UserButton />
          <SignOutButton>
            <button className="text-sm font-medium text-[var(--accents-5)] hover:text-[var(--foreground)] transition-colors">
              Sign out
            </button>
          </SignOutButton>
        </div>

      </SignedIn>
    </>
  );
}
