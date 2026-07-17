import Link from "next/link";
import { CollectionCard } from "./CollectionCard";
import { getFeaturedCollections } from "@/lib/sanity/queries";

export async function FeaturedCollections() {
  const collections = await getFeaturedCollections();

  if (collections.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Colecciones destacadas</h2>
          <Link
            href="/collections"
            className="text-sm text-primary hover:underline font-medium"
          >
            Ver todas
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <CollectionCard
              key={collection._id}
              collection={collection}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
