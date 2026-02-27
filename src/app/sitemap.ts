import { MetadataRoute } from "next";
import { absoluteUrl, PUBLIC_SITE_PATHS } from "@/lib/seo";
import { hasConvex } from "@/lib/public-env";
import { getConvexServerClient } from "@/lib/convex-server";
import { api } from "../../convex/_generated/api";

const PAGE_FREQUENCY: Record<string, NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>> = {
  "/": "weekly",
  "/events": "weekly",
  "/newsletter": "weekly",
  "/team": "monthly",
  "/about": "monthly",
  "/contacts": "monthly",
};

const PAGE_PRIORITY: Record<string, number> = {
  "/": 1,
  "/events": 0.9,
  "/newsletter": 0.9,
  "/team": 0.8,
  "/about": 0.8,
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

async function newsletterEntries(): Promise<MetadataRoute.Sitemap> {
  if (!hasConvex) return [];
  const convex = getConvexServerClient();
  if (!convex) return [];

  try {
    const posts = (await convex.query(api.posts.listPublished, {})) as Array<{
      slug: string;
      publishedAt?: number | null;
    }>;

    return posts
      .filter((p) => p.publishedAt != null)
      .map((post) => ({
        url: absoluteUrl(`/newsletter/${post.slug}`),
        lastModified: new Date(post.publishedAt!),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  return [...staticPageEntries(now), ...(await newsletterEntries())];
}
