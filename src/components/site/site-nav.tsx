"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";

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
        isActive ? "text-[var(--primary)]" : "text-[var(--accents-5)] hover:text-[var(--foreground)]",
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
  const pathname = usePathname();
  const links = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Events" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "/team", label: "Team" },
    { href: "/projects", label: "Projects" },
    { href: "/join-us", label: "Join Us" },
    { href: "/contacts", label: "Contacts" },
    { href: "/admin", label: "Admin", requiredAuth: true },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef(0);
  const shouldRestoreScrollRef = useRef(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setMenuOpen(false);
      }
    };

    media.addEventListener("change", onMediaChange);
    return () => media.removeEventListener("change", onMediaChange);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    lastFocusedElement.current = document.activeElement as HTMLElement;
    scrollYRef.current = window.scrollY;
    shouldRestoreScrollRef.current = true;

    const prevOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevPosition = document.body.style.position;
    const prevTop = document.body.style.top;
    const prevWidth = document.body.style.width;
    const prevOverscrollBehavior = document.documentElement.style.overscrollBehavior;

    const closeFromHistoryNavigation = () => {
      shouldRestoreScrollRef.current = false;
      setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";
    document.documentElement.style.overscrollBehavior = "none";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }

      if (e.key === "Tab" && menuRef.current) {
        const focusableElements = Array.from(
          menuRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => el.getAttribute("aria-hidden") !== "true");

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else if (document.activeElement === lastElement || !menuRef.current.contains(document.activeElement)) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", closeFromHistoryNavigation);
    queueMicrotask(() => firstLinkRef.current?.focus());

    return () => {
      document.body.style.overflow = prevOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.position = prevPosition;
      document.body.style.top = prevTop;
      document.body.style.width = prevWidth;
      document.documentElement.style.overscrollBehavior = prevOverscrollBehavior;
      if (shouldRestoreScrollRef.current) {
        window.scrollTo(0, scrollYRef.current);
      }
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", closeFromHistoryNavigation);
      if (lastFocusedElement.current && document.contains(lastFocusedElement.current)) {
        lastFocusedElement.current.focus();
      }
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-all duration-300",
        isScrolled
          ? "bg-[var(--background)]/90 backdrop-blur-md border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <div>
        <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between px-5 sm:px-6">
          <Link href="/" aria-label="CEEA home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="CEEA" className="h-11 w-auto" />
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {links.map((l) => {
              if (l.requiredAuth) {
                return (
                  <SignedIn key={l.href}>
                    <NavLink href={l.href}>{l.label}</NavLink>
                  </SignedIn>
                );
              }
              return (
                <NavLink key={l.href} href={l.href}>
                  {l.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
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
          <button
            type="button"
            aria-label="Close mobile menu"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMenuOpen(false)}
          />
          <div
            className="absolute left-0 right-0 top-0 bg-[var(--background)] max-h-[100dvh] overflow-y-auto shadow-2xl animate-in slide-in-from-top-1 fade-in duration-300"
            style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
          >
            <div className="px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between">
                <div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/logo.svg" alt="CEEA" className="h-11 w-auto" />
                </div>
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="ui-pressable p-2.5 -mr-2.5 rounded-full text-[var(--foreground)] transition-colors hover:bg-[var(--accents-1)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid gap-0.5">
                {links.map((l, idx) => {
                  const isActive = pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
                  const LinkComponent = (
                    <Link
                      key={l.href}
                      href={l.href}
                      ref={idx === 0 ? firstLinkRef : undefined}
                      className={cn(
                        "block rounded-lg px-3.5 py-3 text-left font-display text-lg transition-[background-color,color] duration-200",
                        isActive
                          ? "text-[var(--primary)] bg-[color-mix(in_oklch,var(--primary)_8%,var(--background))]"
                          : "text-[var(--foreground)] hover:bg-[var(--accents-1)]",
                      )}
                      onClick={() => setMenuOpen(false)}
                    >
                      {l.label}
                    </Link>
                  );

                  if (l.requiredAuth) {
                    return <SignedIn key={l.href}>{LinkComponent}</SignedIn>;
                  }
                  return LinkComponent;
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
