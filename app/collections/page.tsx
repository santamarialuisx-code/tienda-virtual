import type { Metadata } from "next";
import { getCollections } from "@/lib/sanity/queries";
import { CollectionsList } from "@/components/collections/CollectionsList";

export const metadata: Metadata = {
  title: "Colecciones — Tienda Virtual",
  description:
    "Explora nuestras colecciones temáticas de productos personalizados.",
  openGraph: {
    title: "Colecciones — Tienda Virtual",
    description:
      "Explora nuestras colecciones temáticas de productos personalizados.",
  },
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Colecciones</h1>
        <p className="text-muted-foreground">
          Explora nuestras colecciones temáticas de productos personalizados.
        </p>
      </div>

      <CollectionsList collections={collections} />
    </div>
  );
}
