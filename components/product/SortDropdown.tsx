"use client";

import type { ProductSort } from "@/lib/sanity/types";

interface SortDropdownProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
}

const sortOptions: { value: ProductSort; label: string }[] = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "relevance", label: "Relevancia" },
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-muted-foreground whitespace-nowrap">
        Ordenar por:
      </label>
      <select
        id="sort"
        value={value}
        onChange={(e) => onChange(e.target.value as ProductSort)}
        className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus:border-ring focus:ring-3 focus:ring-ring/50"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
