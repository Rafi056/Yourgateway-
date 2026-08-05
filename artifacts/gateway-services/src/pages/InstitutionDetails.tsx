import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useInstitution } from "@/hooks/use-institutions";
import { useCreateApplication } from "@/hooks/use-applications";
import { MapPin, CheckCircle, Loader2, ArrowLeft, ArrowRight, Send, Megaphone, Calendar, Lock, LogOut, Plus, Trash2, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

function InstitutionAdminPanel({ institutionId }: { institutionId: number }) {
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: admin, refetch: refetchAdmin } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const isAdminForThisInstitution = admin && admin.institutionId === institutionId;

  const { data: myAnnouncements, isLoading: loadingAnn } = useQuery({
    queryKey: ["/api/admin/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/admin/announcements");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!isAdminForThisInstitution,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", { username, password });
      return res.json();
    },
    onSuccess: (data) => {
      if (data.institutionId !== institutionId) {
        logoutMutation.mutate();
        setLoginError(language === "ar" ? "هذا الحساب غير مرتبط بهذا المعهد" : "This account is not linked to this institution");
        return;
      }
      setLoginError("");
      setUsername("");
      setPassword("");
      refetchAdmin();
    },
    onError: () => {
      setLoginError(t("ann.login_error"));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/admin/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/announcements", {
        titleAr, titleEn, contentAr, contentEn,
        imageUrl: imageUrl || null,
      });
      return res.json();
    },
    onSuccess: () => {
      setTitleAr("");
      setTitleEn("");
      setContentAr("");
      setContentEn("");
      setImageUrl("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/institutions", institutionId, "announcements"] });
      toast({
        title: language === "ar" ? "تم نشر الإعلان بنجاح" : "Announcement published successfully",
      });
    },
    onError: () => {
      toast({
        title: language === "ar" ? "فشل نشر الإعلان" : "Failed to publish announcement",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/announcements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/institutions", institutionId, "announcements"] });
      toast({
        title: language === "ar" ? "تم حذف الإعلان" : "Announcement deleted",
      });
    },
  });

  return (
    <div className="mt-8">
      <button
        onClick={() => setShowAdminPanel(!showAdminPanel)}
        className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors ${dir === "rtl" ? "flex-row-reverse" : ""}`}
        data-testid="btn-toggle-admin"
      >
        <Lock className="w-4 h-4" />
        <span>{language === "ar" ? "دخول المسؤول" : "Admin Access"}</span>
        {showAdminPanel ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {showAdminPanel && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4"
        >
          {!isAdminForThisInstitution ? (
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h3 className="font-serif text-lg font-bold text-center mb-4">{t("ann.admin_login")}</h3>

              <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">{t("ann.username")}</label>
                  <Input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={language === "ar" ? "أدخل اسم المستخدم" : "Enter username"}
                    data-testid="input-admin-username"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t("ann.password")}</label>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                    data-testid="input-admin-password"
                  />
                </div>
                {loginError && (
                  <p className="text-destructive text-sm font-medium" data-testid="text-admin-login-error">{loginError}</p>
                )}
                <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="btn-admin-login">
                  {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("ann.login_btn")}
                </Button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <p className="text-sm text-muted-foreground">
                  {t("ann.welcome")}، {language === "ar" ? admin.nameAr : admin.nameEn}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logoutMutation.mutate()}
                  className={`flex items-center gap-1 text-muted-foreground hover:text-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                  data-testid="btn-admin-logout"
                >
                  <LogOut className="w-4 h-4" />
                  {t("ann.logout")}
                </Button>
              </div>

              <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                <div className={`flex items-center gap-2 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <Plus className="w-5 h-5 text-primary" />
                  <h3 className="font-serif text-lg font-bold">{t("ann.new_announcement")}</h3>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); publishMutation.mutate(); }} className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("ann.title_ar")}</label>
                    <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} dir="rtl" data-testid="input-ann-title-ar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("ann.title_en")}</label>
                    <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} dir="ltr" data-testid="input-ann-title-en" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("ann.content_ar")}</label>
                    <Textarea value={contentAr} onChange={(e) => setContentAr(e.target.value)} rows={3} dir="rtl" data-testid="input-ann-content-ar" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("ann.content_en")}</label>
                    <Textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={3} dir="ltr" data-testid="input-ann-content-en" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{t("ann.image_url")}</label>
                    <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" placeholder="https://..." data-testid="input-ann-image-url" />
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={publishMutation.isPending || !titleAr || !titleEn || !contentAr || !contentEn}
                    data-testid="btn-ann-publish"
                  >
                    {publishMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("ann.publishing")}</>
                    ) : (
                      <><Megaphone className="w-4 h-4 mr-2" /> {t("ann.publish")}</>
                    )}
                  </Button>
                </form>
              </div>

              {loadingAnn && (
                <div className="flex justify-center py-4">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              )}

              {myAnnouncements && myAnnouncements.length > 0 && (
                <div>
                  <div className={`flex items-center gap-2 mb-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <Megaphone className="w-4 h-4 text-primary" />
                    <h3 className="font-serif text-base font-bold">{t("ann.my_announcements")}</h3>
                  </div>
                  <div className="space-y-3">
                    {myAnnouncements.map((ann: any) => (
                      <div key={ann.id} className="bg-muted/50 rounded-xl p-4 border border-border" data-testid={`admin-ann-${ann.id}`}>
                        <div className={`flex items-start justify-between gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-sm mb-1 truncate">{language === "ar" ? ann.titleAr : ann.titleEn}</h4>
                            <p className="text-muted-foreground text-xs line-clamp-2">{language === "ar" ? ann.contentAr : ann.contentEn}</p>
                            <div className={`flex items-center gap-1 mt-2 text-xs text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0"
                            onClick={() => {
                              if (confirm(t("ann.confirm_delete"))) {
                                deleteMutation.mutate(ann.id);
                              }
                            }}
                            data-testid={`btn-delete-ann-${ann.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

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
    
    window.open(`https://wa.me/601121728799?text=${encodedMessage}`, '_blank');
    
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

            <section className={dir === "rtl" ? "text-right" : "text-left"}>
              <div className={`flex items-center gap-3 mb-6 border-b pb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Megaphone className="w-7 h-7 text-primary" />
                <h2 className="font-serif text-3xl font-bold">{t("ann.title")}</h2>
              </div>

              {institutionAnnouncements && institutionAnnouncements.length > 0 ? (
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
                          <img src={ann.imageUrl} alt={language === "ar" ? `صورة إعلان: ${ann.titleAr}` : `Announcement image: ${ann.titleEn}`} className="w-full h-full object-cover" />
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
                        {[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).length > 0 && (
                          <div className={`mt-3 flex flex-wrap gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                            {[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).map((url: string, i: number) => (
                              <a
                                key={i}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium border border-red-200 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
                              >
                                <FileText className="w-4 h-4" />
                                {language === "ar" ? `تحميل PDF ${[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).length > 1 ? i + 1 : ""}`.trim() : `Download PDF${[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).length > 1 ? ` ${i + 1}` : ""}`}
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-card rounded-2xl p-8 border border-dashed text-center">
                  <Megaphone className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">{t("ann.no_announcements")}</p>
                  <p className="text-muted-foreground text-sm mt-1">{t("ann.no_announcements_desc")}</p>
                </div>
              )}

              <InstitutionAdminPanel institutionId={id} />
            </section>
          </div>

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
                    data-testid="input-student-name"
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
                    data-testid="input-student-email"
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
                    data-testid="input-desired-program"
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
                    data-testid="input-documents"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6 text-lg rounded-xl mt-4" 
                  disabled={isPending}
                  data-testid="btn-submit-application"
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
