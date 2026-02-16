import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign in",
  robots: NO_INDEX_ROBOTS,
};

export default function LocaleSignInPage() {
  redirect("/sign-in");
}
