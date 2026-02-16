import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Sign up",
  robots: NO_INDEX_ROBOTS,
};

export default function LocaleSignUpPage() {
  redirect("/sign-up");
}
