import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<Language, Record<string, string>> = {
  ar: {
    "tab.home": "الرئيسية",
    "tab.institutions": "المؤسسات",
    "tab.packages": "الباقات",
    "tab.contact": "تواصل",
    "home.badge": "مستقبلك العالمي يبدأ هنا",
    "home.title": "بوابتك إلى ماليزيا",
    "home.subtitle": "نحن مكرسون لدعم الطلاب الراغبين في متابعة دراستهم في ماليزيا. سواء كنت تبحث عن التسجيل في أفضل معاهد اللغة الإنجليزية أو الانضمام إلى الجامعات الرائدة، نحن هنا لإرشادك.",
    "home.whatsapp": "تواصل عبر واتساب",
    "home.services_title": "ماذا نقدم لك؟",
    "home.service1_title": "الاستقبال من المطار",
    "home.service1_desc": "نستقبلك فور وصولك لضمان راحتك وأمانك.",
    "home.service2_title": "شريحة الاتصال والمواصلات",
    "home.service2_desc": "نساعدك في الحصول على بطاقة SIM وبطاقة النقل العام.",
    "home.service3_title": "الفحص الطبي والوثائق",
    "home.service3_desc": "دعم كامل في إجراءات الفحص الطبي وتجهيز الوثائق المطلوبة.",
    "home.service4_title": "التوجيه الأكاديمي",
    "home.service4_desc": "استشارات أكاديمية لاختيار التخصص والجامعة الأنسب.",
    "home.service5_title": "متابعة مستمرة",
    "home.service5_desc": "نحن معك من لحظة الوصول وحتى يوم التخرج.",
    "home.service6_title": "سكن مؤقت",
    "home.service6_desc": "سكن مريح لليلة الأولى في فندق عند وصولك.",
    "inst.title": "المؤسسات التعليمية",
    "inst.subtitle": "أفضل الجامعات ومعاهد اللغة في ماليزيا",
    "inst.all": "الكل",
    "inst.universities": "الجامعات",
    "inst.language_centers": "معاهد اللغة",
    "inst.loading": "جاري التحميل...",
    "inst.error": "تعذّر التحميل. حاول مجدداً.",
    "inst.empty": "لا توجد مؤسسات",
    "inst.inquire": "استفسر عبر واتساب",
    "pkg.title": "باقات الدراسة",
    "pkg.subtitle": "اختر الباقة الأنسب لك",
    "pkg.duration": "المدة",
    "pkg.price": "السعر",
    "pkg.original_price": "السعر الأصلي",
    "pkg.features": "ما يشمله الباقة",
    "pkg.inquire": "استفسر عبر واتساب",
    "pkg.loading": "جاري التحميل...",
    "pkg.error": "تعذّر التحميل.",
    "pkg.myr": "رنجت ماليزي",
    "contact.title": "تواصل معنا",
    "contact.subtitle": "فريقنا جاهز للإجابة على استفساراتك",
    "contact.saudi": "المملكة العربية السعودية",
    "contact.malaysia": "ماليزيا",
    "contact.whatsapp_sa": "واتساب السعودية",
    "contact.whatsapp_my": "واتساب ماليزيا",
    "contact.follow": "تابعنا",
    "contact.tiktok": "تيك توك",
    "contact.instagram": "إنستغرام",
  },
  en: {
    "tab.home": "Home",
    "tab.institutions": "Institutions",
    "tab.packages": "Packages",
    "tab.contact": "Contact",
    "home.badge": "Your Global Future Awaits",
    "home.title": "Your Gateway to Malaysia",
    "home.subtitle": "We are dedicated to supporting students who wish to pursue their studies in Malaysia. Whether you are looking to enroll in top English language institutes or join leading universities, we are here to guide you.",
    "home.whatsapp": "Chat on WhatsApp",
    "home.services_title": "What We Offer",
    "home.service1_title": "Airport Pickup",
    "home.service1_desc": "We pick you up upon arrival to ensure your comfort and safety.",
    "home.service2_title": "SIM Card & Transport",
    "home.service2_desc": "We help you get a SIM card and public transport card.",
    "home.service3_title": "Medical & Documents",
    "home.service3_desc": "Full support in medical check-up and preparing required documents.",
    "home.service4_title": "Academic Guidance",
    "home.service4_desc": "Academic consultations to choose the right major and university.",
    "home.service5_title": "Continuous Support",
    "home.service5_desc": "We are with you from arrival until graduation day.",
    "home.service6_title": "Temporary Accommodation",
    "home.service6_desc": "Comfortable hotel accommodation for your first night upon arrival.",
    "inst.title": "Educational Institutions",
    "inst.subtitle": "Top universities and language centers in Malaysia",
    "inst.all": "All",
    "inst.universities": "Universities",
    "inst.language_centers": "Language Centers",
    "inst.loading": "Loading...",
    "inst.error": "Failed to load. Please try again.",
    "inst.empty": "No institutions found",
    "inst.inquire": "Inquire via WhatsApp",
    "pkg.title": "Study Packages",
    "pkg.subtitle": "Choose the package that suits you",
    "pkg.duration": "Duration",
    "pkg.price": "Price",
    "pkg.original_price": "Original Price",
    "pkg.features": "Package Includes",
    "pkg.inquire": "Inquire via WhatsApp",
    "pkg.loading": "Loading...",
    "pkg.error": "Failed to load.",
    "pkg.myr": "MYR",
    "contact.title": "Contact Us",
    "contact.subtitle": "Our team is ready to answer your questions",
    "contact.saudi": "Saudi Arabia",
    "contact.malaysia": "Malaysia",
    "contact.whatsapp_sa": "WhatsApp KSA",
    "contact.whatsapp_my": "WhatsApp Malaysia",
    "contact.follow": "Follow Us",
    "contact.tiktok": "TikTok",
    "contact.instagram": "Instagram",
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {},
  t: (key) => key,
  isRTL: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("ar");

  useEffect(() => {
    AsyncStorage.getItem("language").then((saved) => {
      if (saved === "ar" || saved === "en") setLanguageState(saved);
    });
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem("language", lang);
  };

  const t = (key: string) => translations[language][key] ?? key;
  const isRTL = language === "ar";

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
