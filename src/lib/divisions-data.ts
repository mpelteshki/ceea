import { Palette, Scale, TrendingUp, Users, Briefcase, Newspaper, CalendarDays, Megaphone } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Division = {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
  accent: string;
};

/**
 * Canonical list of CEEA divisions.
 * Shared between the home-page component and the divisions/[slug] pages.
 *
 * First 3 entries are the Assemblies sub-divisions (Culture, Diplomacy & Politics, Community).
 * The remaining entries are standalone divisions (Assemblies, Projects, Career Services, Newsletter).
 */
export const divisions: readonly Division[] = [
  // ── Assemblies sub-divisions ──────────────────────────────────────────────
  {
    icon: Palette,
    name: "Culture",
    slug: "culture",
    description:
      "Cultural events, traditions, food, music, and collaborations celebrating the region's diversity.",
    accent: "var(--brand-caramel)",
  },
  {
    icon: Scale,
    name: "Diplomacy & Politics",
    slug: "diplomacy-politics",
    description:
      "Debates, panels, and speaker events on international relations, policy, and regional affairs.",
    accent: "var(--brand-crimson)",
  },
  {
    icon: Users,
    name: "Community",
    slug: "community",
    description:
      "Social events that bring people together, building community and friendships on campus.",
    accent: "var(--brand-teal-soft)",
  },
  // ── Standalone divisions ──────────────────────────────────────────────────
  {
    icon: CalendarDays,
    name: "Assemblies",
    slug: "assemblies",
    description:
      "Our flagship gatherings where culture, diplomacy, and community converge — bringing Central & Eastern European students together through three specialised sub-divisions.",
    accent: "var(--brand-caramel)",
  },
  {
    icon: TrendingUp,
    name: "Projects",
    slug: "projects",
    description:
      "Events and learning opportunities in fintech, innovation, and emerging finance trends across the region.",
    accent: "var(--brand-teal)",
  },
  {
    icon: Briefcase,
    name: "Career Services",
    slug: "career-services",
    description:
      "Connecting members with career opportunities, internships, and professional development in the region and beyond.",
    accent: "var(--brand-crimson)",
  },
  {
    icon: Megaphone,
    name: "PR & Marketing",
    slug: "pr-marketing",
    description:
      "Shaping CEEA's voice — managing communications, social media, partnerships, and brand presence across the student community.",
    accent: "var(--brand-teal-soft)",
  },
  {
    icon: Newspaper,
    name: "Newsletter",
    slug: "newsletter",
    description:
      "Curating stories, insights, and updates from Central & Eastern Europe — published regularly for students by students.",
    accent: "var(--brand-caramel)",
  },
] as const;

/** Culture, Diplomacy & Politics, Community — shown on the Assemblies detail page */
export const assembliesGroup = divisions.slice(0, 3);

/** Assemblies, Projects, Career Services, Newsletter — each gets a standalone card on the home page */
export const standaloneDivisions = divisions.slice(3);
