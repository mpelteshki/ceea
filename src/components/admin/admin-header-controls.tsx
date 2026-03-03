"use client";

import { SignOutButton, SignedIn } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function AdminHeaderControls() {
  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <SignOutButton>
          <button
            className="group flex items-center gap-2 rounded-md bg-[var(--secondary)]/50 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
            title="Sign Out"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </SignOutButton>
      </SignedIn>
    </div>
  );
}
