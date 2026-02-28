import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Building2, BookA, Globe, CheckCircle2, MessageCircle, Phone, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";

export default function Home() {
  const { t, dir } = useLanguage();

  return (
    <div className={`min-h-screen flex flex-col ${dir === "rtl" ? "text-right" : "text-left"}`}>
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        {/* Background Image & Wash */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=2000" 
            alt="Kuala Lumpur" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className={`max-w-3xl ${dir === "rtl" ? "mr-auto" : "ml-auto"}`}>
            <motion.div
              initial={{ opacity: 0, x: dir === "rtl" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-6 backdrop-blur-sm ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">{t("home.hero_badge")}</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
                {t("home.hero_title")} <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">
                  {t("home.hero_subtitle")}
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-10 leading-relaxed">
                {t("home.hero_desc")}
              </p>
              
              <div className={`flex flex-wrap gap-4 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
                <a href="https://wa.me/966562022668" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-8 py-6 text-lg font-bold bg-[#25D366] hover:bg-[#128C7E] border-none shadow-xl">
                    <MessageCircle className={`${dir === "rtl" ? "ml-2" : "mr-2"} h-6 w-6`} /> {t("home.whatsapp_btn")}
                  </Button>
                </a>
                <a href="https://direct.me/gatemalay" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="rounded-full px-8 py-6 text-lg font-bold text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20">
                    {t("home.social_btn")}
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">{t("home.services_title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("home.services_subtitle")}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: t("home.service1_title"), desc: t("home.service1_desc") },
              { title: t("home.service2_title"), desc: t("home.service2_desc") },
              { title: t("home.service3_title"), desc: t("home.service3_desc") },
              { title: t("home.service4_title"), desc: t("home.service4_desc") },
              { title: t("home.service5_title"), desc: t("home.service5_desc") },
              { title: t("home.service6_title"), desc: t("home.service6_desc") }
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-3xl border border-border shadow-sm text-center"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PATHWAYS SECTION */}
      <section className="py-20 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* University Pathway */}
            <motion.div 
              initial={{ opacity: 0, x: dir === "rtl" ? 30 : -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/institutions?type=university" className="block group h-full">
                <div className="h-full bg-card rounded-3xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-primary/30 transition-all duration-500 relative">
                  <div className={`bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300 ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
                    <Building2 className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4">{t("home.pathway_uni_title")}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {t("home.pathway_uni_desc")}
                  </p>
                  <div className={`flex items-center text-primary font-semibold transition-transform duration-300 ${dir === "rtl" ? "group-hover:-translate-x-2 justify-end" : "group-hover:translate-x-2 justify-start"}`}>
                    {t("home.pathway_uni_link")} {dir === "rtl" ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Language Center Pathway */}
            <motion.div 
              initial={{ opacity: 0, x: dir === "rtl" ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link href="/institutions?type=language_center" className="block group h-full">
                <div className={`h-full bg-card rounded-3xl p-8 border border-border shadow-xl hover:shadow-2xl hover:border-secondary/30 transition-all duration-500 relative ${dir === "rtl" ? "text-right" : "text-left"}`}>
                  <div className={`bg-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-300 ${dir === "rtl" ? "mr-0 ml-auto" : "ml-0 mr-auto"}`}>
                    <BookA className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  <h2 className="font-serif text-3xl font-bold mb-4">{t("home.pathway_lang_title")}</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    {t("home.pathway_lang_desc")}
                  </p>
                  <div className={`flex items-center text-secondary-foreground font-semibold transition-transform duration-300 ${dir === "rtl" ? "group-hover:-translate-x-2 justify-end" : "group-hover:translate-x-2 justify-start"}`}>
                    {t("home.pathway_lang_link")} {dir === "rtl" ? <ArrowLeft className="mr-2 w-5 h-5" /> : <ArrowRight className="ml-2 w-5 h-5" />}
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section className="py-20 bg-primary text-white text-center">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-4xl font-bold mb-8 font-serif">{t("home.contact_title")}</h2>
          <div className="flex flex-col items-center gap-6">
            <div className={`flex items-center gap-4 text-2xl font-bold ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
              <Phone className="h-8 w-8 text-secondary" />
              <div className="flex flex-col gap-1">
                <span>+60 11-2908 2602</span>
                <span>+966 56 202 2668</span>
              </div>
            </div>
            <div className="flex gap-6 mt-8">
              <a href="https://wa.me/966562022668" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <MessageCircle className="h-10 w-10 text-secondary" />
              </a>
              <a href="https://direct.me/gatemalay" target="_blank" rel="noopener noreferrer" className="hover:scale-110 transition-transform">
                <Instagram className="h-10 w-10 text-secondary" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
