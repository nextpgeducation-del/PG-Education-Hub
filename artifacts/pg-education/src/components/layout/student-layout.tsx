import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  LayoutDashboard, 
  User, 
  CreditCard, 
  LogOut,
  Bell,
  Menu,
  X
} from "lucide-react";
import { useState } from "react";
import { useGetCurrentStudent, useLogoutStudent } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function StudentLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: student, isLoading, isError } = useGetCurrentStudent();
  const logoutMutation = useLogoutStudent();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !student) {
    setLocation("/student/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    toast({ title: "Logged out successfully" });
    setLocation("/student/login");
  };

  const navItems = [
    { href: "/student/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/profile", label: "My Profile", icon: User },
    { href: "/student/fees", label: "Fee Details", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 flex-col bg-slate-900 text-white shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link href="/" className="flex items-center gap-2 text-white">
            <GraduationCap className="h-8 w-8 text-accent" />
            <span className="font-bold text-xl">PG Education</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                <item.icon className="h-5 w-5 text-accent" />
                <span>{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={student.profilePhotoUrl || ""} />
              <AvatarFallback>{student.fullName[0]}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="text-sm font-medium truncate">{student.fullName}</p>
              <p className="text-xs text-slate-400 truncate">{student.studentId}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-accent" />
            <span className="font-bold">PG Education</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-64 h-full bg-slate-900 text-white flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold">Menu</span>
                <button onClick={() => setIsSidebarOpen(false)}><X className="h-6 w-6" /></button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
                    <a className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors">
                      <item.icon className="h-5 w-5 text-accent" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-slate-800">
                 <Button 
                  variant="ghost" 
                  className="w-full justify-start text-slate-400"
                  onClick={handleLogout}
                >
                  <LogOut className="h-5 w-5 mr-3" /> Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
