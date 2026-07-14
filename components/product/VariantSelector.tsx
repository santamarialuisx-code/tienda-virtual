"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { ProductVariant } from "@/lib/sanity/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  onVariantSelect: (variant: ProductVariant | null) => void;
}

export function VariantSelector({
  variants,
  onVariantSelect,
}: VariantSelectorProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  if (!variants || variants.length === 0) {
    return null;
  }

  // Group variants by option type
  const sizeVariants = variants.filter((v) => v.options?.size);
  const colorVariants = variants.filter((v) => v.options?.color);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    onVariantSelect(variants[index]);
  };

  return (
    <div className="space-y-4">
      {/* Size selector */}
      {sizeVariants.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Tamaño</label>
          <div className="flex flex-wrap gap-2">
            {sizeVariants.map((variant, idx) => {
              const globalIdx = variants.indexOf(variant);
              return (
                <Button
                  key={variant.name}
                  variant={globalIdx === selectedIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelect(globalIdx)}
                  disabled={variant.stock <= 0}
                >
                  {variant.options?.size}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colorVariants.length > 0 && (
        <div>
          <label className="text-sm font-medium mb-2 block">Color</label>
          <div className="flex flex-wrap gap-2">
            {colorVariants.map((variant) => {
              const globalIdx = variants.indexOf(variant);
              return (
                <Button
                  key={variant.name}
                  variant={globalIdx === selectedIndex ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSelect(globalIdx)}
                  disabled={variant.stock <= 0}
                >
                  {variant.options?.color}
                </Button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected variant info */}
      {variants[selectedIndex] && (
        <div className="text-sm text-muted-foreground">
          {variants[selectedIndex].stock > 0 ? (
            <span className="text-green-600 dark:text-green-400">
              En stock ({variants[selectedIndex].stock} disponibles)
            </span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Agotado</span>
          )}
        </div>
      )}
    </div>
  );
}
