import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Explora nuestras categorías de productos",
};

export default function CategoriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categorías</h1>
      <p className="text-muted-foreground">
        Nuestras categorías de productos próximamente.
      </p>
    </div>
  );
}
