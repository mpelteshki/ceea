import { SiteFooter } from "@/components/site/site-footer";
import { SiteNav } from "@/components/site/site-nav";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell min-h-dvh">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-black/30 focus:bg-[color:var(--paper)] focus:px-4 focus:py-2 focus:font-mono focus:text-[12px] focus:uppercase focus:tracking-[0.18em] focus:text-black dark:focus:border-white/30 dark:focus:text-white"
      >
        Skip to content
      </a>
      <SiteNav />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-5 pb-16 pt-10 sm:px-6 sm:pt-12"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
