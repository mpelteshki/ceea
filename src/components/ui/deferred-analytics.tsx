"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export function DeferredAnalytics() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer analytics to after hydration
    const timer = setTimeout(() => setMounted(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
