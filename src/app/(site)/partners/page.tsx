import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { PartnersShowcase } from "@/components/site/partners-showcase";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION =
  "The organizations, institutions, and communities that help CEEA build stronger programming on campus.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/partners",
  title: "Partners",
  description: toMetaDescription(DESCRIPTION),
});

export default function PartnersPage() {
  return (
    <>
      <PageHeader
        title="Partners"
        subtitle={DESCRIPTION}
      />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        <PartnersShowcase />
      </div>
    </>
  );
}
