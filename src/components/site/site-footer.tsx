import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 py-10 dark:border-white/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <div className="font-display text-2xl leading-none">CEEA</div>
            <p className="max-w-xl text-sm leading-6 text-black/65 dark:text-white/65">
              A Bocconi student association for Central & Eastern European
              community, culture, and career bridges. Based in Milan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/events"
              className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Events
            </Link>
            <Link
              href="/about"
              className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              About
            </Link>
            <Link
              href="/partners"
              className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Partners
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3 py-2 text-sm text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-black/10 pt-6 text-xs text-black/55 dark:border-white/10 dark:text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CEEA Bocconi. Not an official Bocconi
            University website.
          </p>
          <p className="font-mono tracking-wide">
            Built with Next.js, Convex, Clerk, and Bun.
          </p>
        </div>
      </div>
    </footer>
  );
}

