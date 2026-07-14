"use client";

import { useState, useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/lib/sanity/types";

interface FilterState {
  category: string[];
  minPrice: string;
  maxPrice: string;
  inStock: boolean;
}

interface FilterPanelProps {
  categories: Category[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export function FilterPanel({
  categories,
  filters,
  onFiltersChange,
}: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = useCallback(
    (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
      onFiltersChange({ ...filters, [key]: value });
    },
    [filters, onFiltersChange]
  );

  const toggleCategory = useCallback(
    (slug: string) => {
      const current = filters.category;
      const updated = current.includes(slug)
        ? current.filter((s) => s !== slug)
        : [...current, slug];
      updateFilter("category", updated);
    },
    [filters.category, updateFilter]
  );

  const clearAll = () => {
    onFiltersChange({
      category: [],
      minPrice: "",
      maxPrice: "",
      inStock: false,
    });
  };

  const activeCount =
    filters.category.length +
    (filters.minPrice ? 1 : 0) +
    (filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0);

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden"
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filtros
        {activeCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 text-xs">
            {activeCount}
          </Badge>
        )}
      </Button>

      {/* Desktop panel */}
      <div className={`space-y-6 ${isOpen ? "block" : "hidden lg:block"}`}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Filtros</h3>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="text-xs text-muted-foreground hover:text-foreground underline"
            >
              Limpiar todo
            </button>
          )}
        </div>

        {/* Category filter */}
        <div>
          <h4 className="text-sm font-medium mb-3">Categoría</h4>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category._id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={filters.category.includes(category.slug.current)}
                  onChange={() => toggleCategory(category.slug.current)}
                  className="h-4 w-4 rounded border-input"
                />
                <span className="text-sm">{category.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price range filter */}
        <div>
          <h4 className="text-sm font-medium mb-3">Rango de precio</h4>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Mín"
              value={filters.minPrice}
              onChange={(e) => updateFilter("minPrice", e.target.value)}
              className="h-8 text-xs"
              min={0}
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="number"
              placeholder="Máx"
              value={filters.maxPrice}
              onChange={(e) => updateFilter("maxPrice", e.target.value)}
              className="h-8 text-xs"
              min={0}
            />
          </div>
        </div>

        {/* Availability filter */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => updateFilter("inStock", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm">Solo en stock</span>
          </label>
        </div>

        {/* Active filters display */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {filters.category.map((slug) => {
              const cat = categories.find((c) => c.slug.current === slug);
              return (
                <Badge key={slug} variant="secondary" className="gap-1">
                  {cat?.name || slug}
                  <button
                    onClick={() => toggleCategory(slug)}
                    className="hover:text-foreground"
                    aria-label={`Remover filtro ${cat?.name || slug}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
            {filters.minPrice && (
              <Badge variant="secondary" className="gap-1">
                Min: ${filters.minPrice}
                <button
                  onClick={() => updateFilter("minPrice", "")}
                  className="hover:text-foreground"
                  aria-label="Remover precio mínimo"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.maxPrice && (
              <Badge variant="secondary" className="gap-1">
                Max: ${filters.maxPrice}
                <button
                  onClick={() => updateFilter("maxPrice", "")}
                  className="hover:text-foreground"
                  aria-label="Remover precio máximo"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {filters.inStock && (
              <Badge variant="secondary" className="gap-1">
                En stock
                <button
                  onClick={() => updateFilter("inStock", false)}
                  className="hover:text-foreground"
                  aria-label="Remover filtro de stock"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        )}
      </div>
    </>
  );
}
