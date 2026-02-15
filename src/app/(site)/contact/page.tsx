export default function ContactPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-black/70 dark:border-white/10 dark:bg-white/10 dark:text-white/70">
          <span className="font-mono text-[11px]">Reach us</span>
        </div>
        <h1 className="font-display text-5xl leading-[0.95] tracking-tight sm:text-6xl">
          Contact
        </h1>
        <p className="max-w-2xl text-balance text-sm leading-6 text-black/70 dark:text-white/70">
          For sponsorships, speakers, and collaborations: send a clear ask and a
          timeline. We reply faster when the brief is concrete.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <Card
          title="Partnerships"
          body={
            <>
              Email:{" "}
              <span className="font-mono">partnerships@ceea-bocconi.example</span>
              <br />
              Include: format (workshop/speaker/flagship), date window, and audience.
            </>
          }
        />
        <Card
          title="General"
          body={
            <>
              Email: <span className="font-mono">hello@ceea-bocconi.example</span>
              <br />
              Instagram/LinkedIn placeholders can go here once ready.
            </>
          }
        />
      </div>

      <div className="rounded-3xl border border-black/10 bg-white/55 p-8 text-sm text-black/70 dark:border-white/10 dark:bg-white/5 dark:text-white/70">
        Next step: wire this page to a Convex mutation or an email provider
        (Resend, Postmark) so submissions land in one inbox.
      </div>
    </div>
  );
}

function Card({ title, body }: { title: string; body: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white/55 p-6 dark:border-white/10 dark:bg-white/5">
      <div className="font-display text-2xl leading-none">{title}</div>
      <div className="mt-2 text-sm leading-6 text-black/65 dark:text-white/65">
        {body}
      </div>
    </div>
  );
}

