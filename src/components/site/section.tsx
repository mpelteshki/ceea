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
    <section className="space-y-6">
      <header className="space-y-3">
        {eyebrow ? (
          <div className="ui-kicker">{eyebrow}</div>
        ) : null}
        <h2 className="font-display text-3xl leading-[1.05] tracking-tight sm:text-4xl">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}
