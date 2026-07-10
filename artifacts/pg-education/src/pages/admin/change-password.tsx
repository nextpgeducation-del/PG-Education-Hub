import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeAdminPasswordBody } from "@workspace/api-zod";
import { useChangeAdminPassword } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { ShieldAlert, Key } from "lucide-react";

export default function AdminChangePassword() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const mutation = useChangeAdminPassword();

  const form = useForm({
    resolver: zodResolver(ChangeAdminPasswordBody),
    defaultValues: {
      currentPassword: "",
      newPassword: ""
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await mutation.mutateAsync({ data });
      toast({ title: "Password Updated", description: "Your admin password has been changed." });
      setLocation("/admin/dashboard");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Please check your current password.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white border-none shadow-2xl">
        <CardHeader className="text-center space-y-1">
          <div className="flex justify-center mb-4 text-accent">
            <ShieldAlert className="h-12 w-12" />
          </div>
          <CardTitle className="text-2xl font-bold">Secure Your Account</CardTitle>
          <CardDescription>You must update your default password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>Min. 8 characters</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 bg-accent hover:bg-accent/90" disabled={mutation.isPending}>
                <Key className="h-4 w-4 mr-2" />
                {mutation.isPending ? "Updating..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
