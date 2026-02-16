import { renderGradientTitle } from "@/lib/gradient-title";

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
    <section className="space-y-12">
      <header className="ui-title-stack space-y-6">
        {eyebrow ? <div className="ui-kicker">{eyebrow}</div> : null}
        <h2 className="ui-section-title">
          {renderGradientTitle(title)}
        </h2>
        <div className="ui-divider max-w-[120px]" />
      </header>
      {children}
    </section>
  );
}
