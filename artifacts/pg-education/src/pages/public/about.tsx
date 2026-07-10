import { PublicLayout } from "@/components/layout/public-layout";

export default function About() {
  return (
    <PublicLayout>
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-foreground mb-6">About PG Education</h1>
          <p className="text-xl text-center text-muted-foreground max-w-3xl mx-auto">
            Learn Today, Lead Tomorrow. We are committed to nurturing the minds of young students and guiding them towards academic excellence.
          </p>
        </div>
      </div>

      <div className="py-16 md:py-24 container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-foreground">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2010, PG Education began with a simple mission: to provide high-quality, accessible education to students seeking to excel in their board exams and beyond. What started as a small classroom with just 20 students has grown into one of the region's most trusted coaching institutes.
              </p>
              <p>
                Our founders, a group of passionate educators, realized that traditional schooling often left gaps in conceptual understanding. PG Education was established to bridge those gaps through personalized attention, expert guidance, and a rigorously structured curriculum.
              </p>
              <p>
                Today, we proudly serve hundreds of students every year, helping them secure top ranks and gain admission into prestigious universities across the country.
              </p>
            </div>
          </div>
          <div className="bg-slate-100 rounded-2xl p-8 h-full flex flex-col justify-center items-center min-h-[400px]">
            {/* Placeholder for an image or illustration */}
            <div className="w-full h-full bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300">
              <span className="font-medium text-lg">Institute Photo</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 py-16 md:py-24 border-y">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-primary font-bold text-xl">M</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To empower students with deep conceptual knowledge, critical thinking skills, and the confidence to achieve their highest potential. We strive to create an engaging, supportive learning environment that fosters academic growth and personal development.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <span className="text-accent font-bold text-xl">V</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the premier educational institution recognized nationally for transforming potential into excellence. We envision a future where every PG Education student becomes a lifelong learner and a leader in their chosen field.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
