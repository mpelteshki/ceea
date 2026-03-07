import type { Metadata } from "next";
import { FadeIn, FadeInStagger, StaggerItem } from "@/components/ui/fade-in";
import { PageHeader } from "@/components/site/page-header";
import { AboutAnimatedSections } from "@/components/site/about-animations";
import { Palette, Scale, TrendingUp, Users, Briefcase, Newspaper } from "lucide-react";
import { buildPageMetadata, toMetaDescription } from "@/lib/seo";

const divisionCards = [
  // ── Assemblies sub-divisions ─────────────────────────────────────────────
  {
    icon: Palette,
    accent: "var(--brand-caramel)",
    name: "Culture",
    group: "Assemblies",
    description:
      "Promotes the diverse cultural palette of the region through themed events, traditions, food, music, and collaborations, celebrating diversity and creating cultural osmosis on campus.",
  },
  {
    icon: Scale,
    accent: "var(--brand-crimson)",
    name: "Diplomacy & Politics",
    group: "Assemblies",
    description:
      "Organizes debates, discussions, panels, and speaker events on international relations, policy, and regional affairs, encouraging informed debate and engagement with current issues.",
  },
  {
    icon: Users,
    accent: "var(--brand-teal-soft)",
    name: "Community",
    group: "Assemblies",
    description:
      "Plans and delivers social events that bring people together, both members and guests, strengthen the community, and create a welcoming space for networking and friendships.",
  },
  // ── Standalone divisions ──────────────────────────────────────────────────
  {
    icon: TrendingUp,
    accent: "var(--brand-teal)",
    name: "Projects",
    group: undefined,
    description:
      "Curates events and learning opportunities focused on fintech and innovation in the region, connecting students with industry trends, professionals, and practical insights in finance and tech.",
  },
  {
    icon: Briefcase,
    accent: "var(--brand-crimson)",
    name: "Career Services",
    group: undefined,
    description:
      "Connects members with career opportunities, internships, and professional development across Central & Eastern Europe and beyond.",
  },
  {
    icon: Newspaper,
    accent: "var(--brand-caramel)",
    name: "Newsletter",
    group: undefined,
    description:
      "Curates stories, insights, and updates from Central & Eastern Europe — published regularly for students by students.",
  },
] as const;

const realityItems = [
  {
    number: "01",
    title: "Recruitment cycles",
    body: "Associations typically recruit at the start of semesters and during on-campus association fairs. Consistency and clear roles matter more than huge headcount.",
  },
  {
    number: "02",
    title: "Execution culture",
    body: "The strongest associations operate like a small studio: defined owners, repeatable formats, and a high bar for comms, logistics, and partner experience.",
  },
  {
    number: "03",
    title: "Collaboration is normal",
    body: "Joint events with other associations are common and high-leverage: they extend reach, share best practices, and create more interesting formats.",
  },
  {
    number: "04",
    title: "Brand is a differentiator",
    body: "In a campus full of posters, your visual system is part of your credibility. A consistent aesthetic signals seriousness, even for events.",
  },
] as const;

const partnerItems = [
  {
    number: "01",
    title: "Workshop",
    body: "A focused session (60-90 min) with real value: case, hiring, or region-specific insights.",
  },
  {
    number: "02",
    title: "Flagship sponsorship",
    body: "Brand placement + speaking moment + recruiting angle, aligned with a signature event.",
  },
  {
    number: "03",
    title: "Community support",
    body: "Enable small formats: dinners, cultural calendar moments, and student travel experiences.",
  },
] as const;

const MISSION =
  "A student association at Bocconi is a structured, student-run organization that builds community and creates programming on campus: events, partnerships, and a visible presence in the student ecosystem. CEEA focuses that energy around Central & Eastern Europe.";

export const metadata: Metadata = buildPageMetadata({
  pathname: "/about",
  title: "What CEEA is.",
  description: toMetaDescription(MISSION),
});

export default async function AboutPage() {
  return (
    <>
      <PageHeader
        title="What CEEA is."
        subtitle={MISSION}
      />

      <AboutAnimatedSections
        divisionCards={divisionCards.map(d => ({
          iconName: d.icon.displayName || d.icon.name || "Palette",
          accent: d.accent,
          name: d.name,
          group: d.group ?? null,
          description: d.description,
        }))}
        realityItems={realityItems.map(r => ({ ...r }))}
        partnerItems={partnerItems.map(p => ({ ...p }))}
      />
    </>
  );
}
