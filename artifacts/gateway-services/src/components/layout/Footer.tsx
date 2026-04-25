import { Link } from "wouter";
import { MessageCircle, Mail } from "lucide-react";
import { SiFacebook, SiYoutube, SiTiktok, SiSnapchat, SiX, SiInstagram, SiVisa, SiMastercard, SiApplepay } from "react-icons/si";
import { useLanguage } from "@/lib/i18n";

const SOCIAL_LINKS = {
  whatsapp_sa: "https://wa.me/966562022668",
  whatsapp_my: "https://wa.me/601129082602",
  email: "mailto:hlohlo05056@gmail.com",
  instagram: "https://www.instagram.com/gmalay77?igsh=dncyN2w0b29sNXZ5",
  tiktok: "https://www.tiktok.com/@gmalay77",
  snapchat: "https://snapchat.com/t/XqVGyeHu",
  x: "https://x.com/gmalay777",
  facebook: "https://www.facebook.com/share/p/18hKQ9AyMZ/",
  youtube: "https://youtube.com/channel/UCRybLhK6y_C_hGaWFdVEqxA",
};

const IMPORTANT_LINKS_AR = [
  { label: "الجامعات", href: "/institutions?type=university" },
  { label: "الشروط والأحكام", href: "/terms" },
  { label: "معاهد اللغة", href: "/institutions?type=language_center" },
  { label: "سياسة الاسترجاع", href: "/terms#refund" },
  { label: "باقاتنا", href: "/#packages" },
  { label: "سياسة الخصوصية", href: "/terms#privacy" },
  { label: "طلباتي", href: "/dashboard" },
  { label: "تواصل معنا", href: "https://wa.me/966562022668" },
];

const IMPORTANT_LINKS_EN = [
  { label: "Universities", href: "/institutions?type=university" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Language Centers", href: "/institutions?type=language_center" },
  { label: "Refund Policy", href: "/terms#refund" },
  { label: "Our Packages", href: "/#packages" },
  { label: "Privacy Policy", href: "/terms#privacy" },
  { label: "My Applications", href: "/dashboard" },
  { label: "Contact Us", href: "https://wa.me/966562022668" },
];


export function Footer() {
  const { t, dir, language } = useLanguage();
  const isRTL = dir === "rtl";
  const links = language === "ar" ? IMPORTANT_LINKS_AR : IMPORTANT_LINKS_EN;

  return (
    <footer className="bg-foreground text-white" dir={dir}>
      <div className="container mx-auto px-4 md:px-6 py-14">

        {/* ── Important Links ── */}
        <div className="mb-12">
          <div className={`flex items-center gap-3 mb-8 justify-center`}>
            <span className="w-8 h-px bg-white/30" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {language === "ar" ? "روابط مهمة" : "Important Links"}
            </h3>
            <span className="w-8 h-px bg-white/30" />
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-xl mx-auto">
            {links.map((link, i) => (
              <div key={i} className={isRTL ? "text-right" : "text-left"}>
                {link.href.startsWith("http") ? (
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} className="text-white/70 hover:text-secondary transition-colors text-sm">
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-12" />

        {/* ── Contact ── */}
        <div className="mb-10">
          <div className={`flex items-center gap-3 mb-6 justify-center`}>
            <span className="w-8 h-px bg-white/30" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              {language === "ar" ? "تواصل معنا" : "Contact Us"}
            </h3>
            <span className="w-8 h-px bg-white/30" />
          </div>
          <div className={`flex flex-wrap gap-3 justify-center`}>
            <a
              href={SOCIAL_LINKS.whatsapp_sa}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all text-sm font-medium ${isRTL ? "flex-row-reverse" : ""}`}
              data-testid="footer-whatsapp-sa"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              {language === "ar" ? "واتساب السعودية" : "WhatsApp SA"}
            </a>
            <a
              href={SOCIAL_LINKS.whatsapp_my}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-[#25D366]/20 hover:border-[#25D366]/50 transition-all text-sm font-medium ${isRTL ? "flex-row-reverse" : ""}`}
              data-testid="footer-whatsapp-my"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
              {language === "ar" ? "واتساب ماليزيا" : "WhatsApp MY"}
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all text-sm font-medium ${isRTL ? "flex-row-reverse" : ""}`}
              data-testid="footer-email"
            >
              <Mail className="w-4 h-4 text-white/70" />
              {language === "ar" ? "البريد الإلكتروني" : "Email"}
            </a>
          </div>
        </div>

        {/* ── Social Icons ── */}
        <div className="flex gap-5 justify-center mb-10">
          {[
            { icon: SiFacebook, href: SOCIAL_LINKS.facebook, label: "Facebook" },
            { icon: SiYoutube, href: SOCIAL_LINKS.youtube, label: "YouTube" },
            { icon: SiTiktok, href: SOCIAL_LINKS.tiktok, label: "TikTok" },
            { icon: SiSnapchat, href: SOCIAL_LINKS.snapchat, label: "Snapchat" },
            { icon: SiX, href: SOCIAL_LINKS.x, label: "X" },
            { icon: SiInstagram, href: SOCIAL_LINKS.instagram, label: "Instagram" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center hover:bg-secondary/20 hover:border-secondary/50 transition-all"
              data-testid={`footer-social-${label.toLowerCase()}`}
            >
              <Icon className="w-4 h-4 text-white/70" />
            </a>
          ))}
        </div>

        <div className="w-full h-px bg-white/10 mb-8" />

        {/* ── Copyright + CR ── */}
        <div className="text-center mb-8 space-y-2">
          <p className="text-white/50 text-sm">
            © {new Date().getFullYear()} {language === "ar" ? "بوابتك إلى ماليزيا. جميع الحقوق محفوظة." : "Gateway Services Malaysia. All rights reserved."}
          </p>
          <p className="text-white/40 text-xs">
            {language === "ar" ? "السجل التجاري:" : "Commercial Registration:"}{" "}
            <span className="font-mono text-white/60">7050249676</span>
          </p>
        </div>

        {/* ── Payment Methods ── */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Tabby */}
          <div className="h-9 px-4 rounded-md bg-[#3FCEA0] flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-widest">tabby</span>
          </div>
          {/* Tamara */}
          <div className="h-9 px-4 rounded-md bg-white flex items-center justify-center border border-white/20">
            <span className="text-[#282828] font-black text-sm tracking-wider">tamara</span>
          </div>
          {/* Apple Pay */}
          <div className="h-9 px-4 rounded-md bg-white flex items-center justify-center gap-1.5">
            <SiApplepay className="text-black text-2xl" />
          </div>
          {/* Visa */}
          <div className="h-9 px-4 rounded-md bg-white flex items-center justify-center">
            <SiVisa className="text-[#1A1F71] text-3xl" />
          </div>
          {/* Mastercard */}
          <div className="h-9 px-4 rounded-md bg-white flex items-center justify-center">
            <SiMastercard className="text-[#EB001B] text-2xl" />
          </div>
          {/* Mada */}
          <div className="h-9 px-4 rounded-md bg-[#1B4F9B] flex items-center justify-center">
            <span className="text-white font-black text-sm tracking-widest">mada</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
