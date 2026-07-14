import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tienda Virtual — Tu tienda en línea en Venezuela",
  description:
    "Tu tienda en línea con los mejores productos y precios en Venezuela. Envíos a toda Venezuela con pago por PayPal o PagoMóvil.",
  openGraph: {
    title: "Tienda Virtual — Tu tienda en línea en Venezuela",
    description:
      "Tu tienda en línea con los mejores productos y precios en Venezuela.",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-primary/10 py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Bienvenido a{" "}
            <span className="text-primary">Tienda Virtual</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Descubre los mejores productos con precios increíbles. Envíos a
            toda Venezuela con pago por PayPal o PagoMóvil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Ver Productos
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-8 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Conócenos
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="font-semibold mb-2">Envío Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Entrega a toda Venezuela en tiempo récord.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💳</span>
              </div>
              <h3 className="font-semibold mb-2">Pago Flexible</h3>
              <p className="text-sm text-muted-foreground">
                Paga con PayPal o PagoMóvil como prefieras.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-sm text-muted-foreground">
                Solo los mejores productos para nuestros clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            ¿Listo para comprar?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Explora nuestro catálogo y encuentra lo que necesitas.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Explorar Productos
          </Link>
        </div>
      </section>
    </div>
  );
}
