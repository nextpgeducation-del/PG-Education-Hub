import { StudentLayout } from "@/components/layout/student-layout";
import { useGetStudentFees } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { CreditCard, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

export default function StudentFees() {
  const { data: fees, isLoading } = useGetStudentFees();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'partial':
        return <Badge variant="secondary" className="bg-yellow-500 text-white hover:bg-yellow-600"><Clock className="h-3 w-3 mr-1" /> Partial</Badge>;
      default:
        return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const getMonthName = (month: number) => {
    return new Date(2000, month - 1).toLocaleString('default', { month: 'long' });
  };

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Fee Details</h1>
        <p className="text-slate-500">View your monthly fee schedule and payment status.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-primary" /> Fee History
          </CardTitle>
          <CardDescription>List of all fees for the current session.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-20"><Spinner /></div>
          ) : fees && fees.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Month/Year</TableHead>
                    <TableHead>Fee Amount</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Late Fee</TableHead>
                    <TableHead className="font-bold">Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Receipt No.</TableHead>
                    <TableHead>Payment Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fees.map((fee) => (
                    <TableRow key={fee.id}>
                      <TableCell className="font-medium">{getMonthName(fee.month)} {fee.year}</TableCell>
                      <TableCell>₹{fee.feeAmount}</TableCell>
                      <TableCell className="text-green-600">-₹{fee.discount}</TableCell>
                      <TableCell className="text-red-600">+₹{fee.lateFee}</TableCell>
                      <TableCell className="font-bold">₹{fee.amountPaid}</TableCell>
                      <TableCell>{getStatusBadge(fee.status)}</TableCell>
                      <TableCell className="font-mono text-xs">{fee.receiptNumber || "-"}</TableCell>
                      <TableCell>
                        {fee.paymentDate ? format(new Date(fee.paymentDate), "dd MMM yyyy") : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty>
              <EmptyTitle>No fee records</EmptyTitle>
              <EmptyDescription>Your fee schedule hasn't been generated yet.</EmptyDescription>
            </Empty>
          )}
        </CardContent>
      </Card>
    </StudentLayout>
  );
}
