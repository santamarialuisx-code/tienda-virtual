import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/sanity/queries";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { urlFor } from "@/lib/sanity/image";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

async function getCachedCategoryBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return getCategoryBySlug(slug);
}

async function getCachedProductsByCategory(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("categories");
  return getProductsByCategory(slug);
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    return { title: "Categoría no encontrada" };
  }

  return {
    title: category.name,
    description: category.description || `Productos en la categoría ${category.name}`,
    openGraph: {
      title: category.name,
      description: category.description || `Productos en la categoría ${category.name}`,
      type: "website",
    },
  };
}

export default async function CategoryDetailPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCachedCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const { products, total } = await getCachedProductsByCategory(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: "Categorías", href: "/categories" },
          { label: category.name },
        ]}
        className="mb-6"
      />

      {/* Category Header */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {category.image && (
          <div className="relative w-full md:w-64 h-48 rounded-xl overflow-hidden shrink-0">
            <Image
              src={urlFor(category.image).width(256).height(192).url()}
              alt={category.name}
              fill
              sizes="(max-width: 768px) 100vw, 256px"
              className="object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-2">
            {total} {total === 1 ? "producto" : "productos"}
          </p>
        </div>
      </div>

      {/* Products */}
      <ProductGrid products={products} />
    </div>
  );
}
