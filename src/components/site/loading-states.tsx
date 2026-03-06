import { SectionHeader } from "@/components/site/section-header";

function TinySpinner({ label }: { label: string }) {
  return (
    <div className="flex min-h-24 items-center justify-center" aria-live="polite">
      <div role="status" aria-label={label} className="flex items-center justify-center">
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-[var(--accents-3)] border-t-[var(--foreground)]" />
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

export function EventsLoadingState() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />
      <div className="ui-site-container relative py-12 sm:py-16">
        <SectionHeader
          title="Upcoming events"
          accent="var(--brand-red)"
          cta={{ label: "View all events", href: "/events" }}
        />
        <TinySpinner label="Loading upcoming events" />
      </div>
    </section>
  );
}

export function DispatchLoadingState() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: "var(--home-section-bg, var(--background))" }}
      />
      <div className="ui-site-container relative py-12 sm:py-16">
        <SectionHeader
          title="Latest dispatches"
          accent="var(--brand-blue)"
          cta={{ label: "View all dispatches", href: "/newsletter" }}
        />
        <TinySpinner label="Loading latest dispatches" />
      </div>
    </section>
  );
}

export function ListLoadingState({ label }: { label: string }) {
  return (
    <TinySpinner label={label} />
  );
}
