import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import { Building2, Calendar, Megaphone, Loader2, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Announcements() {
  const { t, dir, language } = useLanguage();

  const { data: announcements, isLoading } = useQuery({
    queryKey: ["/api/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/announcements");
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
  });

  return (
    <div className={`min-h-screen bg-muted/30 pb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <Megaphone className="w-10 h-10" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">{t("ann.title")}</h1>
          </div>
          <p className="text-white/80 max-w-2xl text-lg">{t("ann.desc")}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className={`flex justify-end mb-6 ${dir === "rtl" ? "justify-start" : "justify-end"}`}>
          <Link href="/admin">
            <Button variant="outline" className={`flex items-center gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`} data-testid="link-admin-panel">
              <Building2 className="w-4 h-4" />
              {t("ann.admin_login")}
            </Button>
          </Link>
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
          </div>
        )}

        {announcements?.length === 0 && !isLoading && (
          <div className="text-center py-20 bg-card rounded-2xl border border-dashed">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Megaphone className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">{t("ann.no_announcements")}</h3>
            <p className="text-muted-foreground">{t("ann.no_announcements_desc")}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {announcements?.map((ann: any, idx: number) => (
            <motion.div
              key={ann.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-lg transition-shadow"
              data-testid={`announcement-card-${ann.id}`}
            >
              {ann.imageUrl && (
                <div className="h-48 bg-muted overflow-hidden">
                  <img src={ann.imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-6">
                <div className={`flex items-center gap-2 mb-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
                    {ann.institutionName}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold mb-2" data-testid={`announcement-title-${ann.id}`}>
                  {language === "ar" ? ann.titleAr : ann.titleEn}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 whitespace-pre-line">
                  {language === "ar" ? ann.contentAr : ann.contentEn}
                </p>
                <div className={`flex items-center gap-2 text-xs text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(ann.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                  <span className="opacity-50">•</span>
                  <span>{t("ann.posted_by")} {language === "ar" ? ann.adminNameAr : ann.adminNameEn}</span>
                </div>
                {ann.pdfUrl && (
                  <a
                    href={ann.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                  >
                    <FileText className="w-4 h-4" />
                    {language === "ar" ? "تحميل الملف PDF" : "Download PDF"}
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
