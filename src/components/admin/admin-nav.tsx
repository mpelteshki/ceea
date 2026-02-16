"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Team", href: "/admin/team" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Partners", href: "/admin/partners" },
] as const;

function normalizeAdminPath(pathname: string) {
  const withoutLocale = pathname.replace(/^\/(en|it)(?=\/|$)/, "");
  return withoutLocale.length === 0 ? "/" : withoutLocale;
}

export function AdminNav() {
  const pathname = normalizeAdminPath(usePathname());

  return (
    <nav className="flex w-full items-center gap-1 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={active ? "true" : "false"}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] data-[active=true]:bg-[var(--foreground)] data-[active=true]:text-[var(--background)]"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
