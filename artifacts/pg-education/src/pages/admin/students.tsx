import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useListStudents, useCreateStudent } from "@workspace/api-client-react";
import { CreateStudentBody } from "@workspace/api-zod";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Filter, MoreHorizontal, Eye } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function AdminStudents() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [className, setClassName] = useState<any>(undefined);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data: students, isLoading, refetch } = useListStudents({
    search: search || undefined,
    className: className === "all" ? undefined : className,
    sort: "newest"
  });

  const createMutation = useCreateStudent();
  const form = useForm({
    resolver: zodResolver(CreateStudentBody),
    defaultValues: {
      fullName: "",
      fatherName: "",
      mobile: "",
      email: "",
      pinCode: "",
      schoolName: "",
      className: "6-8" as any,
      password: "password123",
      admissionDate: new Date()
    }
  });

  const onAddSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync({ data });
      toast({ title: "Student Added Successfully" });
      setIsAddOpen(false);
      form.reset();
      refetch();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to add student" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-green-500">{status}</Badge>;
      case 'terminated': return <Badge variant="destructive">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Student Management</h1>
          <p className="text-slate-500">Manage all registered students and admissions.</p>
        </div>
        
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <UserPlus className="h-4 w-4 mr-2" /> New Admission
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Manual Student Admission</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onAddSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="fullName" render={({ field }) => (
                    <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="fatherName" render={({ field }) => (
                    <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="mobile" render={({ field }) => (
                    <FormItem><FormLabel>Mobile</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                  <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="className" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Class Batch</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent><SelectItem value="6-8">6-8</SelectItem><SelectItem value="9-10">9-10</SelectItem><SelectItem value="11-12">11-12</SelectItem></SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="admissionDate" render={({ field }) => (
                    <FormItem><FormLabel>Admission Date</FormLabel><FormControl><Input type="date" value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : field.value} onChange={e => field.onChange(new Date(e.target.value))} /></FormControl><FormMessage /></FormItem>
                  )} />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={createMutation.isPending}>Register Student</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-8 border-none shadow-sm">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search by name, ID or mobile..." 
                className="pl-9"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Select value={className} onValueChange={setClassName}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                <SelectItem value="6-8">Class 6-8</SelectItem>
                <SelectItem value="9-10">Class 9-10</SelectItem>
                <SelectItem value="11-12">Class 11-12</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Admission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                      <TableCell className="font-bold">{student.fullName}</TableCell>
                      <TableCell>{student.className}</TableCell>
                      <TableCell>{student.mobile}</TableCell>
                      <TableCell>{format(new Date(student.admissionDate), "dd MMM yyyy")}</TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link href={`/admin/students/${student.id}`}>
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                            <Eye className="h-4 w-4 mr-2" /> View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!students || students.length === 0) && (
                    <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400">No students found.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
