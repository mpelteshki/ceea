import { internalMutation } from "./_generated/server";

/**
 * Seed all tables with example data — only inserts if the table is empty.
 * Run with: bunx convex run --no-push seed:run
 */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const counts = { events: 0, team: 0, projects: 0, partners: 0 };

    // ── Events ──────────────────────────────────────────────────
    const existingEvents = await ctx.db.query("events").first();
    if (!existingEvents) {
      const eventData: Array<{
        title: string;
        summary: string;
        location: string;
        kind: "flagship" | "career" | "culture" | "community";
        startsAt: number;
        rsvpUrl?: string;
      }> = [
        {
          title: "CEE Welcome Mixer",
          summary:
            "Kick off the semester with fellow Central & Eastern European students. Drinks, snacks, and good conversation at Via Sarfatti.",
          location: "Bocconi — Aula Magna",
          kind: "community",
          startsAt: now + 7 * 24 * 60 * 60 * 1000, // +1 week
          rsvpUrl: "https://forms.gle/example1",
        },
        {
          title: "EU Enlargement: What's Next?",
          summary:
            "A panel discussion with policy analysts on the future of EU expansion into the Western Balkans and Eastern Partnership countries.",
          location: "Bocconi — Room AS01",
          kind: "flagship",
          startsAt: now + 14 * 24 * 60 * 60 * 1000, // +2 weeks
        },
        {
          title: "Fintech in CEE: Prague to Tallinn",
          summary:
            "Exploring the booming fintech ecosystems across Central and Eastern Europe — from Revolut's roots to Wise's expansion.",
          location: "Bocconi — Room N11",
          kind: "career",
          startsAt: now + 21 * 24 * 60 * 60 * 1000, // +3 weeks
          rsvpUrl: "https://forms.gle/example2",
        },
        {
          title: "Traditional Film Night: Ida",
          summary:
            "Screening of Paweł Pawlikowski's Oscar-winning film followed by a discussion on post-war identity in Central Europe.",
          location: "Bocconi — Sala Crociera",
          kind: "culture",
          startsAt: now + 28 * 24 * 60 * 60 * 1000, // +4 weeks
        },
      ];

      for (const ev of eventData) {
        await ctx.db.insert("events", { ...ev, createdAt: now });
        counts.events++;
      }
    }

    // ── Team ────────────────────────────────────────────────────
    const existingTeam = await ctx.db.query("team").first();
    if (!existingTeam) {
      const teamData: Array<{
        firstName: string;
        lastName: string;
        role: string;
        type: "member" | "alumni";
        linkedinUrl?: string;
      }> = [
        { firstName: "Ana", lastName: "Petrović", role: "President", type: "member" },
        { firstName: "Tomáš", lastName: "Horák", role: "Vice President", type: "member" },
        { firstName: "Katarzyna", lastName: "Wójcik", role: "Head of Culture Division", type: "member" },
        { firstName: "Miroslav", lastName: "Dimitrov", role: "Head of Diplomacy & Politics Division", type: "member" },
        { firstName: "Elīna", lastName: "Bērziņa", role: "Head of Fintech Division", type: "member" },
        { firstName: "Bogdan", lastName: "Ionescu", role: "Head of Social Division", type: "member" },
        { firstName: "Jakub", lastName: "Kowalski", role: "Treasurer", type: "member" },
        { firstName: "Daria", lastName: "Shevchenko", role: "Communications Lead", type: "member" },
        { firstName: "Luka", lastName: "Marković", role: "Former President (2024)", type: "alumni" },
        { firstName: "Petra", lastName: "Szabó", role: "Former VP (2024)", type: "alumni" },
      ];

      for (const member of teamData) {
        await ctx.db.insert("team", { ...member, createdAt: now });
        counts.team++;
      }
    }

    // ── Projects ────────────────────────────────────────────────
    const existingProjects = await ctx.db.query("projects").first();
    if (!existingProjects) {
      const projectData = [
        {
          title: "CEE Policy Brief Series",
          description:
            "A student-led publication series covering EU policy impacting Central and Eastern Europe — from energy security to digital markets.",
          link: "https://ceea-bocconi.org/projects",
        },
        {
          title: "Bocconi–CEE Mentorship Programme",
          description:
            "Connecting current Bocconi students with CEEA alumni working across finance, consulting, and public policy in the region.",
        },
        {
          title: "The Dispatch Newsletter",
          description:
            "Our flagship newsletter covering events, interviews, and analysis relevant to CEE students at Bocconi and beyond.",
        },
      ];

      for (const proj of projectData) {
        await ctx.db.insert("projects", { ...proj, createdAt: now });
        counts.projects++;
      }
    }

    // ── Partners ────────────────────────────────────────────────
    const existingPartners = await ctx.db.query("partners").first();
    if (!existingPartners) {
      const partnerData: Array<{
        name: string;
        tier: "lead" | "supporting" | "community";
        websiteUrl?: string;
      }> = [
        { name: "SDA Bocconi", tier: "lead", websiteUrl: "https://www.sdabocconi.it" },
        { name: "Visegrád Fund", tier: "lead", websiteUrl: "https://www.visegradfund.org" },
        { name: "CzechInvest", tier: "supporting", websiteUrl: "https://www.czechinvest.org" },
        { name: "Polish Cultural Institute", tier: "supporting", websiteUrl: "https://instytutpolski.pl/roma" },
        { name: "Bocconi Students Association", tier: "community", websiteUrl: "https://www.bocconistudents.it" },
        { name: "AIESEC Bocconi", tier: "community", websiteUrl: "https://aiesec.org" },
      ];

      for (const partner of partnerData) {
        await ctx.db.insert("partners", { ...partner, createdAt: now });
        counts.partners++;
      }
    }

    return {
      message: "Seed complete",
      inserted: counts,
    };
  },
});
