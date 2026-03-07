import type { Metadata } from "next";
import { getAdminState } from "@/lib/admin";
import Link from "next/link";
import { AdminAuthMenu } from "@/components/admin/admin-auth-menu";
import { AdminNav } from "@/components/admin/admin-nav";
import { AdminHeaderControls } from "@/components/admin/admin-header-controls";
import { NO_INDEX_ROBOTS } from "@/lib/seo";
import { Logo } from "@/components/ui/logo";

export const metadata: Metadata = {
  title: "Admin",
  robots: NO_INDEX_ROBOTS,
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const state = await getAdminState();
  if (!state.ok) {
    return (
      <div className="site-shell min-h-dvh flex items-center justify-center bg-[var(--background)]">
        <div className="w-full max-w-md p-6">
          <div className="text-center mb-8">
            <Logo className="h-12 w-auto mx-auto mb-4 text-foreground" />
            <h1 className="text-2xl font-bold font-display text-foreground">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Restricted area for CEEA administrators.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            {state.reason === "clerk_not_configured" ? (
              <>
                Clerk is not configured. Set{" "}
                <span className="font-mono text-[var(--foreground)]">
                  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
                </span>{" "}
                and{" "}
                <span className="font-mono text-[var(--foreground)]">
                  CLERK_SECRET_KEY
                </span>{" "}
                in the environment, then redeploy.
              </>
            ) : (
              <>
                You need to sign in to access the admin area.
              </>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <AdminAuthMenu />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell min-h-dvh bg-[var(--background)]">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:border focus:border-[var(--accents-2)] focus:bg-[var(--background)] focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider focus:text-[var(--foreground)]"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-md transition-colors">
        <div className="ui-site-container flex flex-col items-center gap-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="flex items-center justify-center gap-3">
            <Link href="/" className="group flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-[var(--ring)] hover:text-foreground">
              <span className="sr-only">Back to site</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 3.5L2 8L6.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Logo className="h-6 w-auto text-foreground" />
            <h1 className="font-display text-lg font-bold tracking-tight">Admin</h1>
          </div>

          <div className="flex items-center gap-4">
            <AdminNav />
            <div className="h-6 w-px bg-[var(--border)] hidden sm:block" />
            <AdminHeaderControls />
          </div>
        </div>
      </header>

      <main id="admin-main" tabIndex={-1} className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        {children}
      </main>

      <footer className="mt-20 border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} CEEA Bocconi • Admin Interface</p>
      </footer>
    </div>
  );
}
