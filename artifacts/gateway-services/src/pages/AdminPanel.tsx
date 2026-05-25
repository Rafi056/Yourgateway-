import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, LogOut, Trash2, Plus, Megaphone, Lock, Calendar, ImageIcon, FileText, X, Upload } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const TOKEN_KEY = "gw_admin_token";

function getToken() { return localStorage.getItem(TOKEN_KEY); }
function setToken(t: string) { localStorage.setItem(TOKEN_KEY, t); }
function clearToken() { localStorage.removeItem(TOKEN_KEY); }

function authFetch(url: string, options: RequestInit = {}) {
  const token = getToken();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.body && typeof options.body === "string" ? { "Content-Type": "application/json" } : {}),
    },
  });
}

async function uploadFile(file: File): Promise<string> {
  const urlRes = await authFetch("/api/storage/uploads/request-url", {
    method: "POST",
    body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type || "application/octet-stream" }),
  });
  if (!urlRes.ok) throw new Error("Failed to get upload URL");
  const { uploadURL, objectPath } = await urlRes.json();

  const putRes = await fetch(uploadURL, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!putRes.ok) throw new Error("Failed to upload file");

  return `/api/storage${objectPath}`;
}

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

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [pdfFiles, setPdfFiles] = useState<(File | null)[]>([null, null, null]);
  const [isUploading, setIsUploading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const { data: admin, isLoading: checkingAuth } = useQuery({
    queryKey: ["/api/admin/me"],
    queryFn: async () => {
      if (!getToken()) return null;
      const res = await authFetch("/api/admin/me");
      if (!res.ok) { clearToken(); return null; }
      return res.json();
    },
    retry: false,
  });

  const { data: myAnnouncements, isLoading: loadingAnn } = useQuery({
    queryKey: ["/api/admin/announcements"],
    queryFn: async () => {
      const res = await authFetch("/api/admin/announcements");
      if (!res.ok) return [];
      return res.json();
    },
    enabled: !!admin,
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.token) setToken(data.token);
      setLoginError("");
      setUsername("");
      setPassword("");
      const { token: _token, ...adminData } = data;
      queryClient.setQueryData(["/api/admin/me"], adminData);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
    onError: () => setLoginError(t("ann.login_error")),
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authFetch("/api/admin/logout", { method: "POST" });
      clearToken();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/me"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      setIsUploading(true);
      let imageUrl: string | null = null;
      let pdfUrl: string | null = null;
      let pdfUrl2: string | null = null;
      let pdfUrl3: string | null = null;

      try {
        if (imageFile) imageUrl = await uploadFile(imageFile);
        if (pdfFiles[0]) pdfUrl = await uploadFile(pdfFiles[0]);
        if (pdfFiles[1]) pdfUrl2 = await uploadFile(pdfFiles[1]);
        if (pdfFiles[2]) pdfUrl3 = await uploadFile(pdfFiles[2]);
      } finally {
        setIsUploading(false);
      }

      const res = await authFetch("/api/announcements", {
        method: "POST",
        body: JSON.stringify({ titleAr, titleEn, contentAr, contentEn, imageUrl, pdfUrl, pdfUrl2, pdfUrl3 }),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      setTitleAr(""); setTitleEn(""); setContentAr(""); setContentEn("");
      setImageFile(null); setImagePreview(null); setPdfFiles([null, null, null]);
      pdfInputRefs.forEach(r => { if (r.current) r.current.value = ""; });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({ title: language === "ar" ? "تم نشر الإعلان بنجاح" : "Announcement published successfully" });
    },
    onError: () => toast({ title: language === "ar" ? "فشل نشر الإعلان" : "Failed to publish", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await authFetch(`/api/announcements/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/announcements"] });
      queryClient.invalidateQueries({ queryKey: ["/api/announcements"] });
      toast({ title: language === "ar" ? "تم حذف الإعلان" : "Announcement deleted" });
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePdfChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setPdfFiles(prev => { const next = [...prev]; next[index] = file; return next; });
  };

  const removePdf = (index: number) => {
    setPdfFiles(prev => { const next = [...prev]; next[index] = null; return next; });
    if (pdfInputRefs[index].current) pdfInputRefs[index].current!.value = "";
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
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
          <h2 className="font-serif text-2xl font-bold text-center mb-2">
            {language === "ar" ? "بوابة إدارة الإعلانات" : "Announcements Management Portal"}
          </h2>
          <p className="text-muted-foreground text-center text-sm mb-8">
            {language === "ar" ? "سجل دخولك لإضافة إعلانات المعهد" : "Sign in to manage your institution announcements"}
          </p>
          <form onSubmit={(e) => { e.preventDefault(); loginMutation.mutate(); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t("ann.username")}</label>
              <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder={language === "ar" ? "أدخل اسم المستخدم" : "Enter username"} autoComplete="username" data-testid="input-username" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t("ann.password")}</label>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder={language === "ar" ? "أدخل كلمة المرور" : "Enter password"} autoComplete="current-password" data-testid="input-password" />
            </div>
            {loginError && <p className="text-destructive text-sm font-medium" data-testid="text-login-error">{loginError}</p>}
            <Button type="submit" className="w-full" disabled={loginMutation.isPending} data-testid="btn-login">
              {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : t("ann.login_btn")}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const isPending = publishMutation.isPending || isUploading;

  return (
    <div className={`min-h-screen bg-muted/30 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div>
              <h1 className="font-serif text-xl font-bold">{language === "ar" ? "إدارة الإعلانات" : "Announcements Management"}</h1>
              <p className="text-white/80 text-sm">{language === "ar" ? admin.nameAr : admin.nameEn} — {admin.institutionName}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()} className={`flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 ${dir === "rtl" ? "flex-row-reverse" : ""}`} data-testid="btn-logout">
              <LogOut className="w-4 h-4" />
              {t("ann.logout")}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-6 border border-border shadow-sm">
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">{language === "ar" ? "صورة (اختياري)" : "Image (optional)"}</label>
                <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-border">
                    <img src={imagePreview} alt="preview" className="w-full h-40 object-cover" />
                    <button type="button" onClick={() => { setImageFile(null); setImagePreview(null); if (imageInputRef.current) imageInputRef.current.value = ""; }} className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => imageInputRef.current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                    <ImageIcon className="w-8 h-8" />
                    <span className="text-sm">{language === "ar" ? "اضغط لرفع صورة" : "Click to upload image"}</span>
                  </button>
                )}
              </div>

              {/* PDF Upload — up to 3 */}
              <div>
                <label className="block text-sm font-medium mb-2">{language === "ar" ? "ملفات PDF (حتى 3 ملفات، اختياري)" : "PDF files (up to 3, optional)"}</label>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <input ref={pdfInputRefs[i]} type="file" accept="application/pdf" className="hidden" onChange={handlePdfChange(i)} />
                      {pdfFiles[i] ? (
                        <div className={`flex items-center gap-3 p-3 bg-muted/50 rounded-xl border border-border ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <FileText className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <span className="text-sm flex-grow truncate">{pdfFiles[i]!.name}</span>
                          <button type="button" onClick={() => removePdf(i)} className="text-muted-foreground hover:text-destructive flex-shrink-0">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button type="button" onClick={() => pdfInputRefs[i].current?.click()} className="w-full border-2 border-dashed border-border rounded-xl p-3 flex items-center gap-3 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                          <Upload className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm">{language === "ar" ? `ملف PDF ${i + 1}` : `PDF file ${i + 1}`}</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isPending || !titleAr || !titleEn || !contentAr || !contentEn} data-testid="btn-publish">
                {isPending ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> {language === "ar" ? (isUploading ? "جاري رفع الملفات..." : "جاري النشر...") : (isUploading ? "Uploading files..." : "Publishing...")}</>
                ) : (
                  <><Megaphone className="w-4 h-4 mr-2" /> {t("ann.publish")}</>
                )}
              </Button>
            </form>
          </motion.div>

          {/* My Announcements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className={`flex items-center gap-2 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Megaphone className="w-5 h-5 text-primary" />
              <h2 className="font-serif text-xl font-bold">{t("ann.my_announcements")}</h2>
            </div>

            {loadingAnn && <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>}

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
                      <div className={`flex items-center gap-3 mt-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                        <div className={`flex items-center gap-1 text-xs text-muted-foreground ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                          <Calendar className="w-3 h-3" />
                          <span>{new Date(ann.createdAt).toLocaleDateString()}</span>
                        </div>
                        {ann.imageUrl && <span className="flex items-center gap-1 text-xs text-muted-foreground"><ImageIcon className="w-3 h-3" />{language === "ar" ? "صورة" : "Image"}</span>}
                        {[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).length > 0 && (
                          <span className="flex items-center gap-1 text-xs text-red-500">
                            <FileText className="w-3 h-3" />
                            {[ann.pdfUrl, ann.pdfUrl2, ann.pdfUrl3].filter(Boolean).length} PDF
                          </span>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10 flex-shrink-0" onClick={() => { if (confirm(t("ann.confirm_delete"))) deleteMutation.mutate(ann.id); }} data-testid={`btn-delete-${ann.id}`}>
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
