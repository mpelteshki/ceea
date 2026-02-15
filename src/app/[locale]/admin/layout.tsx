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
      <div className="site-shell min-h-dvh bg-[var(--accents-1)]">
        <div className="mx-auto w-full max-w-2xl px-5 py-12">
          <h1 className="text-2xl font-bold font-display text-[var(--foreground)]">
            Admin access required
          </h1>
          <div className="mt-4 rounded-lg border border-[var(--accents-2)] bg-[var(--background)] p-5 text-sm text-[var(--accents-5)]">
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

          <AdminAuthMenu />
        </div>
      </div>
    );
  }

  return (
    <div className="site-shell min-h-dvh bg-[var(--accents-1)]">
      <div className="mx-auto w-full max-w-6xl px-5 py-10">
        <header className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold font-display tracking-tight">CEEA Admin</h1>
            <Link href="/" className="text-xs text-[var(--accents-5)] hover:text-[var(--foreground)] transition-colors inline-flex items-center gap-1">
              <span>←</span> Back to site
            </Link>
          </div>

          <nav className="flex flex-wrap items-center gap-1 rounded-lg border border-[var(--accents-2)] bg-[var(--background)] p-1">
            {[
              { label: "Dashboard", href: "/admin" },
              { label: "Team", href: "/admin/team" },
              { label: "Projects", href: "/admin/projects" },
              { label: "Gallery", href: "/admin/gallery" },
              { label: "Partners", href: "/admin/partners" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-4 py-2 text-sm font-medium text-[var(--accents-5)] hover:bg-[var(--accents-1)] hover:text-[var(--foreground)] transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="min-h-[600px] rounded-xl border border-[var(--accents-2)] bg-[var(--background)] p-8 shadow-sm">
          {children}
        </main>

        <footer className="mt-12 text-center text-xs text-[var(--accents-4)]">
          <p>© {new Date().getFullYear()} CEEA Bocconi • Admin Interface</p>
        </footer>
      </div>
    </div>
  );
}

