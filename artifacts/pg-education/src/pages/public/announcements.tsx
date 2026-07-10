import { PublicLayout } from "@/components/layout/public-layout";
import { useListPublicAnnouncements } from "@workspace/api-client-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { format } from "date-fns";

export default function Announcements() {
  const { data: announcements, isLoading } = useListPublicAnnouncements();

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-12 border-b">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-8 w-8 text-accent" />
            <h1 className="text-3xl font-bold">Announcements</h1>
          </div>
          <p className="text-muted-foreground">Stay updated with the latest news, events, and important notices from PG Education.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" className="text-primary" />
          </div>
        ) : announcements && announcements.length > 0 ? (
          <div className="space-y-6">
            {announcements.map((ann) => (
              <Card key={ann.id} className={ann.pinned ? "border-accent/30 shadow-md" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      {format(new Date(ann.createdAt), "PPP")}
                    </div>
                    {ann.pinned && (
                      <Badge className="bg-accent text-accent-foreground">Pinned</Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl">{ann.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {ann.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyTitle>No announcements</EmptyTitle>
            <EmptyDescription>There are no active announcements at the moment.</EmptyDescription>
          </Empty>
        )}
      </div>
    </PublicLayout>
  );
}
