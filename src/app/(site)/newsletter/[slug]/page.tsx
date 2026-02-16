import type { Metadata } from "next";
import { NewsletterArticle } from "@/components/site/newsletter-article";
import { getConvexServerClient } from "@/lib/convex-server";
import { hasConvex } from "@/lib/public-env";
import { buildPageMetadata, SITE_NAME, toMetaDescription } from "@/lib/seo";
import { api } from "../../../../../convex/_generated/api";
import type { Doc } from "../../../../../convex/_generated/dataModel";

type PostDoc = Doc<"posts">;

export async function generateStaticParams() {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  const posts = (await convex.query(api.posts.listAll, {})) as PostDoc[];
  return posts.filter((post) => post.publishedAt != null).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/newsletter/${slug}`;

  if (!hasConvex) {
    return buildPageMetadata({
      pathname,
      title: `Not found. | ${SITE_NAME}`,
      description: toMetaDescription("Not found."),
      noIndex: true,
    });
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return buildPageMetadata({
      pathname,
      title: `Not found. | ${SITE_NAME}`,
      description: toMetaDescription("Not found."),
      noIndex: true,
    });
  }

  const post = (await convex.query(api.posts.getBySlug, { slug })) as PostDoc | null;
  if (!post || post.publishedAt == null) {
    return buildPageMetadata({
      pathname,
      title: `Not found. | ${SITE_NAME}`,
      description: toMetaDescription("Not found."),
      noIndex: true,
    });
  }

  const title = String(post.title || SITE_NAME);
  const description = toMetaDescription(String(post.excerpt || ""));
  const metadata = buildPageMetadata({
    pathname: `/newsletter/${post.slug}`,
    title,
    description,
  });

  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: new Date(post.publishedAt).toISOString(),
      authors: [SITE_NAME],
    },
  };
}

export default async function NewsletterArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NewsletterArticle slug={slug} />;
}
