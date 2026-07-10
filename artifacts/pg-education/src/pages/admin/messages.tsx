import { AdminLayout } from "@/components/layout/admin-layout";
import { useListContactMessages } from "@workspace/api-client-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { format } from "date-fns";
import { Empty, EmptyDescription } from "@/components/ui/empty";

export default function AdminMessages() {
  const { data: messages, isLoading } = useListContactMessages();

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Contact Enquiries</h1>
        <p className="text-slate-500">Messages received from the public website contact form.</p>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : messages && messages.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Sender</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((msg) => (
                    <TableRow key={msg.id}>
                      <TableCell className="whitespace-nowrap">{format(new Date(msg.createdAt), "dd MMM HH:mm")}</TableCell>
                      <TableCell className="font-bold">{msg.fullName}</TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p>{msg.mobile}</p>
                          <p className="text-slate-400">{msg.email}</p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-primary">{msg.subject}</TableCell>
                      <TableCell className="max-w-md truncate">{msg.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <Empty title="No messages">
              <EmptyDescription>You haven't received any contact messages yet.</EmptyDescription>
            </Empty>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
