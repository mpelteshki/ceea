"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProvider } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useMemo } from "react";
import { hasClerk, hasConvex } from "@/lib/public-env";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = useMemo(() => {
    if (!hasConvex) return null;
    return new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  }, []);

  // Allow `next build` / preview deploys without env vars.
  // Data-driven UI will render "backend not configured" fallbacks.
  if (!convex) {
    return hasClerk ? <ClerkProvider>{children}</ClerkProvider> : children;
  }

  if (!hasClerk) {
    return <ConvexProvider client={convex}>{children}</ConvexProvider>;
  }

  return (
    <ClerkProvider>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
