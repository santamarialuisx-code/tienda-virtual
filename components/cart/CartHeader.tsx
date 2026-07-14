"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { useCartStore } from "@/lib/store/cart";

export function CartHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const { items, getTotals, removeItem } = useCartStore();
  const { itemCount, subtotal } = getTotals();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={`Carrito (${itemCount} artículos)`}
      >
        <ShoppingBag className="h-5 w-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </Button>

      {/* Mini Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border bg-background shadow-lg z-50">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Tu Carrito</h3>
          </div>

          {itemCount === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              Tu carrito está vacío
            </div>
          ) : (
            <>
              <div className="max-h-64 overflow-y-auto divide-y">
                {items.slice(0, 5).map((item) => (
                  <div
                    key={`${item.productId}-${item.variant || ""}`}
                    className="p-4 flex gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.quantity} x{" "}
                        <PriceDisplay
                          priceUSD={item.price}
                          className="inline"
                        />
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => removeItem(item.productId, item.variant)}
                      aria-label="Eliminar"
                    >
                      ×
                    </Button>
                  </div>
                ))}
                {items.length > 5 && (
                  <div className="p-2 text-center text-xs text-muted-foreground">
                    y {items.length - 5} más...
                  </div>
                )}
              </div>

              <div className="p-4 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <PriceDisplay priceUSD={subtotal} className="font-semibold" />
                </div>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button className="w-full" variant="outline">
                    Ver Carrito
                  </Button>
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button className="w-full">Ir a Pagar</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
