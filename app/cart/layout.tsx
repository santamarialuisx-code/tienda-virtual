import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Carrito",
  description:
    "Tu carrito de compras en Tienda Virtual. Revisa tus productos y procede al checkout.",
  openGraph: {
    title: "Carrito | Tienda Virtual",
    description: "Tu carrito de compras en Tienda Virtual.",
  },
};

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
