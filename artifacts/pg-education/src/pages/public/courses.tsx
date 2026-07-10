import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

export default function Courses() {
  const courses = [
    {
      level: "Classes 6-8",
      title: "Foundation Batch",
      description: "A strong foundation is the key to future success. Our foundation batch focuses on building conceptual clarity in Mathematics and Science, along with developing analytical skills.",
      features: [
        "Interactive learning modules",
        "Weekly assessment tests",
        "Mathematics & Science focus",
        "English language proficiency",
        "Mental Ability & Logical Reasoning"
      ],
      badge: "Foundation"
    },
    {
      level: "Classes 9-10",
      title: "Secondary Excellence",
      description: "Crucial years for academic growth. We provide comprehensive coverage of the school curriculum while preparing students for the challenges of Board examinations.",
      features: [
        "Board-oriented teaching pattern",
        "Regular mock tests & analysis",
        "Detailed study material",
        "Doubt clearing sessions",
        "Science, Math, Social Studies & English"
      ],
      badge: "Board Prep"
    },
    {
      level: "Classes 11-12",
      title: "Senior Secondary (Boards + Competitive)",
      description: "Specialized streams for students looking to excel in their board exams and get a head start on competitive entrance preparations.",
      features: [
        "Stream-specific expert faculty",
        "Advanced problem-solving techniques",
        "Intensive revision programs",
        "Career counseling sessions",
        "Science (PCM/PCB), Commerce & Arts"
      ],
      badge: "Advanced"
    }
  ];

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">Our Course Programs</h1>
          <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
            Tailored educational pathways designed to nurture talent and achieve academic brilliance at every stage.
          </p>
        </div>
      </div>

      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="grid gap-12">
          {courses.map((course, index) => (
            <Card key={index} className="overflow-hidden border-2 hover:border-primary/20 transition-colors">
              <div className="grid md:grid-cols-[1fr_2fr]">
                <div className="bg-slate-900 text-white p-8 flex flex-col justify-center items-center text-center">
                  <Badge className="bg-accent text-accent-foreground mb-4">{course.badge}</Badge>
                  <h2 className="text-3xl font-bold mb-2">{course.level}</h2>
                  <p className="text-slate-400">{course.title}</p>
                </div>
                <CardContent className="p-8 md:p-12">
                  <CardHeader className="p-0 mb-6">
                    <CardTitle className="text-2xl mb-4">Course Overview</CardTitle>
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {course.description}
                    </p>
                  </CardHeader>
                  
                  <div className="grid sm:grid-cols-2 gap-4">
                    {course.features.map((feature, fIndex) => (
                      <div key={fIndex} className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
