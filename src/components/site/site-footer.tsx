import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Instagram, Linkedin, Mail } from "lucide-react";

export async function SiteFooter() {
  const t = await getTranslations("Footer");
  const tNav = await getTranslations("Navigation");
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      <div className="h-[2px] bg-gradient-to-r from-[var(--brand-teal)] via-[var(--brand-caramel)] to-[var(--brand-teal)]" />

      <div className="bg-gradient-to-br from-[#0f3d40] via-[var(--brand-teal)] to-[#154d52] text-white relative">
        <div className="absolute top-0 right-0 w-[40%] h-[60%] bg-[radial-gradient(ellipse_at_top_right,rgba(196,154,108,0.15),transparent_70%)] pointer-events-none" />

        <div className="ui-site-container relative z-10 py-16 sm:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-white/10 backdrop-blur-sm text-white flex items-center justify-center font-bold text-xl rounded-lg border border-white/10">
                  C
                </div>
                <div className="font-brand text-2xl text-white">CEEA</div>
              </div>
              <p className="max-w-md text-sm leading-7 text-white/60">{t("tagline")}</p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href="https://www.instagram.com/ceea.bocconi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-pressable h-9 w-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/ceea-bocconi/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ui-pressable h-9 w-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="mailto:ceea.bocconi@gmail.com"
                  className="ui-pressable h-9 w-9 rounded-full bg-white/8 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/15 transition-[color,background-color,transform] duration-200 hover:-translate-y-0.5"
                  aria-label="Email"
                >
                  <Mail className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">{t("sitemap")}</h4>
              <Link href="/events" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("events")}</Link>
              <Link href="/newsletter" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("newsletter")}</Link>
              <Link href="/team" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("team")}</Link>
              <Link href="/projects" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("projects")}</Link>
              <Link href="/about" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">{tNav("about")}</Link>
            </div>

            <div className="flex flex-col gap-4">
              <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-white/40">{t("connect")}</h4>
              <a href="https://www.instagram.com/ceea.bocconi/" target="_blank" rel="noopener noreferrer" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">Instagram</a>
              <a href="https://www.linkedin.com/company/ceea-bocconi/" target="_blank" rel="noopener noreferrer" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">LinkedIn</a>
              <a href="mailto:ceea.bocconi@gmail.com" className="ui-footer-link text-sm py-1 text-white/60 hover:text-white">ceea.bocconi@gmail.com</a>
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
