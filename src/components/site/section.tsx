export function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-8">
      <header className="space-y-5">
        {eyebrow ? (
          <div className="ui-kicker">{eyebrow}</div>
        ) : null}
        <h2 className="font-display text-3xl font-bold tracking-tight text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
