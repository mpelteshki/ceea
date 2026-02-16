"use client";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { useEffect, useState } from "react";

export function DeferredAnalytics() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = () => setReady(true);
    const win = globalThis as unknown as Window & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        options?: IdleRequestOptions,
      ) => number;
      cancelIdleCallback?: (handle: number) => void;
    };

    if (typeof win.requestIdleCallback === "function") {
      const id = win.requestIdleCallback(run, { timeout: 1500 });
      return () => win.cancelIdleCallback?.(id);
    }

    const timeout = setTimeout(run, 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (!ready) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
