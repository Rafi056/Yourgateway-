import { Link, useLocation } from "wouter";
import { GraduationCap, BookOpen, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImg from "@assets/IMG_3512_1772166816327.jpeg";

export function Navbar() {
  const [location] = useLocation();

  const navLinks = [
    { href: "/institutions?type=university", label: "Universities", icon: GraduationCap },
    { href: "/institutions?type=language_center", label: "Language Centers", icon: BookOpen },
    { href: "/dashboard", label: "My Applications", icon: LayoutDashboard },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <img 
              src={logoImg} 
              alt="Gateway to Malaysia Logo" 
              className="h-12 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-serif text-2xl font-bold tracking-tight text-primary hidden sm:inline">
              StudyMalaysia
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location === link.href || (location.startsWith("/institutions") && link.href.includes("institutions"));
              return (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                    isActive ? "text-primary border-b-2 border-primary py-7" : "text-muted-foreground"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/institutions">
              <Button className="rounded-full px-6 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
