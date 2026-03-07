"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Team", href: "/admin/team" },
  { label: "Projects", href: "/admin/projects" },
  { label: "Partners", href: "/admin/partners" },
  { label: "Newsletter", href: "/admin/newsletter" },
] as const;

function normalizeAdminPath(pathname: string) {
  return pathname.length === 0 ? "/" : pathname;
}

export function AdminNav() {
  const pathname = normalizeAdminPath(usePathname());

  return (
    <nav aria-label="Admin sections" className="flex w-full items-center gap-1 overflow-x-auto pb-1 sm:w-auto sm:pb-0">
      {ITEMS.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));

        return (
          <Link
            key={item.href}
            href={item.href}
            data-active={active ? "true" : "false"}
            aria-current={active ? "page" : undefined}
            className="shrink-0 rounded-full px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-[var(--secondary)] hover:text-foreground data-[active=true]:bg-foreground data-[active=true]:text-background"
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
