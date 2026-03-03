import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LogOut, Trash2, Plus, Megaphone, Lock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminPanel() {
  const { t, dir, language } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [titleAr, setTitleAr] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [contentAr, setContentAr] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const { data: admin, isLoading: checkingAuth, refetch: refetchAdmin } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      const res = await fetch("/api/admin/me");
      if (!res.ok) return null;
      return res.json();
    },
    retry: false,
  });

  const { data: myAnnouncements, isLoading: loadingAnn } = useQuery({
    queryKey: ["/api/admin/announcements"],
    queryFn: async () => {
      const res = await fetch("/api/admin/announcements");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!admin,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admin/login", { username, password });
      return res.json();
    },
    onSuccess: () => {
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
      toast({
        title: language === "ar" ? "تم حذف الإعلان" : "Announcement deleted",
      });
    },
  });

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className={`min-h-screen bg-muted/30 flex items-center justify-center p-4 ${dir === "rtl" ? "text-right" : "text-left"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full shadow-xl border border-border"
        >
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold text-center mb-2">{t("ann.admin_login")}</h2>
          <p className="text-muted-foreground text-center text-sm mb-8">{t("ann.admin_panel")}</p>

          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("ann.username")}</label>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={language === "ar" ? "أدخل اسم المستخدم" : "Enter username"}
                data-testid="input-username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("ann.password")}</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"}
                data-testid="input-password"
              />
            </div>
            {loginError && (
              <p className="text-destructive text-sm font-medium" data-testid="text-login-error">{loginError}</p>
            )}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="btn-login">
              {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("ann.login_btn")}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-muted/30 pb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      <div className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div>
              <h1 className="font-serif text-3xl font-bold mb-1">{t("ann.admin_panel")}</h1>
              <p className="text-white/80">
                {t("ann.welcome")}، {language === "ar" ? admin.nameAr : admin.nameEn} — {admin.institutionName}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => logoutMutation.mutate()}
              className={`flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 ${dir === "rtl" ? "flex-row-reverse" : ""}`}
              data-testid="btn-logout"
            >
              <LogOut className="w-4 h-4" />
              {t("ann.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 border border-border shadow-sm"
          >
            <div className={`flex items-center gap-2 mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Plus className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold">{t("ann.new_announcement")}</h2>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); publishMutation.mutate(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">{t("ann.title_ar")}</label>
                <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} dir="rtl" data-testid="input-title-ar" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("ann.title_en")}</label>
                <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} dir="ltr" data-testid="input-title-en" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("ann.content_ar")}</label>
                <Textarea value={contentAr} onChange={(e) => setContentAr(e.target.value)} rows={4} dir="rtl" data-testid="input-content-ar" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("ann.content_en")}</label>
                <Textarea value={contentEn} onChange={(e) => setContentEn(e.target.value)} rows={4} dir="ltr" data-testid="input-content-en" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">{t("ann.image_url")}</label>
                <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} dir="ltr" placeholder="https://..." data-testid="input-image-url" />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={publishMutation.isPending || !titleAr || !titleEn || !contentAr || !contentEn}
                data-testid="btn-publish"
              >
                {publishMutation.isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {t("ann.publishing")}</>
                ) : (
                  <><Megaphone className="w-4 h-4 mr-2" /> {t("ann.publish")}</>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className={`flex items-center gap-2 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Megaphone className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold">{t("ann.my_announcements")}</h2>
            </div>

            {loadingAnn && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            )}

            {myAnnouncements?.length === 0 && !loadingAnn && (
              <div className="bg-card rounded-2xl p-8 border border-dashed text-center">
                <Megaphone className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">{t("ann.no_announcements")}</p>
              </div>
            )}

            <div className="space-y-4">
              {myAnnouncements?.map((ann: any) => (
                <div key={ann.id} className="bg-card rounded-xl p-4 border border-border shadow-sm" data-testid={`admin-announcement-${ann.id}`}>
                  <div className={`flex items-start justify-between gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-sm mb-1 truncate">{language === "ar" ? ann.titleAr : ann.titleEn}</h3>
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
                      data-testid={`btn-delete-${ann.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
