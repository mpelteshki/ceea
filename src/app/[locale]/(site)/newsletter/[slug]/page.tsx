import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { NewsletterArticle } from "@/components/site/newsletter-article";
import { getConvexServerClient } from "@/lib/convex-server";
import { getLocalized } from "@/lib/localization";
import { hasConvex } from "@/lib/public-env";
import { buildPageMetadata, resolveLocale, SITE_NAME, toMetaDescription } from "@/lib/seo";
import { api } from "../../../../../../convex/_generated/api";
import type { Doc } from "../../../../../../convex/_generated/dataModel";

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
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const typedLocale = resolveLocale(locale);
  const t = await getTranslations({ locale: typedLocale, namespace: "NewsletterArticle" });
  const pathname = `/newsletter/${slug}`;

  if (!hasConvex) {
    return buildPageMetadata({
      locale: typedLocale,
      pathname,
      title: `${t("notFound")} | ${SITE_NAME}`,
      description: toMetaDescription(t("notFound")),
      noIndex: true,
    });
  }

  const convex = getConvexServerClient();
  if (!convex) {
    return buildPageMetadata({
      locale: typedLocale,
      pathname,
      title: `${t("notFound")} | ${SITE_NAME}`,
      description: toMetaDescription(t("notFound")),
      noIndex: true,
    });
  }

  const post = (await convex.query(api.posts.getBySlug, { slug })) as PostDoc | null;
  if (!post || post.publishedAt == null) {
    return buildPageMetadata({
      locale: typedLocale,
      pathname,
      title: `${t("notFound")} | ${SITE_NAME}`,
      description: toMetaDescription(t("notFound")),
      noIndex: true,
    });
  }

  const localized = getLocalized(post, typedLocale, ["title", "excerpt"] as const);
  const title = String(localized.title ?? post.title);
  const description = toMetaDescription(String(localized.excerpt ?? post.excerpt));
  const metadata = buildPageMetadata({
    locale: typedLocale,
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
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  return <NewsletterArticle slug={slug} />;
}
