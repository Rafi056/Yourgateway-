import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";
import { CheckCircle2, Target, Star, MessageCircle } from "lucide-react";

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }) };

export default function AboutUs() {
  const { dir, language } = useLanguage();

  const services = language === "ar"
    ? ["التسجيل في معاهد اللغة الإنجليزية","التقديم على الجامعات الماليزية","الاستشارات التعليمية","المساعدة في إجراءات القبول","الإرشاد قبل السفر وبعد الوصول","دعم الطلاب خلال رحلتهم الدراسية"]
    : ["Registration in English Language Institutes","Applying to Malaysian Universities","Educational Consultations","Assistance with Admission Procedures","Pre-travel and Post-arrival Guidance","Student Support Throughout Their Journey"];

  const reasons = language === "ar"
    ? ["شركة سعودية موثقة بسجل تجاري","خبرة ومعرفة بالحياة والدراسة في ماليزيا","متابعة مباشرة مع الطالب","وضوح وشفافية في الإجراءات","دعم مستمر قبل وبعد الوصول"]
    : ["Saudi company registered with a commercial register","Experience and knowledge of life and study in Malaysia","Direct follow-up with the student","Clarity and transparency in procedures","Continuous support before and after arrival"];

  return (
    <div className={`min-h-screen bg-background ${dir === "rtl" ? "text-right" : "text-left"}`} dir={dir}>

      {/* Hero */}
      <section className="relative py-24 bg-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/80 via-primary to-foreground/90 pointer-events-none" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-secondary font-bold text-sm uppercase tracking-widest mb-3"
          >
            {language === "ar" ? "تعرّف علينا" : "Get to Know Us"}
          </motion.p>
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="font-serif text-5xl md:text-6xl font-black mb-6 leading-tight"
          >
            {language === "ar" ? "من نحن" : "About Us"}
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed"
          >
            {language === "ar"
              ? "شركة سعودية مرخصة أسسها شباب عاشوا تجربة الدراسة في ماليزيا"
              : "A licensed Saudi company founded by youth who lived the study experience in Malaysia"}
          </motion.p>
        </div>
      </section>

      {/* About text */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-muted-foreground leading-loose text-[1.05rem]"
          >
            <p>
              {language === "ar"
                ? "نحن شركة سعودية مرخصة ومُوثقة بسجل تجاري سعودي، أسسناها كشباب لديهم خبرة وتجربة حقيقية في الدراسة والحياة في ماليزيا. هدفنا هو تسهيل رحلة الطلاب الراغبين بالدراسة في ماليزيا، بدايةً من اختيار معهد اللغة الإنجليزية أو الجامعة المناسبة وحتى الاستقرار والبدء بالحياة الدراسية بكل راحة ووضوح."
                : "We are a licensed Saudi company registered with a Saudi commercial register, founded by young people with real experience studying and living in Malaysia. Our goal is to facilitate the journey of students wishing to study in Malaysia, from choosing the right English language institute or university to settling in and starting academic life with full comfort and clarity."}
            </p>
            <p>
              {language === "ar"
                ? "نؤمن أن الدراسة بالخارج تحتاج إلى جهة موثوقة تفهم احتياجات الطالب وتساعده بخطوات واضحة بعيدًا عن التعقيد أو المعلومات المشتتة، لذلك نقدم خدماتنا بطريقة احترافية وشفافة تناسب الطلاب وأولياء الأمور."
                : "We believe that studying abroad requires a trusted party that understands the student's needs and helps them with clear steps, away from complexity or scattered information. Therefore, we provide our services in a professional and transparent manner that suits students and parents alike."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className={`flex items-center gap-3 mb-10 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-serif text-3xl font-bold">
                {language === "ar" ? "خدماتنا" : "Our Services"}
              </h2>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {services.map((s, i) => (
              <motion.div
                key={s} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4 ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}
              >
                <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <span className="font-medium">{s}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className={`flex items-center gap-3 mb-6 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-secondary" />
              </div>
              <h2 className="font-serif text-3xl font-bold">
                {language === "ar" ? "رؤيتنا" : "Our Vision"}
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {language === "ar"
                ? "أن نكون من الجهات السعودية الموثوقة في تقديم الخدمات التعليمية للطلاب الراغبين بالدراسة في ماليزيا، مع التركيز على المصداقية وجودة الخدمة وتجربة الطالب."
                : "To be one of the trusted Saudi entities in providing educational services for students wishing to study in Malaysia, with a focus on credibility, service quality, and the student experience."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why us */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="font-serif text-3xl font-bold mb-10">
              {language === "ar" ? "لماذا نحن؟" : "Why Us?"}
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reasons.map((r, i) => (
              <motion.div
                key={r} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`flex items-start gap-3 bg-card border border-border rounded-xl px-5 py-4 ${dir === "rtl" ? "flex-row-reverse text-right" : ""}`}
              >
                <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="font-medium">{r}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6 max-w-2xl">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="font-serif text-4xl font-black mb-4"
          >
            {language === "ar" ? "رحلتك الدراسية تبدأ بخطوة صحيحة" : "Your Study Journey Starts with the Right Step"}
          </motion.h2>
          <motion.p
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="text-white/80 text-lg mb-8"
          >
            {language === "ar"
              ? "ونحن هنا لنساعدك في كل مرحلة"
              : "And we are here to help you at every stage"}
          </motion.p>
          <motion.a
            href="https://wa.me/966562022668"
            target="_blank" rel="noopener noreferrer"
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}
            className={`inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#20b958] text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all ${dir === "rtl" ? "flex-row-reverse" : ""}`}
          >
            <MessageCircle className="w-5 h-5" />
            {language === "ar" ? "تواصل معنا الآن" : "Contact Us Now"}
          </motion.a>
        </div>
      </section>

    </div>
  );
}
