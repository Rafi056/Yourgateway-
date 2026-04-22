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

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "١. القبول بالشروط" : "1. Acceptance of Terms"}</h3>
              <p>
                {ar
                  ? "باستخدامك لموقع Gateway Services أو خدماتنا، فأنت توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا."
                  : "By using Gateway Services website or our services, you agree to be bound by these terms and conditions. If you do not agree to any part of these terms, please do not use our services."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٢. وصف الخدمة" : "2. Service Description"}</h3>
              <p>
                {ar
                  ? "تقدم Gateway Services خدمات التوجيه التعليمي للطلاب الراغبين في الدراسة في ماليزيا، بما في ذلك التسجيل في الجامعات ومعاهد اللغة الإنجليزية، وخدمات الاستقبال والدعم اللوجستي."
                  : "Gateway Services provides educational guidance services for students wishing to study in Malaysia, including registration at universities and English language institutes, as well as reception and logistical support services."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٣. الباقات والأسعار" : "3. Packages & Pricing"}</h3>
              <p>
                {ar
                  ? "جميع الأسعار المذكورة بالرينجيت الماليزي (MYR). الأسعار المعروضة بالريال السعودي هي أسعار تقريبية تخضع لتغييرات سعر الصرف. تحتفظ الشركة بحق تعديل الأسعار دون إشعار مسبق مع الحفاظ على حقوق العملاء الذين أتموا عمليات الشراء."
                  : "All prices are listed in Malaysian Ringgit (MYR). Prices shown in Saudi Riyal are approximate and subject to exchange rate changes. The company reserves the right to modify prices without prior notice while preserving the rights of customers who have completed purchases."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٤. التزامات العميل" : "4. Client Obligations"}</h3>
              <ul className={`space-y-2 ${dir === "rtl" ? "pr-4" : "pl-4"}`}>
                <li className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="text-primary mt-1">•</span>
                  <span>{ar ? "تقديم معلومات صحيحة ودقيقة عند التسجيل" : "Provide accurate and correct information when registering"}</span>
                </li>
                <li className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="text-primary mt-1">•</span>
                  <span>{ar ? "الالتزام بمتطلبات الجهات التعليمية والسلطات الماليزية" : "Comply with the requirements of educational institutions and Malaysian authorities"}</span>
                </li>
                <li className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="text-primary mt-1">•</span>
                  <span>{ar ? "إبلاغ الشركة فوراً عن أي تغييرات في المعلومات الشخصية" : "Immediately notify the company of any changes in personal information"}</span>
                </li>
                <li className={`flex items-start gap-2 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                  <span className="text-primary mt-1">•</span>
                  <span>{ar ? "إتمام الدفع كاملاً قبل بدء تقديم الخدمة" : "Complete payment in full before service delivery begins"}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٥. حدود المسؤولية" : "5. Limitation of Liability"}</h3>
              <p>
                {ar
                  ? "تسعى Gateway Services لتقديم أفضل الخدمات، غير أنها لا تتحمل المسؤولية عن قرارات القبول النهائية من قِبل الجامعات أو المعاهد، أو أي تغييرات في سياسات الجهات التعليمية، أو ظروف خارجة عن إرادتها."
                  : "Gateway Services strives to provide the best services, however it is not responsible for final admission decisions by universities or institutes, any changes in educational institution policies, or circumstances beyond its control."}
              </p>
            </div>

            <div>
              <h3 className="font-bold text-foreground mb-2">{ar ? "٦. طرق الدفع" : "6. Payment Methods"}</h3>
              <p className="mb-3">
                {ar ? "نقبل طرق الدفع التالية:" : "We accept the following payment methods:"}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-muted rounded-2xl p-4 text-center border border-border">
                  <div className="w-8 h-8 rounded-xl bg-[#3FCEA0]/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-[#3FCEA0] font-bold text-sm">T</span>
                  </div>
                  <p className="font-bold text-foreground text-sm">Tabby</p>
                  <p className="text-xs text-muted-foreground">{ar ? "4 أقساط بدون فوائد" : "4 interest-free installments"}</p>
                </div>
                <div className="bg-muted rounded-2xl p-4 text-center border border-border">
                  <div className="w-8 h-8 rounded-xl bg-[#F5A623]/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-[#F5A623] font-bold text-sm">T</span>
                  </div>
                  <p className="font-bold text-foreground text-sm">Tamara</p>
                  <p className="text-xs text-muted-foreground">{ar ? "3 أقساط بدون فوائد" : "3 interest-free installments"}</p>
                </div>
                <div className="bg-muted rounded-2xl p-4 text-center border border-border">
                  <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-2">
                    <span className="text-primary font-bold text-sm">B</span>
                  </div>
                  <p className="font-bold text-foreground text-sm">{ar ? "تحويل بنكي" : "Bank Transfer"}</p>
                  <p className="text-xs text-muted-foreground">{ar ? "دفعة واحدة كاملة" : "Full payment"}</p>
                </div>
              </div>
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
