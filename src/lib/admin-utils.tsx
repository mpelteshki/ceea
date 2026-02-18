/** Shared pagination helper used across all admin list panels. */
export function paginate<T>(items: T[], page: number, pageSize: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    safePage,
    totalPages,
    totalItems: items.length,
  };
}

/** Read a single search-param value from the browser URL (SSR-safe). */
export function readSearchParam(name: string): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(name);
}

/** Parse a page number from a raw search-param string. */
export function parsePage(raw: string | null): number {
  const value = Number(raw);
  return Number.isInteger(value) && value > 0 ? value : 1;
}

/** Generic sort-param parser — returns `fallback` when `raw` isn't in `valid`. */
export function parseEnum<T extends string>(raw: string | null, valid: readonly T[], fallback: T): T {
  return valid.includes(raw as T) ? (raw as T) : fallback;
}

/** Shared loading spinner shown while admin panels hydrate. */
export function AdminPanelFallback({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="py-16 text-center">
      <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent text-[var(--accents-5)]" />
      <p className="mt-3 text-sm text-[var(--accents-5)]">{label}</p>
    </div>
  );
}
