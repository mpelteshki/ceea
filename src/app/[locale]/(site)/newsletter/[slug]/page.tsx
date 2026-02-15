import { NewsletterArticle } from "@/components/site/newsletter-article";

export default async function NewsletterArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  return <NewsletterArticle slug={slug} />;
}
