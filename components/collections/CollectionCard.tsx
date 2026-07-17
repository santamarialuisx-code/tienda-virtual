import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";
import type { CollectionListItem } from "@/lib/sanity/queries";

interface CollectionCardProps {
  collection: CollectionListItem;
}

export function CollectionCard({ collection }: CollectionCardProps) {
  const imageUrl = collection.image
    ? urlFor(collection.image).width(600).height(400).url()
    : null;

  return (
    <Link
      href={`/collections/${collection.slug.current}`}
      className="group block"
    >
      <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:ring-foreground/20 hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[3/2] overflow-hidden bg-muted">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={collection.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              Sin imagen
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-base font-semibold line-clamp-1 mb-1 group-hover:text-primary transition-colors">
            {collection.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            {collection.productCount}{" "}
            {collection.productCount === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>
    </Link>
  );
}
