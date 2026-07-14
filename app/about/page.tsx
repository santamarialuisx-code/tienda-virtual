import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conoce más sobre Tienda Virtual, tu tienda en línea de confianza en Venezuela con los mejores productos y precios.",
  openGraph: {
    title: "Nosotros | Tienda Virtual",
    description:
      "Conoce más sobre Tienda Virtual, tu tienda en línea de confianza en Venezuela.",
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sobre Nosotros</h1>
      <div className="max-w-2xl space-y-6">
        <p className="text-muted-foreground">
          Tienda Virtual es tu tienda en línea de confianza en Venezuela.
          Ofrecemos una amplia variedad de productos con los mejores precios
          y un servicio de atención al cliente excepcional.
        </p>
        <p className="text-muted-foreground">
          Nuestro objetivo es hacer tus compras fáciles y seguras, con
          opciones de pago flexibles como PayPal y PagoMóvil para tu
          conveniencia.
        </p>
        <p className="text-muted-foreground">
          Trabajamos con los mejores proveedores para garantizar la calidad
          de cada producto que ofrecemos.
        </p>
      </div>
    </div>
  );
}
