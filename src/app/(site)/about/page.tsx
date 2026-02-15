import { Section } from "@/components/site/section";

export default function AboutPage() {
  return (
    <div className="space-y-16">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Mission</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          What CEEA is
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          A student association at Bocconi is a structured, student-run
          organization that builds community and creates programming on campus:
          events, partnerships, and a visible presence in the student ecosystem.
          CEEA focuses that energy around Central & Eastern Europe.
        </p>
      </header>

      <Section eyebrow="Pillars" title="Three things we refuse to be mediocre at">
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="Programming"
            body="A consistent cadence: flagship events, smaller formats, and collaborations with other Bocconi associations."
          />
          <Card
            title="Community"
            body="Belonging for students connected to CEE, and a curious doorway for everyone else."
          />
          <Card
            title="Career bridge"
            body="Company touchpoints and alumni connections, especially where CEE context is an advantage."
          />
        </div>
      </Section>

      <Section eyebrow="How it works" title="The Bocconi association reality">
        <div className="grid gap-4 md:grid-cols-2">
          <Card
            title="Recruitment cycles"
            body="Associations typically recruit at the start of semesters and during on-campus association fairs. Consistency and clear roles matter more than huge headcount."
          />
          <Card
            title="Execution culture"
            body="The strongest associations operate like a small studio: defined owners, repeatable formats, and a high bar for comms, logistics, and partner experience."
          />
          <Card
            title="Collaboration is normal"
            body="Joint events with other associations are common and high-leverage: they extend reach, share best practices, and create more interesting formats."
          />
          <Card
            title="Brand is a differentiator"
            body="In a campus full of posters, your visual system is part of your credibility. A consistent aesthetic signals seriousness, even for social events."
          />
        </div>
      </Section>
    </div>
  );
}

function Card({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="font-display text-2xl leading-none">{title}</div>
      <p className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
        {body}
      </p>
    </div>
  );
}

