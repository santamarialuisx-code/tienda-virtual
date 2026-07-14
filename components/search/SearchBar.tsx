"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Search, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { searchProducts } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import type { ProductListItem } from "@/lib/sanity/types";

const MAX_RESULTS = 8;

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductListItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Focus input when overlay opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setQuery("");
        setResults([]);
        setTotalResults(0);
        setHasSearched(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.trim().length < 2) {
      setResults([]);
      setTotalResults(0);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await searchProducts(query.trim(), 1, MAX_RESULTS);
        setResults(response.products);
        setTotalResults(response.total);
      } catch {
        setResults([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Keyboard: Escape to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleProductClick = useCallback(
    (slug: string) => {
      setIsOpen(false);
      router.push(`/products/${slug}`);
    },
    [router]
  );

  const handleViewAll = useCallback(() => {
    setIsOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }, [query, router]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        setIsOpen(false);
      }
    },
    []
  );

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const overlayContent = isOpen && (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Búsqueda de productos"
    >
      <div className="w-full max-w-2xl mt-[8vh] mx-4 bg-background rounded-3xl shadow-2xl border overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Buscar productos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-base bg-transparent"
            aria-label="Buscar productos"
          />
          {isLoading && (
            <Loader2 className="h-5 w-5 text-muted-foreground animate-spin shrink-0" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            aria-label="Cerrar búsqueda"
            className="shrink-0 text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto">
          {/* Loading State */}
          {isLoading && query.trim().length >= 2 && (
            <div className="p-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-14 w-14 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && hasSearched && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="h-12 w-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No se encontraron productos para &quot;{query}&quot;
              </p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Intenta con otros términos de búsqueda
              </p>
            </div>
          )}

          {/* Results List */}
          {!isLoading && results.length > 0 && (
            <div className="p-2">
              {results.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleProductClick(product.slug.current)}
                  className="flex items-center gap-3 w-full p-3 rounded-2xl hover:bg-muted/50 transition-colors text-left group"
                >
                  {/* Product Image */}
                  <div className="h-14 w-14 rounded-xl overflow-hidden bg-muted shrink-0">
                    {product.images ? (
                      <img
                        src={urlFor(product.images).width(112).height(112).url()}
                        alt={product.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                        <Search className="h-5 w-5" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm font-semibold text-primary">
                        {formatPrice(product.price)}
                      </span>
                      {product.category && (
                        <span className="text-xs text-muted-foreground truncate">
                          {product.category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow indicator */}
                  <svg
                    className="h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}

              {/* View All Link */}
              {totalResults > MAX_RESULTS && (
                <div className="p-3 border-t mt-1">
                  <button
                    onClick={handleViewAll}
                    className="w-full text-center text-sm text-primary hover:text-primary/80 font-medium py-2 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    Ver todos los resultados ({totalResults})
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Initial Hint */}
          {!hasSearched && !isLoading && (
            <div className="p-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground/70">
                Escribe para buscar productos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir búsqueda"
        className="relative text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Render overlay via Portal to escape header stacking context */}
      {typeof window !== "undefined" && createPortal(overlayContent, document.body)}
    </>
  );
}
