import { useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { useListNotes } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileText, Search, Download, FilterX } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";

export default function Notes() {
  const [className, setClassName] = useState<"6-8" | "9-10" | "11-12" | "all">("all");
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");

  const { data: notes, isLoading } = useListNotes({
    className: className === "all" ? undefined : className,
    subject: subject || undefined,
    search: search || undefined
  });

  const resetFilters = () => {
    setClassName("all");
    setSubject("");
    setSearch("");
  };

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Study Notes</h1>
          <p className="text-muted-foreground">Access high-quality study materials and subject notes curated by our faculty.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="grid md:grid-cols-[250px_1fr] gap-8">
          {/* Filters Sidebar */}
          <aside className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search notes..." 
                  className="pl-9" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Class Level</label>
              <Select value={className} onValueChange={(val: any) => setClassName(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="6-8">Class 6-8</SelectItem>
                  <SelectItem value="9-10">Class 9-10</SelectItem>
                  <SelectItem value="11-12">Class 11-12</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
              <Input 
                placeholder="Subject (e.g. Physics)" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>
              <FilterX className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
          </aside>

          {/* Notes Grid */}
          <main>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" className="text-primary" />
              </div>
            ) : notes && notes.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                  <Card key={note.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="bg-primary/10 w-10 h-10 rounded-lg flex items-center justify-center mb-3">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-medium">{note.subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class:</span>
                          <span className="font-medium">{note.className}</span>
                        </div>
                      </div>
                      <Button className="w-full" variant="outline" onClick={() => window.open(note.fileUrl, '_blank')}>
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyTitle>No notes found</EmptyTitle>
                <EmptyDescription>Try adjusting your filters or check back later for updates.</EmptyDescription>
              </Empty>
            )}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
