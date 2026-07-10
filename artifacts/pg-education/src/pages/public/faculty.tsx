import { PublicLayout } from "@/components/layout/public-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default function Faculty() {
  const faculty = [
    {
      name: "Dr. Rajesh Khanna",
      subject: "Physics",
      qualification: "Ph.D. in Physics, 15+ Years Experience",
      bio: "An expert in mechanics and electromagnetism, Dr. Khanna has mentored thousands of students towards securing top ranks in board and competitive exams.",
      image: "https://i.pravatar.cc/300?u=rajesh"
    },
    {
      name: "Mrs. Sneha Sharma",
      subject: "Mathematics",
      qualification: "M.Sc. Mathematics, B.Ed.",
      bio: "Known for making complex mathematical concepts easy to understand. Her focus is on building a strong foundation and speed in calculations.",
      image: "https://i.pravatar.cc/300?u=sneha"
    },
    {
      name: "Mr. Amit Verma",
      subject: "Chemistry",
      qualification: "M.Tech in Chemical Engineering",
      bio: "Mr. Verma brings practical knowledge to the classroom, helping students visualize chemical reactions and excel in organic chemistry.",
      image: "https://i.pravatar.cc/300?u=amit"
    },
    {
      name: "Ms. Priya Singh",
      subject: "Biology",
      qualification: "M.Sc. Botany, 8+ Years Experience",
      bio: "Specializes in medical entrance preparation. Her detailed diagrams and mnemonic techniques are highly popular among students.",
      image: "https://i.pravatar.cc/300?u=priya"
    },
    {
      name: "Mr. Vikram Aditya",
      subject: "English & Social Studies",
      qualification: "M.A. English Literature",
      bio: "A passionate educator who focuses on enhancing students' communication skills and their understanding of global history and geography.",
      image: "https://i.pravatar.cc/300?u=vikram"
    },
    {
      name: "Mrs. Meena Kumari",
      subject: "Commerce",
      qualification: "Chartered Accountant (CA)",
      bio: "Provides specialized guidance for Accountancy and Economics, bringing real-world financial knowledge to the classroom.",
      image: "https://i.pravatar.cc/300?u=meena"
    }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {faculty.map((member, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-full scale-110 group-hover:scale-125 transition-transform duration-300"></div>
                  <Avatar className="h-32 w-32 border-4 border-white relative z-10">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                </div>
                <Badge className="mb-2 bg-accent text-accent-foreground">{member.subject}</Badge>
                <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm font-medium text-primary mb-4">{member.qualification}</p>
                <p className="text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </PublicLayout>
  );
}
