"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import { Logo } from "@/components/ui/logo";
import { SITE_APPLY_FORM_URL } from "@/lib/site-contact";

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
  const isExternal = href.startsWith("http");
  const isActive = isExternal
    ? false
    : pathname === href || (pathname.startsWith(href) && href !== "/");

  const className = cn(
    "ui-nav-link group/nav px-3 py-5 text-[13px] font-medium tracking-wide transition-colors duration-200",
    isActive ? "text-[var(--primary)]" : "text-[var(--accents-5)] hover:text-foreground",
  );

  const content = (
    <span
      className={cn(
        "inline-block transition-transform duration-200",
        isActive ? "translate-y-0" : "group-hover/nav:-translate-y-0.5",
      )}
    >
      {children}
    </span>
  );

  if (isExternal) {
    return (
      <a href={href} onClick={onClick} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      data-active={isActive ? "true" : "false"}
      className={className}
    >
      {content}
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
    { href: SITE_APPLY_FORM_URL, label: "Join Us" },
    { href: "/contacts", label: "Contacts" },
    { href: "/admin", label: "Admin", requiredAuth: true },
  ];

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const menuId = useId();
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef(0);
  const shouldRestoreScrollRef = useRef(true);

  const openMenu = useCallback(() => {
    setMenuOpen(true);
    // rAF ensures the DOM has the element before we flip visibility for CSS transition
    requestAnimationFrame(() => requestAnimationFrame(() => setMenuVisible(true)));
  }, []);

  const closeMenu = useCallback(() => {
    setMenuVisible(false);
    // Wait for CSS exit transition before unmounting
    const timer = setTimeout(() => setMenuOpen(false), 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const onMediaChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        // Instant close on breakpoint change — no exit animation needed
        setMenuVisible(false);
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
      setMenuVisible(false);
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
        closeMenu();
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
  }, [menuOpen, closeMenu]);

  return (
    <header
      className={cn(
        "fixed top-0 z-40 w-full transition-[transform,background-color,border-color,padding] duration-300",
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div>
        <div className="mx-auto flex h-16 max-w-[80rem] items-center justify-between px-5 sm:px-6">
          <Link href="/" aria-label="CEEA home">
            <Logo className="h-11 w-auto text-foreground" />
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
              className="ui-pressable lg:hidden flex items-center justify-center h-10 w-10 rounded-full text-[var(--accents-5)] hover:text-foreground hover:bg-[var(--accents-1)] transition-colors"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => (menuOpen ? closeMenu() : openMenu())}
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
            className={cn(
              "absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200",
              menuVisible ? "opacity-100" : "opacity-0",
            )}
            onClick={closeMenu}
          />
          <div
            className={cn(
              "absolute left-0 right-0 top-0 bg-background max-h-[100dvh] overflow-y-auto shadow-2xl transition-[opacity,transform] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
              menuVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-2",
            )}
            style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" }}
          >
            <div className="px-5 pt-5 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))]">
              <div className="flex items-center justify-between">
                <div>
                  <Logo className="h-11 w-auto text-foreground" />
                </div>
                <button
                  type="button"
                  onClick={closeMenu}
                  className="ui-pressable p-2.5 -mr-2.5 rounded-full text-foreground transition-colors hover:bg-[var(--accents-1)]"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-5 grid gap-0.5">
                {links.map((l, idx) => {
                  const isExternal = l.href.startsWith("http");
                  const isActive = isExternal
                    ? false
                    : pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href));
                  const className = cn(
                    "block rounded-lg px-3.5 py-3 text-left font-display text-lg transition-[background-color,color] duration-200",
                    isActive
                      ? "text-[var(--primary)] bg-[color-mix(in_oklch,var(--primary)_8%,var(--background))]"
                      : "text-foreground hover:bg-[var(--accents-1)]",
                  );
                  const LinkComponent = (
                    isExternal ? (
                      <a
                        key={l.href}
                        href={l.href}
                        ref={idx === 0 ? firstLinkRef : undefined}
                        className={className}
                        onClick={closeMenu}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        key={l.href}
                        href={l.href}
                        ref={idx === 0 ? firstLinkRef : undefined}
                        className={className}
                        onClick={closeMenu}
                      >
                        {l.label}
                      </Link>
                    )
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
