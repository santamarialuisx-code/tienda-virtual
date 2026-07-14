import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Productos",
  description:
    "Explora nuestro catálogo de productos. Encuentra los mejores precios en Venezuela con envío a todo el país.",
  openGraph: {
    title: "Productos | Tienda Virtual",
    description:
      "Explora nuestro catálogo de productos con los mejores precios en Venezuela.",
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
