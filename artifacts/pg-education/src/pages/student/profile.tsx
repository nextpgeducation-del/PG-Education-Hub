import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateStudentProfilePhotoBody, ChangeStudentPasswordBody } from "@workspace/api-zod";
import { useGetStudentProfile, useUpdateStudentProfilePhoto, useChangeStudentPassword } from "@workspace/api-client-react";
import { StudentLayout } from "@/components/layout/student-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Lock, Camera } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export default function StudentProfile() {
  const { toast } = useToast();
  const { data: profile, isLoading } = useGetStudentProfile();
  const updatePhotoMutation = useUpdateStudentProfilePhoto();
  const changePasswordMutation = useChangeStudentPassword();

  const photoForm = useForm({
    resolver: zodResolver(UpdateStudentProfilePhotoBody),
    defaultValues: { profilePhotoUrl: profile?.profilePhotoUrl || "" }
  });

  const passwordForm = useForm({
    resolver: zodResolver(ChangeStudentPasswordBody),
    defaultValues: { currentPassword: "", newPassword: "" }
  });

  const onPhotoSubmit = async (data: any) => {
    try {
      await updatePhotoMutation.mutateAsync({ data });
      toast({ title: "Profile Photo Updated" });
    } catch (error) {
      toast({ variant: "destructive", title: "Update Failed" });
    }
  };

  const onPasswordSubmit = async (data: any) => {
    try {
      await changePasswordMutation.mutateAsync({ data });
      toast({ title: "Password Changed Successfully" });
      passwordForm.reset();
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to change password" });
    }
  };

  if (isLoading) return <StudentLayout><Spinner /></StudentLayout>;

  return (
    <StudentLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-8">
        <Card className="h-fit">
          <CardContent className="p-8 flex flex-col items-center text-center">
            <div className="relative mb-6">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={profile?.profilePhotoUrl || ""} />
                <AvatarFallback className="text-2xl">{profile?.fullName[0]}</AvatarFallback>
              </Avatar>
            </div>
            <h2 className="text-2xl font-bold mb-1">{profile?.fullName}</h2>
            <p className="text-slate-500 text-sm mb-4">Student ID: {profile?.studentId}</p>
            <div className="w-full pt-4 border-t text-left space-y-3 text-sm">
              <div>
                <span className="text-slate-400">Class Batch:</span>
                <p className="font-semibold">{profile?.className}</p>
              </div>
              <div>
                <span className="text-slate-400">Father's Name:</span>
                <p className="font-semibold">{profile?.fatherName}</p>
              </div>
              <div>
                <span className="text-slate-400">Mobile:</span>
                <p className="font-semibold">{profile?.mobile}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="details"><User className="h-4 w-4 mr-2" /> Personal Details</TabsTrigger>
            <TabsTrigger value="settings"><Lock className="h-4 w-4 mr-2" /> Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>View your registered information.</CardDescription>
              </CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-8">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                  <p className="text-lg font-medium">{profile?.fullName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                  <p className="text-lg font-medium">{profile?.email || "Not provided"}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">School Name</label>
                  <p className="text-lg font-medium">{profile?.schoolName}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Pin Code</label>
                  <p className="text-lg font-medium">{profile?.pinCode}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...photoForm}>
                  <form onSubmit={photoForm.handleSubmit(onPhotoSubmit)} className="flex gap-4">
                    <FormField
                      control={photoForm.control}
                      name="profilePhotoUrl"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="Enter Photo URL" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={updatePhotoMutation.isPending}>
                      <Camera className="h-4 w-4 mr-2" /> Update
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                    <FormField
                      control={passwordForm.control}
                      name="currentPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={changePasswordMutation.isPending}>
                      Update Password
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </StudentLayout>
  );
}
