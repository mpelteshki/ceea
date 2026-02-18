import { internalMutation } from "./_generated/server";

/**
 * Seed all tables with example data — only inserts if the table is empty.
 * Run with: bunx convex run --no-push seed:run
 */
export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const counts = { events: 0, posts: 0, team: 0, projects: 0, partners: 0 };

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

    // ── Posts (newsletter) ──────────────────────────────────────
    const existingPosts = await ctx.db.query("posts").first();
    if (!existingPosts) {
      const postData = [
        {
          title: "Spring Semester Kick-off",
          slug: "spring-semester-kick-off",
          excerpt:
            "A look at what CEEA has planned for the spring — new divisions, bigger events, and deeper community ties.",
          body: `# Spring Semester Kick-off\n\nWelcome back! This semester we're launching our revamped divisions structure and a packed calendar of events.\n\n## What's New\n\n- **Fintech Division** now hosts monthly workshop sprints\n- **Culture Division** introducing a film series\n- **Diplomacy & Politics Division** partnering with SDA Bocconi for a lecture series\n\nStay tuned for weekly updates right here in The Dispatch.`,
          publishedAt: now - 3 * 24 * 60 * 60 * 1000,
        },
        {
          title: "Voices from the Region: Interview with Ambassador Novak",
          slug: "voices-from-the-region-ambassador-novak",
          excerpt:
            "We sat down with the Czech Ambassador to Italy to discuss student mobility, EU policy, and the future of CEE in Europe.",
          body: `# Voices from the Region\n\n*An interview with Ambassador Jan Novak*\n\nAmbassador Novak spoke candidly about the growing importance of student associations in bridging cultural gaps across Europe.\n\n> "Associations like CEEA are exactly the kind of grassroots diplomacy we need more of."\n\nThe full conversation covered education policy, visa challenges for Eastern European students, and what Milan means as a hub for the region.`,
          publishedAt: now - 10 * 24 * 60 * 60 * 1000,
        },
        {
          title: "Recap: Winter Gala 2025",
          slug: "recap-winter-gala-2025",
          excerpt:
            "Over 200 attendees, three live performances, and a record-breaking charity auction — here's everything that happened.",
          body: `# Winter Gala 2025 Recap\n\nOur biggest event of the year did not disappoint. The Winter Gala brought together students, alumni, and partners for an evening of celebration.\n\n## Highlights\n\n- 🎵 Live performance by the Bocconi Chamber Ensemble\n- 🎨 Art auction raising €2,400 for scholarship funds\n- 🤝 Networking with 15+ partner organisations\n\nThank you to everyone who made this possible.`,
          publishedAt: now - 30 * 24 * 60 * 60 * 1000,
        },
      ];

      for (const post of postData) {
        await ctx.db.insert("posts", { ...post, createdAt: now });
        counts.posts++;
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
