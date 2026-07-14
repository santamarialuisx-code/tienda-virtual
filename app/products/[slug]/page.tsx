import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Detalle del Producto",
};

export default function ProductDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Detalle del Producto</h1>
      <p className="text-muted-foreground">
        Información del producto próximamente.
      </p>
    </div>
  );
}
