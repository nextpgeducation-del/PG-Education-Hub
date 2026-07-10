import { StudentLayout } from "@/components/layout/student-layout";
import { useGetCurrentStudent, useGetStudentNotifications } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, BookOpen, GraduationCap, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function StudentDashboard() {
  const { data: student } = useGetCurrentStudent();
  const { data: notifications } = useGetStudentNotifications();

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {student?.fullName}!</h1>
        <p className="text-slate-500">Here's an overview of your academic progress.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-primary text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium bg-white/20 px-2 py-1 rounded">ID: {student?.studentId}</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Class Batch</h3>
            <p className="text-3xl font-bold">Class {student?.className}</p>
          </CardContent>
        </Card>

        <Card className="bg-accent text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Admission Date</h3>
            <p className="text-3xl font-bold">
              {student?.admissionDate ? format(new Date(student.admissionDate), "MMM yyyy") : "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-white/20 p-2 rounded-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded">Active</span>
            </div>
            <h3 className="text-lg font-semibold opacity-90">Status</h3>
            <p className="text-3xl font-bold capitalize">{student?.status}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" /> Notifications
              </CardTitle>
              <CardDescription>Important updates and alerts targeted at you.</CardDescription>
            </CardHeader>
            <CardContent>
              {notifications && notifications.length > 0 ? (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <div key={n.id} className="flex gap-4 p-4 rounded-lg bg-slate-50 border border-slate-100">
                      <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                        <Bell className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{n.title}</h4>
                        <p className="text-sm text-slate-600 mb-2">{n.description}</p>
                        <span className="text-xs text-slate-400">{format(new Date(n.createdAt), "PPP")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty>
                  <EmptyTitle>No notifications</EmptyTitle>
                  <EmptyDescription>You have no new notifications at this time.</EmptyDescription>
                </Empty>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" /> Quick Links
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="/notes" className="block p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                <h4 className="font-bold mb-1">Study Notes</h4>
                <p className="text-xs text-slate-500">Download subject-wise study material.</p>
              </a>
              <a href="/papers" className="block p-4 rounded-lg border hover:bg-slate-50 transition-colors">
                <h4 className="font-bold mb-1">Exam Papers</h4>
                <p className="text-xs text-slate-500">Practice with previous year papers.</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </StudentLayout>
  );
}
