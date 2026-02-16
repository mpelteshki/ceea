import { getAdminState } from "@/lib/admin";
import { Link } from "@/i18n/routing";
import { AdminAuthMenu } from "@/components/admin/admin-auth-menu";

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
            <h1 className="text-2xl font-bold font-display text-[var(--foreground)]">
              Admin Access
            </h1>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Restricted area for CEEA administrators.
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm">
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
            ) : state.reason === "admin_emails_not_set" ? (
              <>
                Admin allowlist is not configured. Set{" "}
                <span className="font-mono text-[var(--foreground)]">
                  ADMIN_EMAILS
                </span>{" "}
                to a comma-separated list (for example:{" "}
                <span className="font-mono text-[var(--foreground)]">
                  you@domain.com,other@domain.com
                </span>
                ).
              </>
            ) : state.reason === "no_email" ? (
              <>
                Your Clerk user does not have an email address. Add an email to
                your account (or sign in with email), then try again.
              </>
            ) : (
              <>
                You are signed in as{" "}
                <span className="font-mono text-[var(--foreground)]">
                  {state.email ?? "unknown"}
                </span>
                , but that address is not in{" "}
                <span className="font-mono text-[var(--foreground)]">
                  ADMIN_EMAILS
                </span>
                .
                {state.email?.endsWith("@privaterelay.appleid.com") ? (
                  <>
                    {" "}
                    This is an Apple private relay address. To access admin,
                    sign out and sign back in with a non-relay email (or disable
                    Apple &quot;Hide My Email&quot; for this app in Clerk).
                  </>
                ) : null}
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
      <div className="mx-auto w-full max-w-5xl px-6 py-10">
        <header className="sticky top-0 z-10 mb-12 -mx-6 px-6 py-4 bg-[var(--background)]/80 backdrop-blur-md border-b border-[var(--border)] flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between transition-colors">
          <div className="flex items-center gap-3">
            <Link href="/" className="group flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--foreground)] hover:text-[var(--foreground)]">
              <span className="sr-only">Back to site</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 3.5L2 8L6.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2.5 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <h1 className="font-display text-lg font-bold tracking-tight">Admin</h1>
          </div>

          <nav className="flex items-center gap-1">
            {[
              { label: "Dashboard", href: "/admin" },
              { label: "Team", href: "/admin/team" },
              { label: "Projects", href: "/admin/projects" },
              { label: "Partners", href: "/admin/partners" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-1.5 text-sm font-medium text-[var(--muted-foreground)] transition-colors hover:bg-[var(--secondary)] hover:text-[var(--foreground)] data-[active=true]:bg-[var(--foreground)] data-[active=true]:text-[var(--background)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>

        <footer className="mt-20 border-t border-[var(--border)] pt-8 text-center text-xs text-[var(--muted-foreground)]">
          <p>© {new Date().getFullYear()} CEEA Bocconi • Admin Interface</p>
        </footer>
      </div>
    </div>
  );
}
