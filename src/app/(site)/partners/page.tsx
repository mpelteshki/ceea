export default function PartnersPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Collaborate</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Partners
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          We collaborate with companies, alumni, and other Bocconi associations.
          If you want a curated audience and a clean execution, we should talk.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title="Workshop"
          body="A focused session (60-90 min) with real value: case, hiring, or region-specific insights."
        />
        <Card
          title="Flagship sponsorship"
          body="Brand placement + speaking moment + recruiting angle, aligned with a signature event."
        />
        <Card
          title="Community support"
          body="Enable small formats: dinners, cultural calendar moments, and student travel experiences."
        />
      </div>
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

