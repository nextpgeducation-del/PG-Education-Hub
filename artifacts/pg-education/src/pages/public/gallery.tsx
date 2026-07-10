import { PublicLayout } from "@/components/layout/public-layout";
import { useListGalleryImages } from "@workspace/api-client-react";
import { Spinner } from "@/components/ui/spinner";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export default function Gallery() {
  const { data: images, isLoading } = useListGalleryImages();

  return (
    <PublicLayout>
      <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Photo Gallery</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A glimpse into life at PG Education — where learning meets enthusiasm.
          </p>
        </div>
      </div>

      <div className="py-20 container mx-auto px-4 md:px-6">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" className="text-primary" />
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img) => (
              <div key={img.id} className="group relative overflow-hidden rounded-xl bg-slate-100 transition-all hover:shadow-xl">
                <AspectRatio ratio={4 / 3}>
                  <img 
                    src={img.imageUrl} 
                    alt={img.caption || "Gallery Image"} 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </AspectRatio>
                {img.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-12 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Empty>
            <EmptyTitle>Gallery is empty</EmptyTitle>
            <EmptyDescription>We haven't uploaded any photos yet. Check back soon!</EmptyDescription>
          </Empty>
        )}
      </div>
    </PublicLayout>
  );
}
