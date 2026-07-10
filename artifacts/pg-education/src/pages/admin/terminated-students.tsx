import { AdminLayout } from "@/components/layout/admin-layout";
import { useListTerminatedStudents, useRestoreStudent, useDeleteStudent } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";
import { format, differenceInDays, addDays } from "date-fns";

export default function AdminTerminatedStudents() {
  const { toast } = useToast();
  const { data: students, isLoading, refetch } = useListTerminatedStudents();
  const restoreMutation = useRestoreStudent();
  const deleteMutation = useDeleteStudent();

  const onRestore = async (id: number) => {
    try {
      await restoreMutation.mutateAsync({ id });
      toast({ title: "Student Restored" });
      refetch();
    } catch (e) { toast({ variant: "destructive", title: "Restore failed" }); }
  };

  const onDelete = async (id: number) => {
    if (!confirm("Are you sure? This student will be permanently deleted from the database.")) return;
    try {
      await deleteMutation.mutateAsync({ id });
      toast({ title: "Student Permanently Deleted" });
      refetch();
    } catch (e) { toast({ variant: "destructive", title: "Delete failed" }); }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Terminated Students</h1>
        <p className="text-slate-500">Students in this list are marked for deletion after 60 days of termination.</p>
      </div>

      <Card className="border-none shadow-sm">
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
                    <TableHead>Terminated On</TableHead>
                    <TableHead>Retention Remaining</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students?.map((student) => {
                    const termDate = new Date(student.terminationDate!);
                    const expiryDate = addDays(termDate, 60);
                    const daysLeft = differenceInDays(expiryDate, new Date());
                    
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-mono text-xs">{student.studentId}</TableCell>
                        <TableCell className="font-bold">{student.fullName}</TableCell>
                        <TableCell>{format(termDate, "dd MMM yyyy")}</TableCell>
                        <TableCell>
                          <Badge variant={daysLeft < 10 ? 'destructive' : 'secondary'}>
                            {daysLeft} days left
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right flex justify-end gap-2">
                          <Button variant="outline" size="sm" className="text-green-600" onClick={() => onRestore(student.id)}>
                            <RotateCcw className="h-4 w-4 mr-1" /> Restore
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => onDelete(student.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Purge
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {(!students || students.length === 0) && (
                    <TableRow><TableCell colSpan={5} className="text-center py-10 text-slate-400">No terminated students found.</TableCell></TableRow>
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
