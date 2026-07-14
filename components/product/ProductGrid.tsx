import { ProductCard } from "./ProductCard";
import type { ProductListItem } from "@/lib/sanity/types";

interface ProductGridProps {
  products: ProductListItem[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-3xl">📦</span>
        </div>
        <h3 className="text-lg font-medium mb-2">No hay productos disponibles</h3>
        <p className="text-sm text-muted-foreground">
          Pronto tendremos productos increíbles para ti.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
