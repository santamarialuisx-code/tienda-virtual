import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description: "Explora todos nuestros productos disponibles",
};

export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Productos</h1>
      <p className="text-muted-foreground">
        Catálogo de productos próximamente.
      </p>
    </div>
  );
}
