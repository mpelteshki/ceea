import type { Metadata } from "next";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "SSO callback",
  robots: NO_INDEX_ROBOTS,
};

export default function SsoCallbackPage() {
  return <AuthenticateWithRedirectCallback />;
}
