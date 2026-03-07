import Script from "next/script";
import { notFound } from "next/navigation";

import { ArticleWithDesignSwitcher } from "@/components/site/newsletter-article-designs";
import type { Post } from "@/lib/posts";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/lib/seo";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../../convex/_generated/api";

async function resolvePost(slug: string): Promise<Post | null> {
  if (!hasConvex) return null;
  const convex = getConvexServerClient();
  if (!convex) return null;

  const row = await convex.query(api.posts.getBySlug, { slug });
  if (!row || row.publishedAt == null) return null;

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    publishedAt: row.publishedAt,
  };
}

export async function NewsletterArticle({ slug }: { slug: string }) {
  const post = await resolvePost(slug);

  if (!post) {
    notFound();
  }

  const articleUrl = absoluteUrl(`/newsletter/${post.slug}`);
  const publishedAtIso = new Date(post.publishedAt).toISOString();
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: publishedAtIso,
    dateModified: publishedAtIso,
    url: articleUrl,
    mainEntityOfPage: articleUrl,
    inLanguage: "en",
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL.origin,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL.origin}/favicon.ico`,
      },
    },
  };

  return (
    <>
      <Script id={`newsletter-article-structured-data-${post.slug}`} type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(articleStructuredData)}
      </Script>
      <ArticleWithDesignSwitcher post={post} />
    </>
  );
}
