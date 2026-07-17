"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/product/QuantitySelector";
import { PriceDisplay } from "@/components/product/PriceDisplay";
import { useCartStore, type CartItem as CartItemType } from "@/lib/store/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex gap-4 py-4 border-b">
      {/* Product Image */}
      <Link
        href={`/products/${item.slug}`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted"
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="96px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-xs">
            Sin imagen
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="text-sm font-medium hover:text-primary transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            {item.variant && (
              <p className="text-xs text-muted-foreground mt-1">
                Variante: {item.variant}
              </p>
            )}
            {item.stock !== undefined && (
              <p className="text-xs text-muted-foreground mt-1">
                Disponibles: {item.stock}
              </p>
            )}
            {item.customization && (
              <div className="flex flex-wrap gap-2 mt-2">
                {item.customization.color && (
                  <span className="inline-flex items-center gap-1 text-xs">
                    <span
                      className="h-3 w-3 rounded-full border"
                      style={{ backgroundColor: item.customization.color }}
                    />
                    {item.customization.color}
                  </span>
                )}
                {item.customization.size && (
                  <span className="inline-flex items-center text-xs bg-secondary px-2 py-0.5 rounded">
                    {item.customization.size}
                  </span>
                )}
                {item.customization.text && (
                  <span className="inline-flex items-center text-xs text-muted-foreground truncate max-w-[150px]">
                    &quot;{item.customization.text}&quot;
                  </span>
                )}
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.productId, item.variant)}
            className="h-11 w-11 shrink-0 text-muted-foreground hover:text-destructive"
            aria-label="Eliminar producto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) =>
              updateQuantity(item.productId, qty, item.variant)
            }
            min={1}
            max={item.stock ?? 999}
          />
          <PriceDisplay
            priceUSD={(item.price + (item.customization?.fee ?? 0)) * item.quantity}
            className="text-sm font-semibold"
          />
        </div>
      </div>
    </div>
  );
}
