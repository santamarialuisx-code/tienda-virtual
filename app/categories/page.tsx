import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { getAllCategories } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora nuestras categorías de productos",
};

async function getCachedAllCategories() {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return getAllCategories();
}

export default async function CategoriesPage() {
  const categories = await getCachedAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Categorías</h1>
      <p className="text-muted-foreground mb-8">
        {categories.length > 0
          ? `${categories.length} categorías disponibles`
          : "Próximamente tendremos categorías para ti"}
      </p>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-3xl">📂</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No hay categorías disponibles</h3>
          <p className="text-sm text-muted-foreground">
            Pronto tendremos categorías para organizar nuestros productos.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/categories/${category.slug.current}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 transition-all hover:ring-foreground/20 hover:shadow-md">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  {category.image ? (
                    <Image
                      src={urlFor(category.image).width(600).height(450).url()}
                      alt={category.name}
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
                  <h2 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
                    {category.name}
                  </h2>
                  {category.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {category.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {"productCount" in category
                      ? `${category.productCount} productos`
                      : ""}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
