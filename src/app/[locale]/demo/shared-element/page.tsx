import type { Metadata } from "next";
import { SharedElementDemo } from "@/components/site/shared-element-demo";
import { NO_INDEX_ROBOTS } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Shared element demo",
  robots: NO_INDEX_ROBOTS,
};

export default function SharedElementDemoPage() {
  return <SharedElementDemo />;
}
