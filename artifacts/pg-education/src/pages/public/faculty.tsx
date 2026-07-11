import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Faculty() {
  const faculty = [
    {
      name: "Mr. Priyanshu",
      subject: "Mathematics",
      qualification: "M.Sc. Mathematics",
      bio: "An expert in Mathematics with a passion for making complex concepts simple and accessible. Known for building strong problem-solving skills and conceptual clarity in every student.",
    },
    {
      name: "Mr. Ravi Yadav",
      subject: "Science",
      qualification: "M.Sc. Science",
      bio: "A dedicated Science educator who brings real-world context to the classroom. His engaging teaching style helps students grasp core scientific principles with confidence.",
    },
  ];

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Expert Faculty</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Learn from the best minds. Our faculty members are dedicated educators committed to your success.
          </p>
        </div>
      </div>

      <div className="py-20 container mx-auto px-4 md:px-6">
        <div className="flex flex-col sm:flex-row gap-8 justify-center max-w-3xl mx-auto">
          {faculty.map((member, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300 flex-1">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                  <Avatar className="h-32 w-32 border-4 border-white relative z-10">
                    <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <Badge className="mb-2 bg-accent text-accent-foreground">{member.subject}</Badge>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-primary mb-4">{member.qualification}</p>
                <p className="text-muted-foreground leading-relaxed">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
