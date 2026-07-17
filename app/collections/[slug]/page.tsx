import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { getCollectionBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { ProductCard } from "@/components/product/ProductCard";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

async function getCachedCollectionBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("collections");
  return getCollectionBySlug(slug);
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCachedCollectionBySlug(slug);

  if (!collection) {
    return { title: "Colección no encontrada" };
  }

  return {
    title: `${collection.name} — Tienda Virtual`,
    description:
      collection.description?.slice(0, 160) ||
      `Explora la colección ${collection.name} en Tienda Virtual`,
    openGraph: {
      title: `${collection.name} — Tienda Virtual`,
      description:
        collection.description?.slice(0, 160) ||
        `Explora la colección ${collection.name} en Tienda Virtual`,
      type: "website",
      images: collection.image
        ? [
            {
              url: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${collection.image.asset._ref}`,
              width: 800,
              height: 400,
              alt: collection.name,
            },
          ]
        : [],
    },
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCachedCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const heroImageUrl = collection.image
    ? urlFor(collection.image).width(1200).height(400).url()
    : null;

  // Filter out null products (references to deactivated products)
  // The GROQ query returns ProductListItem-shaped objects
  const products = (collection.products || []).filter(
    (p) => p !== null && p !== undefined
  ) as import("@/lib/sanity/types").ProductListItem[];

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground transition-colors">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <Link href="/collections" className="hover:text-foreground transition-colors">
          Colecciones
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium">{collection.name}</span>
      </nav>

      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl mb-8">
        {heroImageUrl ? (
          <div className="relative aspect-[3/1] bg-muted">
            <Image
              src={heroImageUrl}
              alt={collection.name}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[3/1] bg-muted flex items-center justify-center text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      {/* Collection header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-muted-foreground max-w-2xl">
            {collection.description}
          </p>
        )}
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Próximamente productos en esta colección
          </p>
          <Link
            href="/products"
            className="text-primary hover:underline text-sm font-medium"
          >
            Explorar todos los productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
