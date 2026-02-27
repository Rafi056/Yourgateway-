import { GraduationCap } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-foreground py-12 text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 inline-flex">
              <GraduationCap className="h-8 w-8 text-secondary" />
              <span className="font-serif text-3xl font-bold tracking-tight text-white">
                StudyMalaysia
              </span>
            </Link>
            <p className="mt-6 text-white/70 max-w-sm text-balance leading-relaxed text-right">
              بوابتك الموثوقة للتعليم العالمي في ماليزيا. سواء كنت تسعى للحصول على درجة جامعية أو إتقان اللغة الإنجليزية، ابدأ رحلتك معنا هنا.
            </p>
          </div>
          
          <div className="text-right">
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">استكشف</h4>
            <ul className="space-y-4 text-white/70">
              <li>
                <Link href="/institutions?type=university" className="hover:text-secondary transition-colors">الجامعات</Link>
              </li>
              <li>
                <Link href="/institutions?type=language_center" className="hover:text-secondary transition-colors">معاهد اللغة</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">لوحة التحكم</Link>
              </li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">الدعم والتواصل</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="https://wa.me/966562022668" className="hover:text-secondary transition-colors">واتساب</a></li>
              <li><a href="https://direct.me/gatemalay" className="hover:text-secondary transition-colors">منصاتنا الاجتماعية</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">الأسئلة الشائعة</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} بوابتك إلى ماليزيا. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
