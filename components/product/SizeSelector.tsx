"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelect: (size: string) => void;
}

export function SizeSelector({
  sizes,
  selectedSize,
  onSelect,
}: SizeSelectorProps) {
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Talla</label>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={selectedSize === size ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(size)}
            className={cn(
              "min-w-[2.75rem]",
              selectedSize === size && "ring-2 ring-foreground/20"
            )}
          >
            {size}
          </Button>
        ))}
      </div>
    </div>
  );
}
