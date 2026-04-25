import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Building2, BookA, Globe, CheckCircle2, MessageCircle, Phone, Instagram, Zap, Sparkles, CreditCard, Banknote, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Home() {
  const { t, dir, language } = useLanguage();
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [showSAR, setShowSAR] = useState(false);

  const MYR_TO_SAR = 0.80;
  const toSAR = (myrPrice: string) => {
    const num = parseFloat(myrPrice.replace(/,/g, ''));
    return Math.round(num * MYR_TO_SAR).toLocaleString();
  };

  const { data: packagesData } = useQuery({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    }
  });

  return (
    <div className={`min-h-screen flex flex-col ${dir === "rtl" ? "text-right" : "text-left"}`}>
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=2000" 
            alt="Kuala Lumpur" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-6 backdrop-blur-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">{t("home.hero_badge")}</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {t("home.hero_title")} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">
                  {t("home.hero_subtitle")}
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                {t("home.hero_desc")}
              </p>
              
              <div className={`flex flex-wrap gap-4 justify-center ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <a href="https://wa.me/966562022668" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-8 py-6 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] border-none shadow-xl">
                    <MessageCircle className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-6 w-6`} />
                    {language === 'ar' ? 'استفسر عبر الواتساب' : 'Inquire on WhatsApp'}
                  </Button>
                </a>
                <a href="https://direct.me/gatemalay" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-bold text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20">
                    {t("home.social_btn")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">{t("home.services_title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.services_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t("home.service1_title"), desc: t("home.service1_desc") },
              { title: t("home.service2_title"), desc: t("home.service2_desc") },
              { title: t("home.service3_title"), desc: t("home.service3_desc") },
              { title: t("home.service4_title"), desc: t("home.service4_desc") },
              { title: t("home.service5_title"), desc: t("home.service5_desc") },
              { title: t("home.service6_title"), desc: t("home.service6_desc") }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm text-center"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PATHWAYS SECTION */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            <motion.div 
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/institutions?type=university" className="block group h-full">
                <div className="h-full bg-card rounded-3xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500 relative">
                  <div className={`bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300 ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
                    <Building2 className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4">{t("home.pathway_uni_title")}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {t("home.pathway_uni_desc")}
                  </p>
                  <div className={`flex items-center text-primary font-semibold transition-transform duration-300 ${dir === "rtl" ? "group-hover:-translate-x-2 justify-end" : "group-hover:translate-x-2 justify-start"}`}>
                    {t("home.pathway_uni_link")} {dir === "rtl" ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/institutions?type=language_center" className="block group h-full">
                <div className={`h-full bg-card rounded-3xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-secondary/30 transition-all duration-500 relative ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  <div className={`bg-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-300 ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
                    <BookA className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4">{t("home.pathway_lang_title")}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {t("home.pathway_lang_desc")}
                  </p>
                  <div className={`flex items-center text-secondary-foreground font-semibold transition-transform duration-300 ${dir === "rtl" ? "group-hover:-translate-x-2 justify-end" : "group-hover:translate-x-2 justify-start"}`}>
                    {t("home.pathway_lang_link")} {dir === "rtl" ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PACKAGES SECTION */}
      <section className="py-20 bg-muted/30" id="packages">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-4`}>
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold">{language === 'ar' ? 'باقات حصرية' : 'Exclusive Packages'}</span>
            </div>
            <h2 className="font-serif text-4xl font-bold mb-4">
              {language === 'ar' ? 'باقات اللغة الإنجليزية' : 'English Language Packages'}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {language === 'ar' 
                ? 'اختر الباقة المناسبة لك واستمتع بتجربة دراسية متكاملة في ماليزيا'
                : 'Choose the package that suits you and enjoy a complete study experience in Malaysia'}
            </p>
          </div>

          <div className={`flex items-center justify-between mb-8 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => setShowSAR(!showSAR)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${dir === "rtl" ? "flex-row-reverse" : ""} ${
                showSAR 
                  ? "bg-primary/10 border-primary/30 text-primary" 
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid="btn-toggle-currency-home"
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${showSAR ? "rotate-180" : ""}`} />
              {showSAR
                ? (language === 'ar' ? "إخفاء الريال السعودي" : "Hide SAR")
                : (language === 'ar' ? "عرض بالريال السعودي" : "Show in SAR")
              }
            </button>
            {showSAR && (
              <span className="text-xs text-muted-foreground">
                {language === 'ar' ? "* السعر تقريبي - سعر الصرف قد يتغير" : "* Approximate - exchange rate may vary"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packagesData?.map((pkg: any, idx: number) => (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.08 }}
                className={`relative flex flex-col h-full rounded-3xl border-2 transition-all duration-300 overflow-hidden ${
                  pkg.isSpecial === "true" 
                    ? "border-secondary shadow-xl shadow-secondary/10 bg-secondary/5" 
                    : "border-border bg-card shadow-sm hover:border-primary/50"
                }`}
              >
                {pkg.isSpecial === "true" && (
                  <div className="absolute top-0 left-0 right-0 bg-secondary text-secondary-foreground text-center py-1 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" /> {language === 'ar' ? "عرض خاص" : "Special Offer"}
                  </div>
                )}
                
                <div className="p-8 flex flex-col flex-grow pt-10">
                  <h3 className="font-serif text-2xl font-bold mb-2">{language === 'ar' ? pkg.nameAr : pkg.nameEn}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{language === 'ar' ? pkg.descriptionAr : pkg.descriptionEn}</p>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm text-muted-foreground line-through">MYR {pkg.originalPrice}</span>
                      {showSAR && <span className="text-xs text-muted-foreground line-through">(≈ {toSAR(pkg.originalPrice)} {language === 'ar' ? 'ر.س' : 'SAR'})</span>}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-black text-primary">MYR {pkg.discountedPrice}</span>
                      {showSAR && <span className="text-lg font-bold text-muted-foreground">(≈ {toSAR(pkg.discountedPrice)} {language === 'ar' ? 'ر.س' : 'SAR'})</span>}
                    </div>
                    {pkg.savings && (
                      <span className="inline-flex items-center mt-2 px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                        {language === 'ar' ? `وفر MYR ${pkg.savings}` : `Save MYR ${pkg.savings}`}
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {language === 'ar' ? "المميزات المشمولة:" : "Included Features:"}
                    </p>
                    {(language === 'ar' ? pkg.featuresAr : pkg.featuresEn).map((feat: string, i: number) => (
                      <div key={i} className={`flex items-start gap-2 text-sm ${dir === 'rtl' ? 'flex-row-reverse' : ''}`}>
                        <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    onClick={() => setSelectedPkg(pkg)}
                    className={`w-full py-6 rounded-xl font-bold text-lg ${pkg.isSpecial === "true" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}`}
                    data-testid={`btn-subscribe-home-${pkg.id}`}
                  >
                    {language === 'ar' ? "اشترك الآن" : "Subscribe Now"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/institutions?type=packages">
              <Button variant="outline" className="rounded-full px-8 py-5 text-base font-bold">
                {language === 'ar' ? 'عرض جميع الباقات' : 'View All Packages'}
                {dir === "rtl" ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold mb-8 font-serif">{t("home.contact_title")}</h2>
          <div className="flex flex-col items-center gap-6">
            <div className={`flex items-center gap-4 text-2xl font-bold ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Phone className="h-8 w-8 text-secondary" />
              <div className="flex flex-col gap-1">
                <span>+60 11-2908 2602</span>
                <span>+966 56 202 2668</span>
              </div>
            </div>
            <div className="flex gap-6 mt-8">
              <a href="https://wa.me/966562022668" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <MessageCircle className="h-10 w-10 text-secondary" />
              </a>
              <a href="https://direct.me/gatemalay" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <Instagram className="h-10 w-10 text-secondary" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING BRAND CTA */}
      <section className="py-24 bg-background border-t border-border text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-medium"
          >
            {language === "ar"
              ? "نحن نؤمن أن كل طالب يستحق مستقبلاً مشرقاً،\nصُمِّمت بوابتك إلى ماليزيا لتكون رفيقك من أولى خطواتك حتى يوم تخرجك."
              : "We believe every student deserves a bright future.\nGateway Services Malaysia was designed to be your companion from your first step to graduation day."}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-serif text-5xl md:text-7xl font-black text-primary mb-10 leading-tight"
          >
            {language === "ar" ? "بوابتك إلى ماليزيا" : "Gateway to Malaysia"}
          </motion.h2>

          {/* CR Number + QR Code */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className={`inline-flex items-center gap-8 border border-border rounded-2xl px-8 py-5 bg-card shadow-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <img
              src="/cr-qr.jpeg"
              alt="CR QR Code"
              className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
            />
            <div className={`${dir === "rtl" ? "text-right" : "text-left"} space-y-1`}>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                {language === "ar" ? "السجل التجاري السعودي" : "Saudi Commercial Register"}
              </p>
              <p className="font-mono text-2xl font-black text-foreground tracking-widest">7050249676</p>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "المملكة العربية السعودية" : "Kingdom of Saudi Arabia"}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PAYMENT MODAL */}
      <AnimatePresence>
        {selectedPkg && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedPkg(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`bg-card rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border relative ${dir === "rtl" ? "text-right" : "text-left"}`}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedPkg(null)} 
                className={`absolute top-4 ${dir === "rtl" ? "left-4" : "right-4"} p-2 rounded-full hover:bg-muted transition-colors`}
                data-testid="btn-close-modal-home"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold mb-1">
                  {language === 'ar' ? selectedPkg.nameAr : selectedPkg.nameEn}
                </h3>
                <div className="flex items-baseline gap-2 mt-2 flex-wrap">
                  <span className="text-3xl font-black text-primary">MYR {selectedPkg.discountedPrice}</span>
                  <span className="text-sm text-muted-foreground line-through">MYR {selectedPkg.originalPrice}</span>
                </div>
                {showSAR && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ {toSAR(selectedPkg.discountedPrice)} {language === 'ar' ? 'ر.س' : 'SAR'} ({language === 'ar' ? "تقريبي" : "approx."})
                  </p>
                )}
              </div>

              <p className="text-sm font-semibold mb-4">
                {language === 'ar' ? "اختر طريقة الدفع:" : "Choose payment method:"}
              </p>

              <div className="space-y-3">
                {/* Tabby */}
                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar' 
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nطريقة الدفع: تابي (Tabby) - 4 أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment: Tabby - 4 installments`
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="block" data-testid="btn-pay-tabby-home"
                >
                  <Button variant="outline" className={`w-full py-5 text-base font-bold justify-between border-2 hover:border-[#3FCEA0] hover:bg-[#3FCEA0]/5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-[#3FCEA0]/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#3FCEA0]" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : "text-left"}>
                        <span className="block font-bold">Tabby</span>
                        <span className="text-xs text-muted-foreground">{language === 'ar' ? "قسّمها على 4 دفعات" : "Split into 4 payments"}</span>
                      </div>
                    </div>
                    <ArrowLeft className={`w-4 h-4 ${dir === "rtl" ? "" : "rotate-180"}`} />
                  </Button>
                </a>

                {/* Tamara */}
                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar'
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nطريقة الدفع: تمارا (Tamara) - 3 أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment: Tamara - 3 installments`
                  )}`}
                  target="_blank" rel="noopener noreferrer"
                  className="block" data-testid="btn-pay-tamara-home"
                >
                  <Button variant="outline" className={`w-full py-5 text-base font-bold justify-between border-2 hover:border-[#F5A623] hover:bg-[#F5A623]/5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-[#F5A623]/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-[#F5A623]" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : "text-left"}>
                        <span className="block font-bold">Tamara</span>
                        <span className="text-xs text-muted-foreground">{language === 'ar' ? "قسّمها على 3 دفعات" : "Split into 3 payments"}</span>
                      </div>
                    </div>
                    <ArrowLeft className={`w-4 h-4 ${dir === "rtl" ? "" : "rotate-180"}`} />
                  </Button>
                </a>

                {/* Bank Transfer */}
                <div
                  className={`border-2 border-border rounded-xl p-4 bg-muted/30 ${dir === "rtl" ? "text-right" : "text-left"}`}
                  data-testid="btn-pay-bank-home"
                >
                  <div className={`flex items-center gap-3 mb-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Banknote className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <span className="block font-bold text-sm">{language === 'ar' ? "تحويل بنكي" : "Bank Transfer"}</span>
                      <span className="text-xs text-muted-foreground">{language === 'ar' ? "دفعة واحدة كاملة" : "Full payment"}</span>
                    </div>
                  </div>
                  <div className="space-y-1.5 text-xs bg-card rounded-lg p-3 border border-border font-mono">
                    <div className={`flex justify-between gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className="text-muted-foreground font-sans">{language === 'ar' ? "الاسم" : "Name"}</span>
                      <span className="font-semibold font-sans">Samer Almarzuqi</span>
                    </div>
                    <div className={`flex justify-between gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className="text-muted-foreground font-sans">IBAN</span>
                      <span className="font-bold tracking-wider text-[11px]">SA2645000000262447881001</span>
                    </div>
                    <div className={`flex justify-between gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <span className="text-muted-foreground font-sans">{language === 'ar' ? "رقم الحساب" : "Account No."}</span>
                      <span>262-447881-001</span>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/966562022668?text=${encodeURIComponent(
                      language === 'ar'
                        ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nطريقة الدفع: تحويل بنكي\nIBAN: SA2645000000262447881001`
                        : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment: Bank Transfer\nIBAN: SA2645000000262447881001`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block mt-3"
                  >
                    <Button size="sm" variant="outline" className={`w-full text-xs font-bold ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                      {language === 'ar' ? "أبلغنا بعد التحويل" : "Notify us after transfer"}
                    </Button>
                  </a>
                </div>

                {/* WhatsApp - Inquiry ONLY */}
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-2 text-center">
                    {language === 'ar' ? "هل لديك سؤال قبل الشراء؟" : "Have a question before buying?"}
                  </p>
                  <a
                    href={`https://wa.me/966562022668?text=${encodeURIComponent(
                      language === 'ar'
                        ? `أريد الاستفسار عن ${selectedPkg.nameAr} قبل الشراء`
                        : `I want to inquire about ${selectedPkg.nameEn} before purchasing`
                    )}`}
                    target="_blank" rel="noopener noreferrer"
                    className="block" data-testid="btn-inquiry-whatsapp-home"
                  >
                    <Button variant="outline" className={`w-full py-4 text-sm font-bold justify-between border border-[#25D366]/40 hover:border-[#25D366] hover:bg-[#25D366]/5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                        <span className="text-[#25D366]">{language === 'ar' ? "استفسار عبر الواتساب" : "WhatsApp Inquiry"}</span>
                      </div>
                      <ArrowLeft className={`w-4 h-4 text-[#25D366] ${dir === "rtl" ? "" : "rotate-180"}`} />
                    </Button>
                  </a>
                </div>
              </div>

              <div className={`mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Link href="/terms" className="underline hover:text-foreground transition-colors" onClick={() => setSelectedPkg(null)}>
                  {language === 'ar' ? "الشروط والأحكام" : "Terms & Conditions"}
                </Link>
                <span>•</span>
                <Link href="/terms#refund" className="underline hover:text-foreground transition-colors" onClick={() => setSelectedPkg(null)}>
                  {language === 'ar' ? "سياسة الاسترجاع" : "Refund Policy"}
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
