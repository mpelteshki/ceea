import type { Metadata } from "next";
import { NewsletterArticle } from "@/components/site/newsletter-article";
import type { Post } from "@/lib/posts";
import { buildPageMetadata, SITE_NAME, toMetaDescription } from "@/lib/seo";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../../../convex/_generated/api";

async function resolvePostMeta(slug: string): Promise<Post | null> {
  if (!hasConvex) return null;
  const convex = getConvexServerClient();
  if (!convex) return null;

  const row = await convex.query(api.posts.getBySlug, { slug });
  if (!row || row.publishedAt == null) return null;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: "",
    publishedAt: row.publishedAt,
  };
}

export async function generateStaticParams() {
  // Newsletter posts are dynamic (Convex-driven); use on-demand rendering
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/newsletter/${slug}`;
  const post = await resolvePostMeta(slug);

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
