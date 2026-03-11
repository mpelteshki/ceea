/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface AuthorProfile {
  _id: string;
  name: string;
  bio?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  photoId?: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  authorProfile?: AuthorProfile;
  publishedAt: number; // epoch ms
}
