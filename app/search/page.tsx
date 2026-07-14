"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { Pagination } from "@/components/ui/pagination";
import { searchProducts } from "@/lib/sanity/queries";
import type { ProductListItem } from "@/lib/sanity/types";

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query.trim()) {
      setProducts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    searchProducts(query.trim(), currentPage, 12)
      .then((result) => {
        setProducts(result.products);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [query, currentPage]);

  const handlePageChange = (page: number) => {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${page}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">
        {query ? `Resultados para "${query}"` : "Buscar productos"}
      </h1>
      <p className="text-muted-foreground mb-8">
        {isLoading
          ? "Buscando..."
          : query
            ? `${total} ${total === 1 ? "resultado" : "resultados"} encontrados`
            : "Escribe algo para buscar"}
      </p>

      {isLoading ? (
        <ProductGridSkeleton />
      ) : !query.trim() ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-3xl">🔍</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Escribe tu búsqueda</h3>
          <p className="text-sm text-muted-foreground">
            Usa la barra de búsqueda para encontrar productos.
          </p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <span className="text-3xl">😕</span>
          </div>
          <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
          <p className="text-sm text-muted-foreground">
            Intenta con otros términos de búsqueda.
          </p>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}
