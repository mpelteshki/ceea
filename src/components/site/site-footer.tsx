import Link from "next/link";
import { SITE_CONTACT, SITE_EMAIL_HREF } from "@/lib/site-contact";

const PRIMARY_LINKS = [
  { href: "/events", label: "Events" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/about", label: "About" },
  { href: "/join-us", label: "Join Us" },
  { href: "/contacts", label: "Contacts" },
] as const;

export async function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[var(--brand-teal)] text-white">
      <div className="ui-site-container relative z-10 py-9 sm:py-10">
        <h2 className="sr-only">Footer</h2>

        <div className="grid gap-8 md:grid-cols-[1.1fr_1fr_1fr]">
          <section>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-lg font-bold">
                C
              </div>
              <p className="font-brand text-xl tracking-wide">CEEA</p>
            </div>
            <p className="mt-3 max-w-md text-sm leading-6 text-white/75">
              Central &amp; Eastern European Association at Bocconi University.
            </p>
          </section>

          <nav aria-label="Footer navigation">
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/60">Navigate</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-9 items-center text-sm text-white/78 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <section>
            <p className="text-[11px] font-mono uppercase tracking-[0.18em] text-white/60">Contact</p>
            <ul className="mt-3 space-y-1">
              <li>
                <a
                  href={SITE_EMAIL_HREF}
                  className="inline-flex min-h-9 items-center text-sm text-white/78 transition-colors hover:text-white"
                >
                  {SITE_CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONTACT.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center text-sm text-white/78 transition-colors hover:text-white"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={SITE_CONTACT.linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-9 items-center text-sm text-white/78 transition-colors hover:text-white"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </section>
        </div>

        <div
          className="mt-6 flex flex-col gap-3 border-t border-white/15 pt-4 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between"
          style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
        >
          <p>© {currentYear} CEEA Bocconi.</p>
        </div>
      </div>
    </footer>
  );
}
