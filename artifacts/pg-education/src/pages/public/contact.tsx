import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitContactMessageBody, SubscribeNewsletterBody } from "@workspace/api-zod";
import { useSubmitContactMessage, useSubscribeNewsletter } from "@workspace/api-client-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Send, MailPlus } from "lucide-react";

export default function Contact() {
  const { toast } = useToast();
  const contactMutation = useSubmitContactMessage();
  const newsletterMutation = useSubscribeNewsletter();

  const contactForm = useForm({
    resolver: zodResolver(SubmitContactMessageBody),
    defaultValues: {
      fullName: "",
      mobile: "",
      email: "",
      subject: "",
      message: ""
    }
  });

  const newsletterForm = useForm({
    resolver: zodResolver(SubscribeNewsletterBody),
    defaultValues: {
      name: "",
      mobile: "",
      email: ""
    }
  });

  const onContactSubmit = async (data: any) => {
    try {
      await contactMutation.mutateAsync({ data });
      toast({
        title: "Message Sent",
        description: "Thank you for reaching out. We will get back to you soon.",
      });
      contactForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send message. Please try again.",
      });
    }
  };

  const onNewsletterSubmit = async (data: any) => {
    try {
      await newsletterMutation.mutateAsync({ data });
      toast({
        title: "Subscribed",
        description: "You've successfully subscribed to our newsletter.",
      });
      newsletterForm.reset();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to subscribe. Please try again.",
      });
    }
  };

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Have questions? We're here to help. Reach out to us via the form below or our contact details.
          </p>
        </div>
      </div>

      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">Get in Touch</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Our Location</h3>
                  <p className="text-muted-foreground">123 Education Hub, Sector 4<br />New Delhi, India 110001</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Phone Number</h3>
                  <p className="text-muted-foreground">+91 98765 43210<br />+91 98765 01234</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Email Address</h3>
                  <p className="text-muted-foreground">info@pgeducation.com<br />admissions@pgeducation.com</p>
                </div>
              </div>
            </div>

            {/* Newsletter Card */}
            <Card className="bg-slate-900 text-white border-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailPlus className="h-5 w-5 text-accent" /> Newsletter
                </CardTitle>
                <CardDescription className="text-slate-400">Subscribe for weekly study tips and updates.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...newsletterForm}>
                  <form onSubmit={newsletterForm.handleSubmit(onNewsletterSubmit)} className="space-y-4">
                    <FormField
                      control={newsletterForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Your Name" className="bg-slate-800 border-slate-700 text-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newsletterForm.control}
                      name="mobile"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Mobile Number" className="bg-slate-800 border-slate-700 text-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={newsletterMutation.isPending}>
                      {newsletterMutation.isPending ? "Subscribing..." : "Subscribe Now"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>Fill out the form below and our team will get back to you within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...contactForm}>
                  <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={contactForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactForm.control}
                        name="mobile"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <Input placeholder="10-digit number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        control={contactForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email (Optional)</FormLabel>
                            <FormControl>
                              <Input placeholder="john@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contactForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Enquiry about..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={contactForm.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Message</FormLabel>
                          <FormControl>
                            <Textarea placeholder="How can we help you?" className="min-h-[150px]" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" size="lg" className="w-full sm:w-auto px-8" disabled={contactMutation.isPending}>
                      <Send className="h-4 w-4 mr-2" /> {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
