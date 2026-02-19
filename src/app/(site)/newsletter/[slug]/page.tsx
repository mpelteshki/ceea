import type { Metadata } from "next";
import { NewsletterArticle } from "@/components/site/newsletter-article";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { buildPageMetadata, SITE_NAME, toMetaDescription } from "@/lib/seo";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/newsletter/${slug}`;
  const post = getPostBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      pathname,
      title: `Not found. | ${SITE_NAME}`,
      description: toMetaDescription("Not found."),
      noIndex: true,
    });
  }

  const metadata = buildPageMetadata({
    pathname: `/newsletter/${post.slug}`,
    title: post.title,
    description: toMetaDescription(post.excerpt || ""),
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
