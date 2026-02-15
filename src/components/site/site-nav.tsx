"use client";

import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguagePicker } from "./language-picker";

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
  const isActive = pathname === href || (pathname.startsWith(href) && href !== '/');

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "relative py-1 text-sm font-medium transition-colors hover:text-[var(--foreground)]",
        isActive
          ? "text-[var(--foreground)]"
          : "text-[var(--accents-5)]"
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute left-0 right-0 top-full mt-3 h-[1.5px] bg-[var(--foreground)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </Link>
  );
}

export function SiteNav() {
  const t = useTranslations("Navigation");

  const links = useMemo(
    () => [
      { href: "/", label: t("home") },
      { href: "/events", label: t("events") },
      { href: "/newsletter", label: t("newsletter") },
      { href: "/team", label: t("team") },
      { href: "/gallery", label: t("gallery") },
      { href: "/projects", label: t("projects") },
      { href: "/join-us", label: t("joinUs") },
      { href: "/contacts", label: t("contacts") },
      // { href: "/about", label: t("about") }, // Maybe unnecessary if we have other pages
    ],
    [], // t is stable reference from useTranslations
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    // Store previously focused element
    lastFocusedElement.current = document.activeElement as HTMLElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      // Focus trap logic
      if (e.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    queueMicrotask(() => firstLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      // Restore focus
      lastFocusedElement.current?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--accents-2)] bg-[var(--background)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href="/" className="group inline-flex items-center gap-2">
          {/* Simple Geometric Logo or just Text */}
          <div className="h-8 w-8 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-lg rounded-sm">
            C
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[var(--foreground)]">CEEA</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink key={l.href} href={l.href}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LanguagePicker />

          <button
            type="button"
            className="lg:hidden text-[var(--accents-5)] hover:text-[var(--foreground)]"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls={menuId}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div
          ref={menuRef}
          id={menuId}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 lg:hidden"
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
            className="absolute left-0 right-0 top-0 border-b border-[var(--accents-2)] bg-[var(--background)] p-5 max-h-[90vh] overflow-y-auto"
          >
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center justify-between">
                <div className="font-display text-xl font-bold tracking-tight text-[var(--foreground)]">CEEA</div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2 text-[var(--foreground)] transition-colors hover:opacity-70"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 grid gap-4">
                {links.map((l, idx) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    ref={idx === 0 ? firstLinkRef : undefined}
                    className="font-display text-lg font-medium text-[var(--foreground)]"
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--accents-2)] pt-4">
                <div className="text-xs text-[var(--accents-4)]">
                  <span className="font-mono">ESC</span> to close
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </header>
  );
}
