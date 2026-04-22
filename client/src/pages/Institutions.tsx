import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useInstitutions } from "@/hooks/use-institutions";
import { Building2, MapPin, ArrowRight, ArrowLeft, BookOpen, Loader2, CheckCircle2, Zap, Sparkles, CreditCard, Banknote, MessageCircle, X, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

export default function Institutions() {
  const [location] = useLocation();
  const { t, dir, language } = useLanguage();
  const searchParams = new URLSearchParams(window.location.search);
  const initialType = searchParams.get("type") || "all";
  
  const [filterType, setFilterType] = useState<string>(initialType);
  const [selectedPkg, setSelectedPkg] = useState<any>(null);
  const [showSAR, setShowSAR] = useState(false);

  const MYR_TO_SAR = 0.80;
  const toSAR = (myrPrice: string) => {
    const num = parseFloat(myrPrice.replace(/,/g, ''));
    const sar = Math.round(num * MYR_TO_SAR);
    return sar.toLocaleString();
  };
  
  const { data: institutions, isLoading, error } = useInstitutions(
    filterType === "all" ? undefined : (filterType === "packages" ? "language_center" : filterType)
  );

  const { data: packagesData } = useQuery({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const res = await fetch("/api/packages");
      if (!res.ok) throw new Error("Failed to fetch packages");
      return res.json();
    }
  });

  return (
    <div className={`min-h-screen bg-muted/30 pb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {t("inst.title")}
          </h1>
          <p className="text-white/80 max-w-2xl text-lg">
            {t("inst.desc")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className={`flex flex-wrap gap-4 mb-12 border-b border-border pb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setFilterType("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterType === "all" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
            data-testid="filter-all"
          >
            {t("inst.all")}
          </button>
          <button
            onClick={() => setFilterType("university")}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""} ${
              filterType === "university" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
            data-testid="filter-university"
          >
            <Building2 className="w-4 h-4" /> {t("inst.universities")}
          </button>
          <button
            onClick={() => setFilterType("language_center")}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""} ${
              filterType === "language_center" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
            data-testid="filter-language"
          >
            <BookOpen className="w-4 h-4" /> {t("inst.language_centers")}
          </button>
          <button
            onClick={() => setFilterType("packages")}
            className={`px-6 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""} ${
              filterType === "packages" 
                ? "bg-secondary text-secondary-foreground shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground border-secondary/30 border"
            }`}
            data-testid="filter-packages"
          >
            <Zap className="w-4 h-4" /> {language === 'ar' ? "باقات اللغة" : "Language Packages"}
          </button>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
            <p>{t("inst.loading")}</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive p-6 rounded-xl text-center">
            <p className="font-bold">{t("inst.failed")}</p>
            <p className="text-sm opacity-80">{t("inst.try_again")}</p>
          </div>
        )}

        {filterType === "packages" ? (
          <>
          <div className={`flex items-center justify-between mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <button
              onClick={() => setShowSAR(!showSAR)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${dir === "rtl" ? "flex-row-reverse" : ""} ${
                showSAR 
                  ? "bg-primary/10 border-primary/30 text-primary" 
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid="btn-toggle-currency"
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
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
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
                  <p className="text-muted-foreground text-sm mb-6">{language === 'ar' ? pkg.descriptionAr : pkg.descriptionEn}</p>
                  
                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-sm text-muted-foreground line-through">MYR {pkg.originalPrice}</span>
                      {showSAR && <span className="text-xs text-muted-foreground line-through">({language === 'ar' ? `≈ ${toSAR(pkg.originalPrice)} ر.س` : `≈ SAR ${toSAR(pkg.originalPrice)}`})</span>}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-black text-primary">MYR {pkg.discountedPrice}</span>
                      {showSAR && <span className="text-lg font-bold text-muted-foreground">({language === 'ar' ? `≈ ${toSAR(pkg.discountedPrice)} ر.س` : `≈ SAR ${toSAR(pkg.discountedPrice)}`})</span>}
                    </div>
                    {pkg.savings && (
                      <div className="mt-2 inline-flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                          {language === 'ar' ? `وفر MYR ${pkg.savings}` : `Save MYR ${pkg.savings}`}
                        </span>
                        {showSAR && <span className="text-xs text-green-600 font-medium">({language === 'ar' ? `≈ ${toSAR(pkg.savings)} ر.س` : `≈ SAR ${toSAR(pkg.savings)}`})</span>}
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-8 flex-grow">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{language === 'ar' ? "المميزات المشمولة:" : "Included Features:"}</p>
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
                    data-testid={`btn-subscribe-${pkg.id}`}
                  >
                    {language === 'ar' ? "اشترك الآن" : "Subscribe Now"}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          </>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {institutions?.map((inst, idx) => (
              <motion.div
                key={inst.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
                  <div className="h-48 bg-white relative overflow-hidden">
                    {inst.imageUrl ? (
                      <img 
                        src={inst.imageUrl} 
                        alt={inst.name}
                        className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                        {inst.type === 'university' ? <Building2 className="w-12 h-12 opacity-50" /> : <BookOpen className="w-12 h-12 opacity-50" />}
                      </div>
                    )}
                    <div className={`absolute top-4 ${dir === "rtl" ? "right-4" : "left-4"}`}>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md ${
                        inst.type === 'university' ? 'bg-primary/90 text-white' : 'bg-secondary/90 text-secondary-foreground'
                      }`}>
                        {inst.type === 'university' ? t("details.university") : t("details.language_center")}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="font-serif text-2xl font-bold mb-2 line-clamp-2">{inst.name}</h3>
                    <div className={`flex items-center text-muted-foreground text-sm mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <MapPin className={`w-4 h-4 ${dir === "rtl" ? "ml-1" : "mr-1"}`} />
                      {inst.location}
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
                      {inst.description}
                    </p>
                    
                    <Link href={`/institutions/${inst.id}`}>
                      <Button className="w-full group/btn" variant="outline" data-testid={`btn-view-${inst.id}`}>
                        {t("inst.view_details")}
                        {dir === "rtl" ? <ArrowLeft className="w-4 h-4 mr-2 group-hover/btn:-translate-x-1 transition-transform" /> : <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />}
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {institutions?.length === 0 && !isLoading && (
              <div className="col-span-full text-center py-20 bg-card rounded-2xl border border-dashed">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">{t("inst.not_found")}</h3>
                <p className="text-muted-foreground">{t("inst.adjust_filters")}</p>
              </div>
            )}
          </div>
        )}
      </div>

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
                data-testid="btn-close-modal"
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
                    {language === 'ar' ? `≈ ${toSAR(selectedPkg.discountedPrice)} ر.س` : `≈ SAR ${toSAR(selectedPkg.discountedPrice)}`} <span className="opacity-60">({language === 'ar' ? "تقريبي" : "approx."})</span>
                  </p>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-6">
                {language === 'ar' ? "اختر طريقة الدفع المناسبة لك:" : "Choose your preferred payment method:"}
              </p>

              <div className="space-y-3">
                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar' 
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nأريد الدفع عبر تابي (Tabby) - أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment via Tabby - Installments`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="btn-pay-tabby"
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

                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar'
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nأريد الدفع عبر تمارا (Tamara) - أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment via Tamara - Installments`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="btn-pay-tamara"
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

                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar'
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: MYR ${selectedPkg.discountedPrice}\nأريد الدفع عبر تحويل بنكي`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: MYR ${selectedPkg.discountedPrice}\nPayment via Bank Transfer`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="btn-pay-bank"
                >
                  <Button variant="outline" className={`w-full py-5 text-base font-bold justify-between border-2 hover:border-primary hover:bg-primary/5 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-primary" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : "text-left"}>
                        <span className="block font-bold">{language === 'ar' ? "تحويل بنكي" : "Bank Transfer"}</span>
                        <span className="text-xs text-muted-foreground">{language === 'ar' ? "دفعة واحدة كاملة" : "Full payment"}</span>
                      </div>
                    </div>
                    <ArrowLeft className={`w-4 h-4 ${dir === "rtl" ? "" : "rotate-180"}`} />
                  </Button>
                </a>

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
                    className="block" data-testid="btn-inquiry-whatsapp"
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
                <a href="/terms" className="underline hover:text-foreground transition-colors">
                  {language === 'ar' ? "الشروط والأحكام" : "Terms & Conditions"}
                </a>
                <span>•</span>
                <a href="/terms#refund" className="underline hover:text-foreground transition-colors">
                  {language === 'ar' ? "سياسة الاسترجاع" : "Refund Policy"}
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
