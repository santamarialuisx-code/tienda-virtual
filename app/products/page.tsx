"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ProductGridSkeleton } from "@/components/product/ProductGridSkeleton";
import { FilterPanel } from "@/components/search/FilterPanel";
import { SortDropdown } from "@/components/product/SortDropdown";
import { Pagination } from "@/components/ui/pagination";
import { filterProducts, getAllCategories } from "@/lib/sanity/queries";
import type {
  ProductListItem,
  Category,
  ProductSort,
  PaginatedProducts,
} from "@/lib/sanity/types";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Read initial values from URL — memoize arrays to prevent infinite loops
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentSort = (searchParams.get("sort") as ProductSort) || "newest";
  const currentCategory = useMemo(
    () => searchParams.get("category")?.split(",").filter(Boolean) || [],
    [searchParams]
  );
  const currentMinPrice = searchParams.get("minPrice") || "";
  const currentMaxPrice = searchParams.get("maxPrice") || "";
  const currentInStock = searchParams.get("inStock") === "true";

  // Build URL params
  const buildUrlParams = useCallback(
    (overrides: Record<string, string | string[] | number | boolean | undefined>) => {
      const params = new URLSearchParams();
      const values = {
        page: currentPage,
        sort: currentSort,
        category: currentCategory,
        minPrice: currentMinPrice,
        maxPrice: currentMaxPrice,
        inStock: currentInStock,
        ...overrides,
      };

      if (values.page > 1) params.set("page", String(values.page));
      if (values.sort !== "newest") params.set("sort", values.sort);
      if (values.category.length > 0) params.set("category", values.category.join(","));
      if (values.minPrice) params.set("minPrice", values.minPrice);
      if (values.maxPrice) params.set("maxPrice", values.maxPrice);
      if (values.inStock) params.set("inStock", "true");

      return params.toString();
    },
    [currentPage, currentSort, currentCategory, currentMinPrice, currentMaxPrice, currentInStock]
  );

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const result = await filterProducts({
          category: currentCategory.length > 0 ? currentCategory[0] : undefined,
          minPrice: currentMinPrice ? Number(currentMinPrice) : undefined,
          maxPrice: currentMaxPrice ? Number(currentMaxPrice) : undefined,
          inStock: currentInStock || undefined,
          sort: currentSort,
          page: currentPage,
          limit: 12,
        });
        setProducts(result.products);
        setTotalPages(result.totalPages);
        setTotal(result.total);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [currentCategory, currentMinPrice, currentMaxPrice, currentInStock, currentSort, currentPage]);

  // Fetch categories
  useEffect(() => {
    getAllCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handlePageChange = (page: number) => {
    router.push(`/products?${buildUrlParams({ page })}`);
  };

  const handleSortChange = (sort: ProductSort) => {
    router.push(`/products?${buildUrlParams({ sort, page: 1 })}`);
  };

  const handleFiltersChange = (filters: {
    category: string[];
    minPrice: string;
    maxPrice: string;
    inStock: boolean;
  }) => {
    router.push(
      `/products?${buildUrlParams({
        category: filters.category,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        inStock: filters.inStock || undefined,
        page: 1,
      })}`
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Productos</h1>
        <p className="text-muted-foreground">
          {isLoading ? "Cargando..." : `${total} productos encontrados`}
        </p>
      </div>

      {/* Filters & Sort */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <aside className="lg:w-64 shrink-0">
          <FilterPanel
            categories={categories}
            filters={{
              category: currentCategory,
              minPrice: currentMinPrice,
              maxPrice: currentMaxPrice,
              inStock: currentInStock,
            }}
            onFiltersChange={handleFiltersChange}
          />
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Sort */}
          <div className="flex items-center justify-between mb-6">
            <SortDropdown value={currentSort} onChange={handleSortChange} />
          </div>

          {/* Products */}
          {isLoading ? (
            <ProductGridSkeleton />
          ) : (
            <ProductGrid products={products} />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  );
}
