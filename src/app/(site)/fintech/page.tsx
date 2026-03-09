import type { Metadata } from "next";

import { PageHeader } from "@/components/site/page-header";
import { FintechShowcase } from "@/components/site/fintech-showcase";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const DESCRIPTION =
  "A public view of the division's initiatives: experiments, editorial projects, and practical work at the intersection of finance, tech, and the region.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/fintech",
  title: "Fintech",
  description: toMetaDescription(DESCRIPTION),
});

export default function FintechPage() {
  return (
    <>
      <PageHeader
        title="Fintech"
        subtitle={DESCRIPTION}
        kicker="Projects"
      />

      <div className="ui-site-container pt-8 pb-12 sm:pt-10 sm:pb-16">
        <FintechShowcase />
      </div>
    </>
  );
}
