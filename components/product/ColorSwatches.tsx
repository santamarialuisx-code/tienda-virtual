"use client";

import { cn } from "@/lib/utils";

interface ColorSwatchesProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

export function ColorSwatches({
  colors,
  selectedColor,
  onSelect,
}: ColorSwatchesProps) {
  if (!colors || colors.length === 0) {
    return null;
  }

  return (
    <div>
      <label className="text-sm font-medium mb-2 block">Color</label>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`Color: ${color}`}
            aria-pressed={selectedColor === color}
            onClick={() => onSelect(color)}
            className={cn(
              "size-11 rounded-full border-2 transition-all",
              "hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              selectedColor === color
                ? "border-foreground ring-2 ring-foreground/20"
                : "border-border hover:border-foreground/50"
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
