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
