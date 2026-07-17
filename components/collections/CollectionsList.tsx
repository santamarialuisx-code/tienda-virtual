import { CollectionCard } from "./CollectionCard";
import type { CollectionListItem } from "@/lib/sanity/queries";

interface CollectionsListProps {
  collections: CollectionListItem[];
}

export function CollectionsList({ collections }: CollectionsListProps) {
  if (collections.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          No hay colecciones disponibles
        </p>
        <a
          href="/products"
          className="text-primary hover:underline text-sm font-medium"
        >
          Explorar todos los productos
        </a>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {collections.map((collection) => (
        <CollectionCard key={collection._id} collection={collection} />
      ))}
    </div>
  );
}
