import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categoría",
};

export default function CategoryDetailPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Categoría</h1>
      <p className="text-muted-foreground">
        Productos de esta categoría próximamente.
      </p>
    </div>
  );
}
