"use client";

import { Link, usePathname } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguagePicker } from "./language-picker";
import SiteNavClerkControls from "./site-nav-clerk-controls";

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
  const isActive = pathname === href || (pathname.startsWith(href) && href !== "/");

  return (
    <Link
      href={href}
      onClick={onClick}
      data-active={isActive ? "true" : "false"}
      className={cn(
        "ui-nav-link group/nav px-3 py-5 text-[13px] font-medium tracking-wide transition-colors duration-200",
        isActive ? "text-[var(--foreground)]" : "text-[var(--accents-5)] hover:text-[var(--foreground)]",
      )}
    >
      <span
        className={cn(
          "inline-block transition-transform duration-200",
          isActive ? "translate-y-0" : "group-hover/nav:-translate-y-0.5",
        )}
      >
        {children}
      </span>
    </Link>
  );
}

export function SiteNav() {
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  const links = [
    { href: "/", label: t("home") },
    { href: "/events", label: t("events") },
    { href: "/newsletter", label: t("newsletter") },
    { href: "/team", label: t("team") },
    { href: "/projects", label: t("projects") },
    { href: "/join-us", label: t("joinUs") },
    { href: "/contacts", label: t("contacts") },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;

    lastFocusedElement.current = document.activeElement as HTMLElement;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select',
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    queueMicrotask(() => firstLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
      lastFocusedElement.current?.focus();
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="h-[2px] bg-gradient-to-r from-[var(--brand-teal)] via-[var(--brand-caramel)] to-[var(--brand-teal)]" />

      <div className="border-b border-[var(--accents-2)] bg-[var(--background)]/80 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="group inline-flex items-center gap-3 transition-transform duration-300 hover:scale-[1.02]">
            <div className="relative h-9 w-9 rounded-lg bg-gradient-to-br from-[var(--brand-teal)] to-[color-mix(in_oklch,var(--brand-teal)_70%,#0a3a3d)] text-white flex items-center justify-center font-bold text-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              C
            </div>
            <span className="font-brand text-[1.35rem] text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--brand-teal)]">
              CEEA
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink key={l.href} href={l.href}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <SiteNavClerkControls />
            <LanguagePicker />

            <button
              type="button"
              className="ui-pressable lg:hidden flex items-center justify-center h-10 w-10 rounded-full text-[var(--accents-5)] hover:text-[var(--foreground)] hover:bg-[var(--accents-1)] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div ref={menuRef} id={menuId} role="dialog" aria-modal="true" className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute left-0 right-0 top-0 bg-[var(--background)] max-h-[90vh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-2 fade-in duration-300"
            style={{ overscrollBehavior: "contain" }}
          >
            <div className="h-[2px] bg-gradient-to-r from-[var(--brand-teal)] via-[var(--brand-caramel)] to-[var(--brand-teal)]" />

            <div className="p-6">
              <div className="mx-auto max-w-6xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[var(--brand-teal)] to-[color-mix(in_oklch,var(--brand-teal)_70%,#0a3a3d)] text-white flex items-center justify-center font-bold text-sm shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
                      C
                    </div>
                    <div className="font-brand text-xl text-[var(--foreground)]">CEEA</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="ui-pressable p-3 -mr-3 rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--accents-1)]"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-8 grid gap-1">
                  {links.map((l, idx) => {
                    const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));

                    return (
                      <Link
                        key={l.href}
                        href={l.href}
                        ref={idx === 0 ? firstLinkRef : undefined}
                        className={cn(
                          "block font-display text-xl py-3 px-4 rounded-xl transition-[background-color,color,transform] duration-200 hover:translate-x-1",
                          isActive
                            ? "text-[var(--brand-teal)] bg-[color-mix(in_oklch,var(--brand-teal)_8%,var(--background))]"
                            : "text-[var(--foreground)] hover:bg-[var(--accents-1)]",
                        )}
                        onClick={() => setMenuOpen(false)}
                      >
                        {l.label}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-[var(--accents-2)]">
                  <div className="text-xs text-[var(--accents-4)]">
                    <kbd className="font-mono px-1.5 py-0.5 bg-[var(--accents-1)] rounded text-[10px]">ESC</kbd> to close
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
