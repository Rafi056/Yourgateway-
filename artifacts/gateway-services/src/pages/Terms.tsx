import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, FileText, AlertCircle, Scale, Wrench, CreditCard, PenLine } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

const TERMS_SECTIONS_AR = [
  {
    icon: Wrench,
    number: "١",
    title: "طبيعة الخدمة",
    content: "نقدم خدمات مساعدة للطلاب تشمل:",
    bullets: [
      "القبول في المعاهد أو الجامعات في ماليزيا",
      "ترتيبات السكن",
      "الاستقبال من المطار",
      "توفير معلومات وخدمات مساندة للطالب",
    ],
  },
  {
    icon: FileText,
    number: "٢",
    title: "استخدام الخدمة",
    content: "الخدمة مخصصة للطلاب الراغبين بالدراسة في ماليزيا، ويجب تقديم معلومات صحيحة عند التسجيل.",
    bullets: [],
  },
  {
    icon: Scale,
    number: "٣",
    title: "المسؤولية",
    content: "نحن نعمل كوسيط ومقدم خدمة تنسيق، ولا نتحمل مسؤولية رفض الطلب من الجهة التعليمية إذا كان بسبب شروط الجهة نفسها.",
    bullets: [],
  },
  {
    icon: CreditCard,
    number: "٤",
    title: "الدفع (إن وجد مستقبلاً)",
    content: "في حال وجود رسوم خدمة أو باقات مدفوعة، يتم توضيحها قبل إتمام الطلب.",
    bullets: [],
  },
  {
    icon: PenLine,
    number: "٥",
    title: "التعديلات",
    content: "نحتفظ بحق تعديل الشروط في أي وقت دون إشعار مسبق.",
    bullets: [],
  },
];

const TERMS_SECTIONS_EN = [
  {
    icon: Wrench,
    number: "1",
    title: "Nature of Service",
    content: "We provide student assistance services including:",
    bullets: [
      "Admission to institutes or universities in Malaysia",
      "Accommodation arrangements",
      "Airport reception",
      "Providing information and student support services",
    ],
  },
  {
    icon: FileText,
    number: "2",
    title: "Use of Service",
    content: "The service is intended for students wishing to study in Malaysia, and accurate information must be provided upon registration.",
    bullets: [],
  },
  {
    icon: Scale,
    number: "3",
    title: "Liability",
    content: "We operate as an intermediary and coordination service provider. We are not responsible for application rejections by the educational institution if they result from the institution's own requirements.",
    bullets: [],
  },
  {
    icon: CreditCard,
    number: "4",
    title: "Payment (If Applicable in the Future)",
    content: "If there are service fees or paid packages, they will be clarified before completing the request.",
    bullets: [],
  },
  {
    icon: PenLine,
    number: "5",
    title: "Amendments",
    content: "We reserve the right to modify these terms at any time without prior notice.",
    bullets: [],
  },
];

export default function Terms() {
  const { language, dir } = useLanguage();
  const [location] = useLocation();
  const ar = language === "ar";
  const rtl = dir === "rtl";

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const sections = ar ? TERMS_SECTIONS_AR : TERMS_SECTIONS_EN;

  return (
    <div dir={dir} className="min-h-screen bg-muted/30 pb-24">

      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-secondary" />
            </div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {ar ? "الشروط والأحكام" : "Terms & Conditions"}
            </h1>
          </div>
          <p className="text-white/80 text-lg mt-4 max-w-2xl">
            {ar
              ? "باستخدامك لهذا الموقع أو طلبك لأي من خدماتنا، فإنك توافق على الشروط التالية."
              : "By using this website or requesting any of our services, you agree to the following terms."}
          </p>
          <p className="text-white/50 text-sm mt-3">
            {ar ? "آخر تحديث: أبريل 2025" : "Last updated: April 2025"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-4xl space-y-6">

        {/* Terms of Use Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden"
        >
          {/* Card Header */}
          <div className="bg-primary/5 border-b border-border px-8 py-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {ar ? "شروط الاستخدام" : "Terms of Service"}
            </h2>
          </div>

          {/* Sections */}
          <div className="divide-y divide-border">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: rtl ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                  className="px-8 py-6 flex gap-5 items-start"
                >
                  {/* Number badge */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-base mt-0.5 shadow-sm">
                    {sec.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="w-4 h-4 text-primary/70 flex-shrink-0" />
                      <h3 className="font-bold text-foreground text-base">{sec.title}</h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      {sec.content}
                    </p>
                    {sec.bullets.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {sec.bullets.map((b, bi) => (
                          <li key={bi} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Refund Policy */}
        <motion.section
          id="refund"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden scroll-mt-24"
        >
          <div className="bg-secondary/10 border-b border-border px-8 py-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-foreground/70" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {ar ? "سياسة الاسترجاع" : "Refund Policy"}
            </h2>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Notice */}
            <div className="flex gap-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                {ar
                  ? "لضمان حقوقك، يُنصح بالتواصل مع فريقنا عبر الواتساب قبل إتمام أي عملية شراء للاستفسار عن كافة التفاصيل."
                  : "To ensure your rights, we recommend contacting our team via WhatsApp before completing any purchase."}
              </p>
            </div>

            {/* Full refund */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 font-bold text-sm flex-shrink-0">✓</span>
                <h3 className="font-bold text-foreground">{ar ? "حالات الاسترجاع الكامل" : "Full Refund Cases"}</h3>
              </div>
              <ul className="space-y-2.5 pr-9">
                {(ar ? [
                  "إذا لم تتمكن الشركة من توفير الخدمة المتفق عليها",
                  "رفض التأشيرة الطلابية بسبب خطأ من جانب الشركة",
                  "إلغاء الطلب خلال 48 ساعة من تاريخ الدفع وقبل بدء تقديم الخدمات",
                ] : [
                  "If the company is unable to provide the agreed service",
                  "Visa rejection due to an error on the company's part",
                  "Cancellation within 48 hours of payment and before service delivery begins",
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border" />

            {/* Partial refund */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 font-bold text-sm flex-shrink-0">◑</span>
                <h3 className="font-bold text-foreground">{ar ? "حالات الاسترجاع الجزئي" : "Partial Refund Cases"}</h3>
              </div>
              <ul className="space-y-2.5 pr-9">
                {(ar ? [
                  "إلغاء الطلب بعد 48 ساعة وقبل مرور 7 أيام من بدء الخدمة (يُسترجع 50%)",
                  "عدم الاستفادة من بعض الخدمات لأسباب خارجة عن إرادة الطرفين",
                ] : [
                  "Cancellation after 48 hours and before 7 days from service start (50% refund)",
                  "If some services are not utilized due to circumstances beyond either party's control",
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border" />

            {/* No refund */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-7 h-7 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 font-bold text-sm flex-shrink-0">✗</span>
                <h3 className="font-bold text-foreground">{ar ? "حالات عدم الاسترجاع" : "Non-Refundable Cases"}</h3>
              </div>
              <ul className="space-y-2.5 pr-9">
                {(ar ? [
                  "بعد بدء تقديم الخدمة والاستفادة منها فعلياً",
                  "رفض التأشيرة بسبب سجل العميل أو معلوماته غير الصحيحة",
                  "تغيير رأي العميل بعد مرور أكثر من 7 أيام على بدء الخدمة",
                  "رسوم التسجيل في المعاهد التعليمية (تُدفع مباشرة للمعهد)",
                ] : [
                  "After service delivery has started and been utilized",
                  "Visa rejection due to the client's incorrect information or record",
                  "Client's change of mind after more than 7 days from service start",
                  "Registration fees at educational institutions (paid directly to the institution)",
                ]).map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border" />

            {/* How to request */}
            <div className="bg-muted/50 rounded-2xl p-5">
              <h3 className="font-bold text-foreground mb-2">
                {ar ? "كيفية طلب الاسترجاع" : "How to Request a Refund"}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {ar
                  ? "تواصل مع فريقنا عبر الواتساب على الرقم +966 56 202 2668 مع ذكر رقم الطلب وسبب طلب الاسترجاع. سيتم معالجة الطلب خلال 5-7 أيام عمل."
                  : "Contact our team via WhatsApp at +966 56 202 2668 with your order number and reason for the refund. Requests will be processed within 5-7 business days."}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Privacy Policy */}
        <motion.section
          id="privacy"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden scroll-mt-24"
        >
          <div className="bg-primary/5 border-b border-border px-8 py-5 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              {ar ? "سياسة الخصوصية" : "Privacy Policy"}
            </h2>
          </div>
          <div className="px-8 py-6 space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              {ar
                ? "تلتزم Gateway Services بحماية خصوصية عملائها. يتم جمع المعلومات الشخصية لأغراض تقديم الخدمات فقط، ولن يتم مشاركتها مع أطراف ثالثة إلا بموافقة العميل أو عند الضرورة لإتمام الخدمة (مثل الجهات التعليمية والسلطات الماليزية)."
                : "Gateway Services is committed to protecting our clients' privacy. Personal information is collected solely for service delivery purposes and will not be shared with third parties except with client consent or when necessary to complete the service."}
            </p>
            <p>
              {ar
                ? "يحق لك طلب الاطلاع على بياناتك الشخصية أو تعديلها أو حذفها في أي وقت عبر التواصل معنا."
                : "You have the right to request access to, modification of, or deletion of your personal data at any time by contacting us."}
            </p>
          </div>
        </motion.section>

        {/* Footer note */}
        <p className="text-center text-xs text-muted-foreground pb-4">
          {ar
            ? "للاستفسار عن أي بند من هذه الشروط، تواصل معنا عبر الواتساب على +966 56 202 2668"
            : "For inquiries about any clause, contact us via WhatsApp at +966 56 202 2668"}
        </p>
      </div>
    </div>
  );
}
