import type { Metadata } from "next";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Admin",
  robots: NO_INDEX_ROBOTS,
};

export default function LocaleAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
