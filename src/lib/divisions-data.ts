import { Palette, Scale, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Division = {
  icon: LucideIcon;
  name: string;
  slug: string;
  description: string;
  accent: string;
};

/**
 * Canonical list of CEEA divisions.
 * Shared between the home-page component and the divisions/[slug] pages.
 */
export const divisions: readonly Division[] = [
  {
    icon: Palette,
    name: "Culture Division",
    slug: "culture",
    description:
      "Cultural events, traditions, food, music, and collaborations celebrating the region's diversity.",
    accent: "var(--brand-caramel)",
  },
  {
    icon: Scale,
    name: "Diplomacy & Politics Division",
    slug: "diplomacy-politics",
    description:
      "Debates, panels, and speaker events on international relations, policy, and regional affairs.",
    accent: "var(--brand-crimson)",
  },
  {
    icon: TrendingUp,
    name: "Fintech Division",
    slug: "fintech",
    description:
      "Events and learning opportunities in fintech, innovation, and emerging finance trends.",
    accent: "var(--brand-teal)",
  },
  {
    icon: Users,
    name: "Social Division",
    slug: "social",
    description:
      "Social events that bring people together, building community and friendships on campus.",
    accent: "var(--brand-teal-soft)",
  },
] as const;
