import { AdminLayout } from "@/components/layout/admin-layout";
import { useGetAdminDashboardSummary } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserMinus, CreditCard, UserPlus, TrendingUp, Calendar } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboard() {
  const { data: summary, isLoading } = useGetAdminDashboardSummary();

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;

  const stats = [
    { title: "Total Students", value: summary?.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Students", value: summary?.activeStudents, icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
    { title: "Terminated", value: summary?.terminatedStudents, icon: UserMinus, color: "text-red-600", bg: "bg-red-50" },
    { title: "Total Fees Collected", value: `₹${summary?.totalFeesCollected}`, icon: CreditCard, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Pending Fees", value: `₹${summary?.pendingFees}`, icon: TrendingUp, color: "text-orange-600", bg: "bg-orange-50" },
    { title: "Monthly Collection", value: `₹${summary?.monthlyCollection}`, icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-extrabold text-slate-900">Institute Overview</h1>
        <p className="text-slate-500">Real-time metrics and performance indicators.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
              {stat.title === "Total Students" && (
                <p className="text-xs text-slate-400 mt-2">
                  <span className="text-green-500 font-bold">+{summary?.newAdmissionsThisMonth}</span> new admissions this month
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Visual spacers for layout */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="h-64 border-dashed border-2 flex items-center justify-center text-slate-400 bg-slate-50">
            <p>Collection Trends Chart Placeholder</p>
         </Card>
         <Card className="h-64 border-dashed border-2 flex items-center justify-center text-slate-400 bg-slate-50">
            <p>Student Distribution Chart Placeholder</p>
         </Card>
      </div>
    </AdminLayout>
  );
}
