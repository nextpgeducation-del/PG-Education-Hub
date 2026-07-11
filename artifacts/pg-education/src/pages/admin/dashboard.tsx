import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetAdminDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users, UserMinus, CreditCard, UserPlus, TrendingUp,
  Calendar, CalendarDays, FileText, BookOpen, ClipboardList
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetAdminDashboardSummary();

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;

  const primaryStats = [
    { title: "Total Students", value: summary?.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50", sub: `+${summary?.newAdmissionsThisMonth} this month` },
    { title: "Active Students", value: summary?.activeStudents, icon: UserPlus, color: "text-green-600", bg: "bg-green-50", sub: null },
    { title: "Terminated Students", value: summary?.terminatedStudents, icon: UserMinus, color: "text-red-600", bg: "bg-red-50", sub: null },
    { title: "Today's Registrations", value: summary?.todaysNewRegistrations, icon: CalendarDays, color: "text-cyan-600", bg: "bg-cyan-50", sub: "New admissions today" },
    { title: "Total Notes", value: summary?.totalNotes, icon: FileText, color: "text-indigo-600", bg: "bg-indigo-50", sub: "Study notes uploaded" },
    { title: "Previous Year Papers", value: summary?.totalPapers, icon: BookOpen, color: "text-violet-600", bg: "bg-violet-50", sub: "Exam papers uploaded" },
    { title: "Mock Tests", value: summary?.totalMockTests, icon: ClipboardList, color: "text-amber-600", bg: "bg-amber-50", sub: "Coming soon" },
  ];

  const feeStats = [
    { title: "Total Fees Collected", value: `₹${summary?.totalFeesCollected.toLocaleString()}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Fees", value: `₹${summary?.pendingFees.toLocaleString()}`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Monthly Collection", value: `₹${summary?.monthlyCollection.toLocaleString()}`, icon: Calendar, color: "text-teal-600", bg: "bg-teal-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Institute Overview</h1>
        <p className="text-slate-500 mt-1">Live metrics from the database — updated on every page load.</p>
      </div>

      {/* Student & Content Stats */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Students & Content</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
        {primaryStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              {stat.sub && <p className="text-xs text-slate-400 mt-2">{stat.sub}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Fee Stats */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Fee Collection</h2>
      </div>
      <div className="grid sm:grid-cols-3 gap-6">
        {feeStats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}
