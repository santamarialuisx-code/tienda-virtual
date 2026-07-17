import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { getProductBySlug, getRelatedProducts } from "@/lib/sanity/queries";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductGrid } from "@/components/product/ProductGrid";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

async function getCachedProductBySlug(slug: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  return getProductBySlug(slug);
}

async function getCachedRelatedProducts(categorySlug: string, excludeId: string) {
  "use cache";
  cacheLife("hours");
  cacheTag("products");
  return getRelatedProducts(categorySlug, excludeId);
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Compra ${product.name} en Tienda Virtual`,
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || `Compra ${product.name} en Tienda Virtual`,
      type: "website",
      images: product.images?.[0]
        ? [
            {
              url: `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${product.images[0].asset._ref.replace("image-", "").replace("-jpg", ".jpg").replace("-png", ".png").replace("-webp", ".webp")}`,
              width: 800,
              height: 800,
              alt: product.name,
            },
          ]
        : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;
  const product = await getCachedProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products
  let relatedProducts: Awaited<ReturnType<typeof getRelatedProducts>> = [];
  if (product.category?.slug?.current) {
    relatedProducts = await getCachedRelatedProducts(
      product.category.slug.current,
      product._id
    );
  }

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images?.[0]
      ? `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${product.images[0].asset._ref}`
      : undefined,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: (product.stock ?? 0) > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    category: product.category?.name,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Productos Relacionados</h2>
            <ProductGrid products={relatedProducts} />
          </section>
        )}
      </div>
    </>
  );
}
