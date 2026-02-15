import { NewsletterList } from "@/components/site/newsletter-list";

export default function NewsletterPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Dispatch</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Newsletter
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          Short, high-signal updates: what we hosted, what’s next, and the
          people and ideas we’re bringing to campus.
        </p>
      </header>

      <NewsletterList />
    </div>
  );
}

