"use client";

import { SignedIn, SignedOut, UserButton, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export function AdminAuthMenu() {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center text-sm">
      <SignedOut>
        <Link
          href="/sign-in"
          className="rounded-md border border-[var(--accents-2)] bg-[var(--background)] px-3 py-1.5 font-medium text-[var(--foreground)] hover:bg-[var(--accents-1)]"
        >
          Sign in
        </Link>
        <Link
          href="/sign-up"
          className="rounded-md bg-[var(--foreground)] px-3 py-1.5 font-medium text-[var(--background)] hover:opacity-90"
        >
          Sign up
        </Link>
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <UserButton />
            <span className="text-[var(--accents-5)]">
              Signed in
            </span>
          </div>
          <SignOutButton>
            <button className="ui-btn w-fit" data-variant="secondary">
              Sign out from account
            </button>
          </SignOutButton>
        </div>

      </SignedIn>
      <Link href="/" className="underline underline-offset-4 text-[var(--accents-5)]">
        Go to home
      </Link>
    </div>
  );
}
