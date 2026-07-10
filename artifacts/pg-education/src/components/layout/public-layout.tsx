import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/courses", label: "Courses" },
    { href: "/faculty", label: "Faculty" },
    { href: "/notes", label: "Study Notes" },
    { href: "/papers", label: "Exam Papers" },
    { href: "/gallery", label: "Gallery" },
    { href: "/announcements", label: "Announcements" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl tracking-tight hidden sm:inline-block">PG Education</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 ml-4">
              <Link href="/student/login">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">Student Login</Button>
              </Link>
              <Link href="/student/register">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Join Now</Button>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-2 text-muted-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background px-4 py-4 space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-foreground hover:text-primary" onClick={() => setIsMenuOpen(false)}>
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 pt-4 border-t">
              <Link href="/student/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">Student Login</Button>
              </Link>
              <Link href="/student/register" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full justify-center">Join Now</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col">
        {children}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <GraduationCap className="h-6 w-6 text-accent" />
              <span className="font-bold text-lg">PG Education</span>
            </div>
            <p className="text-sm text-slate-400">
              Premium coaching institute for classes 6-12. Learn Today, Lead Tomorrow.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-accent transition-colors">About Us</Link></li>
              <li><Link href="/courses" className="hover:text-accent transition-colors">Our Courses</Link></li>
              <li><Link href="/faculty" className="hover:text-accent transition-colors">Expert Faculty</Link></li>
              <li><Link href="/gallery" className="hover:text-accent transition-colors">Gallery</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Student Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/notes" className="hover:text-accent transition-colors">Study Notes</Link></li>
              <li><Link href="/papers" className="hover:text-accent transition-colors">Previous Papers</Link></li>
              <li><Link href="/announcements" className="hover:text-accent transition-colors">Announcements</Link></li>
              <li><Link href="/student/login" className="hover:text-accent transition-colors">Student Portal</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>123 Education Hub, Sector 4</li>
              <li>New Delhi, India 110001</li>
              <li>Phone: +91 98765 43210</li>
              <li>Email: info@pgeducation.com</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-6 mt-8 pt-8 border-t border-slate-800 text-sm text-center text-slate-500">
          © {new Date().getFullYear()} PG Education. All rights reserved. <Link href="/admin/login" className="hover:text-white ml-2 text-xs">Admin Login</Link>
        </div>
      </footer>
    </div>
  );
}
