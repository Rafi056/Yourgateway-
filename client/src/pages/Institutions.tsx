import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useInstitutions } from "@/hooks/use-institutions";
import { Building2, MapPin, ArrowRight, ArrowLeft, BookOpen, Loader2, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { useQuery } from "@tanstack/react-query";

export default function Institutions() {
  const [location] = useLocation();
  const { t, dir, language } = useLanguage();
  // Extract simple query param manually for simplicity
  const searchParams = new URLSearchParams(window.location.search);
  const initialType = searchParams.get("type") || "all";
  
  const [filterType, setFilterType] = useState<string>(initialType);
  
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
      {/* Header */}
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
        {/* Filters */}
        <div className={`flex flex-wrap gap-4 mb-12 border-b border-border pb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <button
            onClick={() => setFilterType("all")}
            className={`px-6 py-2 rounded-full font-medium transition-all ${
              filterType === "all" 
                ? "bg-primary text-white shadow-md" 
                : "bg-background hover:bg-muted text-muted-foreground"
            }`}
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
          >
            <Zap className="w-4 h-4" /> {language === 'ar' ? "باقات اللغة" : "Language Packages"}
          </button>
        </div>

        {filterType === "packages" ? (
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
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-primary">MYR {pkg.discountedPrice}</span>
                    </div>
                    {pkg.savings && (
                      <div className="mt-2 inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-700 text-xs font-bold">
                        {language === 'ar' ? `وفر ${pkg.savings} رينغيت` : `Save MYR ${pkg.savings}`}
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

                  <Link href="/institutions?type=language_center">
                    <Button className={`w-full py-6 rounded-xl font-bold text-lg ${pkg.isSpecial === "true" ? "bg-secondary text-secondary-foreground hover:bg-secondary/90" : ""}`}>
                      {language === 'ar' ? "اختر معهداً للتقديم" : "Select Institute to Apply"}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Grid */
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
                      <Button className="w-full group/btn" variant="outline">
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
    </div>
  );
}
