import { useLanguage } from "@/lib/i18n";
import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, FileText, AlertCircle } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Terms() {
  const { language, dir } = useLanguage();
  const [location] = useLocation();

  useEffect(() => {
    if (window.location.hash === "#refund") {
      setTimeout(() => {
        const el = document.getElementById("refund");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const ar = language === "ar";

  return (
    <div className={`min-h-screen bg-muted/30 pb-20 ${dir === "rtl" ? "text-right" : "text-left"}`}>
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className={`flex items-center gap-3 mb-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <FileText className="w-8 h-8 text-secondary" />
            <h1 className="font-serif text-4xl md:text-5xl font-bold">
              {ar ? "الشروط والأحكام" : "Terms & Conditions"}
            </h1>
          </div>
          <p className="text-white/80 max-w-2xl text-lg">
            {ar
              ? "يرجى قراءة هذه الشروط والأحكام بعناية قبل استخدام خدماتنا أو إتمام أي عملية شراء."
              : "Please read these terms and conditions carefully before using our services or making any purchase."}
          </p>
          <p className="text-white/60 text-sm mt-2">
            {ar ? "آخر تحديث: أبريل 2025" : "Last updated: April 2025"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 mt-12 max-w-4xl space-y-10">

        {/* Terms of Service */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm"
        >
          <div className={`flex items-center gap-3 mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold">
              {ar ? "شروط الاستخدام" : "Terms of Service"}
            </h2>
          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {ar
              ? "باستخدامك لهذا الموقع أو طلبك لأي من خدماتنا، فإنك توافق على الشروط التالية:"
              : "By using this website or requesting any of our services, you agree to the following terms:"}
          </p>

          <div className="space-y-5 text-muted-foreground leading-relaxed">
            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "١. طبيعة الخدمة" : "1. Nature of Service"}</h3>
              <p className="mb-2">{ar ? "نقدم خدمات مساعدة للطلاب تشمل:" : "We provide student assistance services including:"}</p>
              <ul className="space-y-1.5">
                {(ar ? [
                  "القبول في المعاهد أو الجامعات في ماليزيا",
                  "ترتيبات السكن",
                  "الاستقبال من المطار",
                  "توفير معلومات وخدمات مساندة للطالب",
                ] : [
                  "Admission to institutes or universities in Malaysia",
                  "Accommodation arrangements",
                  "Airport reception",
                  "Providing information and student support services",
                ]).map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <span className="text-primary mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٢. استخدام الخدمة" : "2. Use of Service"}</h3>
              <p>
                {ar
                  ? "الخدمة مخصصة للطلاب الراغبين بالدراسة في ماليزيا، ويجب تقديم معلومات صحيحة عند التسجيل."
                  : "The service is intended for students wishing to study in Malaysia, and accurate information must be provided upon registration."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٣. المسؤولية" : "3. Liability"}</h3>
              <p>
                {ar
                  ? "نحن نعمل كوسيط ومقدم خدمة تنسيق، ولا نتحمل مسؤولية رفض الطلب من الجهة التعليمية إذا كان بسبب شروط الجهة نفسها."
                  : "We operate as an intermediary and coordination service provider. We are not responsible for application rejections by the educational institution if they result from the institution's own requirements."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٤. الدفع (إن وجد مستقبلاً)" : "4. Payment (If Applicable in the Future)"}</h3>
              <p>
                {ar
                  ? "في حال وجود رسوم خدمة أو باقات مدفوعة، يتم توضيحها قبل إتمام الطلب."
                  : "If there are service fees or paid packages, they will be clarified before completing the request."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٥. التعديلات" : "5. Amendments"}</h3>
              <p>
                {ar
                  ? "نحتفظ بحق تعديل الشروط في أي وقت دون إشعار مسبق."
                  : "We reserve the right to modify these terms at any time without prior notice."}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Refund Policy */}
        <motion.section
          id="refund"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm scroll-mt-24"
        >
          <div className={`flex items-center gap-3 mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h2 className="font-serif text-2xl font-bold">
              {ar ? "سياسة الاسترجاع" : "Refund Policy"}
            </h2>
          </div>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {ar
                  ? "لضمان حقوقك، يُنصح بالتواصل مع فريقنا عبر الواتساب قبل إتمام أي عملية شراء للاستفسار عن كافة التفاصيل."
                  : "To ensure your rights, we recommend contacting our team via WhatsApp before completing any purchase to inquire about all details."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">{ar ? "حالات استحقاق الاسترجاع الكامل" : "Full Refund Eligibility"}</h3>
              <ul className="space-y-2">
                {[
                  ar ? "إذا لم تتمكن الشركة من توفير الخدمة المتفق عليها" : "If the company is unable to provide the agreed service",
                  ar ? "في حال رفض طلب التأشيرة الطلابية بسبب خطأ من جانب الشركة" : "If the student visa is rejected due to an error on the company's part",
                  ar ? "إلغاء الطلب خلال 48 ساعة من تاريخ الدفع وقبل بدء تقديم الخدمات" : "Cancellation within 48 hours of payment date and before service delivery begins",
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <span className="text-green-500 mt-1 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">{ar ? "حالات الاسترجاع الجزئي" : "Partial Refund Cases"}</h3>
              <ul className="space-y-2">
                {[
                  ar ? "إلغاء الطلب بعد 48 ساعة وقبل مرور 7 أيام من بدء الخدمة (يُسترجع 50%)" : "Cancellation after 48 hours and before 7 days from service start (50% refund)",
                  ar ? "في حالة عدم الاستفادة من بعض الخدمات المشمولة في الباقة لأسباب خارجة عن إرادة الطرفين" : "If some services included in the package are not utilized due to circumstances beyond either party's control",
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <span className="text-yellow-500 mt-1 font-bold">◐</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-3">{ar ? "حالات عدم استحقاق الاسترجاع" : "Non-Refundable Cases"}</h3>
              <ul className="space-y-2">
                {[
                  ar ? "بعد بدء تقديم الخدمة والاستفادة منها فعلياً" : "After service delivery has started and been utilized",
                  ar ? "رفض التأشيرة بسبب سجل العميل أو معلوماته غير الصحيحة" : "Visa rejection due to the client's record or incorrect information",
                  ar ? "تغيير رأي العميل بعد مرور أكثر من 7 أيام على بدء الخدمة" : "Client's change of mind after more than 7 days from service start",
                  ar ? "رسوم التسجيل في المعاهد التعليمية (تُدفع مباشرة للمعهد)" : "Registration fees at educational institutions (paid directly to the institution)",
                ].map((item, i) => (
                  <li key={i} className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                    <span className="text-red-500 mt-1 font-bold">✗</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "كيفية طلب الاسترجاع" : "How to Request a Refund"}</h3>
              <p>
                {ar
                  ? "لطلب الاسترجاع، يرجى التواصل مع فريقنا عبر الواتساب على الرقم +966 56 202 2668 مع ذكر رقم الطلب وسبب طلب الاسترجاع. سيتم معالجة الطلب خلال 5-7 أيام عمل."
                  : "To request a refund, please contact our team via WhatsApp at +966 56 202 2668 with your order number and reason for the refund request. Requests will be processed within 5-7 business days."}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Privacy Policy */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-3xl border border-border p-8 shadow-sm"
        >
          <div className={`flex items-center gap-3 mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <h2 className="font-serif text-2xl font-bold">
              {ar ? "سياسة الخصوصية" : "Privacy Policy"}
            </h2>
          </div>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              {ar
                ? "تلتزم Gateway Services بحماية خصوصية عملائها. يتم جمع المعلومات الشخصية لأغراض تقديم الخدمات فقط، ولن يتم مشاركتها مع أطراف ثالثة إلا بموافقة العميل أو عند الضرورة لإتمام الخدمة (مثل الجهات التعليمية والسلطات الماليزية)."
                : "Gateway Services is committed to protecting our clients' privacy. Personal information is collected solely for service delivery purposes and will not be shared with third parties except with client consent or when necessary to complete the service (such as educational institutions and Malaysian authorities)."}
            </p>
            <p>
              {ar
                ? "يحق لك طلب الاطلاع على بياناتك الشخصية أو تعديلها أو حذفها في أي وقت عبر التواصل معنا."
                : "You have the right to request access to, modification of, or deletion of your personal data at any time by contacting us."}
            </p>
          </div>
        </motion.section>

        <p className="text-center text-xs text-muted-foreground pb-4">
          {ar
            ? "للاستفسار عن أي بند من هذه الشروط، تواصل معنا عبر الواتساب على +966 56 202 2668"
            : "For inquiries about any clause in these terms, contact us via WhatsApp at +966 56 202 2668"}
        </p>
      </div>
    </div>
  );
}
