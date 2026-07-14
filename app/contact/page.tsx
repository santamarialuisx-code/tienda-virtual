import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para cualquier consulta. Estamos aquí para ayudarte con tus compras en Tienda Virtual.",
  openGraph: {
    title: "Contacto | Tienda Virtual",
    description:
      "Contáctanos para cualquier consulta. Estamos aquí para ayudarte.",
  },
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contacto</h1>
      <div className="max-w-2xl space-y-6">
        <p className="text-muted-foreground">
          ¿Tienes alguna pregunta o consulta? No dudes en contactarnos.
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Email</h3>
            <p className="text-muted-foreground">info@tiendavirtual.com</p>
          </div>
          <div>
            <h3 className="font-semibold">Teléfono</h3>
            <p className="text-muted-foreground">+58 412 123 4567</p>
          </div>
          <div>
            <h3 className="font-semibold">Horario de Atención</h3>
            <p className="text-muted-foreground">
              Lunes a Viernes: 9:00 AM - 6:00 PM
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
