import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import { 
  useGetStudent, 
  useUpdateStudent, 
  useDeleteStudent, 
  useGetStudentFeesAdmin,
  useUpdateFee,
  useTerminateStudent,
  useRestoreStudent
} from "@workspace/api-client-react";
import { UpdateStudentBody as StudentUpdate, UpdateFeeBody as FeeUpdate } from "@workspace/api-zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { User, CreditCard, Trash2, ShieldAlert, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function StudentDetail() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const studentId = parseInt(id!);

  const { data: student, isLoading, refetch: refetchStudent } = useGetStudent(studentId);
  const { data: fees, refetch: refetchFees } = useGetStudentFeesAdmin(studentId);

  const updateMutation = useUpdateStudent();
  const terminateMutation = useTerminateStudent();
  const restoreMutation = useRestoreStudent();
  const updateFeeMutation = useUpdateFee();
  const deleteMutation = useDeleteStudent();

  const [isEditFeeOpen, setIsEditFeeOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<any>(null);

  const studentForm = useForm({
    resolver: zodResolver(StudentUpdate),
    values: student ? {
      fullName: student.fullName,
      fatherName: student.fatherName,
      mobile: student.mobile,
      email: student.email || "",
      className: student.className,
      status: student.status
    } : undefined
  });

  const feeForm = useForm({
    resolver: zodResolver(FeeUpdate),
    values: selectedFee ? {
      feeAmount: selectedFee.feeAmount,
      discount: selectedFee.discount,
      lateFee: selectedFee.lateFee,
      amountPaid: selectedFee.amountPaid,
      status: selectedFee.status,
      paymentMode: selectedFee.paymentMode || "cash",
      remarks: selectedFee.remarks || ""
    } : undefined
  });

  const onStudentUpdate = async (data: any) => {
    try {
      await updateMutation.mutateAsync({ id: studentId, data });
      toast({ title: "Student details updated" });
      refetchStudent();
    } catch (e) { toast({ variant: "destructive", title: "Update failed" }); }
  };

  const onTerminate = async () => {
    try {
      await terminateMutation.mutateAsync({ id: studentId, data: { reason: "Admin manually terminated" } });
      toast({ title: "Student terminated" });
      refetchStudent();
    } catch (e) { toast({ variant: "destructive", title: "Termination failed" }); }
  };

  const onRestore = async () => {
    try {
      await restoreMutation.mutateAsync({ id: studentId });
      toast({ title: "Student restored" });
      refetchStudent();
    } catch (e) { toast({ variant: "destructive", title: "Restore failed" }); }
  };

  const onFeeUpdate = async (data: any) => {
    try {
      await updateFeeMutation.mutateAsync({ feeId: selectedFee.id, data });
      toast({ title: "Fee record updated" });
      setIsEditFeeOpen(false);
      refetchFees();
    } catch (e) { toast({ variant: "destructive", title: "Fee update failed" }); }
  };

  if (isLoading) return <AdminLayout><Spinner /></AdminLayout>;
  if (!student) return <AdminLayout>Student not found</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-slate-900">{student.fullName}</h1>
            <Badge className={student.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>{student.status}</Badge>
          </div>
          <p className="text-slate-500">ID: {student.studentId} • Admission No: {student.admissionNumber}</p>
        </div>
        
        <div className="flex gap-2">
          {student.status === 'terminated' ? (
            <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={onRestore}>
              <CheckCircle2 className="h-4 w-4 mr-2" /> Restore Student
            </Button>
          ) : (
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={onTerminate}>
              <XCircle className="h-4 w-4 mr-2" /> Terminate Student
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="info"><User className="h-4 w-4 mr-2" /> Profile Details</TabsTrigger>
          <TabsTrigger value="fees"><CreditCard className="h-4 w-4 mr-2" /> Fee Management</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader><CardTitle>Edit Student Information</CardTitle></CardHeader>
            <CardContent>
              <Form {...studentForm}>
                <form onSubmit={studentForm.handleSubmit(onStudentUpdate)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField control={studentForm.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={studentForm.control} name="fatherName" render={({ field }) => (
                      <FormItem><FormLabel>Father's Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={studentForm.control} name="mobile" render={({ field }) => (
                      <FormItem><FormLabel>Mobile</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={studentForm.control} name="email" render={({ field }) => (
                      <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={studentForm.control} name="className" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Class Batch</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent><SelectItem value="6-8">6-8</SelectItem><SelectItem value="9-10">9-10</SelectItem><SelectItem value="11-12">11-12</SelectItem></SelectContent>
                        </Select>
                      </FormItem>
                    )} />
                  </div>
                  <Button type="submit" disabled={updateMutation.isPending}>Save Changes</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader><CardTitle>Fee Schedule</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees?.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell>{new Date(2000, fee.month-1).toLocaleString('default', { month: 'short' })} {fee.year}</TableCell>
                      <TableCell>₹{fee.feeAmount + fee.lateFee - fee.discount}</TableCell>
                      <TableCell>₹{fee.amountPaid}</TableCell>
                      <TableCell>
                        <Badge variant={fee.status === 'paid' ? 'default' : 'secondary'}>{fee.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedFee(fee); setIsEditFeeOpen(true); }}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isEditFeeOpen} onOpenChange={setIsEditFeeOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Fee Record</DialogTitle></DialogHeader>
          <Form {...feeForm}>
            <form onSubmit={feeForm.handleSubmit(onFeeUpdate)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={feeForm.control} name="feeAmount" render={({ field }) => (
                  <FormItem><FormLabel>Base Fee</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl></FormItem>
                )} />
                <FormField control={feeForm.control} name="amountPaid" render={({ field }) => (
                  <FormItem><FormLabel>Amount Paid</FormLabel><FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl></FormItem>
                )} />
              </div>
              <FormField control={feeForm.control} name="status" render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                    <SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="partial">Partial</SelectItem><SelectItem value="paid">Paid</SelectItem></SelectContent>
                  </Select>
                </FormItem>
              )} />
              <DialogFooter><Button type="submit">Update Record</Button></DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
