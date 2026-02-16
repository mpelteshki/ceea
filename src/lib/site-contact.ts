export const SITE_CONTACT = {
  email: "ceeabocconi@gmail.com",
  instagram: {
    url: "https://www.instagram.com/bocconi_ceea",
    handle: "@bocconi_ceea",
  },
  linkedin: {
    url: "https://www.linkedin.com/company/ceea-bocconi/",
    label: "CEEA Bocconi",
  },
} as const;

export const SITE_EMAIL_HREF = `mailto:${SITE_CONTACT.email}`;
export const SITE_SOCIAL_URLS = [SITE_CONTACT.instagram.url, SITE_CONTACT.linkedin.url] as const;
