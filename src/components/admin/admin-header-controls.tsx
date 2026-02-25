"use client";

import { SignOutButton, SignedIn, useUser } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Image from "next/image";

export function AdminHeaderControls() {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-3">
      <SignedIn>
        <div className="hidden items-center gap-2 text-sm text-muted-foreground sm:flex">
          <div className="h-6 w-6 overflow-hidden rounded-full bg-[var(--secondary)]">
            <Image
              src={user?.imageUrl ?? "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="}
              alt={user?.fullName || "Admin"}
              width={24}
              height={24}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <span className="font-medium text-foreground">
            {user?.firstName || user?.username || "Admin"}
          </span>
        </div>

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
