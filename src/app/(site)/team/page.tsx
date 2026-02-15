export default function TeamPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">People</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Team
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          This page is intentionally simple for now. In the admin dashboard we
          can add a Team table next, and render committee members here with
          photos, roles, and LinkedIn links.
        </p>
      </header>

      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Suggested sections: President, Vice President, Events, Partnerships,
        Marketing, Finance, Operations, and Alumni Relations.
      </div>
    </div>
  );
}

