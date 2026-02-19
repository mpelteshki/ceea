import { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_SITE_PATHS } from "@/lib/seo";
import { getAllPosts } from "@/lib/posts";

const PAGE_FREQUENCY: Record<string, NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>> = {
  "/": "weekly",
  "/events": "weekly",
  "/newsletter": "weekly",
  "/projects": "monthly",
  "/team": "monthly",
  "/about": "monthly",
  "/join-us": "monthly",
  "/contacts": "monthly",
};

const PAGE_PRIORITY: Record<string, number> = {
  "/": 1,
  "/events": 0.9,
  "/newsletter": 0.9,
  "/projects": 0.8,
  "/team": 0.8,
  "/about": 0.8,
  "/join-us": 0.7,
  "/contacts": 0.7,
};

function staticPageEntries(lastModified: Date): MetadataRoute.Sitemap {
  return PUBLIC_SITE_PATHS.map((pathname) => ({
    url: absoluteUrl(pathname),
    lastModified,
    changeFrequency: PAGE_FREQUENCY[pathname] ?? "monthly",
    priority: PAGE_PRIORITY[pathname] ?? 0.7,
  }));
}

function newsletterEntries(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  return posts.map((post) => ({
    url: absoluteUrl(`/newsletter/${post.slug}`),
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return [...staticPageEntries(now), ...newsletterEntries()];
}
