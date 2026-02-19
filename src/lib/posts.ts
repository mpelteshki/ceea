import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  publishedAt: number; // epoch ms
}

interface PostFrontmatter {
  title?: string;
  slug?: string;
  excerpt?: string;
  publishedAt?: string | Date;
}

/* ------------------------------------------------------------------ */
/*  Paths                                                              */
/* ------------------------------------------------------------------ */

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function parseDate(value: string | Date | undefined): number | null {
  if (!value) return null;
  const ms = new Date(value).getTime();
  return Number.isNaN(ms) ? null : ms;
}

function slugFromFilename(filename: string): string {
  return filename.replace(/\.mdx?$/, "");
}

/* ------------------------------------------------------------------ */
/*  Core readers                                                       */
/* ------------------------------------------------------------------ */

function readPostFile(filename: string): Post | null {
  const filePath = path.join(POSTS_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;

  const publishedAt = parseDate(fm.publishedAt);
  if (publishedAt == null) return null; // drafts have no publishedAt

  const slug = fm.slug?.trim() || slugFromFilename(filename);

  return {
    slug,
    title: fm.title?.trim() || slug,
    excerpt: fm.excerpt?.trim() || "",
    body: content,
    publishedAt,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/** All published posts, newest first. */
export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f));

  const posts: Post[] = [];
  for (const file of files) {
    const post = readPostFile(file);
    if (post) posts.push(post);
  }

  posts.sort((a, b) => b.publishedAt - a.publishedAt);
  return posts;
}

/** Get N most recent published posts. */
export function getRecentPosts(limit: number): Post[] {
  return getAllPosts().slice(0, limit);
}

/** Single post by slug, or null. */
export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(POSTS_DIR)) return null;

  const files = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f));

  for (const file of files) {
    const post = readPostFile(file);
    if (post && post.slug === slug) return post;
  }

  return null;
}
