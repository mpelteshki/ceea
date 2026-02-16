import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SITE_CONTACT, SITE_EMAIL_HREF } from "@/lib/site-contact";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Navigation");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-[var(--brand-teal)] via-[var(--brand-caramel)] to-[var(--brand-teal)]" />

      <div className="bg-gradient-to-br from-[#0f3d40] via-[var(--brand-teal)] to-[#154d52] text-white relative">
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_top_right,rgba(196,154,108,0.15),transparent_70%)] pointer-events-none" />

        <div className="ui-site-container relative z-10 py-16 text-center sm:py-20 lg:text-left">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div className="space-y-6">
              <div className="flex items-center justify-center gap-3 lg:justify-start">
                <div className="h-10 w-10 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center font-bold text-xl rounded-lg border border-white/10">
                  C
                </div>
                <div className="font-brand text-2xl text-white">CEEA</div>
              </div>
              <p className="mx-auto max-w-md text-sm leading-7 text-white/60 lg:mx-0">{t("tagline")}</p>
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-start">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">{t("sitemap")}</p>
              <Link href="/events" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("events")}</Link>
              <Link href="/newsletter" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("newsletter")}</Link>
              <Link href="/team" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("team")}</Link>
              <Link href="/projects" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("projects")}</Link>
              <Link href="/about" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("about")}</Link>
            </div>

            <div className="flex flex-col items-center gap-4 lg:items-start">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/60">{t("connect")}</p>
              <a href={SITE_CONTACT.instagram.url} target="_blank" rel="noopener noreferrer" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">Instagram</a>
              <a href={SITE_EMAIL_HREF} className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{SITE_CONTACT.email}</a>
              <Link href="/join-us" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("joinUs")}</Link>
            </div>
          </div>

          <div
            className="flex flex-col gap-4 pt-12 mt-12 border-t border-white/10 text-xs text-white/30 sm:flex-row sm:items-center sm:justify-between"
            style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
          >
            <p>
              © {currentYear} CEEA Bocconi. {t("legal")}
            </p>
            <p>Central &amp; Eastern European Association at Bocconi University</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
