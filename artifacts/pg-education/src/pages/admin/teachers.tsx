import { useState } from "react";
import { AdminLayout } from "@/components/layout/admin-layout";
import {
  useListTeachers,
  useCreateTeacher,
  useUpdateTeacher,
  useDeleteTeacher,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, UserPlus, Pencil, Trash2, GraduationCap } from "lucide-react";
import type { Teacher } from "@workspace/api-client-react";
import { getListTeachersQueryKey } from "@workspace/api-client-react";

const EMPTY_FORM = { name: "", subject: "", mobile: "", photoUrl: "", status: "active" as const };

export default function AdminTeachers() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editing, setEditing] = useState<Teacher | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: teachers = [], isLoading } = useListTeachers(
    search ? { search } : undefined,
  );

  const createMutation = useCreateTeacher();
  const updateMutation = useUpdateTeacher();
  const deleteMutation = useDeleteTeacher();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: getListTeachersQueryKey() });

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (t: Teacher) => {
    setEditing(t);
    setForm({
      name: t.name,
      subject: t.subject,
      mobile: t.mobile,
      photoUrl: t.photoUrl ?? "",
      status: t.status as "active" | "inactive",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editing) {
        await updateMutation.mutateAsync({
          id: editing.id,
          data: { ...form, photoUrl: form.photoUrl || undefined },
        });
        toast({ title: "Teacher updated" });
      } else {
        await createMutation.mutateAsync({
          data: { ...form, photoUrl: form.photoUrl || undefined },
        });
        toast({ title: "Teacher added" });
      }
      setDialogOpen(false);
      invalidate();
    } catch {
      toast({ variant: "destructive", title: "Failed to save teacher" });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync({ id: deleteId });
      toast({ title: "Teacher deleted" });
      setDeleteId(null);
      invalidate();
    } catch {
      toast({ variant: "destructive", title: "Failed to delete teacher" });
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <AdminLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Teacher List
          </h1>
          <p className="text-slate-500 mt-1">Manage faculty members and their details.</p>
        </div>
        <Button onClick={openAdd} className="gap-2 shrink-0">
          <UserPlus className="h-4 w-4" /> Add Teacher
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="pl-9"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden shadow-sm border border-slate-100 bg-white/80 backdrop-blur-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Photo</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Name</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Subject</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Mobile Number</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wide">Status</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  Loading teachers...
                </td>
              </tr>
            ) : teachers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                  No teachers found.
                </td>
              </tr>
            ) : (
              teachers.map((teacher, i) => (
                <tr
                  key={teacher.id}
                  className={`border-t border-slate-100 transition-colors hover:bg-primary/5 ${
                    i % 2 === 0 ? "bg-white" : "bg-slate-50/60"
                  }`}
                >
                  <td className="px-6 py-4">
                    <Avatar className="h-10 w-10 border-2 border-slate-100">
                      {teacher.photoUrl ? (
                        <img src={teacher.photoUrl} alt={teacher.name} className="object-cover" />
                      ) : (
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {teacher.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-800">{teacher.name}</td>
                  <td className="px-6 py-4 text-slate-600">{teacher.subject}</td>
                  <td className="px-6 py-4 text-slate-600 font-mono">{teacher.mobile}</td>
                  <td className="px-6 py-4">
                    <Badge
                      className={
                        teacher.status === "active"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }
                      variant="outline"
                    >
                      {teacher.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-primary/30 text-primary hover:bg-primary/10"
                        onClick={() => openEdit(teacher)}
                      >
                        <Pencil className="h-3.5 w-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1 border-red-200 text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteId(teacher.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Teacher" : "Add New Teacher"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <Input
                placeholder="e.g. Mr. Priyanshu"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <Input
                placeholder="e.g. Mathematics"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mobile Number * <span className="text-xs text-slate-400">(10 digits)</span>
              </label>
              <Input
                placeholder="10-digit mobile number"
                value={form.mobile}
                maxLength={10}
                onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Photo URL (optional)</label>
              <Input
                placeholder="https://..."
                value={form.photoUrl}
                onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as "active" | "inactive" })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || !form.name || !form.subject || form.mobile.length !== 10}
            >
              {isSaving ? "Saving..." : editing ? "Update Teacher" : "Add Teacher"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the teacher from the list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
