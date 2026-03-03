import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useInstitution } from "@/hooks/use-institutions";
import { useCreateApplication } from "@/hooks/use-applications";
import { MapPin, CheckCircle, Loader2, ArrowLeft, ArrowRight, Send, Megaphone, Calendar } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";

export default function InstitutionDetails() {
  const params = useParams();
  const id = parseInt(params.id || "0", 10);
  const { t, dir, language } = useLanguage();
  
  const { data: institution, isLoading, error } = useInstitution(id);
  const { mutate: submitApplication, isPending } = useCreateApplication();

  const { data: institutionAnnouncements } = useQuery({
    queryKey: ["/api/institutions", id, "announcements"],
    queryFn: async () => {
      const res = await fetch(`/api/institutions/${id}/announcements`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!institution,
  });
  
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    desiredProgram: "",
    documents: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution) return;

    const message = `طلب جديد من ${formData.studentName}\nالمؤسسة: ${institution.name}\nالبرنامج: ${formData.desiredProgram}\nالبريد: ${formData.studentEmail}`;
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp for both numbers
    window.open(`https://wa.me/601129082602?text=${encodedMessage}`, '_blank');
    
    setTimeout(() => {
      window.open(`https://wa.me/966562022668?text=${encodedMessage}`, '_blank');
    }, 800);

    submitApplication({
      ...formData,
      institutionId: institution.id,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !institution) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold mb-4">{t("inst.not_found")}</h2>
        <Link href="/institutions" className="text-primary hover:underline">
          {t("details.back")}
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/30 pb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      {/* Hero Banner for Institution */}
      <div className="relative h-[40vh] min-h-[300px] bg-primary">
        {institution.imageUrl && (
          <img 
            src={institution.imageUrl} 
            alt={institution.name}
            className="w-full h-full object-cover mix-blend-overlay opacity-60"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="container mx-auto">
            <Link href="/institutions" className={`inline-flex items-center text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              {dir === "rtl" ? <ArrowRight className="w-4 h-4 ml-2" /> : <ArrowLeft className="w-4 h-4 mr-2" />} {t("details.back")}
            </Link>
            <div className={`flex items-center gap-3 mb-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                institution.type === 'university' ? 'bg-primary/90 text-white border border-primary-foreground/20' : 'bg-secondary text-secondary-foreground'
              }`}>
                {institution.type === 'university' ? t("details.university") : t("details.language_center")}
              </span>
            </div>
            <h1 className={`font-serif text-4xl md:text-6xl font-bold text-foreground mb-4 ${dir === "rtl" ? "text-right" : "text-left"}`}>
              {institution.name}
            </h1>
            <div className={`flex items-center text-foreground/80 text-lg ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <MapPin className={`w-5 h-5 ${dir === "rtl" ? "ml-2" : "mr-2"}`} />
              {institution.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section className={dir === "rtl" ? "text-right" : "text-left"}>
              <h2 className="font-serif text-3xl font-bold mb-6 border-b pb-4">{t("details.about")}</h2>
              <div className="prose prose-lg text-muted-foreground">
                <p className="leading-relaxed whitespace-pre-line">
                  {institution.description}
                </p>
              </div>
            </section>

            <section className={`bg-card p-8 rounded-2xl border shadow-sm ${dir === "rtl" ? "text-right" : "text-left"}`}>
              <h3 className="font-serif text-2xl font-bold mb-6">{t("details.why_us")}</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  t("home.service1_title"),
                  t("home.service2_title"),
                  t("home.service3_title"),
                  t("home.service4_title"),
                  t("home.service5_title"),
                  t("home.service6_title")
                ].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <CheckCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {institutionAnnouncements && institutionAnnouncements.length > 0 && (
              <section className={dir === "rtl" ? "text-right" : "text-left"}>
                <div className={`flex items-center gap-3 mb-6 border-b pb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <Megaphone className="w-7 h-7 text-primary" />
                  <h2 className="font-serif text-3xl font-bold">{t("ann.title")}</h2>
                </div>
                <div className="space-y-5">
                  {institutionAnnouncements.map((ann: any, idx: number) => (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow"
                      data-testid={`institution-announcement-${ann.id}`}
                    >
                      {ann.imageUrl && (
                        <div className="h-44 bg-muted overflow-hidden">
                          <img src={ann.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-serif text-lg font-bold mb-2" data-testid={`institution-announcement-title-${ann.id}`}>
                          {language === "ar" ? ann.titleAr : ann.titleEn}
                        </h3>
                        <p className="text-muted-foreground text-sm whitespace-pre-line mb-3">
                          {language === "ar" ? ann.contentAr : ann.contentEn}
                        </p>
                        <div className={`flex items-center gap-2 text-xs text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(ann.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                          <span className="opacity-50">•</span>
                          <span>{t("ann.posted_by")} {language === "ar" ? ann.adminNameAr : ann.adminNameEn}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Application Form Sidebar */}
          <div className={`lg:col-span-1 ${dir === "rtl" ? "text-right" : "text-left"}`}>
            <div className="sticky top-28 bg-card rounded-3xl p-8 border border-border shadow-xl">
              <div className="mb-6">
                <h3 className="font-serif text-2xl font-bold">{t("details.start_app")}</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  {t("details.app_desc").replace("{name}", institution.name)}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="studentName">{t("details.full_name")}</Label>
                  <Input 
                    id="studentName"
                    required
                    placeholder={t("details.name_placeholder")}
                    value={formData.studentName}
                    onChange={e => setFormData({...formData, studentName: e.target.value})}
                    className={`bg-background ${dir === "rtl" ? "text-right" : "text-left"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="studentEmail">{t("details.email")}</Label>
                  <Input 
                    id="studentEmail"
                    type="email"
                    required
                    placeholder="example@mail.com"
                    value={formData.studentEmail}
                    onChange={e => setFormData({...formData, studentEmail: e.target.value})}
                    className={`bg-background ${dir === "rtl" ? "text-right" : "text-left"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="desiredProgram">{t("details.desired_program")}</Label>
                  <Input 
                    id="desiredProgram"
                    required
                    placeholder={institution.type === 'university' ? t("details.program_placeholder_uni") : t("details.program_placeholder_lang")}
                    value={formData.desiredProgram}
                    onChange={e => setFormData({...formData, desiredProgram: e.target.value})}
                    className={`bg-background ${dir === "rtl" ? "text-right" : "text-left"}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">{t("details.documents")}</Label>
                  <Textarea 
                    id="documents"
                    placeholder={t("details.docs_placeholder")}
                    value={formData.documents}
                    onChange={e => setFormData({...formData, documents: e.target.value})}
                    className={`min-h-[100px] bg-background ${dir === "rtl" ? "text-right" : "text-left"}`}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg rounded-xl mt-4" 
                  disabled={isPending}
                >
                  {isPending ? (
                    <>{t("details.processing")} <Loader2 className={`${dir === "rtl" ? "mr-2" : "ml-2"} w-5 h-5 animate-spin`} /></>
                  ) : (
                    <>{t("details.submit")} <Send className={`${dir === "rtl" ? "mr-2" : "ml-2"} w-5 h-5`} /></>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground mt-4">
                  {t("details.terms")}
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
