import { NewsletterArticle } from "@/components/site/newsletter-article";

export default async function NewsletterArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <NewsletterArticle slug={slug} />;
}
