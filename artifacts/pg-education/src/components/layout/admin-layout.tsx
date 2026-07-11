import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  UsersRound,
  FileText, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  GraduationCap
} from "lucide-react";
import { useState } from "react";
import { useGetCurrentAdmin, useLogoutAdmin } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { data: admin, isLoading, isError } = useGetCurrentAdmin();
  const logoutMutation = useLogoutAdmin();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (isError || !admin) {
    setLocation("/admin/login");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    toast({ title: "Admin logged out" });
    setLocation("/admin/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/students", label: "Active Students", icon: Users },
    { href: "/admin/terminated-students", label: "Terminated", icon: UsersRound },
    { href: "/admin/teachers", label: "Teacher List", icon: GraduationCap },
    { href: "/admin/content", label: "Content Management", icon: FileText },
    { href: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 flex-col bg-slate-900 text-white shrink-0">
        <div className="p-8 border-b border-slate-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 text-white">
            <ShieldCheck className="h-8 w-8 text-accent" />
            <span className="font-bold text-xl tracking-tight">Admin Portal</span>
          </Link>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors">
                <item.icon className="h-5 w-5 text-accent" />
                <span className="font-medium">{item.label}</span>
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-4 px-4 py-3 mb-6 bg-slate-800/50 rounded-xl">
            <Avatar className="h-10 w-10 border-2 border-slate-700">
              <AvatarFallback className="bg-slate-700 text-white">{admin.username[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="truncate">
              <p className="text-sm font-bold truncate">@{admin.username}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-slate-400 hover:text-white hover:bg-red-900/40 rounded-xl"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-accent" />
            <span className="font-bold">Admin Portal</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 lg:hidden" onClick={() => setIsSidebarOpen(false)}>
            <div className="w-72 h-full bg-slate-900 text-white flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <span className="font-bold">Admin Menu</span>
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
                  <LogOut className="h-5 w-5 mr-3" /> Logout
                </Button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
