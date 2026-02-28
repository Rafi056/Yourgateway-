import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "rtl" | "ltr";
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    "nav.universities": "الجامعات",
    "nav.language_centers": "معاهد اللغة",
    "nav.my_applications": "طلباتي",
    "nav.apply_now": "قدم الآن",
    "nav.brand": "بوابتك إلى ماليزيا",
    "home.hero_badge": "مستقبلك العالمي يبدأ هنا",
    "home.hero_title": "عائلة بوابتك إلى ماليزيا",
    "home.hero_subtitle": "نحن هنا لنرشدك.",
    "home.hero_desc": "عائلة بوابتك إلى ماليزيا مكرسة لدعم الطلاب الراغبين في متابعة دراستهم في ماليزيا. سواء كنت تبحث عن التسجيل في أفضل معاهد اللغة الإنجليزية أو الانضمام إلى الجامعات الرائدة، نحن هنا لإرشادك في كل خطوة.",
    "home.whatsapp_btn": "تواصل معنا عبر الواتساب",
    "home.social_btn": "تابعنا على منصاتنا",
    "home.services_title": "خدماتنا مجانية بالكامل",
    "home.services_subtitle": "نحن نضمن لك انتقالاً سلساً ومريحاً من خلال توفير الدعم الشامل",
    "home.service1_title": "الاستقبال من المطار",
    "home.service1_desc": "نستقبلك فور وصولك لضمان راحتك وأمانك.",
    "home.service2_title": "شريحة الاتصال والمواصلات",
    "home.service2_desc": "نساعدك في الحصول على بطاقة SIM وبطاقة النقل العام.",
    "home.service3_title": "الفحص الطبي والوثائق",
    "home.service3_desc": "دعم كامل في إجراءات الفحص الطبي وتجهيز الوثائق المطلوبة.",
    "home.service4_title": "التوجيه الأكاديمي",
    "home.service4_desc": "تقديم الاستشارات الأكاديمية لاختيار التخصص والجامعة الأنسب.",
    "home.service5_title": "متابعة مستمرة",
    "home.service5_desc": "نحن معك من لحظة الوصول وحتى يوم التخرج.",
    "home.service6_title": "تقديم مجاني",
    "home.service6_desc": "خدماتنا مجانية ولا نتقاضى أي رسوم من الطلاب.",
    "home.pathway_uni_title": "الشهادات الجامعية",
    "home.pathway_uni_desc": "تابع دراساتك الجامعية والدراسات العليا في أفضل الجامعات الماليزية ذات السمعة العالمية المرموقة.",
    "home.pathway_uni_link": "استكشف الجامعات",
    "home.pathway_lang_title": "إتقان اللغة الإنجليزية",
    "home.pathway_lang_desc": "أتقن اللغة الإنجليزية بسرعة مع برامج مكثفة مصممة لإعدادك للتواصل العالمي والدراسات المتقدمة.",
    "home.pathway_lang_link": "ابحث عن معاهد اللغة",
    "home.contact_title": "ابدأ رحلتك الدراسية في ماليزيا اليوم",
    "footer.desc": "بوابتك الموثوقة للتعليم العالمي في ماليزيا. سواء كنت تسعى للحصول على درجة جامعية أو إتقان اللغة الإنجليزية، ابدأ رحلتك معنا هنا.",
    "footer.explore": "استكشف",
    "footer.support": "الدعم والتواصل",
    "footer.whatsapp": "واتساب",
    "footer.social": "منصاتنا الاجتماعية",
    "footer.faq": "الأسئلة الشائعة",
    "footer.rights": "جميع الحقوق محفوظة.",
    "inst.title": "اكتشف المؤسسات",
    "inst.desc": "تصفح مجموعتنا المختارة من أفضل المؤسسات التعليمية في ماليزيا.",
    "inst.all": "الكل",
    "inst.universities": "الجامعات",
    "inst.language_centers": "معاهد اللغة",
    "inst.loading": "جاري تحميل المؤسسات...",
    "inst.failed": "فشل تحميل المؤسسات.",
    "inst.try_again": "يرجى المحاولة مرة أخرى لاحقاً.",
    "inst.view_details": "عرض التفاصيل",
    "inst.not_found": "لم يتم العثور على مؤسسات",
    "inst.adjust_filters": "حاول تعديل الفلاتر الخاصة بك.",
    "details.back": "العودة إلى القائمة",
    "details.university": "جامعة",
    "details.language_center": "معهد لغة",
    "details.about": "حول المؤسسة",
    "details.why_us": "لماذا تختارنا؟",
    "details.start_app": "ابدأ طلب التقديم",
    "details.app_desc": "اتخذ الخطوة الأولى نحو مستقبلك في {name}. املأ النموذج أدناه.",
    "details.full_name": "الاسم الكامل",
    "details.name_placeholder": "مثال: أحمد محمد",
    "details.email": "البريد الإلكتروني",
    "details.desired_program": "البرنامج الدراسي المطلوب",
    "details.program_placeholder_uni": "مثال: بكالوريوس علوم الحاسب",
    "details.program_placeholder_lang": "مثال: دورة لغة إنجليزية مكثفة",
    "details.documents": "المستندات الداعمة (روابط أو نص)",
    "details.docs_placeholder": "قدم رابط جوجل درايف لجواز سفرك، السجلات الأكاديمية، إلخ. أو صفها هنا.",
    "details.processing": "جاري المعالجة",
    "details.submit": "إرسال الطلب",
    "details.terms": "من خلال الإرسال، فإنك توافق على شروطنا وسياسة الخصوصية الخاصة بنا.",
    "dashboard.title": "لوحة التحكم الخاصة بي",
    "dashboard.desc": "تابع حالة طلبات التقديم الخاصة بك للجامعات ومعاهد اللغة.",
    "dashboard.loading": "جاري تحميل طلباتك...",
    "dashboard.submitted": "الطلبات المقدمة",
    "dashboard.total": "إجمالي",
    "dashboard.program": "البرنامج",
    "dashboard.applied_on": "قدم في",
    "dashboard.inst_type": "نوع المؤسسة",
    "dashboard.last_update": "آخر تحديث",
    "dashboard.in_review": "قيد المعالجة",
    "dashboard.no_apps": "لا توجد طلبات حتى الآن",
    "dashboard.no_apps_desc": "لم تقم بتقديم أي طلبات بعد. تصفح مؤسساتنا وابدأ رحلتك اليوم.",
    "dashboard.browse_btn": "تصفح المؤسسات",
    "status.pending": "قيد الانتظار",
    "status.approved": "تمت الموافقة",
    "status.rejected": "مرفوض",
  },
  en: {
    "nav.universities": "Universities",
    "nav.language_centers": "Language Centers",
    "nav.my_applications": "My Applications",
    "nav.apply_now": "Apply Now",
    "nav.brand": "StudyMalaysia",
    "home.hero_badge": "Your Global Future Awaits",
    "home.hero_title": "Your Gateway to Malaysia Family",
    "home.hero_subtitle": "We are here to guide you.",
    "home.hero_desc": "Your Gateway to Malaysia Family is dedicated to supporting students who wish to pursue their studies in Malaysia. Whether you are looking to enroll in top English language institutes or join leading universities, we are here to guide you every step of the way.",
    "home.whatsapp_btn": "Chat with us on WhatsApp",
    "home.social_btn": "Follow us on our platforms",
    "home.services_title": "Our services are completely free",
    "home.services_subtitle": "We ensure a smooth and comfortable transition by providing comprehensive support",
    "home.service1_title": "Airport Pickup",
    "home.service1_desc": "We pick you up upon arrival to ensure your comfort and safety.",
    "home.service2_title": "SIM Card & Transportation",
    "home.service2_desc": "We help you obtain a SIM card and public transport card.",
    "home.service3_title": "Medical Check-up & Docs",
    "home.service3_desc": "Full support in medical check-up procedures and preparing required documents.",
    "home.service4_title": "Academic Guidance",
    "home.service4_desc": "Providing academic consultations to choose the most suitable major and university.",
    "home.service5_title": "Continuous Follow-up",
    "home.service5_desc": "We are with you from the moment of arrival until graduation day.",
    "home.service6_title": "Free Application",
    "home.service6_desc": "Our services are free and we do not charge students any fees.",
    "home.pathway_uni_title": "University Degrees",
    "home.pathway_uni_desc": "Pursue your undergraduate and postgraduate studies at the best Malaysian universities with a prestigious global reputation.",
    "home.pathway_uni_link": "Explore Universities",
    "home.pathway_lang_title": "English Language Mastery",
    "home.pathway_lang_desc": "Master English quickly with intensive programs designed to prepare you for global communication and advanced studies.",
    "home.pathway_lang_link": "Find Language Centers",
    "home.contact_title": "Start Your Study Journey in Malaysia Today",
    "footer.desc": "Your trusted gateway to global education in Malaysia. Whether you're seeking a degree or mastering English, start your journey with us here.",
    "footer.explore": "Explore",
    "footer.support": "Support & Contact",
    "footer.whatsapp": "WhatsApp",
    "footer.social": "Social Platforms",
    "footer.faq": "FAQ",
    "footer.rights": "All rights reserved.",
    "inst.title": "Discover Institutions",
    "inst.desc": "Browse our selection of top-tier educational institutions across Malaysia.",
    "inst.all": "All",
    "inst.universities": "Universities",
    "inst.language_centers": "Language Centers",
    "inst.loading": "Loading institutions...",
    "inst.failed": "Failed to load institutions.",
    "inst.try_again": "Please try again later.",
    "inst.view_details": "View Details",
    "inst.not_found": "No institutions found",
    "inst.adjust_filters": "Try adjusting your filters.",
    "details.back": "Back to list",
    "details.university": "University",
    "details.language_center": "Language Center",
    "details.about": "About the Institution",
    "details.why_us": "Why Choose Us?",
    "details.start_app": "Start Your Application",
    "details.app_desc": "Take the first step towards your future at {name}. Fill out the form below.",
    "details.full_name": "Full Name",
    "details.name_placeholder": "e.g. Jane Doe",
    "details.email": "Email Address",
    "details.desired_program": "Desired Program",
    "details.program_placeholder_uni": "e.g. BSc Computer Science",
    "details.program_placeholder_lang": "e.g. Intensive English Course",
    "details.documents": "Supporting Documents (Links/Text)",
    "details.docs_placeholder": "Provide Google Drive link to your passport, transcripts, etc. or describe them here.",
    "details.processing": "Processing",
    "details.submit": "Submit Application",
    "details.terms": "By submitting, you agree to our terms and privacy policy.",
    "dashboard.title": "My Dashboard",
    "dashboard.desc": "Track the status of your university and language center applications.",
    "dashboard.loading": "Loading your applications...",
    "dashboard.submitted": "Submitted Applications",
    "dashboard.total": "Total",
    "dashboard.program": "Program",
    "dashboard.applied_on": "Applied on",
    "dashboard.inst_type": "Institution Type",
    "dashboard.last_update": "Last Update",
    "dashboard.in_review": "In Review",
    "dashboard.no_apps": "No applications yet",
    "dashboard.no_apps_desc": "You haven't submitted any applications yet. Browse our institutions and start your journey today.",
    "dashboard.browse_btn": "Browse Institutions",
    "status.pending": "Pending",
    "status.approved": "Approved",
    "status.rejected": "Rejected",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem("language") as Language) || "ar";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      <div dir={dir}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
