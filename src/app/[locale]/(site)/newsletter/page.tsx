import { NewsletterList } from "@/components/site/newsletter-list";

export default function NewsletterPage() {
  return (
    <div className="space-y-12">
      <header className="space-y-6">
        <div className="ui-kicker">Dispatch</div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
          Newsletter
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)]">
          Short, high-signal updates: what we hosted, what’s next, and the
          people and ideas we’re bringing to campus.
        </p>
      </header>
      <NewsletterList />
    </div>
  );
}
