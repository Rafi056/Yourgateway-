import { Link } from "wouter";
import { ArrowRight, Building2, BookA, Globe, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden">
        {/* Background Image & Wash */}
        <div className="absolute inset-0 z-0">
          {/* landing page hero scenic malaysia kuala lumpur petronas towers */}
          <img 
            src="https://images.unsplash.com/photo-1546412414-8035e1776c9a?auto=format&fit=crop&q=80&w=2000" 
            alt="Kuala Lumpur" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 border border-secondary/30 text-secondary mb-6 backdrop-blur-sm">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-semibold tracking-wide uppercase">Your Global Future Awaits</span>
              </div>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
                Study in Malaysia, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-yellow-200">
                  Shape Your Destiny.
                </span>
              </h1>
              <p className="text-xl text-white/80 mb-10 text-balance max-w-2xl leading-relaxed">
                Discover world-class universities and premier language centers in one of Asia's most vibrant and culturally rich destinations.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PATHWAYS SECTION */}
      <section className="py-20 -mt-24 relative z-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* University Pathway */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link href="/institutions?type=university" className="block group h-full">
                <div className="h-full bg-card rounded-3xl p-8 border border-border/50 shadow-xl shadow-primary/5 hover:shadow-2xl hover:border-primary/30 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <Building2 className="w-32 h-32" />
                  </div>
                  
                  <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <Building2 className="w-8 h-8 text-primary group-hover:text-white" />
                  </div>
                  
                  <h2 className="font-serif text-3xl font-bold mb-4">University Degrees</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Pursue undergraduate and postgraduate degrees at top-ranked Malaysian universities renowned for global excellence.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {['Global Recognition', 'Affordable Tuition', 'Vibrant Campus Life'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-secondary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-primary font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Explore Universities <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Language Center Pathway */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Link href="/institutions?type=language_center" className="block group h-full">
                <div className="h-full bg-card rounded-3xl p-8 border border-border/50 shadow-xl shadow-primary/5 hover:shadow-2xl hover:border-secondary/30 transition-all duration-500 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                    <BookA className="w-32 h-32" />
                  </div>
                  
                  <div className="bg-secondary/20 w-16 h-16 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-secondary transition-colors duration-300">
                    <BookA className="w-8 h-8 text-secondary-foreground" />
                  </div>
                  
                  <h2 className="font-serif text-3xl font-bold mb-4">Language Mastery</h2>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Master English rapidly with immersive programs designed to prepare you for global communication and further studies.
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {['Intensive Programs', 'Native Speakers', 'IELTS/TOEFL Prep'].map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-medium">
                        <CheckCircle2 className="w-5 h-5 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center text-secondary-foreground font-semibold group-hover:translate-x-2 transition-transform duration-300">
                    Find Language Centers <ArrowRight className="ml-2 w-5 h-5" />
                  </div>
                </div>
              </Link>
            </motion.div>

          </div>
        </div>
      </section>
    </div>
  );
}
