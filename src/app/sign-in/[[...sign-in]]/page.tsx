import { SignIn } from "@clerk/nextjs";
import { hasClerk } from "@/lib/public-env";

export default function Page() {
  return (
    <div className="site-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-6xl items-center justify-center px-5 py-16">
        {hasClerk ? (
          <SignIn />
        ) : (
          <div className="max-w-lg rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            Clerk is not configured. Set{" "}
            <span className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</span>{" "}
            and <span className="font-mono">CLERK_SECRET_KEY</span> in{" "}
            <span className="font-mono">.env.local</span>.
          </div>
        )}
      </div>
    </div>
  );
}
