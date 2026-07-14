import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Tu carrito de compras",
};

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito</h1>
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">
          Tu carrito está vacío.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Seguir Comprando
        </Link>
      </div>
    </div>
  );
}
