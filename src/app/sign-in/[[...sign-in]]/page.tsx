import type { Metadata } from "next";
import { CustomSignIn } from "@/components/auth/custom-sign-in";
import { hasClerk } from "@/lib/public-env";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: NO_INDEX_ROBOTS,
};

export default function Page() {
  return (
    <div className="site-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-5 py-16">
        {hasClerk ? (
          <CustomSignIn />
        ) : (
          <div className="max-w-lg border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md">
            Clerk is not configured. Set{" "}
            <span className="font-mono text-[var(--foreground)]">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>{" "}
            and <span className="font-mono text-[var(--foreground)]">CLERK_SECRET_KEY</span> in{" "}
            <span className="font-mono text-[var(--foreground)]">.env.local</span>.
          </div>
        )}
      </div>
    </div>
  );
}
