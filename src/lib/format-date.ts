/**
 * Shared date-formatting helpers.
 *
 * Every component was defining its own `fmtDate` — this module provides a
 * single source of truth with the specific shapes each consumer needs.
 */

/** Shape used by UpcomingEvents (home) and EventsList (/events) */
export function fmtEventDate(ms: number) {
  const d = new Date(ms);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d).toUpperCase(),
    day: d.getDate().toString().padStart(2, "0"),
    weekday: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(d),
    weekdayLong: new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(d),
    time: new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true }).format(d),
  };
}

/** Shape used by LatestDispatch (home) */
export function fmtPostDate(ms: number) {
  const d = new Date(ms);
  return {
    full: new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(d),
    day: d.getDate().toString().padStart(2, "0"),
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d).toUpperCase(),
    year: d.getFullYear(),
  };
}

/** Short date for newsletter list cards — e.g. "Jan 05, 2025" */
export function fmtShortDate(ms: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date(ms));
}

/** Long date for newsletter article headers — e.g. "January 05, 2025" */
export function fmtLongDate(ms: number) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(ms));
}
