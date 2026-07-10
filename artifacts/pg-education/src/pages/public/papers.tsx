import { useState } from "react";
import { PublicLayout } from "@/components/layout/public-layout";
import { useListPapers } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BookOpen, Search, Download, FilterX, Calendar } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Badge } from "@/components/ui/badge";

export default function Papers() {
  const [board, setBoard] = useState("");
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");

  const { data: papers, isLoading } = useListPapers({
    board: board || undefined,
    subject: subject || undefined,
    search: search || undefined
  });

  const resetFilters = () => {
    setBoard("");
    setSubject("");
    setSearch("");
  };

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-3xl font-bold mb-2">Previous Year Papers</h1>
          <p className="text-muted-foreground">Practice with real exam papers from CBSE, ICSE, and State Boards.</p>
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
                  placeholder="Search papers..." 
                  className="pl-9" 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Board</label>
              <Select value={board} onValueChange={setBoard}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Board" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Boards</SelectItem>
                  <SelectItem value="CBSE">CBSE</SelectItem>
                  <SelectItem value="ICSE">ICSE</SelectItem>
                  <SelectItem value="UP Board">UP Board</SelectItem>
                  <SelectItem value="Haryana Board">Haryana Board</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject</label>
              <Input 
                placeholder="Subject (e.g. Maths)" 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <Button variant="outline" className="w-full" onClick={resetFilters}>
              <FilterX className="h-4 w-4 mr-2" /> Reset Filters
            </Button>
          </aside>

          {/* Papers Grid */}
          <main>
            {isLoading ? (
              <div className="flex justify-center py-20">
                <Spinner size="lg" className="text-primary" />
              </div>
            ) : papers && papers.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {papers.map((paper) => (
                  <Card key={paper.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">{paper.board}</Badge>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          {paper.year}
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col gap-2 text-sm mb-6">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subject:</span>
                          <span className="font-medium">{paper.subject}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Class:</span>
                          <span className="font-medium">{paper.className}</span>
                        </div>
                      </div>
                      <Button className="w-full bg-slate-900 hover:bg-slate-800" onClick={() => window.open(paper.fileUrl, '_blank')}>
                        <Download className="h-4 w-4 mr-2" /> Download PDF
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Empty>
                <EmptyTitle>No papers found</EmptyTitle>
                <EmptyDescription>Try adjusting your filters or check back later.</EmptyDescription>
              </Empty>
            )}
          </main>
        </div>
      </div>
    </PublicLayout>
  );
}
