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
            <p className="mt-6 text-white/70 max-w-sm text-balance leading-relaxed">
              Your premier gateway to world-class education. Whether you're pursuing a degree or mastering English, start your journey here.
            </p>
          </div>
          
          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Explore</h4>
            <ul className="space-y-4 text-white/70">
              <li>
                <Link href="/institutions?type=university" className="hover:text-secondary transition-colors">Universities</Link>
              </li>
              <li>
                <Link href="/institutions?type=language_center" className="hover:text-secondary transition-colors">Language Centers</Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-secondary transition-colors">My Dashboard</Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-white/70">
              <li><a href="#" className="hover:text-secondary transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">Visa Guide</a></li>
              <li><a href="#" className="hover:text-secondary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/50 text-sm">
          <p>© {new Date().getFullYear()} StudyMalaysia Portal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
