import { GraduationCap } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/i18n";

export function Footer() {
  const { t, dir } = useLanguage();

  return (
    <footer className="bg-foreground py-12 text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className={`grid grid-cols-1 md:grid-cols-4 gap-12 ${dir === "rtl" ? "text-right" : "text-left"}`}>
          <div className="md:col-span-2">
            <Link href="/" className={`flex items-center gap-2 inline-flex ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <GraduationCap className="h-8 w-8 text-secondary" />
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                {t("nav.brand")}
              </span>
            </Link>
            <p className={`mt-6 text-white/70 max-w-sm text-balance leading-relaxed ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
              {t("footer.desc")}
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">{t("footer.explore")}</h4>
            <ul className="space-y-4 text-white/70">
              <li>
                <Link href="/institutions?type=university" className="hover:text-secondary transition-colors">{t("nav.universities")}</Link>
              </li>
              <li>
                <Link href="/institutions?type=language_center" className="hover:text-secondary transition-colors">{t("nav.language_centers")}</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">{t("nav.my_applications")}</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">{t("footer.support")}</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="https://wa.me/966562022668" className="hover:text-secondary transition-colors">{t("footer.whatsapp")}</a></li>
              <li><a href="https://direct.me/gatemalay" className="hover:text-secondary transition-colors">{t("footer.social")}</a></li>
              <li>
                <Link href="/terms" className="hover:text-secondary transition-colors">
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link href="/terms#refund" className="hover:text-secondary transition-colors">
                  {t("footer.refund")}
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} {t("nav.brand")}. {t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
