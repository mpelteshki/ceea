import Link from "next/link";
import { Section } from "./section";

export function HomeHighlights() {
  return (
    <Section eyebrow="Shape" title="Formats that work at Bocconi">
      <div className="grid gap-4 md:grid-cols-2">
        <HighlightCard
          title="Association life, done right"
          desc="Bocconi associations are student-run organizations that build community through events, partnerships, and visible campus presence. The best ones feel like a small institution: consistent programming, clear roles, and a recognizable aesthetic."
          cta="What we stand for"
          href="/about"
          tone="danube"
        />
        <HighlightCard
          title="Partner-ready by default"
          desc="Companies and alumni engage when the offer is clear: curated audiences, on-brand communication, and formats that scale from workshops to flagship speaker nights. We keep sponsorship simple, structured, and measurable."
          cta="Become a partner"
          href="/contact"
          tone="carmine"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Mini
          title="Flagship night"
          desc="One signature event per semester: speakers + culture, executed like a product launch."
        />
        <Mini
          title="Career bridge"
          desc="Workshops, interview prep, and company touchpoints for CEE-facing teams."
        />
        <Mini
          title="Small formats"
          desc="Dinners, language tandems, city walks. Belonging is built in rooms, not feeds."
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Pill text="Newsletter drops" />
        <Pill text="Cross-association collabs" />
        <Pill text="Alumni moments" />
        <Pill text="Cultural calendar" />
        <Pill text="Recruitment week" />
      </div>
    </Section>
  );
}

function HighlightCard({
  title,
  desc,
  cta,
  href,
  tone,
}: {
  title: string;
  desc: string;
  cta: string;
  href: string;
  tone: "danube" | "carmine";
}) {
  const accent =
    tone === "danube" ? "bg-[color:var(--danube)]/12" : "bg-[color:var(--carmine)]/12";
  return (
    <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/55 p-7 dark:border-white/10 dark:bg-white/5">
      <div
        className={[
          "pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full blur-3xl",
          accent,
        ].join(" ")}
      />
      <div className="relative space-y-4">
        <div className="font-display text-2xl leading-[1.05] tracking-tight">
          {title}
        </div>
        <p className="text-sm leading-6 text-black/70 dark:text-white/70">
          {desc}
        </p>
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
        >
          {cta} <span className="font-mono text-[12px]">→</span>
        </Link>
      </div>
    </div>
  );
}

function Mini({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/50 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="font-display text-xl leading-none">{title}</div>
      <p className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
        {desc}
      </p>
    </div>
  );
}

function Pill({ text }: { text: string }) {
  return (
    <span className="rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs tracking-wide text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
      {text}
    </span>
  );
}

