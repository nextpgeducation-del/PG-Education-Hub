import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetPublicStats, useListPublicAnnouncements } from "@workspace/api-client-react";
import { GraduationCap, BookOpen, Users, Trophy, ArrowRight, Bell } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: stats, isLoading: statsLoading } = useGetPublicStats();
  const { data: announcements, isLoading: announcementsLoading } = useListPublicAnnouncements();

  const pinnedAnnouncements = announcements?.filter(a => a.pinned) || [];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative bg-slate-900 py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050853063-880246758462?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Learn Today, <span className="text-accent">Lead Tomorrow</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            Premium coaching for classes 6-12. Empowering students with conceptual clarity and academic excellence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/student/register">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 text-lg font-semibold">
                Enroll Now
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10 px-8 text-lg font-semibold">
                Explore Courses
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {statsLoading ? "..." : `${stats?.studentsEnrolled}+`}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Students Enrolled</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {statsLoading ? "..." : `${stats?.expertTeachers}+`}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Expert Teachers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {statsLoading ? "..." : stats?.coursesCount}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Course Modules</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">
                {statsLoading ? "..." : `${stats?.successRate}%`}
              </div>
              <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Preview */}
      {pinnedAnnouncements.length > 0 && (
        <section className="py-12 bg-accent/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex items-center gap-2 mb-6 text-accent">
              <Bell className="h-6 w-6" />
              <h2 className="text-2xl font-bold">Latest Announcements</h2>
            </div>
            <div className="grid gap-4">
              {pinnedAnnouncements.slice(0, 3).map((ann) => (
                <Card key={ann.id} className="border-accent/20">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-bold text-lg mb-1">{ann.title}</h3>
                        <p className="text-muted-foreground line-clamp-2">{ann.description}</p>
                      </div>
                      <Link href="/announcements">
                        <Button variant="ghost" size="sm" className="text-accent hover:text-accent hover:bg-accent/10">
                          View All
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Highlights */}
      <section className="py-24 container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Programs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Structured batches designed to build a strong foundation and excel in board exams.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Foundation (6-8)",
              desc: "Building core concepts in Mathematics and Science for early learners.",
              icon: GraduationCap
            },
            {
              title: "Secondary (9-10)",
              desc: "Focused preparation for Board exams with comprehensive practice.",
              icon: BookOpen
            },
            {
              title: "Senior Secondary (11-12)",
              desc: "Specialized coaching for Science, Commerce, and Arts streams.",
              icon: Users
            }
          ].map((item, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-6">{item.desc}</p>
                <Link href="/courses">
                  <Button variant="link" className="text-primary p-0 h-auto font-semibold">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <Trophy className="h-16 w-16 text-accent mx-auto mb-8" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Join the Winners' Circle</h2>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            Secure your future with the region's top-rated coaching institute. Limited seats available for the new batch!
          </p>
          <Link href="/student/register">
            <Button size="lg" className="bg-white text-primary hover:bg-slate-100 px-10 text-lg font-bold">
              Register Now
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
