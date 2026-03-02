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
  const [showMYR, setShowMYR] = useState(false);

  const SAR_TO_MYR = 1.25;
  const toMYR = (sarPrice: string) => {
    const num = parseFloat(sarPrice.replace(/,/g, ''));
    const myr = Math.round(num * SAR_TO_MYR);
    return myr.toLocaleString();
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
              onClick={() => setShowMYR(!showMYR)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${dir === "rtl" ? "flex-row-reverse" : ""} ${
                showMYR 
                  ? "bg-primary/10 border-primary/30 text-primary" 
                  : "bg-muted border-border text-muted-foreground hover:bg-muted/80"
              }`}
              data-testid="btn-toggle-currency"
            >
              <RefreshCw className={`w-4 h-4 transition-transform ${showMYR ? "rotate-180" : ""}`} />
              {showMYR
                ? (language === 'ar' ? "إخفاء الرينغيت الماليزي" : "Hide MYR")
                : (language === 'ar' ? "عرض بالرينغيت الماليزي" : "Show in MYR")
              }
            </button>
            {showMYR && (
              <span className="text-xs text-muted-foreground">
                {language === 'ar' ? "* السعر التقريبي - سعر الصرف قد يتغير" : "* Approximate - exchange rate may vary"}
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
                      <span className="text-sm text-muted-foreground line-through">{language === 'ar' ? `${pkg.originalPrice} ر.س` : `SAR ${pkg.originalPrice}`}</span>
                      {showMYR && <span className="text-xs text-muted-foreground line-through">(MYR {toMYR(pkg.originalPrice)})</span>}
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-black text-primary">{language === 'ar' ? `${pkg.discountedPrice} ر.س` : `SAR ${pkg.discountedPrice}`}</span>
                      {showMYR && <span className="text-lg font-bold text-muted-foreground">(MYR {toMYR(pkg.discountedPrice)})</span>}
                    </div>
                    {pkg.savings && (
                      <div className="mt-2 inline-flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                          {language === 'ar' ? `وفر ${pkg.savings} ر.س` : `Save SAR ${pkg.savings}`}
                        </span>
                        {showMYR && <span className="text-xs text-green-600 font-medium">(MYR {toMYR(pkg.savings)})</span>}
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
                  <div className="h-48 bg-muted relative overflow-hidden">
                    {inst.imageUrl ? (
                      <img 
                        src={inst.imageUrl} 
                        alt={inst.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
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
                  <span className="text-3xl font-black text-primary">{language === 'ar' ? `${selectedPkg.discountedPrice} ر.س` : `SAR ${selectedPkg.discountedPrice}`}</span>
                  <span className="text-sm text-muted-foreground line-through">{language === 'ar' ? `${selectedPkg.originalPrice} ر.س` : `SAR ${selectedPkg.originalPrice}`}</span>
                </div>
                {showMYR && (
                  <p className="text-xs text-muted-foreground mt-1">
                    ≈ MYR {toMYR(selectedPkg.discountedPrice)} <span className="opacity-60">({language === 'ar' ? "تقريبي" : "approx."})</span>
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
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: ${selectedPkg.discountedPrice} ر.س\nأريد الدفع عبر تابي (Tabby) - أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: SAR ${selectedPkg.discountedPrice}\nPayment via Tabby - Installments`
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
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: ${selectedPkg.discountedPrice} ر.س\nأريد الدفع عبر تمارا (Tamara) - أقساط`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: SAR ${selectedPkg.discountedPrice}\nPayment via Tamara - Installments`
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
                      ? `أريد الاشتراك في ${selectedPkg.nameAr}\nالسعر: ${selectedPkg.discountedPrice} ر.س\nأريد الدفع عبر تحويل بنكي`
                      : `I want to subscribe to ${selectedPkg.nameEn}\nPrice: SAR ${selectedPkg.discountedPrice}\nPayment via Bank Transfer`
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

                <a
                  href={`https://wa.me/966562022668?text=${encodeURIComponent(
                    language === 'ar'
                      ? `أريد الاستفسار عن ${selectedPkg.nameAr}\nالسعر: ${selectedPkg.discountedPrice} ر.س`
                      : `I want to inquire about ${selectedPkg.nameEn}\nPrice: SAR ${selectedPkg.discountedPrice}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                  data-testid="btn-pay-whatsapp"
                >
                  <Button className={`w-full py-5 text-base font-bold justify-between bg-[#25D366] hover:bg-[#128C7E] ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className={dir === "rtl" ? "text-right" : "text-left"}>
                        <span className="block font-bold text-white">{language === 'ar' ? "تواصل عبر واتساب" : "Chat on WhatsApp"}</span>
                        <span className="text-xs text-white/80">{language === 'ar' ? "استفسر أو ادفع مباشرة" : "Inquire or pay directly"}</span>
                      </div>
                    </div>
                    <ArrowLeft className={`w-4 h-4 text-white ${dir === "rtl" ? "" : "rotate-180"}`} />
                  </Button>
                </a>
              </div>

              <p className="text-xs text-center text-muted-foreground mt-6">
                {language === 'ar' ? "سيتم توجيهك للواتساب لإتمام عملية الدفع مع فريقنا" : "You will be redirected to WhatsApp to complete payment with our team"}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
