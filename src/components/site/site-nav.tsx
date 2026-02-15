"use client";

import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { hasClerk } from "@/lib/public-env";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative py-2 font-mono text-[11px] uppercase tracking-[0.24em] transition-colors hover:text-black dark:hover:text-white",
        active ? "text-black dark:text-white" : "text-black/55 dark:text-white/55",
      )}
    >
      {children}
      {active && (
        <motion.div
          layoutId="nav-underline"
          className="absolute -bottom-px left-0 right-0 h-[2px] bg-[color:var(--danube)]"
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
        />
      )}
    </Link>
  );
}

export function SiteNav() {
  const links = useMemo(
    () => [
      { href: "/events", label: "Events" },
      { href: "/newsletter", label: "Newsletter" },
      { href: "/about", label: "About" },
      { href: "/team", label: "Team" },
      { href: "/partners", label: "Partners" },
      { href: "/contact", label: "Contact" },
    ],
    [],
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    queueMicrotask(() => firstLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[color:var(--rule-strong)] bg-[color:var(--paper)]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          <span className="font-display text-3xl leading-none tracking-tight">
            CEEA
          </span>
          <span className="ui-tag">Bocconi</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 sm:flex">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="sm:hidden text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {hasClerk ? (
            <>
              <SignedOut>
                <Link
                  href="/sign-in"
                  className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white sm:block"
                >
                  Admin
                </Link>
              </SignedOut>
              <SignedIn>
                <Link
                  href="/admin"
                  className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white sm:block"
                >
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </>
          ) : (
            <Link
              href="/admin"
              className="hidden font-mono text-[11px] uppercase tracking-[0.24em] text-black/55 transition-colors hover:text-black dark:text-white/55 dark:hover:text-white sm:block"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {menuOpen ? (
        <div
          id={menuId}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 sm:hidden"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute left-0 right-0 top-0 border-b border-[color:var(--rule-strong)] bg-[color:var(--paper)] p-5"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between">
                <div className="font-display text-2xl leading-none">CEEA</div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-black transition-colors hover:opacity-70 dark:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-8 grid gap-4">
                {links.map((l, idx) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    ref={idx === 0 ? firstLinkRef : undefined}
                    className="font-display text-2xl tracking-tight text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between border-t border-[color:var(--rule)] pt-6">
                <Link
                  href="/admin"
                  className="font-mono text-[11px] uppercase tracking-[0.24em] text-black/55 hover:text-black dark:text-white/55 dark:hover:text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Admin Access
                </Link>
                <div className="text-xs text-black/40 dark:text-white/40">
                  Press <span className="font-mono">Esc</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </header>
  );
}
