"use client";

import { Section } from "@/components/site/section";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("AboutPage");

  return (
    <div className="space-y-24">
      <header className="space-y-6">
        <div className="ui-kicker">{t("kicker")}</div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-6xl">
          {t("title")}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)]">
          {t("mission")}
        </p>
      </header>

      <Section eyebrow={t("pillarsEyebrow")} title={t("pillarsTitle")}>
        <div className="border-y border-[var(--accents-2)] mt-8">
          <div className="grid divide-y divide-[var(--accents-2)] md:grid-cols-3 md:divide-x md:divide-y-0">
            <Principle
              number="01"
              title={t("pillar1Title")}
              body={t("pillar1Body")}
            />
            <Principle
              number="02"
              title={t("pillar2Title")}
              body={t("pillar2Body")}
            />
            <Principle
              number="03"
              title={t("pillar3Title")}
              body={t("pillar3Body")}
            />
          </div>
        </div>
      </Section>

      <Section eyebrow={t("realityEyebrow")} title={t("realityTitle")}>
        <div className="border-t border-[var(--accents-2)] mt-8">
          <dl className="grid gap-0 md:grid-cols-2 md:gap-x-12">
            <Definition
              number="A"
              title={t("reality1Title")}
              body={t("reality1Body")}
            />
            <Definition
              number="B"
              title={t("reality2Title")}
              body={t("reality2Body")}
            />
            <Definition
              number="C"
              title={t("reality3Title")}
              body={t("reality3Body")}
            />
            <Definition
              number="D"
              title={t("reality4Title")}
              body={t("reality4Body")}
            />
          </dl>
        </div>
      </Section>

      <Section eyebrow={t("peopleEyebrow")} title={t("peopleTitle")}>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)] mb-8">
          {t("peopleBody")}
        </p>
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-6 text-sm text-[var(--accents-5)] rounded-sm">
          {t("peopleNote")}
        </div>
      </Section>

      <Section eyebrow={t("partnersEyebrow")} title={t("partnersTitle")}>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)] mb-8">
          {t("partnersBody")}
        </p>
        <div className="border-y border-[var(--accents-2)] mt-8">
          <div className="grid divide-y divide-[var(--accents-2)] md:grid-cols-3 md:divide-x md:divide-y-0">
            <Offer
              number="01"
              title={t("partner1Title")}
              body={t("partner1Body")}
            />
            <Offer
              number="02"
              title={t("partner2Title")}
              body={t("partner2Body")}
            />
            <Offer
              number="03"
              title={t("partner3Title")}
              body={t("partner3Body")}
            />
          </div>
        </div>
      </Section>

      <Section eyebrow={t("contactEyebrow")} title={t("contactTitle")}>
        <p className="max-w-2xl text-lg leading-8 text-[var(--accents-5)] mb-8">
          {t("contactBody")}
        </p>
        <div className="border-t border-[var(--accents-2)] mt-8">
          <dl className="grid gap-0 md:grid-cols-2 md:gap-x-12">
            <ContactRow
              number="01"
              title={t("contact1Title")}
              body={
                <>
                  Email:{" "}
                  <span className="font-mono text-[var(--foreground)]">
                    partnerships@ceea-bocconi.example
                  </span>
                  <br />
                  {t("contact1BodyPre")}
                </>
              }
            />
            <ContactRow
              number="02"
              title={t("contact2Title")}
              body={
                <>
                  Email: <span className="font-mono text-[var(--foreground)]">hello@ceea-bocconi.example</span>
                  <br />
                  {t("contact2Body")}
                </>
              }
            />
          </dl>
        </div>
        <div className="border border-[var(--accents-2)] bg-[var(--accents-1)] p-4 text-sm text-[var(--accents-5)] rounded-md mt-8">
          Next step: wire this page to a Convex mutation or an email provider
          (Resend, Postmark) so submissions land in one inbox.
        </div>
      </Section>
    </div>
  );
}

function Principle({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-3">
        <span className="ui-tag">{number}</span>
      </div>
      <div className="font-display text-xl font-semibold text-[var(--foreground)]">{title}</div>
      <p className="mt-3 text-sm leading-7 text-[var(--accents-5)]">
        {body}
      </p>
    </div>
  );
}

function Definition({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="border-b border-[var(--accents-2)] py-6 md:py-8">
      <dt className="flex items-center gap-3">
        <span className="ui-tag">{number}</span>
        <span className="font-display text-xl font-semibold text-[var(--foreground)]">{title}</span>
      </dt>
      <dd className="mt-3 text-sm leading-7 text-[var(--accents-5)]">
        {body}
      </dd>
    </div>
  );
}

function Offer({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: string;
}) {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-3">
        <span className="ui-tag">{number}</span>
      </div>
      <div className="font-display text-xl font-semibold text-[var(--foreground)]">{title}</div>
      <p className="mt-3 text-sm leading-7 text-[var(--accents-5)]">
        {body}
      </p>
    </div>
  );
}

function ContactRow({
  number,
  title,
  body,
}: {
  number: string;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="border-b border-[var(--accents-2)] py-6 md:py-8">
      <dt className="flex items-center gap-3">
        <span className="ui-tag">{number}</span>
        <span className="font-display text-xl font-semibold text-[var(--foreground)]">{title}</span>
      </dt>
      <dd className="mt-3 text-sm leading-7 text-[var(--accents-5)]">
        {body}
      </dd>
    </div>
  );
}
