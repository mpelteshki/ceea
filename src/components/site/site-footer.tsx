"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Navigation");

  return (
    <footer className="border-t border-[var(--accents-2)] py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 sm:px-6">
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 bg-[var(--foreground)] text-[var(--background)] flex items-center justify-center font-bold text-sm rounded-sm">
                C
              </div>
              <div className="font-display text-xl font-bold tracking-tight text-[var(--foreground)]">
                CEEA
              </div>
            </div>
            <p className="max-w-md text-sm leading-6 text-[var(--accents-5)]">
              {t("tagline")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-x-12 gap-y-8 sm:flex sm:gap-x-10">
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-[var(--foreground)]">{t("sitemap")}</h4>
              <Link href="/events" className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]">{tNav("events")}</Link>
              <Link href="/newsletter" className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]">{tNav("newsletter")}</Link>
              <Link href="/about" className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]">{tNav("about")}</Link>
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-[var(--foreground)]">{t("connect")}</h4>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]">Instagram</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--accents-5)] hover:text-[var(--foreground)]">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-12 text-xs text-[var(--accents-5)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CEEA Bocconi. {t("legal")}
          </p>

        </div>
      </div>
    </footer>
  );
}
