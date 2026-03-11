"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { AuthorProfile } from "@/lib/posts";

/* ------------------------------------------------------------------ */
/*  Author chip — clickable inline element that opens a profile card   */
/* ------------------------------------------------------------------ */

export function AuthorChip({
  profile,
  className,
}: {
  profile: AuthorProfile;
  className?: string;
}) {
  return <AuthorChipWithProfile profile={profile} className={className} />;
}

function AuthorChipWithProfile({
  profile,
  className,
}: {
  profile: AuthorProfile;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        cardRef.current &&
        !cardRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, close]);

  return (
    <span className="relative inline-block">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "inline-flex items-center gap-1.5 rounded-full transition-colors",
          "hover:text-foreground hover:bg-foreground/5",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-teal)] focus-visible:ring-offset-2",
          "cursor-pointer px-1.5 py-0.5 -mx-1.5 -my-0.5",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <AuthorAvatar name={profile.name} size={18} />
        <span className="underline decoration-dotted underline-offset-[3px] decoration-current/30">
          {profile.name}
        </span>
      </button>

      {open && (
        <div
          ref={cardRef}
          role="dialog"
          aria-label={`${profile.name}'s profile`}
          className="absolute left-0 top-full z-50 mt-2 w-72 animate-in fade-in slide-in-from-top-1 duration-150"
        >
          <AuthorProfileCard profile={profile} onClose={close} />
        </div>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Profile card                                                       */
/* ------------------------------------------------------------------ */

function AuthorProfileCard({
  profile,
  onClose,
}: {
  profile: AuthorProfile;
  onClose: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg shadow-black/5">
      {/* Header strip */}
      <div className="h-14 bg-gradient-to-r from-[var(--brand-teal)] to-[var(--brand-teal)]/70" />

      <div className="-mt-7 px-5 pb-5">
        {/* Avatar */}
        <div className="mb-3">
          <AuthorAvatar name={profile.name} size={52} className="ring-3 ring-card" />
        </div>

        {/* Name */}
        <h3 className="font-display text-base font-semibold text-foreground leading-tight">
          {profile.name}
        </h3>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {profile.bio}
          </p>
        )}

        {/* Links */}
        {(profile.linkedinUrl || profile.websiteUrl) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            )}
            {profile.websiteUrl && (
              <a
                href={profile.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              >
                <GlobeIcon />
                Website
              </a>
            )}
          </div>
        )}
      </div>

      {/* Close hint (mobile) */}
      <button
        type="button"
        onClick={onClose}
        className="w-full border-t border-border px-5 py-2 text-center text-[0.6875rem] text-muted-foreground transition-colors hover:bg-foreground/5 sm:hidden"
      >
        Close
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Avatar (initials-based)                                            */
/* ------------------------------------------------------------------ */

function AuthorAvatar({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={[
        "inline-flex items-center justify-center rounded-full bg-[var(--brand-teal)]/15 text-[var(--brand-teal)] font-semibold select-none shrink-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        lineHeight: 1,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Icons                                                              */
/* ------------------------------------------------------------------ */

function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
