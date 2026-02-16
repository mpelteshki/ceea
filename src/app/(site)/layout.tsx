import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--background)] overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-[var(--accents-2)] focus:bg-[var(--background)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-[var(--foreground)]"
      >
        Skip to content
      </a>
      <SiteNav />
      <main
        id="main"
        tabIndex={-1}
        className="flex-1 min-h-[100dvh] text-center sm:text-left"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
